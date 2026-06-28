'use client';

import React from 'react';

type RiskItemProps = {
  title: string;
  severity: 'success' | 'warning' | 'critical';
  type: string;
  desc: string;
};

const SeverityIcons = {
  success: () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-success"><polyline points="20 6 9 17 4 12"/></svg>,
  warning: () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-warning"><path d="M12 9v4m0 4h.01m-6.938 4h13.88a2 2 0 0 0 1.998-1.88l-3.5-5.64a2 2 0 0 0-1.998-1.88H8.348a2 2 0 0 0-1.998 1.88l-3.5 5.64A2 2 0 0 0 4.348 23z"/></svg>,
  critical: () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-critical"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>,
};

export const RiskItem = ({ title, severity, type, desc }: RiskItemProps) => {
  return (
    <div className="p-4 rounded-interactive border border-slate-200 bg-white flex gap-4 items-start group hover:border-primary/50 transition-all cursor-default shadow-sm">
      <div className="mt-1">
        {SeverityIcons[severity]()}
      </div>
      <div className="flex-grow">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{type}</span>
          <span className="text-sm font-semibold text-slate-900">{title}</span>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
};
