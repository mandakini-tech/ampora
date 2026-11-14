import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Table } from '../components/common/Table';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { Input, Select } from '../components/common/Input';
import { BillDocument, printBillDocument } from '../components/billing/BillDocument';
import {
  Receipt,
  User,
  Printer,
  Download,
  CheckCircle2,
  Eye,
  Calendar,
} from 'lucide-react';

export const BillGenerationPage = () => {
  const { consumers, bills, tariffSlabs, generateBill, calculateBillCharges, settings } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  // Selected reading passed from MeterReading page (if any)
  const navStateReading = location.state?.reading;

  const [selectedConsumerId, setSelectedConsumerId] = useState(
    navStateReading?.consumerId || consumers[0]?.id || ''
  );
  const [billingPeriod, setBillingPeriod] = useState(
    new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })
  );
  const [previousReading, setPreviousReading] = useState(
    navStateReading?.previousReading ?? consumers[0]?.previousReading ?? 0
  );
  const [currentReading, setCurrentReading] = useState(
    navStateReading?.currentReading ?? consumers[0]?.currentReading ?? 0
  );

  // Selected Bill Preview modal
  const [previewBill, setPreviewBill] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    const matched = consumers.find((c) => c.id === selectedConsumerId);
    if (matched && !navStateReading) {
      setPreviousReading(Number(matched.previousReading) || 0);
      setCurrentReading(Number(matched.currentReading) || 0);
    }
  }, [selectedConsumerId, consumers]);

  const currentConsumer = consumers.find((c) => c.id === selectedConsumerId) || consumers[0];
  const unitsConsumed = Math.max(0, currentReading - previousReading);
  const calculatedCharges = calculateBillCharges(unitsConsumed, currentConsumer?.connectionType);

  const handleGenerate = (e) => {
    e.preventDefault();
    const newBill = generateBill({
      consumerId: selectedConsumerId,
      billingPeriod,
      previousReading,
      currentReading,
      unitsConsumed,
      meterReadingId: navStateReading?.id,
    });

    if (newBill) {
      setPreviewBill(newBill);
      setIsPreviewOpen(true);
    }
  };

  const billColumns = [
    {
      header: 'Bill ID',
      accessor: 'id',
      render: (row) => (
        <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-xs">
          {row.id}
        </span>
      ),
    },
    {
      header: 'Consumer',
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-900">{row.consumerName}</p>
          <span className="text-xs text-slate-400 font-mono">{row.consumerId}</span>
        </div>
      ),
    },
    { header: 'Period', accessor: 'billingPeriod' },
    {
      header: 'Units',
      accessor: 'unitsConsumed',
      render: (row) => <span className="font-mono text-slate-700 font-semibold">{row.unitsConsumed} kWh</span>,
    },
    {
      header: 'Total Payable',
      accessor: 'totalAmount',
      render: (row) => <span className="font-bold text-slate-900">₹{row.totalAmount.toLocaleString()}</span>,
    },
    { header: 'Due Date', accessor: 'dueDate' },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <Badge variant={row.status}>{row.status}</Badge>,
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            icon={Eye}
            onClick={() => {
              setPreviewBill(row);
              setIsPreviewOpen(true);
            }}
          >
            Bill Preview
          </Button>
          {row.status !== 'Paid' && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/payments', { state: { billId: row.id } })}
            >
              Collect
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Slab Tariff Visualization Banner */}
      <Card title="Slab-Based Electricity Tariff Structure" subtitle="Current configured tariff rates">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tariffSlabs.map((slab) => (
            <div
              key={slab.id}
              className="p-4 rounded-xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  Slab #{slab.id}
                </span>
                <span className="font-mono text-xs text-slate-400">
                  {slab.maxUnits === 999999 ? '301+ units' : `${slab.minUnits}–${slab.maxUnits} units`}
                </span>
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-extrabold text-slate-900">₹{slab.rate.toFixed(2)}</span>
                <span className="text-xs text-slate-500 font-medium">/ unit</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">{slab.description}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Bill Generation Form & Live Calculation Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Form */}
        <Card title="Generate Electricity Invoice" className="lg:col-span-2">
          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Select Consumer"
                icon={User}
                options={consumers.map((c) => ({
                  label: `${c.name} (${c.id})`,
                  value: c.id,
                }))}
                value={selectedConsumerId}
                onChange={(e) => setSelectedConsumerId(e.target.value)}
              />

              <Input
                label="Billing Month / Cycle"
                icon={Calendar}
                value={billingPeriod}
                onChange={(e) => setBillingPeriod(e.target.value)}
                required
              />

              <Input
                label="Previous Meter Reading (kWh)"
                type="number"
                value={previousReading}
                onChange={(e) => setPreviousReading(Number(e.target.value))}
                required
              />

              <Input
                label="Current Meter Reading (kWh)"
                type="number"
                value={currentReading}
                onChange={(e) => setCurrentReading(Number(e.target.value))}
                required
              />
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Slab Unit Calculation Breakdown
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {calculatedCharges.tariffSlabs.map((s, idx) => (
                  <div key={idx} className="p-2 bg-white rounded-lg border border-slate-200">
                    <p className="text-slate-400 font-medium">{s.slab}</p>
                    <p className="font-bold text-slate-800">{s.units} units × ₹{s.rate}</p>
                    <p className="text-blue-600 font-semibold mt-0.5">₹{s.amount.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t flex items-center justify-end gap-3">
              <Button type="submit" variant="primary" icon={CheckCircle2} size="lg">
                Generate & Preview Bill
              </Button>
            </div>
          </form>
        </Card>

        {/* Live Calculation Summary Box */}
        <Card title="Bill Calculation Summary" className="bg-white border-slate-200">
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Units Consumed:</span>
              <span className="font-bold text-slate-900">{unitsConsumed} kWh</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Energy Charges:</span>
              <span className="font-semibold text-slate-800">₹{calculatedCharges.energyCharges}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Fixed Charges ({currentConsumer?.connectionType}):</span>
              <span className="font-semibold text-slate-800">₹{calculatedCharges.fixedCharges}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Electricity Tax / Duty (9%):</span>
              <span className="font-semibold text-slate-800">₹{calculatedCharges.taxes}</span>
            </div>
            {calculatedCharges.subsidy > 0 && (
              <div className="flex justify-between py-1 border-b border-slate-100 text-emerald-600 font-semibold">
                <span>Government Subsidy:</span>
                <span>-₹{calculatedCharges.subsidy}</span>
              </div>
            )}
            <div className="flex justify-between py-2 text-sm font-bold text-slate-900 border-t border-slate-200">
              <span>Final Payable Amount:</span>
              <span className="text-blue-600 text-base">₹{calculatedCharges.totalAmount}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Generated Bills History Table */}
      <Card title="Generated Electricity Bills Log">
        <Table columns={billColumns} data={bills} searchPlaceholder="Search by Bill ID, Consumer Name..." />
      </Card>

      {/* DETAILED PRINTABLE BILL PREVIEW MODAL */}
      <Modal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title="Ampora Official Statement Preview"
        subtitle={`Invoice Ref: ${previewBill?.id}`}
        maxWidth="max-w-3xl"
      >
        {previewBill && (
          <div className="space-y-6">
            <BillDocument
              bill={previewBill}
              consumer={consumers.find((consumer) => consumer.id === previewBill.consumerId)}
              settings={settings}
            />

            {/* Modal Action Controls */}
            <div className="flex items-center justify-between pt-2 no-print">
              <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
                Close Preview
              </Button>
              <div className="flex items-center gap-2">
                <Button variant="secondary" icon={Printer} onClick={() => printBillDocument(previewBill)}>
                  Print Bill
                </Button>
                <Button variant="primary" icon={Download} onClick={() => printBillDocument(previewBill)}>
                  Save as PDF
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
