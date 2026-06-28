import db from '../lib/db';

export class AllocationEngine {
  static async checkCapacity(specialistId: number, hours: number, windowStart: string, windowEnd: string) {
    const currentLoad = db.prepare(
      'SELECT SUM(hours) as total FROM allocations WHERE specialistId = ? AND windowStart >= ? AND windowEnd <= ?',
      [specialistId, windowStart, windowEnd]
    ).get() as { total: number | null };

    const total = currentLoad?.total || 0;

    // Get specialist availability
    const spec = db.prepare('SELECT availabilityHoursPerWeek FROM specialists WHERE id = ?').get() as { availabilityHoursPerWeek: number } | undefined;

    if (!spec) throw new Error("Specialist not found");

    const newLoad = total + hours;
    const loadPercentage = (newLoad / spec.availabilityHoursPerWeek) * 100;

    return {
      isAllowed: loadPercentage <= 100,
      percentage: loadPercentage,
      excess: Math.max(0, newLoad - spec.availabilityHoursPerWeek)
    };
  }

  static async allocate(specialistId: number, taskId: number, hours: number, windowStart: string, windowEnd: string) {
    const check = await this.checkCapacity(specialistId, hours, windowStart, windowEnd);

    if (!check.isAllowed) {
      throw new Error(`Capacity Exceeded: This assignment would push the specialist to ${check.percentage.toFixed(1)}%`);
    }

    db.prepare(
      'INSERT INTO allocations (specialistId, taskId, hours, windowStart, windowEnd) VALUES (?, ?, ?, ?, ?)',
      [specialistId, taskId, hours, windowStart, windowEnd]
    ).run();
  }
}
