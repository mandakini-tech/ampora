import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Input, Select } from '../components/common/Input';
import { BillDocument, printBillDocument } from '../components/billing/BillDocument';
import {
  Zap,
  Receipt,
  CreditCard,
  Calendar,
  CheckCircle2,
  Download,
  Printer,
  MessageSquare,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export const ConsumerPortalPage = () => {
  const { currentUser, bills, payments, complaints, consumers, meterReadings, payBill, addComplaint, settings } = useApp();

  // Active consumer target: logged-in consumer
  const consumerId = currentUser?.consumerId;
  const consumerBills = consumerId ? bills.filter((b) => b.consumerId === consumerId) : [];
  const consumerPayments = consumerId ? payments.filter((p) => p.consumerId === consumerId) : [];
  const consumerComplaints = consumerId ? complaints.filter((c) => c.consumerId === consumerId) : [];

  // Find this consumer's profile from consumers list
  const consumerProfile = consumers.find((c) => c.id === consumerId);

  const currentBill = consumerBills[0] || null;
  const lastPayment = consumerPayments[0] || null;

  // State for Pay Now Modal
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [payMethod, setPayMethod] = useState('UPI');
  const [transactionRef, setTransactionRef] = useState('');
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);

  // State for Complaint Modal
  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);
  const [complaintType, setComplaintType] = useState('Billing Error');
  const [complaintDesc, setComplaintDesc] = useState('');

  // State for Bill View Modal
  const [isBillModalOpen, setIsBillModalOpen] = useState(false);
  const [viewingBill, setViewingBill] = useState(null);

  const monthlyConsumption = new Map();
  meterReadings
    .filter((reading) => reading.consumerId === consumerId)
    .forEach((reading) => {
      const date = new Date(`${reading.readingDate}T00:00:00`);
      if (Number.isNaN(date.getTime())) return;

      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      const month = monthlyConsumption.get(monthKey) || {
        month: date.toLocaleString('en-US', { month: 'short', year: '2-digit' }),
        units: 0,
        timestamp: date.getTime(),
      };
      month.units += Number(reading.unitsConsumed) || 0;
      monthlyConsumption.set(monthKey, month);
    });
  const personalConsumptionData = Array.from(monthlyConsumption.values())
    .sort((a, b) => a.timestamp - b.timestamp)
    .slice(-12);

  const handlePaySubmit = async (e) => {
    e.preventDefault();
    if (!currentBill || isSubmittingPayment) return;
    setIsSubmittingPayment(true);
    try {
      const payment = await payBill(currentBill.id, payMethod, transactionRef);
      if (payment) {
        setTransactionRef('');
        setIsPayModalOpen(false);
      }
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  const handleComplaintSubmit = (e) => {
    e.preventDefault();
    addComplaint({
      type: complaintType,
      description: complaintDesc,
      consumerId,
      consumerName: currentUser?.name || 'Rajesh Kumar',
    });
    setComplaintDesc('');
    setIsComplaintModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Consumer Welcome Hero Header */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-blue-100 mb-2">
            <Zap className="w-3.5 h-3.5 text-yellow-300 fill-current" />
            Meter Serial: {consumerProfile?.meterNumber || 'Not linked'} • {consumerProfile?.tariffCategory || 'Consumer account'}
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Welcome, {currentUser?.name || 'Rajesh Kumar'}
          </h1>
          <p className="text-blue-100 text-xs mt-1">
            Consumer ID: <span className="font-mono font-bold text-white">{consumerId || 'Not linked'}</span>
            {consumerProfile?.address ? ` • ${consumerProfile.address}` : ''}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {currentBill && currentBill.status !== 'Paid' ? (
            <Button
              variant="primary"
              size="lg"
              icon={CreditCard}
              onClick={() => setIsPayModalOpen(true)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white border-0 shadow-lg shadow-emerald-500/20"
            >
              Pay Current Bill (₹{currentBill.totalAmount})
            </Button>
          ) : currentBill ? (
            <div className="px-4 py-2 bg-emerald-500/20 border border-emerald-400/40 rounded-xl text-emerald-300 font-bold text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Bill Cleared & Paid
            </div>
          ) : (
            <p className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-xs text-blue-100">
              No bills are available yet.
            </p>
          )}
        </div>
      </div>

      {/* Main KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-600">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Current Bill Amount</span>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">{currentBill ? `₹${currentBill.totalAmount}` : '—'}</h3>
          <p className="text-xs text-slate-400 mt-1">
            {currentBill ? `Statement: ${currentBill.billingPeriod}` : 'No bill generated yet'}
          </p>
        </Card>

        <Card className="border-l-4 border-l-emerald-600">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Units Consumed</span>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">
            {currentBill ? currentBill.unitsConsumed : '—'}
            {currentBill && <span className="text-sm font-normal text-slate-500"> kWh</span>}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {currentBill ? `${currentBill.previousReading} → ${currentBill.currentReading}` : 'No reading available'}
          </p>
        </Card>

        <Card className="border-l-4 border-l-amber-600">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Payment Status</span>
          <div className="mt-2">
            {currentBill ? <Badge variant={currentBill.status}>{currentBill.status}</Badge> : <span className="text-sm text-slate-500">No bill</span>}
          </div>
          <p className="text-xs text-slate-400 mt-2">
            {currentBill ? `Due Date: ${currentBill.dueDate}` : 'No due date'}
          </p>
        </Card>

        <Card className="border-l-4 border-l-purple-600">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Last Payment</span>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">
            {lastPayment ? `₹${lastPayment.amount}` : 'No payments yet'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {lastPayment ? `${lastPayment.paymentDate} via ${lastPayment.paymentMethod}` : 'Payment history will appear here'}
          </p>
        </Card>
      </div>

      {/* Middle Grid: Consumption Chart & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Monthly Consumption Graph */}
        <Card title="My Electricity Consumption History (kWh)" className="lg:col-span-2">
          <div className="h-64 w-full pt-2">
            {personalConsumptionData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={personalConsumptionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '12px' }}
                  />
                  <Line type="monotone" dataKey="units" stroke="#2563eb" strokeWidth={3} dot={{ r: 5, fill: '#2563eb' }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-slate-500">
                No meter readings yet. Your usage chart will appear after your first reading.
              </div>
            )}
          </div>
        </Card>

        {/* Self-Service Quick Action Cards */}
        <Card title="Consumer Quick Services" subtitle="Manage your utility account">
          <div className="space-y-3">
            <button
              disabled={!currentBill}
              onClick={() => {
                if (!currentBill) return;
                setViewingBill(currentBill);
                setIsBillModalOpen(true);
              }}
              className="w-full p-3.5 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 flex items-center justify-between text-left transition-all group disabled:cursor-not-allowed disabled:opacity-50"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-blue-100 text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">View & Save Bill</p>
                  <p className="text-[11px] text-slate-500">Print or save the full itemized statement</p>
                </div>
              </div>
            </button>

            <button
              disabled={!currentBill || currentBill.status === 'Paid'}
              onClick={() => {
                if (!currentBill) return;
                setTransactionRef('');
                setIsPayModalOpen(true);
              }}
              className="w-full p-3.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 flex items-center justify-between text-left transition-all group disabled:cursor-not-allowed disabled:opacity-50"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Record Payment</p>
                  <p className="text-[11px] text-slate-500">Cash, UPI, or card</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setIsComplaintModalOpen(true)}
              className="w-full p-3.5 rounded-xl border border-slate-200 hover:border-rose-500 hover:bg-rose-50/50 flex items-center justify-between text-left transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-rose-100 text-rose-700 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Register Grievance</p>
                  <p className="text-[11px] text-slate-500">Faulty meter, billing query</p>
                </div>
              </div>
            </button>
          </div>
        </Card>
      </div>

      {/* Consumer Statements & Complaints History Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Billing History Table */}
        <Card title="Billing & Payment History">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase">
                <tr>
                  <th className="px-3 py-2">Bill ID</th>
                  <th className="px-3 py-2">Month</th>
                  <th className="px-3 py-2">Units</th>
                  <th className="px-3 py-2">Amount</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {consumerBills.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50">
                    <td className="px-3 py-2.5 font-mono font-bold text-blue-600">{b.id}</td>
                    <td className="px-3 py-2.5 font-medium">{b.billingPeriod}</td>
                    <td className="px-3 py-2.5">{b.unitsConsumed} kWh</td>
                    <td className="px-3 py-2.5 font-bold">₹{b.totalAmount}</td>
                    <td className="px-3 py-2.5">
                      <Badge variant={b.status}>{b.status}</Badge>
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <button
                        onClick={() => {
                          setViewingBill(b);
                          setIsBillModalOpen(true);
                        }}
                        className="text-xs text-blue-600 hover:underline font-semibold"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
                {!consumerBills.length && (
                  <tr>
                    <td colSpan={6} className="px-3 py-8 text-center text-slate-500">
                      No bills are available for this account yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* My Registered Complaints Status */}
        <Card
          title="My Support Tickets & Complaints"
          action={
            <Button variant="outline" size="sm" onClick={() => setIsComplaintModalOpen(true)}>
              + New Ticket
            </Button>
          }
        >
          <div className="space-y-3">
            {consumerComplaints.map((cmp) => (
              <div key={cmp.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-800">#{cmp.id}</span>
                    <Badge variant={cmp.status}>{cmp.status}</Badge>
                  </div>
                  <span className="text-[10px] text-slate-400">{cmp.submittedDate}</span>
                </div>
                <p className="text-xs font-semibold text-slate-900 mt-1">{cmp.type}</p>
                <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{cmp.description}</p>
                {cmp.resolutionNotes && (
                  <div className="mt-2 p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-[11px] text-emerald-800">
                    <strong>Resolution Note:</strong> {cmp.resolutionNotes}
                  </div>
                )}
              </div>
            ))}
            {!consumerComplaints.length && (
              <p className="py-6 text-center text-xs text-slate-500">No support tickets yet.</p>
            )}
          </div>
        </Card>
      </div>

      {/* PAYMENT RECORD MODAL */}
      <Modal
        isOpen={isPayModalOpen && Boolean(currentBill)}
        onClose={() => setIsPayModalOpen(false)}
        title="Record Payment"
        subtitle={currentBill ? `Invoice #${currentBill.id} - Total ₹${currentBill.totalAmount}` : undefined}
      >
        {currentBill && <form onSubmit={handlePaySubmit} className="space-y-4">
          <p className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs text-blue-900">
            Complete UPI or card payments with your provider first. Cash payments must already have been handed to staff. This form records a completed payment; it does not initiate a transfer.
          </p>
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex justify-between items-center text-xs">
            <div>
              <p className="text-slate-500">Payable Amount:</p>
              <p className="text-2xl font-extrabold text-blue-700">₹{currentBill.totalAmount}</p>
            </div>
            <span className="font-mono text-slate-600 bg-white px-3 py-1 rounded-full border border-blue-200">
              Due: {currentBill.dueDate}
            </span>
          </div>

          <Select
            label="Choose Payment Method"
            options={['Cash', 'UPI', 'Card']}
            value={payMethod}
            onChange={(e) => {
              setPayMethod(e.target.value);
              setTransactionRef('');
            }}
          />
          <Input
            label={payMethod === 'Cash' ? 'Cash receipt number (if available)' : 'Payment transaction reference'}
            placeholder={payMethod === 'Cash' ? 'Enter receipt number' : 'Enter the reference from your provider'}
            value={transactionRef}
            onChange={(e) => setTransactionRef(e.target.value)}
            required={payMethod !== 'Cash'}
          />

          <div className="pt-4 border-t flex justify-end gap-3">
            <Button type="button" variant="outline" disabled={isSubmittingPayment} onClick={() => setIsPayModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="success" icon={CheckCircle2} size="lg" disabled={isSubmittingPayment}>
              {isSubmittingPayment ? 'Saving...' : `Confirm payment ₹${currentBill.totalAmount}`}
            </Button>
          </div>
        </form>}
      </Modal>

      {/* REGISTER COMPLAINT MODAL */}
      <Modal
        isOpen={isComplaintModalOpen}
        onClose={() => setIsComplaintModalOpen(false)}
        title="Register Electricity Complaint"
        subtitle="Submit a ticket to the utility engineering helpdesk"
      >
        <form onSubmit={handleComplaintSubmit} className="space-y-4">
          <Select
            label="Complaint Type"
            options={['Billing Error', 'Faulty Meter', 'Power Outage', 'New Connection', 'Other']}
            value={complaintType}
            onChange={(e) => setComplaintType(e.target.value)}
          />

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Issue Description
            </label>
            <textarea
              rows={4}
              className="w-full rounded-lg border border-slate-300 p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Provide details about the issue..."
              value={complaintDesc}
              onChange={(e) => setComplaintDesc(e.target.value)}
              required
            />
          </div>

          <div className="pt-4 border-t flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsComplaintModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Submit Ticket
            </Button>
          </div>
        </form>
      </Modal>

      {/* CONSUMER VIEW BILL MODAL */}
      <Modal
        isOpen={isBillModalOpen}
        onClose={() => setIsBillModalOpen(false)}
        title="Consumer Bill Statement"
        subtitle={`Invoice Ref: ${viewingBill?.id}`}
      >
        {viewingBill && (
          <div className="space-y-4">
            <BillDocument bill={viewingBill} consumer={consumerProfile} settings={settings} />

            <div className="no-print flex justify-between pt-2">
              <Button variant="outline" onClick={() => setIsBillModalOpen(false)}>
                Close
              </Button>
              <div className="flex gap-2">
                <Button variant="secondary" icon={Printer} onClick={() => printBillDocument(viewingBill)}>
                  Print Bill
                </Button>
                <Button variant="primary" icon={Download} onClick={() => printBillDocument(viewingBill)}>
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
