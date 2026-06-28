'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

export type AllocationRequest = {
  specialistId: number;
  taskId: number;
  hours: number;
  windowStart: string;
  windowEnd: string;
};

export async function calculateSpecialistLoad(specialistId: number, windowStart: string, windowEnd: string) {
  const row = db.prepare(`
    SELECT SUM(hours) as totalHours
    FROM allocations
    WHERE specialistId = ?
    AND windowStart >= ?
    AND windowEnd <= ?
  `).get(specialistId, windowStart, windowEnd) as { totalHours: number | null };

  return row.totalHours || 0;
}

export async function validateAllocation(request: AllocationRequest) {
  const specialist = db.prepare('SELECT * FROM specialists WHERE id = ?').get(request.specialistId) as any;
  if (!specialist) throw new Error("Specialist not found.");
  if (!specialist.isActive) throw new Error("Specialist is currently inactive.");

  const currentLoad = await calculateSpecialistLoad(request.specialistId, request.windowStart, request.windowEnd);
  const totalHours = currentLoad + request.hours;
  const capacityPercentage = (totalHours / specialist.availabilityHoursPerWeek) * 100;

  if (capacityPercentage > 100) {
    return {
      valid: false,
      error: `Capacity Exceeded: This assignment would push the specialist to ${capacityPercentage.toFixed(1)}%.`,
      percentage: capacityPercentage
    };
  }

  // Story 2.3: Recovery Floor Enforcement
  // Check if this is a high-intensity task (> 8h)
  if (request.hours > 8) {
    const lastIntensiveTask = db.prepare(`
      SELECT a.windowEnd
      FROM allocations a
      JOIN tasks t ON a.taskId = t.id
      WHERE a.specialistId = ? AND t.duration > 8
      ORDER BY a.windowEnd DESC LIMIT 1
    `).get(request.specialistId) as { windowEnd: string | null };

    if (lastIntensiveTask?.windowEnd) {
      const end = new Date(lastIntensiveTask.windowEnd).getTime();
      const start = new Date(request.windowStart).getTime();
      const diffHours = (start - end) / (1000 * 60 * 60);

      if (diffHours < 24) {
        return {
          valid: false,
          error: "Recovery Floor Violation: Specialist requires a minimum recharge period (24h) after intensive tasks.",
          percentage: capacityPercentage
        };
      }
    }
  }

  return { valid: true, percentage: capacityPercentage };
}

export async function allocateTask(request: AllocationRequest, override?: { priority: string; rationale: string }) {
  const validation = await validateAllocation(request);

  if (!validation.valid && !override) {
    throw new Error(validation.error);
  }

  const stmt = db.prepare(
    'INSERT INTO allocations (specialistId, taskId, hours, windowStart, windowEnd) VALUES (?, ?, ?, ?, ?)'
  );
  const info = stmt.run(request.specialistId, request.taskId, request.hours, request.windowStart, request.windowEnd);
  const allocationId = info.lastInsertRowid;

  if (override) {
    const debtHours = (validation.percentage || 0) > 100
      ? (validation.percentage || 0) - 100
      : 0;

    db.prepare(`
      INSERT INTO capacity_debt (allocationId, priority, rationale, excessHours)
      VALUES (?, ?, ?, ?)
    `).run(allocationId, override.priority, override.rationale, debtHours);
  }

  revalidatePath('/dashboard');
  revalidatePath('/allocate');
  return allocationId;
}
