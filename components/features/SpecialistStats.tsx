'use client';

import React from 'react';
import { Card } from '../ui/Card';

type StatsProps = {
  specialistName: string;
  load: number;
  tasksCount: number;
  recoveryWindow: string;
};

export const SpecialistStats = ({ specialistName, load, tasksCount, recoveryWindow }: StatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-gap">
      <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm hover:bg-white transition-colors group">
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400 group-hover:text-primary transition-colors">Current Load</span>
        <div className="text-4xl font-semibold text-slate-900 mt-2 flex items-baseline gap-2">
          {load}<span className="text-lg text-slate-400">%</span>
        </div>
      </Card>
      <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm hover:bg-white transition-colors group">
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400 group-hover:text-primary transition-colors">Active Tasks</span>
        <div className="text-4xl font-semibold text-slate-900 mt-2">
          {tasksCount}
        </div>
      </Card>
      <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm hover:bg-white transition-colors group">
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400 group-hover:text-primary transition-colors">Next Recovery</span>
        <div className="text-xl font-semibold text-slate-900 mt-2 leading-tight">
          {recoveryWindow}
        </div>
      </Card>
    </div>
  );
};
