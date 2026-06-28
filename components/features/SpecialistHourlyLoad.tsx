'use client';

import React from 'react';
import { Card } from '../ui/Card';

type HourlyLoadItem = {
  windowStart: string;
  hours: number;
  taskName: string;
};

export const SpecialistHourlyLoad = ({ data }: { data: HourlyLoadItem[] }) => {
  return (
    <Card className="w-full border-none shadow-sm bg-white/50 backdrop-blur-sm">
      <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Detailed Hourly Load</h3>
      <div className="flex flex-col gap-3">
        {data.length === 0 ? (
          <p className="text-sm text-slate-500 italic">No allocations found for the current period.</p>
        ) : (
          data.map((item, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-interactive bg-white border border-slate-100 hover:border-primary/30 transition-all">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-slate-900">{item.taskName}</span>
                <span className="text-[10px] text-slate-400">{item.windowStart}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-primary">{item.hours}h</span>
                <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${Math.min((item.hours / 8) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
