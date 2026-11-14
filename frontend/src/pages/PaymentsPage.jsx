import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
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
  ShieldCheck,
  Zap,
} from 'lucide-react';

export const PaymentsPage = () => {
  const { payments, bills, payBill } = useApp();
  const location = useLocation();
  const requestedBillId = location.state?.billId || '';

  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  const [isPayModalOpen, setIsPayModalOpen] = useState(Boolean(requestedBillId));
  const [selectedBillId, setSelectedBillId] = useState(requestedBillId);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [transactionRef, setTransactionRef] = useState('');
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);

  // Summaries
  const totalCollected = payments
    .filter((payment) => payment.status === 'Successful')
    .reduce((acc, payment) => acc + (Number(payment.amount) || 0), 0);
  const pendingAmount = bills
    .filter((bill) => bill.status === 'Pending')
    .reduce((acc, bill) => acc + (Number(bill.totalAmount) || 0), 0);
  const overdueAmount = bills
    .filter((bill) => bill.status === 'Overdue')
    .reduce((acc, bill) => acc + (Number(bill.totalAmount) || 0), 0);
  const now = new Date();
  const transactionsThisMonth = payments.filter((payment) => {
    const date = new Date(payment.paymentDate);
    return payment.status === 'Successful' &&
      !Number.isNaN(date.getTime()) &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();
  }).length;
  const formatCurrency = (amount) => `₹${amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  const handleOpenReceipt = (payment) => {
    setSelectedReceipt(payment);
    setIsReceiptOpen(true);
  };

  const handleOpenPay = (billId = '') => {
    const defaultBill = billId || bills.find((b) => b.status !== 'Paid')?.id || '';
    setSelectedBillId(defaultBill);
    setTransactionRef('');
    setIsPayModalOpen(true);
  };

  const handleCollectSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBillId || isSubmittingPayment) return;
    setIsSubmittingPayment(true);
    try {
      const newTxn = await payBill(selectedBillId, paymentMethod, transactionRef);
      if (newTxn) {
        setIsPayModalOpen(false);
        handleOpenReceipt(newTxn);
      }
    } finally {
      setIsSubmittingPayment(false);
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
            Review recorded payments, collect dues, and issue digital receipts
          </p>
        </div>
        <Button variant="primary" icon={CreditCard} onClick={() => handleOpenPay()}>
          Record Payment
        </Button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Collected"
          value={formatCurrency(totalCollected)}
          icon={CheckCircle2}
          color="emerald"
          subtitle="Successful recorded payments"
        />
        <StatCard
          title="Pending Amount"
          value={formatCurrency(pendingAmount)}
          icon={Clock}
          color="amber"
          subtitle="Bills awaiting payment"
        />
        <StatCard
          title="Overdue Amount"
          value={formatCurrency(overdueAmount)}
          icon={AlertTriangle}
          color="rose"
          subtitle="Bills marked overdue"
        />
        <StatCard
          title="Transactions This Month"
          value={transactionsThisMonth}
          icon={CreditCard}
          color="blue"
          subtitle="Successful records this month"
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
            { label: 'Card', value: 'Card' },
            { label: 'Credit/Debit Card (legacy)', value: 'Credit/Debit Card' },
            { label: 'Net Banking (legacy)', value: 'Net Banking' },
            { label: 'Cash', value: 'Cash' },
          ]}
        />
      </Card>

      {/* COLLECT PAYMENT MODAL */}
      <Modal
        isOpen={isPayModalOpen}
        onClose={() => setIsPayModalOpen(false)}
        title="Collect Bill Payment"
        subtitle="Record a payment that has already been received"
      >
        <form onSubmit={handleCollectSubmit} className="space-y-4">
          <p className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs text-blue-900">
            Confirm the funds were received before recording the payment. UPI and card transactions must be completed with the provider first; this form does not initiate a transfer.
          </p>
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
            options={['Cash', 'UPI', 'Card']}
            value={paymentMethod}
            onChange={(e) => {
              setPaymentMethod(e.target.value);
              setTransactionRef('');
            }}
          />

          <Input
            label="Transaction Reference / Cheque / Ref No."
            placeholder={paymentMethod === 'Cash' ? 'Enter cash receipt number' : 'Enter the reference from your provider'}
            value={transactionRef}
            onChange={(e) => setTransactionRef(e.target.value)}
            required
          />

          <div className="pt-4 border-t flex items-center justify-end gap-3">
            <Button type="button" variant="outline" disabled={isSubmittingPayment} onClick={() => setIsPayModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="success" icon={CheckCircle2} disabled={isSubmittingPayment}>
              {isSubmittingPayment ? 'Saving...' : 'Record Payment & Issue Receipt'}
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
