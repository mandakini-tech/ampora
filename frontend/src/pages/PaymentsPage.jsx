import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatCard } from '../components/common/StatCard';
import { Table } from '../components/common/Table';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Card } from '../components/common/Card';
import { Input, Select } from '../components/common/Input';
import {
  CreditCard,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Receipt,
  Printer,
  Download,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export const PaymentsPage = () => {
  const { payments, bills, payBill } = useApp();

  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [selectedBillId, setSelectedBillId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [transactionRef, setTransactionRef] = useState('');

  // Summaries
  const totalCollected = payments.reduce((acc, p) => acc + p.amount, 0) + 3820000;
  const pendingAmount = bills.filter((b) => b.status === 'Pending').reduce((acc, b) => acc + b.totalAmount, 0) + 320000;
  const overdueAmount = bills.filter((b) => b.status === 'Overdue').reduce((acc, b) => acc + b.totalAmount, 0) + 140000;

  const handleOpenReceipt = (payment) => {
    setSelectedReceipt(payment);
    setIsReceiptOpen(true);
  };

  const handleOpenPay = (billId = '') => {
    const defaultBill = billId || bills.find((b) => b.status !== 'Paid')?.id || '';
    setSelectedBillId(defaultBill);
    setTransactionRef(`UPI-${Date.now().toString().slice(-6)}`);
    setIsPayModalOpen(true);
  };

  const handleCollectSubmit = (e) => {
    e.preventDefault();
    if (!selectedBillId) return;
    const newTxn = payBill(selectedBillId, paymentMethod, transactionRef);
    if (newTxn) {
      setIsPayModalOpen(false);
      handleOpenReceipt(newTxn);
    }
  };

  const columns = [
    {
      header: 'Transaction ID',
      accessor: 'id',
      render: (row) => (
        <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded text-xs">
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
    {
      header: 'Bill Ref',
      accessor: 'billId',
      render: (row) => <span className="font-mono text-blue-600 font-medium text-xs">{row.billId}</span>,
    },
    {
      header: 'Amount Paid',
      accessor: 'amount',
      render: (row) => <span className="font-bold text-emerald-700">₹{row.amount.toLocaleString()}</span>,
    },
    { header: 'Payment Date', accessor: 'paymentDate' },
    {
      header: 'Method',
      accessor: 'paymentMethod',
      render: (row) => (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
          <CreditCard className="w-3.5 h-3.5 text-blue-600" />
          {row.paymentMethod}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <Badge variant="paid">{row.status}</Badge>,
    },
    {
      header: 'Receipt',
      render: (row) => (
        <Button
          variant="outline"
          size="sm"
          icon={Receipt}
          onClick={() => handleOpenReceipt(row)}
        >
          View Receipt
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Payment Collection & Transaction Ledger</h2>
          <p className="text-xs text-slate-500 mt-1">
            Track real-time payment transactions, collect dues, and issue digital receipts
          </p>
        </div>
        <Button variant="primary" icon={CreditCard} onClick={() => handleOpenPay()}>
          Collect New Payment
        </Button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Collected"
          value={`₹${(totalCollected / 100000).toFixed(2)} Lakhs`}
          change="+12.4%"
          isPositive={true}
          icon={CheckCircle2}
          color="emerald"
          subtitle="Cleared Dues"
        />
        <StatCard
          title="Pending Amount"
          value={`₹${(pendingAmount / 100000).toFixed(2)} Lakhs`}
          change="-4.2%"
          isPositive={true}
          icon={Clock}
          color="amber"
          subtitle="Within Grace Period"
        />
        <StatCard
          title="Overdue Amount"
          value={`₹${(overdueAmount / 100000).toFixed(2)} Lakhs`}
          change="-1.5%"
          isPositive={true}
          icon={AlertTriangle}
          color="rose"
          subtitle="Past Due Date"
        />
        <StatCard
          title="Transactions This Month"
          value={payments.length + 1240}
          change="+8.9%"
          isPositive={true}
          icon={CreditCard}
          color="blue"
          subtitle="UPI / Cards / Cash"
        />
      </div>

      {/* Payment Transactions Table */}
      <Card title="Payment Transaction History">
        <Table
          columns={columns}
          data={payments}
          searchPlaceholder="Search transactions by Consumer, Txn ID, Bill ID..."
          filterField="paymentMethod"
          filterOptions={[
            { label: 'UPI', value: 'UPI' },
            { label: 'Credit/Debit Card', value: 'Credit/Debit Card' },
            { label: 'Net Banking', value: 'Net Banking' },
            { label: 'Cash', value: 'Cash' },
          ]}
        />
      </Card>

      {/* COLLECT PAYMENT MODAL */}
      <Modal
        isOpen={isPayModalOpen}
        onClose={() => setIsPayModalOpen(false)}
        title="Collect Bill Payment"
        subtitle="Process counter or digital payment collection"
      >
        <form onSubmit={handleCollectSubmit} className="space-y-4">
          <Select
            label="Select Pending Statement / Bill"
            options={bills
              .filter((b) => b.status !== 'Paid')
              .map((b) => ({
                label: `Bill ${b.id} - ${b.consumerName} (₹${b.totalAmount})`,
                value: b.id,
              }))}
            value={selectedBillId}
            onChange={(e) => setSelectedBillId(e.target.value)}
            required
          />

          <Select
            label="Payment Method"
            options={['UPI', 'Credit/Debit Card', 'Net Banking', 'Cash']}
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />

          <Input
            label="Transaction Reference / Cheque / Ref No."
            placeholder="e.g. UPI/7749102/gpay"
            value={transactionRef}
            onChange={(e) => setTransactionRef(e.target.value)}
            required
          />

          <div className="pt-4 border-t flex items-center justify-end gap-3">
            <Button variant="outline" onClick={() => setIsPayModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="success" icon={CheckCircle2}>
              Confirm Payment & Issue Receipt
            </Button>
          </div>
        </form>
      </Modal>

      {/* DIGITAL RECEIPT MODAL */}
      <Modal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        title="Official Digital Payment Receipt"
        subtitle={`Receipt Ref: ${selectedReceipt?.id}`}
        maxWidth="max-w-lg"
      >
        {selectedReceipt && (
          <div className="space-y-6">
            <div id="printable-area" className="p-6 bg-white border border-slate-200 rounded-xl space-y-5">
              
              {/* Receipt Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                    <Zap className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">Ampora Ltd.</h3>
                    <p className="text-[10px] text-slate-500">Official Payment Voucher</p>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs tracking-wider border border-emerald-300 uppercase">
                  ✓ PAYMENT PAID
                </span>
              </div>

              {/* Receipt Data Table */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400">Transaction ID:</span>
                  <span className="font-mono font-bold text-slate-800">{selectedReceipt.id}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400">Bill Invoice Ref:</span>
                  <span className="font-mono font-bold text-blue-600">{selectedReceipt.billId}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400">Consumer Name:</span>
                  <span className="font-semibold text-slate-900">{selectedReceipt.consumerName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400">Consumer ID:</span>
                  <span className="font-mono text-slate-700">{selectedReceipt.consumerId}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400">Payment Date & Time:</span>
                  <span className="font-medium text-slate-800">{selectedReceipt.paymentDate}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400">Payment Channel:</span>
                  <span className="font-semibold text-slate-800">{selectedReceipt.paymentMethod}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400">Reference Txn:</span>
                  <span className="font-mono text-slate-600 truncate max-w-[180px]">{selectedReceipt.transactionRef}</span>
                </div>
                <div className="flex justify-between pt-3 text-base font-extrabold text-slate-900 border-t border-slate-200">
                  <span>AMOUNT CLEARED:</span>
                  <span className="text-emerald-600">₹{selectedReceipt.amount.toLocaleString()}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg text-center text-[10px] text-slate-400">
                Thank you for your prompt electricity bill payment. This digital receipt is legally valid.
              </div>
            </div>

            <div className="flex justify-between no-print pt-2">
              <Button variant="outline" onClick={() => setIsReceiptOpen(false)}>
                Close
              </Button>
              <Button variant="primary" icon={Printer} onClick={() => window.print()}>
                Print Receipt
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
