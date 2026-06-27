import React from 'react';

type RiskItemProps = {
  title: string;
  severity: 'success' | 'warning' | 'critical';
  type: string;
  desc: string;
};

export const RiskItem = ({ title, severity, type, desc }: RiskItemProps) => {
  const severityColors = {
    success: 'bg-success',
    warning: 'bg-warning',
    critical: 'bg-critical',
  };

  return (
    <div className="p-3 rounded-interactive border border-slate-200 bg-white flex gap-4 items-start group hover:border-primary transition-colors cursor-default">
      <div className={`w-2 h-full rounded-full ${severityColors[severity]}`} />
      <div className="flex-grow">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{type}</span>
          <span className="text-sm font-semibold text-slate-900">{title}</span>
        </div>
        <p className="text-xs text-slate-500 mt-1">{desc}</p>
      </div>
    </div>
  );
};
