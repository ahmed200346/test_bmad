'use server';

import db from '@/lib/db';
import { secureAction } from '@/lib/secure-action';

export async function calculateSpecialistCapacity(specialistId: number, windowStart: string, windowEnd: string): Promise<number> {
  const stmt = db.prepare(
    'SELECT SUM(hours) as total FROM allocations WHERE specialistId = ? AND windowStart >= ? AND windowEnd <= ?'
  );
  const result = stmt.get(specialistId, windowStart, windowEnd) as { total: number | null };
  return result.total || 0;
}

export async function getSpecialistHourlyLoad(token: string | undefined, specialistId: number) {
  return secureAction(token, undefined, 'getSpecialistHourlyLoad', async (user) => {
    // Privacy Wall Check: PMs can see everything, Specialists can only see themselves
    if (user.role !== 'PM' && user.id !== specialistId) {
      throw new Error("403 Forbidden: You do not have permission to access this specialist's detailed load view.");
    }

    const rows = db.prepare(
      'SELECT a.windowStart, a.hours, t.name as taskName FROM allocations a JOIN tasks t ON a.taskId = t.id WHERE a.specialistId = ? ORDER BY a.windowStart ASC',
      [specialistId]
    ).all() as any[];

    return rows;
  });
}
