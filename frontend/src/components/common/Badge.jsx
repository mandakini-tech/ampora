import React from 'react';

export const Badge = ({ children, variant = 'default', size = 'md' }) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-medium',
    md: 'px-2.5 py-1 text-xs font-semibold',
    lg: 'px-3 py-1.5 text-sm font-semibold',
  };

  const variantClasses = {
    // Status badges
    paid: 'bg-emerald-50 text-emerald-700 border border-emerald-200/80',
    pending: 'bg-amber-50 text-amber-700 border border-amber-200/80',
    overdue: 'bg-rose-50 text-rose-700 border border-rose-200/80',
    active: 'bg-emerald-50 text-emerald-700 border border-emerald-200/80',
    inactive: 'bg-slate-100 text-slate-600 border border-slate-200',
    suspended: 'bg-rose-50 text-rose-700 border border-rose-200/80',
    
    // Complaint statuses
    submitted: 'bg-blue-50 text-blue-700 border border-blue-200/80',
    'in progress': 'bg-purple-50 text-purple-700 border border-purple-200/80',
    resolved: 'bg-emerald-50 text-emerald-700 border border-emerald-200/80',
    rejected: 'bg-rose-50 text-rose-700 border border-rose-200/80',

    // Generic variants
    primary: 'bg-blue-50 text-blue-700 border border-blue-200',
    secondary: 'bg-slate-100 text-slate-700 border border-slate-200',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200',
    default: 'bg-slate-100 text-slate-700 border border-slate-200',
  };

  const key = String(variant).toLowerCase();
  const appliedVariant = variantClasses[key] || variantClasses.default;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full ${sizeClasses[size]} ${appliedVariant}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75 shrink-0" />
      {children}
    </span>
  );
};
