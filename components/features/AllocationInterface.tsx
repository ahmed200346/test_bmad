'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { OverrideModal } from './OverrideModal';
import { getSpecialists, Specialist } from '@/app/actions/specialists';
import { getTasks, Task } from '@/app/actions/tasks';
import { validateAllocation, allocateTask, AllocationRequest } from '@/app/actions/engine';

export const AllocationInterface = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [selectedTask, setSelectedTask] = useState<string>('');
  const [selectedSpecialist, setSelectedSpecialist] = useState<string>('');
  const [validation, setValidation] = useState<{ valid: boolean; error: string; percentage: number } | null>(null);
  const [isOverrideOpen, setIsOverrideOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const [t, s] = await Promise.all([getTasks(), getSpecialists()]);
      setTasks(t);
      setSpecialists(s.filter(sp => sp.isActive));
    };
    loadData();
  }, []);

  useEffect(() => {
    const checkCapacity = async () => {
      if (!selectedSpecialist || !selectedTask) {
        setValidation(null);
        return;
      }

      const task = tasks.find(t => t.id.toString() === selectedTask);
      const spec = specialists.find(s => s.id.toString() === selectedSpecialist);

      if (!task || !spec) return;

      // Simulate a window (Current Week) for the sake of the demo
      const today = new Date().toISOString().split('T')[0];
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      const end = nextWeek.toISOString().split('T')[0];

      const result = await validateAllocation({
        specialistId: spec.id,
        taskId: task.id,
        hours: task.duration,
        windowStart: today,
        windowEnd: end,
      });
      setValidation(result);
    };
    checkCapacity();
  }, [selectedTask, selectedSpecialist, tasks, specialists]);

  const handleSave = async (overrideData?: { priority: string; rationale: string }) => {
    setIsSaving(true);
    try {
      const task = tasks.find(t => t.id.toString() === selectedTask);
      const spec = specialists.find(s => s.id.toString() === selectedSpecialist);
      if (!task || !spec) throw new Error("Invalid selection");

      const today = new Date().toISOString().split('T')[0];
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      const end = nextWeek.toISOString().split('T')[0];

      await allocateTask({
        specialistId: spec.id,
        taskId: task.id,
        hours: task.duration,
        windowStart: today,
        windowEnd: end,
      }, overrideData);

      setSelectedTask('');
      setSelectedSpecialist('');
      setValidation(null);
      setIsOverrideOpen(false);
      alert("Allocation saved successfully.");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Card className="max-w-2xl mx-auto border-none shadow-md bg-white">
        <div className="flex flex-col gap-10 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-3">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Task Selection</label>
              <select
                className="p-3 border border-slate-200 rounded-interactive bg-slate-50 text-slate-900 focus:ring-2 focus:ring-primary outline-none transition-all cursor-pointer"
                value={selectedTask}
                onChange={(e) => setSelectedTask(e.target.value)}
              >
                <option value="">Select a task...</option>
                {tasks.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Specialist Selection</label>
              <select
                className="p-3 border border-slate-200 rounded-interactive bg-slate-50 text-slate-900 focus:ring-2 focus:ring-primary outline-none transition-all cursor-pointer"
                value={selectedSpecialist}
                onChange={(e) => setSelectedSpecialist(e.target.value)}
              >
                <option value="">Select a specialist...</option>
                {specialists.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </div>

          <div className={`p-5 rounded-interactive border transition-all duration-500 ${
            !selectedSpecialist ? 'bg-slate-50 border-slate-200 text-slate-400' :
            validation?.valid === false ? 'bg-critical/10 border-critical text-critical-dark shadow-sm' :
            validation?.valid === true ? 'bg-success/10 border-success text-success-dark shadow-sm' :
            'bg-slate-50 border-slate-200 text-slate-400'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${
                !selectedSpecialist ? 'bg-slate-300' :
                validation?.valid === false ? 'bg-critical animate-pulse' :
                validation?.valid === true ? 'bg-success' : 'bg-slate-300'
              }`} />
              <div className="text-sm font-medium leading-relaxed">
                {!selectedSpecialist ? (
                  "Please select a specialist to validate capacity constraints."
                ) : validation?.valid === false ? (
                  validation.error
                ) : (
                  `Sustainable Allocation: Current load is ${validation?.percentage.toFixed(1)}%.`
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-slate-100">
            <Button
              variant="ghost"
              disabled={!selectedSpecialist || validation?.valid === true}
              onClick={() => setIsOverrideOpen(true)}
              className="text-slate-500 hover:text-primary"
            >
              Request Override
            </Button>
            <Button
              disabled={!selectedTask || !selectedSpecialist || (validation && !validation.valid)}
              onClick={() => handleSave()}
              className="px-6 shadow-sm"
            >
              {isSaving ? 'Saving...' : 'Save Allocation'}
            </Button>
          </div>
        </div>
      </Card>

      <OverrideModal
        isOpen={isOverrideOpen}
        onClose={() => setIsOverrideOpen(false)}
        specialistName={specialists.find(s => s.id.toString() === selectedSpecialist)?.name || 'Unknown'}
        onConfirm={(data) => handleSave(data)}
      />
    </>
  );
};
