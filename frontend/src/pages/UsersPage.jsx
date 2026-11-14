import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Table } from '../components/common/Table';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { Card } from '../components/common/Card';
import { Input, Select } from '../components/common/Input';
import {
  UserCheck,
  UserPlus,
  ShieldCheck,
  KeyRound,
  Trash2,
  Mail,
  User,
  CheckCircle2,
} from 'lucide-react';

export const UsersPage = () => {
  const { users, addUser, updateUser, deleteUser } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Billing Staff',
    status: 'Active',
  });

  const handleOpenAdd = () => {
    setFormData({ name: '', email: '', role: 'Billing Staff', status: 'Active' });
    setIsAddModalOpen(true);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    addUser(formData);
    setIsAddModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (selectedUser) {
      deleteUser(selectedUser.id);
      setIsDeleteModalOpen(false);
    }
  };

  const columns = [
    {
      header: 'User ID',
      accessor: 'id',
      render: (row) => (
        <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded text-xs">
          {row.id}
        </span>
      ),
    },
    {
      header: 'Name',
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
            {row.name.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-slate-900">{row.name}</p>
            <p className="text-xs text-slate-400">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Role',
      accessor: 'role',
      render: (row) => (
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
            row.role === 'Administrator'
              ? 'bg-purple-50 text-purple-700 border border-purple-200'
              : row.role === 'Billing Staff'
              ? 'bg-blue-50 text-blue-700 border border-blue-200'
              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          }`}
        >
          {row.role}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <Badge variant={row.status}>{row.status}</Badge>,
    },
    { header: 'Last Login', accessor: 'lastLogin' },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => alert(`Password reset link dispatched to ${row.email}`)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50"
            title="Reset Password"
          >
            <KeyRound className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setSelectedUser(row);
              setIsDeleteModalOpen(true);
            }}
            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50"
            title="Delete User"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900">System Users & Access Control</h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage System Administrators, Billing Staff, and Consumer access roles
          </p>
        </div>
        <Button variant="primary" icon={UserPlus} onClick={handleOpenAdd}>
          Add System Staff / User
        </Button>
      </div>

      <Card title="System Accounts List">
        <Table
          columns={columns}
          data={users}
          searchPlaceholder="Search users by name, email, role..."
          filterField="role"
          filterOptions={[
            { label: 'Administrator', value: 'Administrator' },
            { label: 'Billing Staff', value: 'Billing Staff' },
            { label: 'Consumer', value: 'Consumer' },
          ]}
        />
      </Card>

      {/* ADD USER MODAL */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Provision New Staff / User Account"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <Input
            label="Full User Name"
            icon={User}
            placeholder="e.g. Ramesh Staff"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Official Email Address"
            type="email"
            icon={Mail}
            placeholder="user@ampora.gov.in"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <Select
            label="System Role"
            options={['Administrator', 'Billing Staff', 'Consumer']}
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          />

          <div className="pt-4 border-t flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" icon={CheckCircle2}>
              Create Account
            </Button>
          </div>
        </form>
      </Modal>

      {/* DELETE CONFIRMATION MODAL */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Revoke User Access"
        message={`Are you sure you want to delete ${selectedUser?.name} (${selectedUser?.email})?`}
      />
    </div>
  );
};
