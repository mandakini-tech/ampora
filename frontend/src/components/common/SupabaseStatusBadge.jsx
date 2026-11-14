import React, { useState } from 'react';
import { Database, CheckCircle2, AlertCircle, RefreshCw, ExternalLink, X, Copy, Check } from 'lucide-react';
import { isSupabaseConfigured, getSupabaseConfig } from '../../lib/supabase';

export const SupabaseStatusBadge = ({ onRefresh, isSyncing }) => {
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const config = getSupabaseConfig();
  const isConnected = config.isConfigured;

  const handleCopyEnv = () => {
    const template = `VITE_SUPABASE_URL=https://your-project.supabase.co\nVITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key`;
    navigator.clipboard.writeText(template);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all shadow-2xs border ${
          isConnected
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
            : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
        }`}
        title="Supabase Database Status - Click for details"
      >
        <span className="relative flex h-2 w-2">
          {isConnected && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          )}
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              isConnected ? 'bg-emerald-500' : 'bg-amber-500'
            }`}
          ></span>
        </span>
        <Database className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">
          {isConnected ? 'Supabase Connected' : 'Supabase (Local Standby)'}
        </span>
        <span className="sm:hidden">{isConnected ? 'Live DB' : 'Standby'}</span>
      </button>

      {/* Supabase Status Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold">Supabase Backend Status</h3>
                  <p className="text-xs text-slate-400">PostgreSQL Cloud Database Integration</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5 text-sm text-slate-600">
              {/* Status Box */}
              <div
                className={`p-4 rounded-xl border flex items-start gap-3 ${
                  isConnected
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                    : 'bg-amber-50/70 border-amber-200 text-amber-900'
                }`}
              >
                {isConnected ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-semibold text-slate-900">
                    {isConnected
                      ? 'Live Cloud Database Connected'
                      : 'Running in Local Standby Mode'}
                  </div>
                  <p className="text-xs mt-1 text-slate-600 leading-relaxed">
                    {isConnected
                      ? `Connected to Supabase project at ${config.url}. All operations are reading and writing to your cloud PostgreSQL database in real time.`
                      : 'Frontend is currently using local browser storage with sample seed data. Configure your Supabase project credentials in frontend/.env to enable cloud synchronization.'}
                  </p>
                </div>
              </div>

              {/* Database Tables Registered */}
              <div>
                <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2">
                  Database Tables Mapped
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { name: 'consumers', desc: 'Registered meters & accounts' },
                    { name: 'meter_readings', desc: 'Monthly units consumed' },
                    { name: 'bills', desc: 'Slab-calculated invoices' },
                    { name: 'payments', desc: 'UPI & net banking receipts' },
                    { name: 'complaints', desc: 'Consumer grievances & desk' },
                    { name: 'system_settings', desc: 'Taxes, due days & info' },
                    { name: 'tariff_slabs', desc: 'Tiered electricity rates' },
                    { name: 'users', desc: 'Admin & staff accounts' },
                  ].map((tbl) => (
                    <div
                      key={tbl.name}
                      className="p-2 bg-slate-50 border border-slate-200/80 rounded-lg flex items-center justify-between"
                    >
                      <span className="font-mono font-medium text-slate-800">{tbl.name}</span>
                      <span className="text-[10px] text-slate-500">Ready</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructions on how to connect */}
              {!isConnected && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                      How to Connect Live Supabase:
                    </h4>
                    <button
                      onClick={handleCopyEnv}
                      className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? 'Copied template!' : 'Copy .env snippet'}
                    </button>
                  </div>
                  <ol className="text-xs text-slate-600 space-y-1 list-decimal list-inside bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                    <li>Create project on <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-blue-600 underline">supabase.com</a>.</li>
                    <li>Run <code className="bg-slate-200 px-1 rounded text-slate-800 font-mono">backend/database/schema.sql</code> in SQL editor.</li>
                    <li>Run <code className="bg-slate-200 px-1 rounded text-slate-800 font-mono">backend/database/seed.sql</code> to insert initial sample data.</li>
                    <li>Add your project URL & Publishable key (or anon key) into <code className="bg-slate-200 px-1 rounded text-slate-800 font-mono">frontend/.env</code>.</li>
                  </ol>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => {
                  if (onRefresh) onRefresh();
                }}
                disabled={isSyncing}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white border border-slate-300 rounded-lg shadow-2xs hover:bg-slate-100 disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-blue-600' : ''}`} />
                {isSyncing ? 'Syncing...' : 'Refresh Database'}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-1.5 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 shadow-2xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

