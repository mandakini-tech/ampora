import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Select } from '../components/common/Input';
import {
  FileBarChart,
  Download,
  Printer,
  Calendar,
  Filter,
  TrendingUp,
  CreditCard,
  Zap,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { monthlyRevenueData, consumptionChartData } from '../mock/data';

export const ReportsPage = () => {
  const { bills, payments, consumers } = useApp();

  const [dateRange, setDateRange] = useState('Oct 2026');
  const [connectionFilter, setConnectionFilter] = useState('ALL');

  // Export CSV generator function
  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Bill ID,Consumer Name,Consumer ID,Units (kWh),Total Amount (INR),Due Date,Status\n';

    bills.forEach((b) => {
      csvContent += `${b.id},"${b.consumerName}",${b.consumerId},${b.unitsConsumed},${b.totalAmount},${b.dueDate},${b.status}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Ampora_Report_${dateRange.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Analytics & Financial Reports Engine</h2>
          <p className="text-xs text-slate-500 mt-1">
            Generate monthly revenue reports, consumption metrics, and export auditing datasets
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" icon={Printer} onClick={handlePrintReport}>
            Print Report
          </Button>
          <Button variant="primary" icon={Download} onClick={handleExportCSV}>
            Export CSV Data
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="bg-slate-50 border-slate-200">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            label="Billing Cycle / Date Range"
            icon={Calendar}
            options={['Oct 2026', 'Sep 2026', 'Aug 2026', 'Q3 2026 (July - Sept)', 'Year to Date 2026']}
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          />
          <Select
            label="Filter Connection Tariff"
            icon={Filter}
            options={[
              { label: 'All Connections', value: 'ALL' },
              { label: 'Residential Only', value: 'Residential' },
              { label: 'Commercial Only', value: 'Commercial' },
              { label: 'Industrial Only', value: 'Industrial' },
            ]}
            value={connectionFilter}
            onChange={(e) => setConnectionFilter(e.target.value)}
          />
          <div className="flex items-end">
            <div className="w-full text-xs text-slate-500 p-2 bg-white rounded-lg border border-slate-200 font-mono">
              Report Ref: <span className="font-bold text-slate-800">REP-2026-OCT-09</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Analytics Charts Suite */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Monthly Revenue vs Target (₹ Lakhs)" subtitle="Financial collection performance">
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="revenue" fill="#2563eb" radius={[4, 4, 0, 0]} name="Revenue (Lakhs)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Category Consumption Distribution (kWh)" subtitle="Energy distribution load">
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={consumptionChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="Residential" stroke="#2563eb" strokeWidth={2} />
                <Line type="monotone" dataKey="Commercial" stroke="#f59e0b" strokeWidth={2} />
                <Line type="monotone" dataKey="Industrial" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Summary Audit Table */}
      <Card title="Detailed Audit Statement Table" subtitle={`Statements for ${dateRange}`}>
        <div id="printable-area" className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase border-b">
              <tr>
                <th className="px-3 py-2.5">Invoice ID</th>
                <th className="px-3 py-2.5">Consumer Name</th>
                <th className="px-3 py-2.5">Consumer ID</th>
                <th className="px-3 py-2.5">Units (kWh)</th>
                <th className="px-3 py-2.5">Energy Chg</th>
                <th className="px-3 py-2.5">Tax (9%)</th>
                <th className="px-3 py-2.5">Total Amount</th>
                <th className="px-3 py-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bills.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50">
                  <td className="px-3 py-2.5 font-mono font-bold text-blue-600">{b.id}</td>
                  <td className="px-3 py-2.5 font-medium">{b.consumerName}</td>
                  <td className="px-3 py-2.5 font-mono text-slate-500">{b.consumerId}</td>
                  <td className="px-3 py-2.5 font-semibold">{b.unitsConsumed}</td>
                  <td className="px-3 py-2.5">₹{b.energyCharges}</td>
                  <td className="px-3 py-2.5">₹{b.taxes}</td>
                  <td className="px-3 py-2.5 font-bold text-slate-900">₹{b.totalAmount}</td>
                  <td className="px-3 py-2.5 font-semibold">{b.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
