import React from 'react';

export const Card = ({
  children,
  title,
  subtitle,
  action,
  headerBorder = true,
  className = '',
  bodyClassName = '',
}) => {
  return (
    <div className={`bg-white rounded-xl border border-slate-200/80 shadow-sm ${className}`}>
      {(title || subtitle || action) && (
        <div className={`p-5 flex items-center justify-between ${headerBorder ? 'border-b border-slate-100' : ''}`}>
          <div>
            {title && <h3 className="text-base font-semibold text-slate-900">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={`p-5 ${bodyClassName}`}>{children}</div>
    </div>
  );
};
