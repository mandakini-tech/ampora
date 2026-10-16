import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Zap,
  Lock,
  Mail,
  ShieldCheck,
  UserCheck,
  User,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Input, Select } from '../components/common/Input';

export const LoginPage = () => {
  const { login } = useApp();
  const navigate = useNavigate();

  const [role, setRole] = useState('Administrator');
  const [email, setEmail] = useState('admin@ampora.gov.in');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      login(role, email, password);
      setIsLoading(false);
      if (role === 'Consumer') {
        navigate('/consumer-portal');
      } else {
        navigate('/dashboard');
      }
    }, 600);
  };

  const handleQuickDemo = (demoRole) => {
    setIsLoading(true);
    let demoEmail = 'admin@ampora.gov.in';
    if (demoRole === 'Billing Staff') demoEmail = 'ramesh.billing@ampora.gov.in';
    if (demoRole === 'Consumer') demoEmail = 'rajesh.kumar@example.com';

    setRole(demoRole);
    setEmail(demoEmail);

    setTimeout(() => {
      login(demoRole, demoEmail, 'password123');
      setIsLoading(false);
      if (demoRole === 'Consumer') {
        navigate('/consumer-portal');
      } else {
        navigate('/dashboard');
      }
    }, 400);
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
            Empowering utility boards and consumers with real-time meter tracking, slab-based invoice generation, instant online payments, and direct complaint resolution.
          </p>

          {/* Key Feature Stats Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/60 backdrop-blur-xs">
              <p className="text-2xl font-bold text-white">14.8K+</p>
              <p className="text-xs text-slate-400 mt-0.5">Active Consumers</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/60 backdrop-blur-xs">
              <p className="text-2xl font-bold text-emerald-400">99.4%</p>
              <p className="text-xs text-slate-400 mt-0.5">On-Time Payments</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/60 backdrop-blur-xs">
              <p className="text-2xl font-bold text-blue-400">4 Slabs</p>
              <p className="text-xs text-slate-400 mt-0.5">Tariff Engine</p>
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
              Select your role and enter credentials to access your dashboard
            </p>
          </div>

          {/* Viva Quick Demo Selector */}
          <div className="mb-6 p-3 rounded-xl bg-blue-50/70 border border-blue-200">
            <p className="text-[11px] font-bold text-blue-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Viva Demonstration Quick Login
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('Administrator')}
                className="px-2 py-1.5 rounded-lg bg-white border border-blue-300 hover:bg-blue-600 hover:text-white text-blue-700 text-xs font-semibold shadow-2xs transition-colors text-center"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('Billing Staff')}
                className="px-2 py-1.5 rounded-lg bg-white border border-blue-300 hover:bg-blue-600 hover:text-white text-blue-700 text-xs font-semibold shadow-2xs transition-colors text-center"
              >
                Billing Staff
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('Consumer')}
                className="px-2 py-1.5 rounded-lg bg-white border border-blue-300 hover:bg-blue-600 hover:text-white text-blue-700 text-xs font-semibold shadow-2xs transition-colors text-center"
              >
                Consumer
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selection Selector Tabs */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Select User Role
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setRole('Administrator');
                    setEmail('admin@ampora.gov.in');
                  }}
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
                  onClick={() => {
                    setRole('Billing Staff');
                    setEmail('ramesh.billing@ampora.gov.in');
                  }}
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
                  onClick={() => {
                    setRole('Consumer');
                    setEmail('rajesh.kumar@example.com');
                  }}
                  className={`p-2.5 rounded-xl border text-xs font-semibold transition-all flex flex-col items-center gap-1.5 ${
                    role === 'Consumer'
                      ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-2xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Consumer</span>
                </button>
              </div>
            </div>

            {/* Email Field */}
            <Input
              label="Email Address / User ID"
              icon={Mail}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. user@ampora.gov.in"
              required
            />

            {/* Password Field */}
            <Input
              label="Password"
              icon={Lock}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Remember me</span>
              </label>
              <a
                href="#forgot"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Password reset link sent to registered email.');
                }}
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Forgot password?
              </a>
            </div>

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

          <div className="mt-8 pt-6 border-t border-slate-100 text-center text-xs text-slate-500">
            Ampora Software Engineering Academic Project Presentation System
          </div>
        </div>
      </div>
    </div>
  );
};
