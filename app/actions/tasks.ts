'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

export type Task = {
  id: number;
  name: string;
  duration: number;
  startDate: string | null;
  endDate: string | null;
  status: string;
  isBlocked: boolean;
};

export async function getTasks() {
  const rows = db.prepare('SELECT * FROM tasks').all() as any[];

  return Promise.all(rows.map(async (row) => {
    const prerequisites = db.prepare('SELECT parentTaskId FROM dependencies WHERE childTaskId = ?').all(row.id) as { parentTaskId: number }[];

    let isBlocked = false;
    for (const { parentTaskId } of prerequisites) {
      const parent = db.prepare('SELECT status FROM tasks WHERE id = ?').get(parentTaskId) as { status: string } | undefined;
      if (!parent || parent.status !== 'Complete') {
        isBlocked = true;
        break;
      }
    }

    return {
      ...row,
      isBlocked
    };
  })) as Promise<Task[]>;
}

export async function createTask(data: { name: string; duration: number; startDate?: string; endDate?: string }) {
  if (data.duration < 0.25) {
    throw new Error("Task duration must be at least 0.25 hours.");
  }

  const stmt = db.prepare(
    'INSERT INTO tasks (name, duration, startDate, endDate) VALUES (?, ?, ?, ?)'
  );
  const info = stmt.run(data.name, data.duration, data.startDate || null, data.endDate || null);
  revalidatePath('/dashboard');
  return info.lastInsertRowid;
}

export async function updateTask(id: number, data: Partial<Task>) {
  const updates: string[] = [];
  const params: any[] = [];

  if (data.name !== undefined) { updates.push('name = ?'); params.push(data.name); }
  if (data.duration !== undefined) {
    if (data.duration < 0.25) throw new Error("Task duration must be at least 0.25 hours.");
    updates.push('duration = ?');
    params.push(data.duration);
  }
  if (data.startDate !== undefined) { updates.push('startDate = ?'); params.push(data.startDate); }
  if (data.endDate !== undefined) { updates.push('endDate = ?'); params.push(data.endDate); }
  if (data.status !== undefined) { updates.push('status = ?'); params.push(data.status); }

  if (updates.length === 0) return;

  params.push(id);
  const stmt = db.prepare(`UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`);
  stmt.run(...params);
  revalidatePath('/dashboard');
}

export async function addDependency(parentTaskId: number, childTaskId: number) {
  if (parentTaskId === childTaskId) {
    throw new Error("A task cannot depend on itself.");
  }

  // Circular Dependency Detection (DFS)
  const visited = new Set<number>();
  const recStack = new Set<number>();

  function hasCycle(u: number): boolean {
    visited.add(u);
    recStack.add(u);

    const deps = db.prepare('SELECT childTaskId FROM dependencies WHERE parentTaskId = ?').all(u) as { childTaskId: number }[];
    for (const { childTaskId } of deps) {
      if (!visited.has(childTaskId)) {
        if (hasCycle(childTaskId)) return true;
      } else if (recStack.has(childTaskId)) {
        return true;
      }
    }

    recStack.delete(u);
    return false;
  }

  // Temporarily add the dependency to check for cycle
  db.prepare('INSERT INTO dependencies (parentTaskId, childTaskId) VALUES (?, ?)').run(parentTaskId, childTaskId);

  const cycle = hasCycle(parentTaskId);

  if (cycle) {
    db.prepare('DELETE FROM dependencies WHERE parentTaskId = ? AND childTaskId = ?').run(parentTaskId, childTaskId);
    throw new Error("Circular dependencies are not permitted.");
  }

  revalidatePath('/dashboard');
}

export async function removeDependency(parentTaskId: number, childTaskId: number) {
  db.prepare('DELETE FROM dependencies WHERE parentTaskId = ? AND childTaskId = ?').run(parentTaskId, childTaskId);
  revalidatePath('/dashboard');
}
