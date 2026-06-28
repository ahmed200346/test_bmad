'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getHeatmapData() {
  // Window: Current Week (Demo)
  const today = new Date().toISOString().split('T')[0];
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  const end = nextWeek.toISOString().split('T')[0];

  const specialists = db.prepare('SELECT * FROM specialists WHERE isActive = 1').all() as any[];

  return specialists.map(s => {
    const load = db.prepare(`
      SELECT SUM(hours) as total
      FROM allocations
      WHERE specialistId = ?
      AND windowStart >= ?
      AND windowEnd <= ?
    `).get(s.id, today, end) as { total: number | null };

    const totalHours = load.total || 0;
    const percentage = (totalHours / s.availabilityHoursPerWeek) * 100;

    return {
      specialist: s.name,
      load: Math.round(percentage),
      hours: totalHours,
      capacity: s.availabilityHoursPerWeek
    };
  });
}
