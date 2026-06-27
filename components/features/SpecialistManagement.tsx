'use client';

import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { getSpecialists, createSpecialist, updateSpecialist, deactivateSpecialist, Specialist } from '@/app/actions/specialists';

export const SpecialistManagement = () => {
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingSpecialist, setEditingSpecialist] = useState<Specialist | null>(null);

  const loadSpecialists = async () => {
    const data = await getSpecialists();
    setSpecialists(data);
  };

  React.useEffect(() => {
    loadSpecialists();
  }, []);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      skillTags: (formData.get('skills') as string).split(',').map(s => s.trim()),
      seniority: formData.get('seniority') as any,
      availabilityHoursPerWeek: parseFloat(formData.get('hours') as string),
      isActive: true
    };
    await createSpecialist(data);
    setIsCreateOpen(false);
    loadSpecialists();
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingSpecialist) return;
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      skillTags: (formData.get('skills') as string).split(',').map(s => s.trim()),
      seniority: formData.get('seniority') as any,
      availabilityHoursPerWeek: parseFloat(formData.get('hours') as string),
    };
    await updateSpecialist(editingSpecialist.id, data);
    setEditingSpecialist(null);
    loadSpecialists();
  };

  const handleDeactivate = async (id: number) => {
    await deactivateSpecialist(id);
    loadSpecialists();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-900">Specialist Inventory</h2>
        <Button onClick={() => setIsCreateOpen(true)}>Add Specialist</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gap">
        {specialists.map(s => (
          <Card key={s.id} className="flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="text-2xl">👤</span>
                <span className={`text-[10px] font-bold px-2 py-1 rounded ${s.isActive ? 'bg-success text-slate-900' : 'bg-slate-200 text-slate-500'}`}>
                  {s.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <h3 className="font-semibold text-slate-900">{s.name}</h3>
              <p className="text-xs text-slate-500 mb-3">{s.seniority}</p>
              <div className="flex flex-wrap gap-1 mb-4">
                {s.skillTags.map(tag => (
                  <span key={tag} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="text-sm text-slate-600 mb-6">
                Availability: <span className="font-medium">{s.availabilityHoursPerWeek}h/week</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" className="text-xs" onClick={() => setEditingSpecialist(s)}>Edit</Button>
              {s.isActive && (
                <Button variant="outline" className="text-xs text-critical" onClick={() => handleDeactivate(s.id)}>Deactivate</Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create New Specialist"
        footer={
          <Button onClick={(e) => { /* form handled by onSubmit */ }}>Save</Button>
        }
      >
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-400 uppercase">Full Name</label>
            <input name="name" required className="p-2 border border-slate-200 rounded-interactive" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-400 uppercase">Skills (comma separated)</label>
            <input name="skills" required className="p-2 border border-slate-200 rounded-interactive" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Seniority</label>
              <select name="seniority" className="p-2 border border-slate-200 rounded-interactive">
                <option value="Junior">Junior</option>
                <option value="Mid">Mid</option>
                <option value="Senior">Senior</option>
                <option value="Staff">Staff</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Weekly Hours</label>
              <input name="hours" type="number" required className="p-2 border border-slate-200 rounded-interactive" />
            </div>
          </div>
          <button type="submit" className="mt-4 bg-primary text-white p-2 rounded-interactive font-medium">Create Specialist</button>
        </form>
      </Modal>

      <Modal
        isOpen={!!editingSpecialist}
        onClose={() => setEditingSpecialist(null)}
        title="Edit Specialist"
      >
        {editingSpecialist && (
          <form onSubmit={handleUpdate} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Full Name</label>
              <input name="name" defaultValue={editingSpecialist.name} required className="p-2 border border-slate-200 rounded-interactive" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Skills (comma separated)</label>
              <input name="skills" defaultValue={editingSpecialist.skillTags.join(', ')} required className="p-2 border border-slate-200 rounded-interactive" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-400 uppercase">Seniority</label>
                <select name="seniority" defaultValue={editingSpecialist.seniority} className="p-2 border border-slate-200 rounded-interactive">
                  <option value="Junior">Junior</option>
                  <option value="Mid">Mid</option>
                  <option value="Senior">Senior</option>
                  <option value="Staff">Staff</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-400 uppercase">Weekly Hours</label>
                <input name="hours" type="number" defaultValue={editingSpecialist.availabilityHoursPerWeek} required className="p-2 border border-slate-200 rounded-interactive" />
              </div>
            </div>
            <button type="submit" className="mt-4 bg-primary text-white p-2 rounded-interactive font-medium">Update Specialist</button>
          </form>
        )}
      </Modal>
    </div>
  );
};
