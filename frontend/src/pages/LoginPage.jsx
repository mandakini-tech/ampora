import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Zap,
  Mail,
  ShieldCheck,
  UserCheck,
  User,
  MapPin,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Input, Select } from '../components/common/Input';

export const LoginPage = () => {
  const { login } = useApp();
  const navigate = useNavigate();

  const [role, setRole] = useState('Consumer');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setTimeout(() => {
      const signedIn = login(role, email);
      setIsLoading(false);
      if (!signedIn) {
        setError('No registered account matches this role and email. Register your connection first.');
        return;
      }
      if (role === 'Consumer') {
        navigate('/consumer-portal');
      } else {
        navigate('/dashboard');
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-stretch">
      {/* Left Side: Desktop Utility Hero Graphic Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 text-white relative flex-col justify-between p-12 overflow-hidden">
        {/* Background Grid Accent */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px]" />
        
        {/* Glowing Circle */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/30 blur-3xl rounded-full pointer-events-none" />

        {/* Top Header Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/30">
            <Zap className="w-7 h-7 fill-current" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">
              Ampora
            </h1>
            <p className="text-xs text-slate-400 font-medium">Electricity Billing Management System</p>
          </div>
        </div>

        {/* Middle Content */}
        <div className="relative z-10 my-auto max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Next-Gen Smart Energy Distribution Portal</span>
          </div>

          <h2 className="text-4xl font-extrabold tracking-tight leading-tight text-white mb-4">
            Automated Tariff Calculation, Billing & Consumer Management
          </h2>
          <p className="text-slate-400 text-base leading-relaxed mb-8">
            Manage consumer accounts, meter readings, itemized bills, payment records, and complaint status from one portal.
          </p>

          {/* Core portal capabilities */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/60 backdrop-blur-xs">
              <p className="text-sm font-bold text-white">Usage</p>
              <p className="text-xs text-slate-400 mt-0.5">Meter reading history</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/60 backdrop-blur-xs">
              <p className="text-sm font-bold text-emerald-400">Bills</p>
              <p className="text-xs text-slate-400 mt-0.5">Itemized statements</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/60 backdrop-blur-xs">
              <p className="text-sm font-bold text-blue-400">Support</p>
              <p className="text-xs text-slate-400 mt-0.5">Complaint tracking</p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-xs text-slate-500 flex items-center justify-between border-t border-slate-800 pt-6">
          <p>© 2026 Ampora Distribution Corp. All rights reserved.</p>
          <span className="font-mono">v2.4.0 (College SE Project Edition)</span>
        </div>
      </div>

      {/* Right Side: Login Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-slate-50">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200/80 p-8 sm:p-10">
          
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
              <Zap className="w-6 h-6 fill-current" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                Ampora
              </h1>
              <p className="text-xs text-slate-500">Electricity Management System</p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Portal Login</h2>
            <p className="text-xs text-slate-500 mt-1">
              Select your role and use an account already registered in the database
            </p>
          </div>

          {error && (
            <div role="alert" className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selection Selector Tabs */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Select User Role
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('Administrator')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold transition-all flex flex-col items-center gap-1.5 ${
                    role === 'Administrator'
                      ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-2xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Admin</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('Billing Staff')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold transition-all flex flex-col items-center gap-1.5 ${
                    role === 'Billing Staff'
                      ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-2xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Billing Staff</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('Consumer')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold transition-all flex flex-col items-center gap-1.5 ${
                    role === 'Consumer'
                      ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-2xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Consumer</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('Field Officer')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold transition-all flex flex-col items-center gap-1.5 ${
                    role === 'Field Officer'
                      ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-2xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  <span>Field Officer</span>
                </button>
              </div>
            </div>

            {/* Email Field */}
            <Input
              label="Email Address / User ID"
              icon={Mail}
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              placeholder="Enter your registered account email"
              required
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={isLoading}
              icon={ArrowRight}
            >
              Sign In as {role}
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-500 space-y-2">
            <p>
              New consumer?{' '}
              <a
                href="/register"
                className="text-blue-600 hover:text-blue-700 font-semibold"
                onClick={(e) => { e.preventDefault(); navigate('/register'); }}
              >
                Register your connection
              </a>
            </p>
            <p>Ampora Software Engineering Academic Project Presentation System</p>
          </div>
        </div>
      </div>
    </div>
  );
};
