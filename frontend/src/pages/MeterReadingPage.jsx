import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Table } from '../components/common/Table';
import { Badge } from '../components/common/Badge';
import { Input, Select } from '../components/common/Input';
import {
  Gauge,
  User,
  Zap,
  Calendar,
  ArrowRight,
  Calculator,
  CheckCircle2,
  AlertTriangle,
  Receipt,
} from 'lucide-react';

export const MeterReadingPage = () => {
  const { consumers, meterReadings, addMeterReading, calculateBillCharges } = useApp();
  const navigate = useNavigate();

  // Form state
  const [selectedConsumerId, setSelectedConsumerId] = useState(consumers[0]?.id || '');
  const [currentReadingInput, setCurrentReadingInput] = useState('1450');
  const [readingDate, setReadingDate] = useState(new Date().toISOString().split('T')[0]);

  // Derived selected consumer details
  const currentConsumer = consumers.find((c) => c.id === selectedConsumerId) || consumers[0];
  const previousReading = currentConsumer ? (currentConsumer.currentReading || 1250) : 0;
  const currentReading = Number(currentReadingInput) || previousReading;
  const unitsConsumed = Math.max(0, currentReading - previousReading);

  // Bill preview estimate calculation
  const estimate = calculateBillCharges(unitsConsumed, currentConsumer?.connectionType);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentReading < previousReading) {
      alert('Current reading must be greater than or equal to previous reading');
      return;
    }

    const newReading = addMeterReading({
      consumerId: selectedConsumerId,
      previousReading,
      currentReading,
      readingDate,
    });

    if (newReading) {
      // Direct prompt to generate bill if desired
    }
  };

  const columns = [
    {
      header: 'Reading ID',
      accessor: 'id',
      render: (row) => (
        <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-xs">
          {row.id}
        </span>
      ),
    },
    {
      header: 'Consumer Name & ID',
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-900">{row.consumerName}</p>
          <span className="font-mono text-xs text-blue-600">{row.consumerId}</span>
        </div>
      ),
    },
    {
      header: 'Meter No.',
      accessor: 'meterNumber',
      render: (row) => <span className="font-mono text-slate-600 text-xs">{row.meterNumber}</span>,
    },
    { header: 'Prev Reading', accessor: 'previousReading' },
    { header: 'Curr Reading', accessor: 'currentReading' },
    {
      header: 'Units Consumed',
      accessor: 'unitsConsumed',
      render: (row) => (
        <span className="font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full text-xs">
          {row.unitsConsumed} kWh
        </span>
      ),
    },
    { header: 'Reading Date', accessor: 'readingDate' },
    { header: 'Recorded By', accessor: 'recordedBy' },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <Badge variant={row.status === 'Billed' ? 'paid' : 'pending'}>{row.status}</Badge>,
    },
    {
      header: 'Action',
      render: (row) =>
        row.status === 'Pending Bill' ? (
          <Button
            variant="primary"
            size="sm"
            icon={Receipt}
            onClick={() => navigate('/bills', { state: { reading: row } })}
          >
            Generate Bill
          </Button>
        ) : (
          <span className="text-xs text-slate-400 font-medium">Billed</span>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Meter Reading Entry & Consumption Engine</h2>
          <p className="text-xs text-slate-500 mt-1">
            Record monthly consumer kWh meter readings and preview slab consumption
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            Active Metering Cycle: October 2026
          </span>
        </div>
      </div>

      {/* Grid: Reading Input Form & Calculation Preview Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Entry Form */}
        <Card title="Record New Meter Reading" className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Select Consumer"
                icon={User}
                options={consumers.map((c) => ({
                  label: `${c.name} (${c.id} - ${c.meterNumber})`,
                  value: c.id,
                }))}
                value={selectedConsumerId}
                onChange={(e) => {
                  setSelectedConsumerId(e.target.value);
                  const found = consumers.find((c) => c.id === e.target.value);
                  if (found) {
                    setCurrentReadingInput(String((found.currentReading || 1250) + 120));
                  }
                }}
              />

              <Input
                label="Meter Serial Number"
                icon={Zap}
                value={currentConsumer?.meterNumber || ''}
                disabled
              />

              <Input
                label="Previous Meter Reading (kWh)"
                value={previousReading}
                disabled
                helperText="Auto-fetched from last statement"
              />

              <Input
                label="Current Meter Reading (kWh)"
                type="number"
                icon={Gauge}
                placeholder="Enter current dial value"
                value={currentReadingInput}
                onChange={(e) => setCurrentReadingInput(e.target.value)}
                required
                min={previousReading}
              />

              <Input
                label="Reading Date"
                type="date"
                icon={Calendar}
                value={readingDate}
                onChange={(e) => setReadingDate(e.target.value)}
                required
              />

              <Input
                label="Tariff Category"
                value={`${currentConsumer?.connectionType} (${currentConsumer?.tariffCategory})`}
                disabled
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <Button type="submit" variant="primary" icon={CheckCircle2} size="lg">
                Submit Meter Reading
              </Button>
            </div>
          </form>
        </Card>

        {/* Live Calculation Preview Card */}
        <Card
          title="Consumption Preview Card"
          subtitle="Real-time automated unit calculation & tariff preview"
          className="bg-slate-900 text-white border-slate-800"
        >
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-800/90 border border-slate-700">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Consumer Name</span>
                <span className="font-mono text-blue-400">{currentConsumer?.id}</span>
              </div>
              <p className="text-base font-bold text-white">{currentConsumer?.name}</p>
            </div>

            {/* Units breakdown box */}
            <div className="p-4 rounded-xl bg-blue-600/20 border border-blue-500/30 text-center">
              <span className="text-xs font-semibold text-blue-300 uppercase tracking-wider block">
                Calculated Units Consumed
              </span>
              <div className="text-4xl font-extrabold text-white mt-1">
                {unitsConsumed} <span className="text-lg font-medium text-blue-400">units</span>
              </div>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                {currentReading} (Current) - {previousReading} (Previous)
              </p>
            </div>

            {/* Financial estimate preview */}
            <div className="space-y-2 text-xs border-t border-slate-800 pt-3">
              <div className="flex justify-between text-slate-400">
                <span>Estimated Energy Charges:</span>
                <span className="font-semibold text-white">₹{estimate.energyCharges}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Fixed Charges ({currentConsumer?.connectionType}):</span>
                <span className="font-semibold text-white">₹{estimate.fixedCharges}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>State Tax (9%):</span>
                <span className="font-semibold text-white">₹{estimate.taxes}</span>
              </div>
              {estimate.subsidy > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Govt. Subsidy Discount:</span>
                  <span>-₹{estimate.subsidy}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-800">
                <span>Est. Total Payable:</span>
                <span className="text-blue-400 text-base">₹{estimate.totalAmount}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Meter Reading History Table */}
      <Card title="Meter Reading History Log" subtitle="Comprehensive log of verified meter entries">
        <Table
          columns={columns}
          data={meterReadings}
          searchPlaceholder="Search readings by Consumer Name, ID, or Meter Serial..."
        />
      </Card>
    </div>
  );
};
