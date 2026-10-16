import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Zap,
  LayoutDashboard,
  Users,
  Gauge,
  Receipt,
  CreditCard,
  AlertCircle,
  FileBarChart,
  UserCheck,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  UserCheck2,
  User,
} from 'lucide-react';

export const Sidebar = ({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) => {
  const { currentUser, logout, switchRole } = useApp();
  const navigate = useNavigate();

  // Navigation Items based on User Role
  const role = currentUser?.role || 'Administrator';

  const adminNav = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Consumers', path: '/consumers', icon: Users },
    { label: 'Meter Readings', path: '/meter-readings', icon: Gauge },
    { label: 'Bills', path: '/bills', icon: Receipt },
    { label: 'Payments', path: '/payments', icon: CreditCard },
    { label: 'Complaints', path: '/complaints', icon: AlertCircle },
    { label: 'Reports', path: '/reports', icon: FileBarChart },
    { label: 'Users', path: '/users', icon: UserCheck },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  const staffNav = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Consumers', path: '/consumers', icon: Users },
    { label: 'Meter Readings', path: '/meter-readings', icon: Gauge },
    { label: 'Bills', path: '/bills', icon: Receipt },
    { label: 'Payments', path: '/payments', icon: CreditCard },
    { label: 'Complaints', path: '/complaints', icon: AlertCircle },
  ];

  const consumerNav = [
    { label: 'My Portal', path: '/consumer-portal', icon: User },
    { label: 'My Bills', path: '/bills', icon: Receipt },
    { label: 'Make Payment', path: '/payments', icon: CreditCard },
    { label: 'Register Complaint', path: '/complaints', icon: AlertCircle },
  ];

  const navItems = role === 'Administrator' ? adminNav : role === 'Billing Staff' ? staffNav : consumerNav;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen bg-slate-900 text-slate-300 transition-all duration-300 flex flex-col border-r border-slate-800 ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80 shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20 shrink-0">
              <Zap className="w-6 h-6 fill-current text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <span className="text-lg font-extrabold tracking-tight text-white block leading-tight">
                  Ampora<span className="text-blue-500"></span>
                </span>
                <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase block">
                  Utility Portal
                </span>
              </div>
            )}
          </div>

          {/* Desktop Toggle Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        {/* User Role Indicator pill */}
        {!isCollapsed && (
          <div className="px-4 py-3 mx-3 my-3 rounded-xl bg-slate-800/70 border border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <div className="truncate">
                <p className="text-xs font-semibold text-white truncate">{currentUser?.name}</p>
                <p className="text-[11px] text-blue-400 font-medium truncate">{currentUser?.role}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation items list */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  } ${isCollapsed ? 'justify-center px-0' : ''}`
                }
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!isCollapsed && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Quick Role Switcher for Viva Demo */}
        {!isCollapsed && (
          <div className="p-3 mx-3 my-2 rounded-xl bg-slate-800/40 border border-slate-800">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Demo Role Switcher
            </p>
            <div className="grid grid-cols-3 gap-1">
              <button
                onClick={() => switchRole('Administrator')}
                className={`px-1.5 py-1 text-[11px] font-medium rounded transition-colors ${
                  role === 'Administrator' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Admin
              </button>
              <button
                onClick={() => switchRole('Billing Staff')}
                className={`px-1.5 py-1 text-[11px] font-medium rounded transition-colors ${
                  role === 'Billing Staff' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Staff
              </button>
              <button
                onClick={() => switchRole('Consumer')}
                className={`px-1.5 py-1 text-[11px] font-medium rounded transition-colors ${
                  role === 'Consumer' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Consumer
              </button>
            </div>
          </div>
        )}

        {/* Logout section */}
        <div className="p-3 border-t border-slate-800 shrink-0">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors ${
              isCollapsed ? 'justify-center px-0' : ''
            }`}
            title="Logout"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};
