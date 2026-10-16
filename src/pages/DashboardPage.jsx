import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { StatCard } from '../components/common/StatCard';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import {
  Users,
  Receipt,
  CreditCard,
  AlertTriangle,
  Zap,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  PlusCircle,
  FileText,
  Activity,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  monthlyRevenueData,
  consumptionChartData,
  paymentStatusPieData,
  consumerGrowthData,
} from '../mock/data';

export const DashboardPage = () => {
  const { consumers, bills, payments, complaints, payBill } = useApp();
  const navigate = useNavigate();

  // Metrics calculations
  const totalConsumersCount = consumers.length + 14814; // Base + mock array
  const totalBillsCount = bills.length + 12440;
  const totalPaidAmount = payments.reduce((acc, p) => acc + p.amount, 0) + 3820000;
  
  const pendingBillsList = bills.filter((b) => b.status === 'Pending' || b.status === 'Overdue');
  const pendingDuesTotal = bills
    .filter((b) => b.status === 'Pending' || b.status === 'Overdue')
    .reduce((acc, b) => acc + b.totalAmount, 0) + 450000;

  const activeComplaintsCount = complaints.filter((c) => c.status !== 'Resolved').length;

  const recentActivities = [
    { id: 1, type: 'Payment', title: 'Payment Received', desc: 'Aarav Sharma paid ₹4,594.35 via UPI', time: '10 mins ago', icon: CreditCard, color: 'text-emerald-600 bg-emerald-50' },
    { id: 2, type: 'Reading', title: 'Meter Reading Entered', desc: '130 units recorded for Rajesh Kumar (MTR-884920)', time: '45 mins ago', icon: Zap, color: 'text-blue-600 bg-blue-50' },
    { id: 3, type: 'Bill', title: 'Bill Generated', desc: 'Invoice #BILL-2026-104 generated for Sunita Reddy', time: '2 hours ago', icon: Receipt, color: 'text-amber-600 bg-amber-50' },
    { id: 4, type: 'Complaint', title: 'Complaint Registered', desc: 'Faulty display reported by Sunita Reddy', time: '3 hours ago', icon: AlertTriangle, color: 'text-rose-600 bg-rose-50' },
    { id: 5, type: 'Consumer', title: 'New Consumer Registered', desc: 'Precision Forgings Pvt Ltd added to HT-1 Industrial', time: '5 hours ago', icon: Users, color: 'text-purple-600 bg-purple-50' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-xs font-semibold text-blue-100 mb-2">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            Grid Operations Active • Billing Cycle Oct 2026
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight">System Operational Overview</h1>
          <p className="text-blue-100 text-xs mt-1">
            Real-time analytics for consumer billing, power consumption, payments & complaints
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={PlusCircle}
            onClick={() => navigate('/meter-readings')}
            className="bg-white text-blue-700 hover:bg-blue-50 border-0"
          >
            Enter Meter Reading
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Receipt}
            onClick={() => navigate('/bills')}
            className="bg-blue-900 hover:bg-blue-950 text-white border-0"
          >
            Generate Bill
          </Button>
        </div>
      </div>

      {/* KPI Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Total Consumers"
          value={totalConsumersCount.toLocaleString()}
          change="+3.4%"
          isPositive={true}
          icon={Users}
          color="blue"
          subtitle="Active Connections"
        />
        <StatCard
          title="Bills Generated"
          value={totalBillsCount.toLocaleString()}
          change="+5.1%"
          isPositive={true}
          icon={Receipt}
          color="purple"
          subtitle="Oct 2026 Cycle"
        />
        <StatCard
          title="Payments Collected"
          value={`₹${(totalPaidAmount / 100000).toFixed(2)}L`}
          change="+8.2%"
          isPositive={true}
          icon={CreditCard}
          color="emerald"
          subtitle="Current Month"
        />
        <StatCard
          title="Pending Dues"
          value={`₹${(pendingDuesTotal / 100000).toFixed(2)}L`}
          change="-2.1%"
          isPositive={true}
          icon={Clock}
          color="amber"
          subtitle="Unpaid Statements"
        />
        <StatCard
          title="Active Complaints"
          value={activeComplaintsCount}
          change="-12%"
          isPositive={true}
          icon={AlertCircle}
          color="rose"
          subtitle="Open Tickets"
        />
        <StatCard
          title="Monthly Revenue"
          value="₹45.2 Lakhs"
          change="+6.8%"
          isPositive={true}
          icon={TrendingUp}
          color="blue"
          subtitle="Projected vs Target"
        />
      </div>

      {/* Interactive Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Analytics (Bar / Line Chart) */}
        <Card
          title="Monthly Revenue Trend (₹ Lakhs)"
          subtitle="Actual revenue vs projected target"
          className="lg:col-span-2"
        >
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRevenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="revenue" name="Actual Revenue (Lakhs)" fill="#2563eb" radius={[6, 6, 0, 0]} />
                <Bar dataKey="target" name="Target Revenue (Lakhs)" fill="#cbd5e1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Payment Status Breakdown (Pie Chart) */}
        <Card title="Payment Collection Status" subtitle="Breakdown of October billing cycle">
          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentStatusPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {paymentStatusPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-slate-100">
            {paymentStatusPieData.map((item, idx) => (
              <div key={idx} className="p-2 rounded-lg bg-slate-50">
                <span className="block text-xs text-slate-500 font-medium">{item.name}</span>
                <span className="block text-sm font-bold mt-0.5" style={{ color: item.color }}>
                  {item.value}%
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Second Row of Charts: Consumption & Consumer Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Electricity Consumption (Line Chart) */}
        <Card
          title="Electricity Consumption Trend (kWh)"
          subtitle="Breakdown by consumer category (Residential, Commercial, Industrial)"
          className="lg:col-span-2"
        >
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={consumptionChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="Residential" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Commercial" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Industrial" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Consumer Growth & Live Activity */}
        <div className="space-y-6">
          <Card title="Consumer Growth Trend" subtitle="Total registered active connections">
            <div className="h-36 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={consumerGrowthData}>
                  <XAxis dataKey="month" hide />
                  <YAxis hide domain={['dataMin - 500', 'dataMax + 500']} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '12px' }}
                  />
                  <Line type="monotone" dataKey="consumers" stroke="#2563eb" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
              <span className="text-slate-500">Current Consumer Base</span>
              <span className="font-bold text-slate-900">14,820 Connections</span>
            </div>
          </Card>
        </div>
      </div>

      {/* Bottom Row: Recent Activity & Pending Bills Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity Timeline */}
        <Card title="Recent Utility Activity" subtitle="Live stream of grid & billing transactions">
          <div className="space-y-4">
            {recentActivities.map((act) => {
              const Icon = act.icon;
              return (
                <div key={act.id} className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg shrink-0 ${act.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-slate-800">{act.title}</p>
                      <span className="text-[10px] text-slate-400">{act.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{act.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Pending Bills Table */}
        <Card
          title="Pending Statements & Due Actions"
          subtitle="Recent bills awaiting payment"
          action={
            <Button variant="ghost" size="sm" onClick={() => navigate('/bills')}>
              View All Bills
            </Button>
          }
          className="lg:col-span-2"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase">
                <tr>
                  <th className="px-3 py-2.5">Consumer ID</th>
                  <th className="px-3 py-2.5">Consumer Name</th>
                  <th className="px-3 py-2.5">Bill Amount</th>
                  <th className="px-3 py-2.5">Due Date</th>
                  <th className="px-3 py-2.5">Status</th>
                  <th className="px-3 py-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bills.map((bill) => (
                  <tr key={bill.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-3 py-3 font-mono font-semibold text-slate-700">{bill.consumerId}</td>
                    <td className="px-3 py-3 font-medium text-slate-900">{bill.consumerName}</td>
                    <td className="px-3 py-3 font-semibold text-slate-900">₹{bill.totalAmount.toLocaleString()}</td>
                    <td className="px-3 py-3 text-slate-500">{bill.dueDate}</td>
                    <td className="px-3 py-3">
                      <Badge variant={bill.status}>{bill.status}</Badge>
                    </td>
                    <td className="px-3 py-3 text-right">
                      {bill.status !== 'Paid' ? (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => payBill(bill.id, 'UPI', 'QUICK-PAY')}
                        >
                          Collect Pay
                        </Button>
                      ) : (
                        <span className="text-emerald-600 font-semibold text-xs flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Billed & Paid
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};
