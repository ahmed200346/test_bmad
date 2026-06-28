import { AllocationEngine } from '../lib/allocation-engine';
import db from '../lib/db';

async function benchmark() {
  console.log("⏱️ Starting Performance Benchmarks...");

  const specialistId = db.prepare('SELECT id FROM specialists LIMIT 1').get() as { id: number } | undefined;
  if (!specialistId) {
    console.error("No specialists found. Please seed the DB first.");
    process.exit(1);
  }

  const iterations = 1000;
  const start = performance.now();

  for (let i = 0; i < iterations; i++) {
    await AllocationEngine.checkCapacity(specialistId.id, 1, '2026-06-28', '2026-07-05');
  }

  const end = performance.now();
  const totalTime = end - start;
  const avgTime = totalTime / iterations;

  console.log(`\nBenchmark Results:`);
  console.log(`- Total Iterations: ${iterations}`);
  console.log(`- Total Time: ${totalTime.toFixed(2)}ms`);
  console.log(`- Average Latency: ${avgTime.toFixed(3)}ms`);

  if (avgTime > 100) {
    console.error("❌ Latency exceeds 100ms threshold!");
    process.exit(1);
  } else {
    console.log("✅ Performance within thresholds.");
    process.exit(0);
  }
}

benchmark().catch(console.error);
