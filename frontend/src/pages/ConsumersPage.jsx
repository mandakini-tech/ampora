import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Table } from '../components/common/Table';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { Input, Select } from '../components/common/Input';
import {
  UserPlus,
  Eye,
  Edit,
  Trash2,
  User,
  MapPin,
  Phone,
  Mail,
  Zap,
  Tag,
  Calendar,
  CheckCircle2,
} from 'lucide-react';

export const ConsumersPage = () => {
  const { consumers, addConsumer, updateConsumer, deleteConsumer } = useApp();

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedConsumer, setSelectedConsumer] = useState(null);

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    meterNumber: '',
    connectionType: 'Residential',
    tariffCategory: 'LT-1 Domestic',
    initialReading: 0,
    status: 'Active',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      phone: '',
      email: '',
      meterNumber: '',
      connectionType: 'Residential',
      tariffCategory: 'LT-1 Domestic',
      initialReading: 0,
      status: 'Active',
    });
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (consumer) => {
    setSelectedConsumer(consumer);
    setFormData({
      name: consumer.name,
      address: consumer.address,
      phone: consumer.phone,
      email: consumer.email,
      meterNumber: consumer.meterNumber,
      connectionType: consumer.connectionType,
      tariffCategory: consumer.tariffCategory,
      initialReading: consumer.currentReading || 0,
      status: consumer.status,
    });
    setIsEditModalOpen(true);
  };

  const handleOpenView = (consumer) => {
    setSelectedConsumer(consumer);
    setIsViewModalOpen(true);
  };

  const handleOpenDelete = (consumer) => {
    setSelectedConsumer(consumer);
    setIsDeleteModalOpen(true);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    addConsumer(formData);
    setIsAddModalOpen(false);
    resetForm();
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (selectedConsumer) {
      updateConsumer(selectedConsumer.id, formData);
      setIsEditModalOpen(false);
    }
  };

  const handleDeleteConfirm = () => {
    if (selectedConsumer) {
      deleteConsumer(selectedConsumer.id);
      setIsDeleteModalOpen(false);
    }
  };

  const columns = [
    {
      header: 'Consumer ID',
      accessor: 'id',
      render: (row) => (
        <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded text-xs">
          {row.id}
        </span>
      ),
    },
    {
      header: 'Name',
      accessor: 'name',
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-900">{row.name}</p>
          <p className="text-xs text-slate-400">{row.email}</p>
        </div>
      ),
    },
    { header: 'Contact Phone', accessor: 'phone' },
    {
      header: 'Address',
      accessor: 'address',
      render: (row) => <span className="truncate max-w-xs block">{row.address}</span>,
    },
    {
      header: 'Meter Number',
      accessor: 'meterNumber',
      render: (row) => (
        <span className="font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-xs">
          {row.meterNumber}
        </span>
      ),
    },
    { header: 'Connection', accessor: 'connectionType' },
    { header: 'Tariff Category', accessor: 'tariffCategory' },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <Badge variant={row.status}>{row.status}</Badge>,
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleOpenView(row)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleOpenEdit(row)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50"
            title="Edit Consumer"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleOpenDelete(row)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50"
            title="Delete Consumer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Consumer Management Directory</h2>
          <p className="text-xs text-slate-500 mt-1">
            Register new connections, manage meter assignments, and edit tariff categories
          </p>
        </div>
        <Button variant="primary" icon={UserPlus} onClick={handleOpenAdd}>
          Add New Consumer
        </Button>
      </div>

      {/* Main Consumers Table */}
      <Table
        columns={columns}
        data={consumers}
        searchPlaceholder="Search by ID, Name, Meter Number, Address..."
        filterField="connectionType"
        filterOptions={[
          { label: 'Residential', value: 'Residential' },
          { label: 'Commercial', value: 'Commercial' },
          { label: 'Industrial', value: 'Industrial' },
        ]}
      />

      {/* ADD CONSUMER MODAL */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register New Electricity Consumer"
        subtitle="Generates unique Consumer ID & meter allocation record"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Consumer Name"
              icon={User}
              placeholder="e.g. Anish Shah"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              label="Contact Phone"
              icon={Phone}
              placeholder="+91 98765 00000"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
            <Input
              label="Email Address"
              icon={Mail}
              type="email"
              placeholder="consumer@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <Input
              label="Meter Serial Number"
              icon={Zap}
              placeholder="e.g. MTR-442109"
              value={formData.meterNumber}
              onChange={(e) => setFormData({ ...formData, meterNumber: e.target.value })}
              required
            />
            <Select
              label="Connection Type"
              options={['Residential', 'Commercial', 'Industrial']}
              value={formData.connectionType}
              onChange={(e) => setFormData({ ...formData, connectionType: e.target.value })}
            />
            <Select
              label="Tariff Category"
              options={['LT-1 Domestic', 'LT-2 Commercial', 'HT-1 Industrial']}
              value={formData.tariffCategory}
              onChange={(e) => setFormData({ ...formData, tariffCategory: e.target.value })}
            />
            <Input
              label="Initial Meter Reading (kWh)"
              type="number"
              placeholder="0"
              value={formData.initialReading}
              onChange={(e) => setFormData({ ...formData, initialReading: e.target.value })}
            />
            <Input
              label="Registration Date"
              type="date"
              icon={Calendar}
              value={new Date().toISOString().split('T')[0]}
              disabled
            />
          </div>

          <div className="w-full">
            <Input
              label="Complete Installation Address"
              icon={MapPin}
              placeholder="Flat/House No, Street, Landmark, Pincode"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" icon={CheckCircle2}>
              Register & Assign ID
            </Button>
          </div>
        </form>
      </Modal>

      {/* EDIT CONSUMER MODAL */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Edit Consumer: ${selectedConsumer?.id}`}
        subtitle="Update consumer profile and connection parameters"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <Input
            label="Full Consumer Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
            <Input
              label="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <Input
            label="Address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            required
          />
          <div className="grid grid-cols-3 gap-3">
            <Select
              label="Connection"
              options={['Residential', 'Commercial', 'Industrial']}
              value={formData.connectionType}
              onChange={(e) => setFormData({ ...formData, connectionType: e.target.value })}
            />
            <Select
              label="Tariff"
              options={['LT-1 Domestic', 'LT-2 Commercial', 'HT-1 Industrial']}
              value={formData.tariffCategory}
              onChange={(e) => setFormData({ ...formData, tariffCategory: e.target.value })}
            />
            <Select
              label="Status"
              options={['Active', 'Inactive', 'Suspended']}
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            />
          </div>

          <div className="pt-4 border-t flex items-center justify-end gap-3">
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* VIEW CONSUMER DETAIL MODAL */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Consumer Profile Card"
        subtitle={`System ID: ${selectedConsumer?.id}`}
      >
        {selectedConsumer && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-lg">
                {selectedConsumer.name.charAt(0)}
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">{selectedConsumer.name}</h4>
                <p className="text-xs text-slate-500">{selectedConsumer.email}</p>
                <div className="mt-1">
                  <Badge variant={selectedConsumer.status}>{selectedConsumer.status}</Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-lg border border-slate-100 bg-white">
                <span className="text-slate-400 font-medium uppercase tracking-wider block mb-1">Meter Serial Number</span>
                <span className="font-mono font-bold text-slate-800 text-sm">{selectedConsumer.meterNumber}</span>
              </div>
              <div className="p-3 rounded-lg border border-slate-100 bg-white">
                <span className="text-slate-400 font-medium uppercase tracking-wider block mb-1">Connection & Tariff</span>
                <span className="font-semibold text-slate-800 text-sm">{selectedConsumer.connectionType} • {selectedConsumer.tariffCategory}</span>
              </div>
              <div className="p-3 rounded-lg border border-slate-100 bg-white">
                <span className="text-slate-400 font-medium uppercase tracking-wider block mb-1">Contact Phone</span>
                <span className="font-medium text-slate-800">{selectedConsumer.phone}</span>
              </div>
              <div className="p-3 rounded-lg border border-slate-100 bg-white">
                <span className="text-slate-400 font-medium uppercase tracking-wider block mb-1">Current Meter Reading</span>
                <span className="font-mono font-bold text-blue-600">{selectedConsumer.currentReading || 1380} kWh</span>
              </div>
            </div>

            <div className="p-3 rounded-lg border border-slate-100 bg-white text-xs">
              <span className="text-slate-400 font-medium uppercase tracking-wider block mb-1">Installation Address</span>
              <span className="text-slate-800 font-medium">{selectedConsumer.address}</span>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="secondary" onClick={() => setIsViewModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* DELETE CONFIRMATION MODAL */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Consumer Account"
        message={`Are you sure you want to delete ${selectedConsumer?.name} (${selectedConsumer?.id})? This will unassign meter ${selectedConsumer?.meterNumber} and remove historical data.`}
        confirmText="Delete Account"
      />
    </div>
  );
};
