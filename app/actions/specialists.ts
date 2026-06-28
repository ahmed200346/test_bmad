'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { calculateSpecialistCapacity } from './capacity';

export type Specialist = {
// ... (existing type)
  id: number;
  name: string;
  skillTags: string[];
  seniority: 'Junior' | 'Mid' | 'Senior' | 'Staff';
  availabilityHoursPerWeek: number;
  isActive: boolean;
};

export async function getSpecialists() {
  const rows = db.prepare('SELECT * FROM specialists').all() as any[];
  return rows.map(row => ({
    ...row,
    skillTags: JSON.parse(row.skillTags || '[]'),
    isActive: !!row.isActive
  })) as Specialist[];
}

export async function createSpecialist(data: Omit<Specialist, 'id'>) {
  const stmt = db.prepare(
    'INSERT INTO specialists (name, skillTags, seniority, availabilityHoursPerWeek, isActive) VALUES (?, ?, ?, ?, ?)'
  );
  const info = stmt.run(
    data.name,
    JSON.stringify(data.skillTags),
    data.seniority,
    data.availabilityHoursPerWeek,
    data.isActive ? 1 : 0
  );
  revalidatePath('/dashboard');
  revalidatePath('/specialists');
  return info.lastInsertRowid;
}

export async function updateSpecialist(id: number, data: Partial<Specialist>) {
  const updates: string[] = [];
  const params: any[] = [];

  if (data.name !== undefined) { updates.push('name = ?'); params.push(data.name); }
  if (data.skillTags !== undefined) { updates.push('skillTags = ?'); params.push(JSON.stringify(data.skillTags)); }
  if (data.seniority !== undefined) { updates.push('seniority = ?'); params.push(data.seniority); }
  if (data.availabilityHoursPerWeek !== undefined) { updates.push('availabilityHoursPerWeek = ?'); params.push(data.availabilityHoursPerWeek); }
  if (data.isActive !== undefined) { updates.push('isActive = ?'); params.push(data.isActive ? 1 : 0); }

  if (updates.length === 0) return;

  params.push(id);
  const stmt = db.prepare(`UPDATE specialists SET ${updates.join(', ')} WHERE id = ?`);
  stmt.run(...params);
  revalidatePath('/dashboard');
  revalidatePath('/specialists');
}

export async function deactivateSpecialist(id: number) {
  db.prepare('UPDATE specialists SET isActive = 0 WHERE id = ?').run(id);
  revalidatePath('/dashboard');
  revalidatePath('/specialists');
}

export async function getFilteredSpecialists(filters: {
  skills: string[];
  seniority: string | null;
  availableOnly: boolean;
  windowStart: string;
  windowEnd: string;
}) {
  const all = await getSpecialists();

  const filteredByStatic = all.filter(s => {
    if (filters.seniority && s.seniority !== filters.seniority) return false;
    if (filters.skills.length > 0) {
      if (!filters.skills.every(skill => s.skillTags.includes(skill))) return false;
    }
    return true;
  });

  if (!filters.availableOnly) {
    return filteredByStatic;
  }

  const available = await Promise.all(
    filteredByStatic.map(async (s) => {
      const load = await calculateSpecialistCapacity(s.id, filters.windowStart, filters.windowEnd);
      return load < s.availabilityHoursPerWeek ? s : null;
    })
  );

  return available.filter((s): s is Specialist => s !== null);
}
