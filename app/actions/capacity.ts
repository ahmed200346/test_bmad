'use server';

import db from '@/lib/db';

export async function calculateSpecialistCapacity(specialistId: number, windowStart: string, windowEnd: string): Promise<number> {
  const stmt = db.prepare(
    'SELECT SUM(hours) as total FROM allocations WHERE specialistId = ? AND windowStart >= ? AND windowEnd <= ?'
  );
  const result = stmt.get(specialistId, windowStart, windowEnd) as { total: number | null };
  return result.total || 0;
}
