'use client';

import React from 'react';

type HeatmapCellProps = {
  specialist: string;
  load: number;
  hours: number;
  capacity: number;
};

export const HeatmapCell = ({ specialist, load, hours, capacity }: HeatmapCellProps) => {
  const getColor = () => {
    if (load <= 80) return 'bg-success text-success-dark';
    if (load <= 100) return 'bg-warning text-warning-dark';
    return 'bg-critical text-critical-dark';
  };

  return (
    <div
      className={`p-4 rounded-interactive transition-all duration-300 cursor-help group relative
      ${getColor()} hover:brightness-95 hover:shadow-sm active:scale-95`}
      aria-label={`Specialist ${specialist}, load ${load}%`}
    >
      <div className="text-slate-900 font-medium text-xs truncate opacity-80">{specialist}</div>
      <div className="text-slate-900 font-bold text-2xl">{load}%</div>

      {/* Refined Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 hidden group-hover:block
        w-48 p-3 bg-slate-900 text-white text-xs rounded-lg shadow-xl z-20 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex flex-col gap-1">
          <span className="font-bold text-slate-300">{specialist}</span>
          <div className="flex justify-between items-center gap-4">
            <span className="text-slate-400">Allocated Hours:</span>
            <span className="font-mono font-bold">{hours.toFixed(1)}h / {capacity}h</span>
          </div>
          <div className="mt-1 pt-1 border-t border-slate-700 text-[10px] text-slate-400 italic">
            {load > 100 ? '⚠️ Capacity Debt' : '✅ Sustainable'}
          </div>
        </div>
        {/* Tooltip Arrow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45 -mb-1"></div>
      </div>
    </div>
  );
};