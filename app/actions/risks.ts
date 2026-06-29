'use server';

import db from '@/lib/db';

export type Risk = {
  id: number;
  type: 'Slippage' | 'Constraint';
  title: string;
  severity: 'success' | 'warning' | 'critical';
  desc: string;
};

export async function getScheduleRisks() {
  const risks: Risk[] = [];

  // Define window for constraint check (Current Week)
  const today = new Date().toISOString().split('T')[0];
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  const end = nextWeek.toISOString().split('T')[0];

  // Detect Slippage: Task A -> Task B where A.endDate > B.startDate
  const slippages = db.prepare(`
    SELECT
      t2.id,
      t2.name as title,
      t1.name as parentName,
      t1.endDate as parentEnd,
      t2.startDate as childStart
    FROM dependencies d
    JOIN tasks t1 ON d.parentTaskId = t1.id
    JOIN tasks t2 ON d.childTaskId = t2.id
    WHERE t1.endDate > t2.startDate
  `).all() as any[];

  slippages.forEach(s => {
    risks.push({
      id: s.id,
      type: 'Slippage',
      title: s.title,
      severity: 'critical',
      desc: `Prerequisite ${s.parentName} ends on ${s.parentEnd}, which is after this task starts on ${s.childStart}.`
    });
  });

  // Detect Constraints: Over-allocated specialists in the current window
  const stmt = db.prepare(`
    SELECT s.id, s.name as title,
    (SELECT SUM(hours) FROM allocations WHERE specialistId = s.id AND windowStart >= ? AND windowEnd <= ?) as totalHours,
    s.availabilityHoursPerWeek as capacity
    FROM specialists s
    WHERE s.isActive = 1
  `);
  const overloads = stmt.all(today, end) as any[];

  overloads.forEach(o => {
    const load = (o.totalHours || 0);
    if (load > o.capacity) {
      risks.push({
        id: o.id,
        type: 'Constraint',
        title: o.title,
        severity: 'warning',
        desc: `Current window load is ${((load / o.capacity) * 100).toFixed(1)}% (${load}h / ${o.capacity}h).`
      });
    }
  });

  return risks;
}
