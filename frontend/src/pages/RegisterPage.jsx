import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Zap,
  User,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';

const CONNECTION_TYPES = ['Residential', 'Commercial', 'Industrial'];
export const RegisterPage = () => {
  const { register } = useApp();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1 = account info, 2 = profile details
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Consumer',
    phone: '',
    address: '',
    connectionType: 'Residential',
  });

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    setError('');
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return setError('Name is required.');
    if (!formData.email.trim()) return setError('Email is required.');
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const success = await register(formData);
      if (success) {
        if (formData.role === 'Consumer') {
          navigate('/consumer-portal');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-stretch">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 text-white relative flex-col justify-between p-12 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/30 blur-3xl rounded-full pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/30">
            <Zap className="w-7 h-7 fill-current" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Ampora</h1>
            <p className="text-xs text-slate-400 font-medium">Electricity Billing Management System</p>
          </div>
        </div>

        {/* Middle content */}
        <div className="relative z-10 my-auto max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Quick, Easy Registration</span>
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight leading-tight text-white mb-4">
            Get started with Ampora in minutes
          </h2>
          <p className="text-slate-400 text-base leading-relaxed mb-8">
            Register your electricity connection to view bills, meter readings, payment records, and support tickets.
          </p>
          <div className="space-y-3">
            {[
              'Review itemized electricity bills',
              'View meter reading history',
              'Raise and track complaints',
              'Print or save full bill statements',
            ].map((feat) => (
              <div key={feat} className="flex items-center gap-3 text-sm text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-500 flex items-center justify-between border-t border-slate-800 pt-6">
          <p>© 2026 Ampora Distribution Corp. All rights reserved.</p>
          <span className="font-mono">v2.4.0</span>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-slate-50">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200/80 p-8 sm:p-10">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
              <Zap className="w-6 h-6 fill-current" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Ampora</h1>
              <p className="text-xs text-slate-500">Electricity Management System</p>
            </div>
          </div>

          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Create Account</h2>
            <p className="text-xs text-slate-500 mt-1">
              Step {step} of 2 — {step === 1 ? 'Consumer account details' : 'Connection details'}
            </p>
            {/* Step progress bar */}
            <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                style={{ width: step === 1 ? '50%' : '100%' }}
              />
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Step 1: Credentials */}
          {step === 1 && (
            <form onSubmit={handleNext} className="space-y-4">
              <Input
                label="Full Name"
                icon={User}
                type="text"
                value={formData.name}
                onChange={handleChange('name')}
                placeholder="e.g. Rajesh Kumar"
                required
              />
              <Input
                label="Email Address"
                icon={Mail}
                type="email"
                value={formData.email}
                onChange={handleChange('email')}
                placeholder="e.g. rajesh@example.com"
                required
              />
              <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-[11px] text-amber-900">
                Password verification is not enabled. Registration creates consumer accounts only; staff accounts must be created by an administrator.
              </p>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full mt-2"
                icon={ArrowRight}
              >
                Continue
              </Button>
            </form>
          )}

          {/* Step 2: Profile details */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Phone Number"
                icon={Phone}
                type="tel"
                value={formData.phone}
                onChange={handleChange('phone')}
                placeholder="e.g. +91 98765 43210"
              />
              <Input
                label="Address"
                icon={MapPin}
                type="text"
                value={formData.address}
                onChange={handleChange('address')}
                placeholder="e.g. 12 Main Street, City - 560001"
              />

              {/* Connection type (Consumer only) */}
              {formData.role === 'Consumer' && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                    Connection Type
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {CONNECTION_TYPES.map((ct) => (
                      <button
                        key={ct}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, connectionType: ct }))}
                        className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                          formData.connectionType === ct
                            ? 'border-blue-600 bg-blue-50 text-blue-700'
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {ct}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  className="flex-1"
                  icon={ArrowLeft}
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="flex-1"
                  isLoading={isLoading}
                  icon={CheckCircle2}
                >
                  Register
                </Button>
              </div>
            </form>
          )}

          <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-500 space-y-1">
            <p>
              Already have an account?{' '}
              <a
                href="/login"
                className="text-blue-600 hover:text-blue-700 font-semibold"
                onClick={(e) => { e.preventDefault(); navigate('/login'); }}
              >
                Sign in
              </a>
            </p>
            <p>Ampora Software Engineering Academic Project</p>
          </div>
        </div>
      </div>
    </div>
  );
};

