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
      <Card>
        <span className="text-xs font-bold uppercase text-slate-400">Current Load</span>
        <div className="text-3xl font-semibold text-slate-900 mt-1">{load}%</div>
      </Card>
      <Card>
        <span className="text-xs font-bold uppercase text-slate-400">Active Tasks</span>
        <div className="text-3xl font-semibold text-slate-900 mt-1">{tasksCount}</div>
      </Card>
      <Card>
        <span className="text-xs font-bold uppercase text-slate-400">Next Recovery</span>
        <div className="text-lg font-semibold text-slate-900 mt-1">{recoveryWindow}</div>
      </Card>
    </div>
  );
};
