import React from 'react';

export const Input = ({
  label,
  error,
  helperText,
  icon: Icon,
  className = '',
  id,
  type = 'text',
  ...props
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative rounded-lg shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          id={inputId}
          type={type}
          className={`block w-full rounded-lg border text-sm transition-colors py-2.5 ${
            Icon ? 'pl-10' : 'pl-3.5'
          } pr-3.5 ${
            error
              ? 'border-red-300 text-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500'
              : 'border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
          } bg-white disabled:bg-slate-50 disabled:text-slate-500 ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>}
      {!error && helperText && <p className="mt-1 text-xs text-slate-500">{helperText}</p>}
    </div>
  );
};

export const Select = ({
  label,
  error,
  options = [],
  className = '',
  id,
  icon: Icon,
  ...props
}) => {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative rounded-lg shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <select
          id={selectId}
          className={`block w-full rounded-lg border text-sm transition-colors py-2.5 ${
            Icon ? 'pl-10' : 'pl-3.5'
          } pr-8 ${
            error
              ? 'border-red-300 text-red-900 focus:outline-none focus:ring-2 focus:ring-red-500'
              : 'border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500'
          } bg-white disabled:bg-slate-50 disabled:text-slate-500 ${className}`}
          {...props}
        >
          {options.map((opt, i) => (
            <option key={i} value={typeof opt === 'object' ? opt.value : opt}>
              {typeof opt === 'object' ? opt.label : opt}
            </option>
          ))}
        </select>
      </div>
      {error && <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>}
    </div>
  );
};
