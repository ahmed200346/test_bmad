'use client';

import React from 'react';
import { Card } from '../ui/Card';

type FatigueMonitorProps = {
  load: number;
};

export const FatigueMonitor = ({ load }: FatigueMonitorProps) => {
  const isCritical = load > 90;
  const isWarning = load > 75;

  return (
    <Card className="overflow-hidden border-none shadow-sm bg-white/50 backdrop-blur-sm">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold text-slate-900">Fatigue Monitor</h3>
            <span className="text-xs text-slate-400">Human sustainability index</span>
          </div>
          <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full transition-colors duration-500 ${
            isCritical ? 'bg-critical text-white' :
            isWarning ? 'bg-warning text-slate-900' :
            'bg-success text-slate-900'
          }`}>
            {isCritical ? 'High Risk' : isWarning ? 'Elevated Risk' : 'Stable'}
          </span>
        </div>

        <div className="flex flex-col gap-4">
          <div className="relative h-6 bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner">
            <div
              className={`absolute top-0 left-0 h-full transition-all duration-1000 ease-out ${
                isCritical ? 'bg-critical' :
                isWarning ? 'bg-warning' :
                'bg-success'
              }`}
              style={{ width: `${Math.min(load, 100)}%` }}
            />
            {/* Threshold Markers */}
            <div className="absolute top-0 bottom-0 left-[75%] w-0.5 bg-slate-300/50" />
            <div className="absolute top-0 bottom-0 left-[90%] w-0.5 bg-slate-400/50" />
          </div>

          <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter text-slate-400">
            <span>Sustainable (0-75%)</span>
            <span>At Risk (75-90%)</span>
            <span>Critical (90%+)</span>
          </div>
        </div>

        <div className="p-4 rounded-interactive bg-slate-50 border border-slate-100">
          <p className="text-sm text-slate-600 italic leading-relaxed">
            {isCritical
              ? "Critical: Burn rate suggests high probability of fatigue. Immediate recovery floor enforcement recommended."
              : isWarning
              ? "Warning: Load is approaching critical threshold. Consider redistributing upcoming tasks to maintain sustainability."
              : "Optimal: Current allocation is within sustainable parameters."}
          </p>
        </div>
      </div>
    </Card>
  );
};
