import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Modal } from '../components/common/Modal';
import { Select } from '../components/common/Input';
import { PlusCircle } from 'lucide-react';

const COMPLAINT_TYPES = ['Billing Error', 'Faulty Meter', 'Power Outage', 'New Connection', 'Other'];

export const ConsumerComplaintsPage = () => {
  const { currentUser, complaints, addComplaint } = useApp();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [type, setType] = useState(COMPLAINT_TYPES[0]);
  const [description, setDescription] = useState('');
  const consumerComplaints = complaints
    .filter((complaint) => complaint.consumerId === currentUser?.consumerId)
    .slice()
    .sort((a, b) => new Date(b.submittedDate || 0) - new Date(a.submittedDate || 0));

  const handleSubmit = (event) => {
    event.preventDefault();
    const saved = addComplaint({
      consumerId: currentUser?.consumerId,
      consumerName: currentUser?.name,
      type,
      description,
      priority: 'Medium',
    });
    if (saved) {
      setDescription('');
      setIsFormOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">My Complaints</h2>
          <p className="mt-1 text-xs text-slate-500">Submit a service issue and follow its status and resolution notes.</p>
        </div>
        <Button variant="primary" icon={PlusCircle} onClick={() => setIsFormOpen(true)}>
          New complaint
        </Button>
      </div>

      <Card title="Complaint History">
        <div className="space-y-3">
          {consumerComplaints.map((complaint) => (
            <article key={complaint.id} className="rounded-xl border border-slate-200 p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-slate-900">{complaint.type}</p>
                  <p className="mt-1 font-mono text-xs text-slate-500">{complaint.id} · {complaint.submittedDate}</p>
                </div>
                <Badge variant={complaint.status}>{complaint.status}</Badge>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm text-slate-700">{complaint.description}</p>
              {complaint.resolutionNotes && (
                <p className="mt-3 rounded-lg bg-emerald-50 p-3 text-xs text-emerald-900">
                  <strong>Update from the utility team:</strong> {complaint.resolutionNotes}
                </p>
              )}
            </article>
          ))}
          {!consumerComplaints.length && (
            <p className="py-6 text-center text-sm text-slate-500">You have not submitted any complaints.</p>
          )}
        </div>
      </Card>

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Submit a complaint"
        subtitle="Your ticket will be sent to the utility support desk."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Issue type"
            options={COMPLAINT_TYPES}
            value={type}
            onChange={(event) => setType(event.target.value)}
          />
          <div>
            <label htmlFor="consumer-complaint-description" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
              Description
            </label>
            <textarea
              id="consumer-complaint-description"
              rows={5}
              className="w-full rounded-lg border border-slate-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe the issue and when it started..."
              required
            />
          </div>
          <div className="no-print flex justify-end gap-3 border-t pt-4">
            <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Submit complaint
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
