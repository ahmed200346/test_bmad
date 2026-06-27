'use client';

import React from 'react';

type HeatmapCellProps = {
  specialist: string;
  load: number;
};

export const HeatmapCell = ({ specialist, load }: HeatmapCellProps) => {
  const getColor = () => {
    if (load <= 80) return 'bg-success';
    if (load <= 100) return 'bg-warning';
    return 'bg-critical';
  };

  return (
    <div
      className={`p-4 rounded-interactive transition-all duration-300 cursor-help group relative ${getColor()}`}
    >
      <div className="text-slate-900 font-medium text-xs truncate">{specialist}</div>
      <div className="text-slate-800 font-bold text-lg">{load}%</div>

      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-32 p-2 bg-slate-900 text-white text-xs rounded shadow-lg z-10">
        {specialist} - {load}% Load
      </div>
    </div>
  );
};
