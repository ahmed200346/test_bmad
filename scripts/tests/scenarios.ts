import { AllocationEngine } from '../lib/allocation-engine';
import db from '../lib/db';

async function runScenarios() {
  console.log("🚀 Starting 1,000 Allocation Scenario Tests...");

  // Setup: Create a test specialist and some tasks
  db.exec("DELETE FROM allocations");
  db.exec("DELETE FROM tasks");
  db.exec("DELETE FROM specialists");

  const specialistId = db.prepare('INSERT INTO specialists (name, skillTags, seniority, availabilityHoursPerWeek, isActive) VALUES (?, ?, ?, ?, ?)')
    .run("Test Spec", "[]", "Senior", 40, 1).lastInsertRowid;

  const tasks = [];
  for (let i = 0; i < 100; i++) {
    const id = db.prepare('INSERT INTO tasks (name, duration, status) VALUES (?, ?, ?)')
      .run(`Task ${i}`, 2, 'Pending').lastInsertRowid;
    tasks.push(id);
  }

  let passed = 0;
  let failed = 0;
  let blocked = 0;

  for (let i = 0; i < 1000; i++) {
    const taskId = tasks[Math.floor(Math.random() * tasks.length)];
    const hours = Math.random() * 10 + 1; // 1 to 11 hours
    const windowStart = '2026-06-28';
    const windowEnd = '2026-07-05';

    try {
      const check = await AllocationEngine.checkCapacity(specialistId, hours, windowStart, windowEnd);
      if (check.isAllowed) {
        await AllocationEngine.allocate(specialistId, taskId, hours, windowStart, windowEnd);
        passed++;
      } else {
        blocked++;
        // Verify that the engine correctly blocked it
        // (If we try to allocate anyway, it should throw)
        try {
          await AllocationEngine.allocate(specialistId, taskId, hours, windowStart, windowEnd);
          failed++; // Should have thrown
        } catch (e) {
          // Correctly blocked
        }
      }
    } catch (e) {
      failed++;
    }
  }

  console.log(`\nTest Results:`);
  console.log(`- Total Scenarios: 1000`);
  console.log(`- Successful Allocations: ${passed}`);
  console.log(`- Correctly Blocked: ${blocked}`);
  console.log(`- Failures: ${failed}`);

  if (failed > 0) {
    console.error("❌ Scenario tests failed!");
    process.exit(1);
  } else {
    console.log("✅ All scenarios passed successfully!");
    process.exit(0);
  }
}

runScenarios().catch(console.error);
