import React from 'react';
import { Card } from '../ui/Card';

type FatigueMonitorProps = {
  load: number;
};

export const FatigueMonitor = ({ load }: FatigueMonitorProps) => {
  const isCritical = load > 90;
  const isWarning = load > 75;

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Fatigue Monitor</h3>
          <span className={`text-xs font-bold px-2 py-1 rounded ${
            isCritical ? 'bg-critical text-white' :
            isWarning ? 'bg-warning text-slate-900' :
            'bg-success text-slate-900'
          }`}>
            {isCritical ? 'High Risk' : isWarning ? 'Elevated Risk' : 'Stable'}
          </span>
        </div>

        <div className="relative h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
          <div
            className={`absolute top-0 left-0 h-full transition-all duration-1000 ${
              isCritical ? 'bg-critical' :
              isWarning ? 'bg-warning' :
              'bg-success'
            }`}
            style={{ width: `${Math.min(load, 100)}%` }}
          />
        </div>

        <p className="text-sm text-slate-500 italic">
          {isCritical
            ? "Burn rate suggests high probability of fatigue. Recovery floor enforcement recommended."
            : isWarning
            ? "Load is approaching threshold. Consider redistributing upcoming tasks."
            : "Current allocation is sustainable."}
        </p>
      </div>
    </Card>
  );
};
