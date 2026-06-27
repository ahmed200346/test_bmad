'use client';

import React, { useState } from 'react';
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

  React.useEffect(() => {
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
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-900">Task Inventory</h2>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setIsDepOpen(true)}>Link Dependency</Button>
          <Button onClick={() => setIsCreateOpen(true)}>Add Task</Button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-critical/20 border border-critical text-critical text-sm rounded-interactive">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-gap">
        {tasks.map(t => (
          <Card key={t.id} className="flex items-center justify-between group hover:border-primary transition-colors">
            <div className="flex items-center gap-4">
              <span className="text-xl">📝</span>
              <div>
                <h3 className="font-semibold text-slate-900">{t.name}</h3>
                <p className="text-xs text-slate-500">
                  Duration: {t.duration}h | Status: {t.status}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" className="text-xs" onClick={() => setEditingTask(t)}>Edit</Button>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create New Task"
      >
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-400 uppercase">Task Name</label>
            <input name="name" required className="p-2 border border-slate-200 rounded-interactive" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-400 uppercase">Duration (Hours)</label>
            <input name="duration" type="number" step="0.01" required className="p-2 border border-slate-200 rounded-interactive" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Start Date</label>
              <input name="startDate" type="date" className="p-2 border border-slate-200 rounded-interactive" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-400 uppercase">End Date</label>
              <input name="endDate" type="date" className="p-2 border border-slate-200 rounded-interactive" />
            </div>
          </div>
          <button type="submit" className="mt-4 bg-primary text-white p-2 rounded-interactive font-medium">Create Task</button>
        </form>
      </Modal>

      <Modal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        title="Edit Task"
      >
        {editingTask && (
          <form onSubmit={handleUpdate} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Task Name</label>
              <input name="name" defaultValue={editingTask.name} required className="p-2 border border-slate-200 rounded-interactive" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Duration (Hours)</label>
              <input name="duration" type="number" step="0.01" defaultValue={editingTask.duration} required className="p-2 border border-slate-200 rounded-interactive" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-400 uppercase">Start Date</label>
                <input name="startDate" type="date" defaultValue={editingTask.startDate || ''} className="p-2 border border-slate-200 rounded-interactive" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-400 uppercase">End Date</label>
                <input name="endDate" type="date" defaultValue={editingTask.endDate || ''} className="p-2 border border-slate-200 rounded-interactive" />
              </div>
            </div>
            <button type="submit" className="mt-4 bg-primary text-white p-2 rounded-interactive font-medium">Update Task</button>
          </form>
        )}
      </Modal>

      <Modal
        isOpen={isDepOpen}
        onClose={() => setIsDepOpen(false)}
        title="Link Dependency"
      >
        <form onSubmit={handleAddDependency} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-400 uppercase">Prerequisite Task (Parent)</label>
            <select name="parent" required className="p-2 border border-slate-200 rounded-interactive">
              <option value="">Select task...</option>
              {tasks.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-400 uppercase">Dependent Task (Child)</label>
            <select name="child" required className="p-2 border border-slate-200 rounded-interactive">
              <option value="">Select task...</option>
              {tasks.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <button type="submit" className="mt-4 bg-primary text-white p-2 rounded-interactive font-medium">Create Dependency</button>
        </form>
      </Modal>
    </div>
  );
};
