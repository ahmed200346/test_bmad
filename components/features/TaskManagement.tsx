'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { getTasks, createTask, updateTask, addDependency, Task } from '@/app/actions/tasks';

export const TaskManagement = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isDepOpen, setIsDepOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTasks = async () => {
    const data = await getTasks();
    setTasks(data);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      duration: parseFloat(formData.get('duration') as string),
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string,
    };

    try {
      await createTask(data);
      setIsCreateOpen(false);
      loadTasks();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (!editingTask) return;
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      duration: parseFloat(formData.get('duration') as string),
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string,
    };

    try {
      await updateTask(editingTask.id, data);
      setEditingTask(null);
      loadTasks();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleAddDependency = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    const parentId = parseInt(formData.get('parent') as string);
    const childId = parseInt(formData.get('child') as string);

    try {
      await addDependency(parentId, childId);
      setIsDepOpen(false);
      loadTasks();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Task Inventory</h2>
          <p className="text-sm text-slate-500">Define project effort and duration windows.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setIsDepOpen(true)}>Link Dependency</Button>
          <Button onClick={() => setIsCreateOpen(true)}>Add Task</Button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-critical/10 border border-critical/20 text-critical-dark text-sm rounded-interactive animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2">
            <span className="font-bold">⚠️ Validation Error:</span>
            {error}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-gap">
        {tasks.length === 0 ? (
          <div className="py-20 text-center text-slate-400 italic border-2 border-dashed border-slate-200 rounded-interactive">
            No tasks defined yet. Start by adding your first task.
          </div>
        ) : (
          tasks.map(t => (
            <Card key={t.id} className="flex items-center justify-between group hover:border-primary transition-all duration-300 border-none shadow-sm bg-white/50 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xl group-hover:bg-primary/10 transition-colors">
                  📝
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{t.name}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span>Duration: <span className="font-medium text-slate-700">{t.duration}h</span></span>
                    <span className="text-slate-300">|</span>
                    <span>Status: <span className="font-medium text-slate-700">{t.status}</span></span>
                    {t.startDate && (
                      <>
                        <span className="text-slate-300">|</span>
                        <span>Starts: {t.startDate}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" className="text-xs" onClick={() => setEditingTask(t)}>Edit</Button>
              </div>
            </Card>
          ))
        )}
      </div>

      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create New Task"
      >
        <form onSubmit={handleCreate} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Task Name</label>
            <input name="name" required className="p-3 border border-slate-200 rounded-interactive bg-slate-50 focus:ring-2 focus:ring-primary outline-none transition-all" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Duration (Hours)</label>
            <input name="duration" type="number" step="0.01" required className="p-3 border border-slate-200 rounded-interactive bg-slate-50 focus:ring-2 focus:ring-primary outline-none transition-all" />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Start Date</label>
              <input name="startDate" type="date" className="p-3 border border-slate-200 rounded-interactive bg-slate-50 focus:ring-2 focus:ring-primary outline-none transition-all" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400">End Date</label>
              <input name="endDate" type="date" className="p-3 border border-slate-200 rounded-interactive bg-slate-50 focus:ring-2 focus:ring-primary outline-none transition-all" />
            </div>
          </div>
          <Button type="submit" className="mt-4 w-full py-3">Create Task</Button>
        </form>
      </Modal>

      <Modal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        title="Edit Task"
      >
        {editingTask && (
          <form onSubmit={handleUpdate} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Task Name</label>
              <input name="name" defaultValue={editingTask.name} required className="p-3 border border-slate-200 rounded-interactive bg-slate-50 focus:ring-2 focus:ring-primary outline-none transition-all" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Duration (Hours)</label>
              <input name="duration" type="number" step="0.01" defaultValue={editingTask.duration} required className="p-3 border border-slate-200 rounded-interactive bg-slate-50 focus:ring-2 focus:ring-primary outline-none transition-all" />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Start Date</label>
                <input name="startDate" type="date" defaultValue={editingTask.startDate || ''} className="p-3 border border-slate-200 rounded-interactive bg-slate-50 focus:ring-2 focus:ring-primary outline-none transition-all" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400">End Date</label>
                <input name="endDate" type="date" defaultValue={editingTask.endDate || ''} className="p-3 border border-slate-200 rounded-interactive bg-slate-50 focus:ring-2 focus:ring-primary outline-none transition-all" />
              </div>
            </div>
            <Button type="submit" className="mt-4 w-full py-3">Update Task</Button>
          </form>
        )}
      </Modal>

      <Modal
        isOpen={isDepOpen}
        onClose={() => setIsDepOpen(false)}
        title="Link Dependency"
      >
        <form onSubmit={handleAddDependency} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Prerequisite Task (Parent)</label>
            <select name="parent" required className="p-3 border border-slate-200 rounded-interactive bg-slate-50 focus:ring-2 focus:ring-primary outline-none transition-all">
              <option value="">Select task...</option>
              {tasks.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Dependent Task (Child)</label>
            <select name="child" required className="p-3 border border-slate-200 rounded-interactive bg-slate-50 focus:ring-2 focus:ring-primary outline-none transition-all">
              <option value="">Select task...</option>
              {tasks.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <Button type="submit" className="mt-4 w-full py-3">Create Dependency</Button>
        </form>
      </Modal>
    </div>
  );
};
