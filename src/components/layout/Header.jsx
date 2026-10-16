import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Menu,
  Bell,
  Search,
  User,
  LogOut,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const Header = ({ onMenuClick, isCollapsed }) => {
  const { currentUser, logout, switchRole } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Map route to page title
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return 'System Dashboard';
      case '/consumers':
        return 'Consumer Management';
      case '/meter-readings':
        return 'Meter Reading & Tariff Entry';
      case '/bills':
        return 'Bill Generation & Invoicing';
      case '/payments':
        return 'Payment Tracking & Receipts';
      case '/complaints':
        return 'Consumer Complaints Desk';
      case '/reports':
        return 'Analytics & Export Reports';
      case '/users':
        return 'User & Access Control';
      case '/settings':
        return 'System & Tariff Settings';
      case '/consumer-portal':
        return 'Consumer Self-Service Portal';
      default:
        return 'Ampora Portal';
    }
  };

  const sampleNotifications = [
    { id: 1, title: 'New Payment Received', time: '10m ago', text: '₹4,594 paid by Aarav Sharma (MTR-993011)' },
    { id: 2, title: 'Meter Reading Recorded', time: '45m ago', text: '130 units consumed by Rajesh Kumar' },
    { id: 3, title: 'High Priority Complaint', time: '2h ago', text: 'Faulty meter reported by Sunita Reddy' },
  ];

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200/80 px-4 lg:px-6 flex items-center justify-between shadow-2xs">
      {/* Left side: Hamburger & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-tight">
            {getPageTitle()}
          </h1>
          <p className="text-xs text-slate-500 hidden sm:block">
            {currentUser?.role === 'Consumer'
              ? 'Manage your electricity connection, pay bills & register grievances'
              : 'Ampora Utility Operations & Invoicing System'}
          </p>
        </div>
      </div>

      {/* Center Search Bar */}
      <div className="hidden md:flex items-center w-72 relative">
        <Search className="w-4 h-4 absolute left-3 text-slate-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Quick search (ID, Name, Meter...)"
          className="w-full text-xs pl-9 pr-4 py-2 rounded-full border border-slate-200 bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        />
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-3">
        {/* Role Badge */}
        <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{currentUser?.role} Mode</span>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="relative p-2 rounded-full text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-fade-in">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">Notifications</span>
                <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
                  3 New
                </span>
              </div>
              <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                {sampleNotifications.map((n) => (
                  <div key={n.id} className="p-3 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-semibold text-slate-800">{n.title}</p>
                      <span className="text-[10px] text-slate-400">{n.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-snug">{n.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
              {currentUser?.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                currentUser?.name?.charAt(0) || 'U'
              )}
            </div>
            <span className="text-xs font-semibold text-slate-700 hidden lg:inline-block">
              {currentUser?.name?.split(' ')[0]}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:inline-block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-fade-in">
              <div className="px-4 py-2.5 border-b border-slate-100">
                <p className="text-sm font-bold text-slate-900">{currentUser?.name}</p>
                <p className="text-xs text-slate-500 truncate">{currentUser?.email}</p>
                <p className="text-[11px] text-blue-600 font-semibold mt-1">Role: {currentUser?.role}</p>
              </div>

              {/* Quick Switch role inside menu */}
              <div className="p-2 border-b border-slate-100">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1">
                  Switch Active Role
                </p>
                <button
                  onClick={() => {
                    switchRole('Administrator');
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 rounded text-xs hover:bg-slate-50 font-medium text-slate-700 flex items-center justify-between"
                >
                  <span>Administrator</span>
                  {currentUser?.role === 'Administrator' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                </button>
                <button
                  onClick={() => {
                    switchRole('Billing Staff');
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 rounded text-xs hover:bg-slate-50 font-medium text-slate-700 flex items-center justify-between"
                >
                  <span>Billing Staff</span>
                  {currentUser?.role === 'Billing Staff' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                </button>
                <button
                  onClick={() => {
                    switchRole('Consumer');
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 rounded text-xs hover:bg-slate-50 font-medium text-slate-700 flex items-center justify-between"
                >
                  <span>Consumer</span>
                  {currentUser?.role === 'Consumer' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                </button>
              </div>

              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
