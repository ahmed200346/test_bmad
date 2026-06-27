'use client';

import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { OverrideModal } from './OverrideModal';

type Task = { id: string; name: string };
type Specialist = { id: string; name: string; load: number };

const MOCK_TASKS: Task[] = [
  { id: 't1', name: 'API Integration' },
  { id: 't2', name: 'Auth Layer Setup' },
  { id: 't3', name: 'Database Migration' },
];

const MOCK_SPECIALISTS: Specialist[] = [
  { id: 's1', name: 'Marcus (Senior Dev)', load: 60 },
  { id: 's2', name: 'Sarah (Architect)', load: 90 },
  { id: 's3', name: 'Elena (Frontend)', load: 110 },
];

export const AllocationInterface = () => {
  const [selectedTask, setSelectedTask] = useState<string>('');
  const [selectedSpecialist, setSelectedSpecialist] = useState<string>('');
  const [isOverrideOpen, setIsOverrideOpen] = useState(false);

  const currentSpecialist = MOCK_SPECIALISTS.find(s => s.id === selectedSpecialist);
  const isOverloaded = currentSpecialist && currentSpecialist.load >= 100;

  return (
    <>
      <Card className="max-w-2xl mx-auto">
        <div className="flex flex-col gap-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase text-slate-400">Task</label>
              <select
                className="p-3 border border-slate-200 rounded-interactive bg-white text-slate-900"
                value={selectedTask}
                onChange={(e) => setSelectedTask(e.target.value)}
              >
                <option value="">Select a task...</option>
                {MOCK_TASKS.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase text-slate-400">Specialist</label>
              <select
                className="p-3 border border-slate-200 rounded-interactive bg-white text-slate-900"
                value={selectedSpecialist}
                onChange={(e) => setSelectedSpecialist(e.target.value)}
              >
                <option value="">Select a specialist...</option>
                {MOCK_SPECIALISTS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </div>

          <div className={`p-4 rounded-interactive border transition-all duration-300 ${
            !selectedSpecialist ? 'bg-slate-50 border-slate-200 text-slate-400' :
            isOverloaded ? 'bg-critical/10 border-critical text-critical' :
            'bg-success/10 border-success text-success'
          }`}>
            <div className="text-sm font-medium">
              {!selectedSpecialist ? (
                "Please select a specialist to validate capacity."
              ) : isOverloaded ? (
                `Constraint Violation: ${currentSpecialist?.name} is at ${currentSpecialist?.load}% capacity.`
              ) : (
                `Sustainable Allocation: ${currentSpecialist?.name} has available capacity.`
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="ghost"
              disabled={!selectedSpecialist || !isOverloaded}
              onClick={() => setIsOverrideOpen(true)}
            >
              Request Override
            </Button>
            <Button
              disabled={!selectedTask || !selectedSpecialist || isOverloaded}
            >
              Save Allocation
            </Button>
          </div>
        </div>
      </Card>

      <OverrideModal
        isOpen={isOverrideOpen}
        onClose={() => setIsOverrideOpen(false)}
        specialistName={currentSpecialist?.name || 'Unknown'}
      />
    </>
  );
};
