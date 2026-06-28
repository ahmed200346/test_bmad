'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { getSpecialists, createSpecialist, updateSpecialist, deactivateSpecialist, Specialist } from '@/app/actions/specialists';

export const SpecialistManagement = () => {
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingSpecialist, setEditingSpecialist] = useState<Specialist | null>(null);
  const [filters, setFilters] = useState({
    skill: '',
    seniority: '',
    onlyAvailable: false,
  });

  const loadSpecialists = async () => {
    const data = await getSpecialists(filters);
    setSpecialists(data);
  };

  useEffect(() => {
    loadSpecialists();
  }, [filters]);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      skillTags: (formData.get('skills') as string).split(',').map(s => s.trim()).filter(Boolean),
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
      skillTags: (formData.get('skills') as string).split(',').map(s => s.trim()).filter(Boolean),
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
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Specialist Inventory</h2>
          <p className="text-sm text-slate-500">Manage your team's capabilities and availability.</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>Add Specialist</Button>
      </div>

      {/* Filter Bar - Calm Productivity style */}
      <Card className="p-4 border-none shadow-sm bg-white/50 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex flex-col gap-1 w-full md:w-auto">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Skill Search</label>
            <input
              value={filters.skill}
              onChange={(e) => setFilters(f => ({ ...f, skill: e.target.value }))}
              placeholder="e.g. TypeScript, React..."
              className="p-2 text-sm border border-slate-200 rounded-interactive bg-white focus:ring-2 focus:ring-primary outline-none transition-all"
            />
          </div>
          <div className="flex flex-col gap-1 w-full md:w-auto">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Seniority</label>
            <select
              value={filters.seniority}
              onChange={(e) => setFilters(f => ({ ...f, seniority: e.target.value }))}
              className="p-2 text-sm border border-slate-200 rounded-interactive bg-white focus:ring-2 focus:ring-primary outline-none transition-all"
            >
              <option value="">All Levels</option>
              <option value="Junior">Junior</option>
              <option value="Mid">Mid</option>
              <option value="Senior">Senior</option>
              <option value="Staff">Staff</option>
            </select>
          </div>
          <div className="flex items-center gap-3 pt-4">
            <input
              type="checkbox"
              id="avail-filter"
              checked={filters.onlyAvailable}
              onChange={(e) => setFilters(f => ({ ...f, onlyAvailable: e.target.checked }))}
              className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
            />
            <label htmlFor="avail-filter" className="text-sm font-medium text-slate-600 cursor-pointer">
              Show Available Only
            </label>
          </div>
        </div
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gap">
        {specialists.length === 0 ? (
          <div className="col-span-full py-20 text-center text-slate-400 italic border-2 border-dashed border-slate-200 rounded-interactive">
            No specialists found matching the current filters.
          </div>
        ) : (
          specialists.map(s => (
            <Card key={s.id} className="flex flex-col justify-between group hover:border-primary transition-all duration-300">
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xl group-hover:bg-primary/10 transition-colors">
                    👤
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${s.isActive ? 'bg-success/20 text-success-dark' : 'bg-slate-200 text-slate-500'}`}>
                    {s.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-lg">{s.name}</h3>
                  <p className="text-xs text-slate-500 mb-3">{s.seniority}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {s.skillTags.map(tag => (
                      <span key={tag} className="text-[10px] bg-white text-slate-600 px-2 py-0.5 rounded border border-slate-200 shadow-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="text-sm text-slate-600 flex items-center gap-2">
                    <span className="text-slate-400">Availability:</span>
                    <span className="font-medium text-slate-900">{s.availabilityHoursPerWeek}h/week</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6 pt-4 border-t border-slate-100">
                <Button variant="ghost" className="text-xs flex-grow" onClick={() => setEditingSpecialist(s)}>Edit</Button>
                {s.isActive && (
                  <Button variant="outline" className="text-xs text-critical flex-grow" onClick={() => handleDeactivate(s.id)}>Deactivate</Button>
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create New Specialist"
      >
        <form onSubmit={handleCreate} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Full Name</label>
            <input name="name" required className="p-3 border border-slate-200 rounded-interactive bg-slate-50 focus:ring-2 focus:ring-primary outline-none transition-all" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Skills (comma separated)</label>
            <input name="skills" placeholder="e.g. TypeScript, Architecture, AWS" required className="p-3 border border-slate-200 rounded-interactive bg-slate-50 focus:ring-2 focus:ring-primary outline-none transition-all" />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Seniority</label>
              <select name="seniority" className="p-3 border border-slate-200 rounded-interactive bg-slate-50 focus:ring-2 focus:ring-primary outline-none transition-all">
                <option value="Junior">Junior</option>
                <option value="Mid">Mid</option>
                <option value="Senior">Senior</option>
                <option value="Staff">Staff</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Weekly Hours</label>
              <input name="hours" type="number" required className="p-3 border border-slate-200 rounded-interactive bg-slate-50 focus:ring-2 focus:ring-primary outline-none transition-all" />
            </div>
          </div>
          <Button type="submit" className="mt-4 w-full py-3">Create Specialist</Button>
        </form>
      </Modal>

      <Modal
        isOpen={!!editingSpecialist}
        onClose={() => setEditingSpecialist(null)}
        title="Edit Specialist"
      >
        {editingSpecialist && (
          <form onSubmit={handleUpdate} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Full Name</label>
              <input name="name" defaultValue={editingSpecialist.name} required className="p-3 border border-slate-200 rounded-interactive bg-slate-50 focus:ring-2 focus:ring-primary outline-none transition-all" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Skills (comma separated)</label>
              <input name="skills" defaultValue={editingSpecialist.skillTags.join(', ')} required className="p-3 border border-slate-200 rounded-interactive bg-slate-50 focus:ring-2 focus:ring-primary outline-none transition-all" />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Seniority</label>
                <select name="seniority" defaultValue={editingSpecialist.seniority} className="p-3 border border-slate-200 rounded-interactive bg-slate-50 focus:ring-2 focus:ring-primary outline-none transition-all">
                  <option value="Junior">Junior</option>
                  <option value="Mid">Mid</option>
                  <option value="Senior">Senior</option>
                  <option value="Staff">Staff</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Weekly Hours</label>
                <input name="hours" type="number" defaultValue={editingSpecialist.availabilityHoursPerWeek} required className="p-3 border border-slate-200 rounded-interactive bg-slate-50 focus:ring-2 focus:ring-primary outline-none transition-all" />
              </div>
            </div>
            <Button type="submit" className="mt-4 w-full py-3">Update Specialist</Button>
          </form>
        )}
      </Modal>
    </div>
  );
};
