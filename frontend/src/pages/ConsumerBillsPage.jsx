import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Modal } from '../components/common/Modal';
import { Table } from '../components/common/Table';
import { BillDocument, printBillDocument } from '../components/billing/BillDocument';
import { Download, Eye, Printer } from 'lucide-react';

export const ConsumerBillsPage = () => {
  const { currentUser, bills, consumers, settings } = useApp();
  const [selectedBill, setSelectedBill] = useState(null);
  const consumer = consumers.find((item) => item.id === currentUser?.consumerId);
  const consumerBills = bills
    .filter((bill) => bill.consumerId === currentUser?.consumerId)
    .slice()
    .sort((a, b) => new Date(b.billDate || 0) - new Date(a.billDate || 0));

  const columns = [
    { header: 'Bill ID', accessor: 'id' },
    { header: 'Billing Period', accessor: 'billingPeriod' },
    {
      header: 'Units',
      accessor: 'unitsConsumed',
      render: (bill) => `${Number(bill.unitsConsumed) || 0} kWh`,
    },
    {
      header: 'Amount',
      accessor: 'totalAmount',
      render: (bill) => `₹${(Number(bill.totalAmount) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
    },
    { header: 'Due Date', accessor: 'dueDate' },
    {
      header: 'Status',
      accessor: 'status',
      render: (bill) => <Badge variant={bill.status}>{bill.status}</Badge>,
    },
    {
      header: 'Actions',
      render: (bill) => (
        <Button size="sm" variant="outline" icon={Eye} onClick={() => setSelectedBill(bill)}>
          View bill
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">My Bills</h2>
        <p className="mt-1 text-xs text-slate-500">Your itemized statements, due dates, and payment status.</p>
      </div>

      <Card title="Billing History">
        <Table
          columns={columns}
          data={consumerBills}
          searchPlaceholder="Search your bills by ID or billing period..."
          emptyMessage="No bills are available for your account yet."
        />
      </Card>

      <Modal
        isOpen={Boolean(selectedBill)}
        onClose={() => setSelectedBill(null)}
        title="Electricity Bill"
        subtitle={`Invoice ${selectedBill?.id || ''}`}
        maxWidth="max-w-3xl"
      >
        {selectedBill && (
          <div className="space-y-4">
            <BillDocument bill={selectedBill} consumer={consumer} settings={settings} />
            <div className="no-print flex flex-wrap justify-end gap-2">
              <Button variant="secondary" icon={Printer} onClick={() => printBillDocument(selectedBill)}>
                Print bill
              </Button>
              <Button variant="primary" icon={Download} onClick={() => printBillDocument(selectedBill)}>
                Save as PDF
              </Button>
            </div>
            <p className="no-print text-right text-[11px] text-slate-500">
              In the print dialog, choose “Save as PDF” to download a copy.
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};
