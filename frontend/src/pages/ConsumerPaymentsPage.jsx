import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Modal } from '../components/common/Modal';
import { Table } from '../components/common/Table';
import { Input, Select } from '../components/common/Input';
import { CreditCard, Printer, Receipt } from 'lucide-react';

export const ConsumerPaymentsPage = () => {
  const { currentUser, bills, payments, payBill, settings } = useApp();
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [billToPay, setBillToPay] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [transactionRef, setTransactionRef] = useState('');
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
  const consumerPayments = payments
    .filter((payment) => payment.consumerId === currentUser?.consumerId)
    .slice()
    .sort((a, b) => new Date(b.paymentDate || 0) - new Date(a.paymentDate || 0));
  const unpaidBills = bills.filter(
    (bill) => bill.consumerId === currentUser?.consumerId && bill.status !== 'Paid'
  );

  const handlePaymentSubmit = async (event) => {
    event.preventDefault();
    if (!billToPay || isSubmittingPayment) return;
    setIsSubmittingPayment(true);
    try {
      const payment = await payBill(billToPay.id, paymentMethod, transactionRef);
      if (payment && typeof payment === 'object') {
        setBillToPay(null);
        setTransactionRef('');
        setSelectedPayment(payment);
      }
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  const columns = [
    { header: 'Transaction ID', accessor: 'id' },
    { header: 'Bill Reference', accessor: 'billId' },
    { header: 'Payment Date', accessor: 'paymentDate' },
    {
      header: 'Amount',
      accessor: 'amount',
      render: (payment) => `₹${(Number(payment.amount) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
    },
    { header: 'Method', accessor: 'paymentMethod' },
    {
      header: 'Status',
      accessor: 'status',
      render: (payment) => <Badge variant={payment.status}>{payment.status}</Badge>,
    },
    {
      header: 'Receipt',
      render: (payment) => (
        <Button size="sm" variant="outline" icon={Receipt} onClick={() => setSelectedPayment(payment)}>
          View receipt
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">My Payments</h2>
        <p className="mt-1 text-xs text-slate-500">Payment records and receipts linked to your account.</p>
      </div>

      <Card title="Payment History">
        <Table
          columns={columns}
          data={consumerPayments}
          searchPlaceholder="Search your payments by transaction or bill..."
          emptyMessage="No payment records are available for your account yet."
        />
      </Card>

      <Card title="Bills Awaiting Payment" subtitle="Record completed payments and view the receipt in your payment history.">
        <p className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs text-blue-900">
          Complete UPI or card payments with your provider first. Cash payments must already have been handed to staff. This form records a completed payment; it does not initiate a transfer.
        </p>
        <div className="space-y-3">
          {unpaidBills.map((bill) => (
            <div key={bill.id} className="flex flex-col gap-3 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-slate-900">{bill.id} · {bill.billingPeriod}</p>
                <p className="mt-1 text-xs text-slate-500">
                  Due {bill.dueDate} · ₹{(Number(bill.totalAmount) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <Button
                variant="primary"
                icon={CreditCard}
                onClick={() => {
                  setBillToPay(bill);
                  setTransactionRef('');
                }}
              >
                Record payment
              </Button>
            </div>
          ))}
          {!unpaidBills.length && (
            <p className="py-4 text-center text-sm text-slate-500">You have no unpaid bills.</p>
          )}
        </div>
      </Card>

      <Modal
        isOpen={Boolean(billToPay)}
        onClose={() => setBillToPay(null)}
        title="Record payment"
        subtitle={billToPay ? `${billToPay.id} · ₹${billToPay.totalAmount}` : undefined}
      >
        {billToPay && (
          <form onSubmit={handlePaymentSubmit} className="space-y-4">
            <p className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs text-blue-900">
              Only submit after the payment is complete. Use the reference from your UPI or card provider; for cash, enter the receipt number if one was issued.
            </p>
            <Select
              label="Payment method"
              options={['Cash', 'UPI', 'Card']}
              value={paymentMethod}
              onChange={(event) => {
                setPaymentMethod(event.target.value);
                setTransactionRef('');
              }}
            />
            <Input
              label={paymentMethod === 'Cash' ? 'Cash receipt number (if available)' : 'Payment transaction reference'}
              placeholder={paymentMethod === 'Cash' ? 'Enter receipt number' : 'Enter the reference from your provider'}
              value={transactionRef}
              onChange={(event) => setTransactionRef(event.target.value)}
              required={paymentMethod !== 'Cash'}
            />
            <div className="no-print flex justify-end gap-3 border-t pt-4">
              <Button type="button" variant="outline" disabled={isSubmittingPayment} onClick={() => setBillToPay(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={isSubmittingPayment}>
                {isSubmittingPayment ? 'Saving...' : `Confirm payment ₹${billToPay.totalAmount}`}
              </Button>
            </div>
          </form>
        )}
      </Modal>

      <Modal
        isOpen={Boolean(selectedPayment)}
        onClose={() => setSelectedPayment(null)}
        title="Payment Receipt"
        subtitle={`Transaction ${selectedPayment?.id || ''}`}
      >
        {selectedPayment && (
          <div className="space-y-4">
            <article id="printable-area" className="space-y-4 border border-slate-200 bg-white p-6 text-sm text-slate-900">
              <header className="border-b border-slate-200 pb-4">
                <h3 className="text-lg font-bold">{settings?.companyName || 'Ampora Utility Ltd.'}</h3>
                <p className="mt-1 text-xs">Payment receipt</p>
              </header>
              <dl className="grid grid-cols-2 gap-3 text-xs">
                <dt>Transaction ID</dt><dd className="text-right font-semibold">{selectedPayment.id}</dd>
                <dt>Bill reference</dt><dd className="text-right">{selectedPayment.billId}</dd>
                <dt>Consumer</dt><dd className="text-right">{selectedPayment.consumerName}</dd>
                <dt>Payment date</dt><dd className="text-right">{selectedPayment.paymentDate}</dd>
                <dt>Payment method</dt><dd className="text-right">{selectedPayment.paymentMethod}</dd>
                <dt>Reference</dt><dd className="text-right">{selectedPayment.transactionRef}</dd>
                <dt>Status</dt><dd className="text-right">{selectedPayment.status}</dd>
                <dt className="border-t border-slate-200 pt-3 font-bold">Amount paid</dt>
                <dd className="border-t border-slate-200 pt-3 text-right font-bold">
                  {settings?.currencySymbol || '₹'}{(Number(selectedPayment.amount) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </dd>
              </dl>
            </article>
            <div className="no-print flex justify-end">
              <Button variant="primary" icon={Printer} onClick={() => window.print()}>
                Print receipt
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
