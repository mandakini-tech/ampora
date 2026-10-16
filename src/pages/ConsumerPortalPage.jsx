import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Input, Select } from '../components/common/Input';
import {
  Zap,
  Receipt,
  CreditCard,
  AlertCircle,
  Calendar,
  Clock,
  CheckCircle2,
  Download,
  Printer,
  History,
  TrendingUp,
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
  const { currentUser, bills, payments, complaints, payBill, addComplaint } = useApp();

  // Active consumer target: Rajesh Kumar or logged in consumer
  const consumerId = currentUser?.consumerId || 'PWR-2026-1042';
  const consumerBills = bills.filter((b) => b.consumerId === consumerId);
  const consumerPayments = payments.filter((p) => p.consumerId === consumerId);
  const consumerComplaints = complaints.filter((c) => c.consumerId === consumerId);

  const currentBill = consumerBills[0] || {
    id: 'BILL-2026-101',
    billingPeriod: 'October 2026',
    unitsConsumed: 130,
    totalAmount: 582.34,
    dueDate: '2026-10-16',
    status: 'Pending',
    previousReading: 1250,
    currentReading: 1380,
  };

  const lastPayment = consumerPayments[0] || {
    amount: 620.00,
    paymentDate: '2026-09-10',
    paymentMethod: 'Net Banking',
  };

  // State for Pay Now Modal
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [payMethod, setPayMethod] = useState('UPI');
  const [upiId, setUpiId] = useState('rajesh@upi');

  // State for Complaint Modal
  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);
  const [complaintType, setComplaintType] = useState('Billing Error');
  const [complaintDesc, setComplaintDesc] = useState('');

  // State for Bill View Modal
  const [isBillModalOpen, setIsBillModalOpen] = useState(false);
  const [viewingBill, setViewingBill] = useState(null);

  // Recharts personal consumption data
  const personalConsumptionData = [
    { month: 'May', units: 110 },
    { month: 'Jun', units: 145 },
    { month: 'Jul', units: 160 },
    { month: 'Aug', units: 135 },
    { month: 'Sep', units: 120 },
    { month: 'Oct', units: 130 },
  ];

  const handlePaySubmit = (e) => {
    e.preventDefault();
    payBill(currentBill.id, payMethod, `${payMethod}/AUTOPAY-${Date.now().toString().slice(-4)}`);
    setIsPayModalOpen(false);
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
            Meter Serial: MTR-884920 • LT-1 Domestic
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Welcome, {currentUser?.name || 'Rajesh Kumar'}
          </h1>
          <p className="text-blue-100 text-xs mt-1">
            Consumer ID: <span className="font-mono font-bold text-white">{consumerId}</span> • Green Park Avenue
          </p>
        </div>

        <div className="flex items-center gap-2">
          {currentBill.status !== 'Paid' ? (
            <Button
              variant="primary"
              size="lg"
              icon={CreditCard}
              onClick={() => setIsPayModalOpen(true)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white border-0 shadow-lg shadow-emerald-500/20"
            >
              Pay Current Bill (₹{currentBill.totalAmount})
            </Button>
          ) : (
            <div className="px-4 py-2 bg-emerald-500/20 border border-emerald-400/40 rounded-xl text-emerald-300 font-bold text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Bill Cleared & Paid
            </div>
          )}
        </div>
      </div>

      {/* Main KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-600">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Current Bill Amount</span>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">₹{currentBill.totalAmount}</h3>
          <p className="text-xs text-slate-400 mt-1">Statement: {currentBill.billingPeriod}</p>
        </Card>

        <Card className="border-l-4 border-l-emerald-600">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Units Consumed</span>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">{currentBill.unitsConsumed} <span className="text-sm font-normal text-slate-500">kWh</span></h3>
          <p className="text-xs text-slate-400 mt-1">{currentBill.previousReading} → {currentBill.currentReading}</p>
        </Card>

        <Card className="border-l-4 border-l-amber-600">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Payment Status</span>
          <div className="mt-2">
            <Badge variant={currentBill.status}>{currentBill.status}</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-2">Due Date: {currentBill.dueDate}</p>
        </Card>

        <Card className="border-l-4 border-l-purple-600">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Last Payment</span>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">₹{lastPayment.amount}</h3>
          <p className="text-xs text-slate-400 mt-1">{lastPayment.paymentDate} via {lastPayment.paymentMethod}</p>
        </Card>
      </div>

      {/* Middle Grid: Consumption Chart & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Monthly Consumption Graph */}
        <Card title="My Electricity Consumption History (kWh)" className="lg:col-span-2">
          <div className="h-64 w-full pt-2">
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
          </div>
        </Card>

        {/* Self-Service Quick Action Cards */}
        <Card title="Consumer Quick Services" subtitle="Manage your utility account">
          <div className="space-y-3">
            <button
              onClick={() => {
                setViewingBill(currentBill);
                setIsBillModalOpen(true);
              }}
              className="w-full p-3.5 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 flex items-center justify-between text-left transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-blue-100 text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">View & Download Bill</p>
                  <p className="text-[11px] text-slate-500">Download current PDF statement</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setIsPayModalOpen(true)}
              className="w-full p-3.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 flex items-center justify-between text-left transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Instant Online Payment</p>
                  <p className="text-[11px] text-slate-500">UPI, Cards, NetBanking</p>
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
          </div>
        </Card>
      </div>

      {/* ONLINE PAYMENT MODAL */}
      <Modal
        isOpen={isPayModalOpen}
        onClose={() => setIsPayModalOpen(false)}
        title="Instant Electricity Bill Payment"
        subtitle={`Clearing Invoice #${currentBill.id} - Total ₹${currentBill.totalAmount}`}
      >
        <form onSubmit={handlePaySubmit} className="space-y-4">
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
            options={['UPI', 'Credit/Debit Card', 'Net Banking']}
            value={payMethod}
            onChange={(e) => setPayMethod(e.target.value)}
          />

          {payMethod === 'UPI' && (
            <Input
              label="Enter UPI ID (VPA)"
              placeholder="e.g. mobile@upi"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              required
            />
          )}

          {payMethod === 'Credit/Debit Card' && (
            <div className="space-y-3">
              <Input label="Card Number" placeholder="4532 •••• •••• 8920" required />
              <div className="grid grid-cols-2 gap-3">
                <Input label="Expiry Date" placeholder="MM/YY" required />
                <Input label="CVV" type="password" placeholder="•••" required />
              </div>
            </div>
          )}

          <div className="pt-4 border-t flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsPayModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="success" icon={CheckCircle2} size="lg">
              Authorize Payment ₹{currentBill.totalAmount}
            </Button>
          </div>
        </form>
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
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500">Consumer Name:</span>
                <span className="font-bold">{viewingBill.consumerName}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500">Billing Period:</span>
                <span>{viewingBill.billingPeriod}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500">Units Consumed:</span>
                <span className="font-bold">{viewingBill.unitsConsumed} kWh</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-900 pt-1">
                <span>Total Amount:</span>
                <span className="text-blue-600">₹{viewingBill.totalAmount}</span>
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={() => setIsBillModalOpen(false)}>
                Close
              </Button>
              <Button variant="primary" icon={Printer} onClick={() => window.print()}>
                Print Copy
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
