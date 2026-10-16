import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Table } from '../components/common/Table';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Card } from '../components/common/Card';
import { Input, Select } from '../components/common/Input';
import {
  AlertTriangle,
  PlusCircle,
  CheckCircle2,
  Clock,
  UserCheck,
  MessageSquare,
  Zap,
} from 'lucide-react';

export const ComplaintsPage = () => {
  const { complaints, addComplaint, updateComplaint, consumers } = useApp();

  // Modals state
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // New complaint form state
  const [newComplaintData, setNewComplaintData] = useState({
    consumerId: consumers[0]?.id || '',
    type: 'Billing Error',
    description: '',
    priority: 'Medium',
  });

  // Update complaint form state
  const [updateStatus, setUpdateStatus] = useState('In Progress');
  const [assignedTo, setAssignedTo] = useState('Suresh (Field Supervisor)');
  const [resolutionNotes, setResolutionNotes] = useState('');

  const handleOpenSubmit = () => {
    setNewComplaintData({
      consumerId: consumers[0]?.id || '',
      type: 'Billing Error',
      description: '',
      priority: 'Medium',
    });
    setIsSubmitModalOpen(true);
  };

  const handleOpenUpdate = (complaint) => {
    setSelectedComplaint(complaint);
    setUpdateStatus(complaint.status);
    setAssignedTo(complaint.assignedTo || 'Suresh (Field Supervisor)');
    setResolutionNotes(complaint.resolutionNotes || '');
    setIsUpdateModalOpen(true);
  };

  const handleSubmitNew = (e) => {
    e.preventDefault();
    const consumerObj = consumers.find((c) => c.id === newComplaintData.consumerId);
    addComplaint({
      ...newComplaintData,
      consumerName: consumerObj?.name || 'Rajesh Kumar',
    });
    setIsSubmitModalOpen(false);
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    if (selectedComplaint) {
      updateComplaint(selectedComplaint.id, updateStatus, resolutionNotes, assignedTo);
      setIsUpdateModalOpen(false);
    }
  };

  const columns = [
    {
      header: 'Complaint ID',
      accessor: 'id',
      render: (row) => (
        <span className="font-mono font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded text-xs border border-rose-200">
          #{row.id}
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
      header: 'Category',
      accessor: 'type',
      render: (row) => <span className="font-medium text-slate-800">{row.type}</span>,
    },
    {
      header: 'Description',
      accessor: 'description',
      render: (row) => <span className="truncate max-w-xs block text-slate-600">{row.description}</span>,
    },
    { header: 'Submitted Date', accessor: 'submittedDate' },
    {
      header: 'Priority',
      accessor: 'priority',
      render: (row) => (
        <span
          className={`px-2 py-0.5 rounded text-xs font-semibold ${
            row.priority === 'High'
              ? 'bg-red-100 text-red-700'
              : row.priority === 'Medium'
              ? 'bg-amber-100 text-amber-700'
              : 'bg-slate-100 text-slate-600'
          }`}
        >
          {row.priority}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <Badge variant={row.status}>{row.status}</Badge>,
    },
    {
      header: 'Action',
      render: (row) => (
        <Button variant="outline" size="sm" onClick={() => handleOpenUpdate(row)}>
          Manage Ticket
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Consumer Complaint & Grievance Desk</h2>
          <p className="text-xs text-slate-500 mt-1">
            Track, assign, and resolve power outages, meter defects, and billing queries
          </p>
        </div>
        <Button variant="primary" icon={PlusCircle} onClick={handleOpenSubmit}>
          Register New Complaint
        </Button>
      </div>

      {/* Main Table */}
      <Card title="All Registered Complaints">
        <Table
          columns={columns}
          data={complaints}
          searchPlaceholder="Search complaints by ID, Consumer Name, Category..."
          filterField="status"
          filterOptions={[
            { label: 'Submitted', value: 'Submitted' },
            { label: 'In Progress', value: 'In Progress' },
            { label: 'Resolved', value: 'Resolved' },
            { label: 'Rejected', value: 'Rejected' },
          ]}
        />
      </Card>

      {/* SUBMIT COMPLAINT MODAL */}
      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        title="Register Electricity Complaint"
        subtitle="Generates grievance ticket for field inspection"
      >
        <form onSubmit={handleSubmitNew} className="space-y-4">
          <Select
            label="Select Consumer"
            options={consumers.map((c) => ({
              label: `${c.name} (${c.id})`,
              value: c.id,
            }))}
            value={newComplaintData.consumerId}
            onChange={(e) => setNewComplaintData({ ...newComplaintData, consumerId: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Complaint Category"
              options={['Billing Error', 'Faulty Meter', 'Power Outage', 'New Connection', 'Other']}
              value={newComplaintData.type}
              onChange={(e) => setNewComplaintData({ ...newComplaintData, type: e.target.value })}
            />
            <Select
              label="Priority Level"
              options={['Low', 'Medium', 'High']}
              value={newComplaintData.priority}
              onChange={(e) => setNewComplaintData({ ...newComplaintData, priority: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Detailed Description of Problem
            </label>
            <textarea
              rows={4}
              className="w-full rounded-lg border border-slate-300 p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Describe issue..."
              value={newComplaintData.description}
              onChange={(e) => setNewComplaintData({ ...newComplaintData, description: e.target.value })}
              required
            />
          </div>

          <div className="pt-4 border-t flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsSubmitModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" icon={CheckCircle2}>
              Submit Complaint Ticket
            </Button>
          </div>
        </form>
      </Modal>

      {/* UPDATE / RESOLVE COMPLAINT MODAL */}
      <Modal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        title={`Manage Complaint #${selectedComplaint?.id}`}
        subtitle={`Consumer: ${selectedComplaint?.consumerName} (${selectedComplaint?.consumerId})`}
      >
        {selectedComplaint && (
          <form onSubmit={handleUpdateSubmit} className="space-y-4">
            <div className="p-3 bg-slate-50 border rounded-lg text-xs space-y-1">
              <p><strong>Category:</strong> {selectedComplaint.type}</p>
              <p><strong>Submitted Date:</strong> {selectedComplaint.submittedDate}</p>
              <p><strong>Consumer Note:</strong> {selectedComplaint.description}</p>
            </div>

            <Select
              label="Update Status"
              options={['Submitted', 'In Progress', 'Resolved', 'Rejected']}
              value={updateStatus}
              onChange={(e) => setUpdateStatus(e.target.value)}
            />

            <Input
              label="Assigned Officer / Technical Team"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              placeholder="Field Team A"
            />

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Resolution Notes / Officer Comments
              </label>
              <textarea
                rows={3}
                className="w-full rounded-lg border border-slate-300 p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter inspection feedback and action taken..."
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
              />
            </div>

            <div className="pt-4 border-t flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsUpdateModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Save & Update Ticket
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
