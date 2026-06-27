# Performance Constraints & Verification

The system must meet the following performance targets under the reference hardware configuration (Intel i7‑12700K, 16 GB RAM, SSD) running the latest Node.js LTS:

- **Constraint evaluation latency:** ≤ 100 ms per operation for standard CRUD and allocation checks.
- **Dashboard render time:** ≤ 2 s for displaying up to 5,000 tasks and 1,000 specialists.
- **Allocation batch processing:** ≤ 500 ms for processing a batch of 1,000 allocation requests.

Verification is performed via an automated benchmark suite executed on CI. The suite records median latency across 10 runs and fails the build if any target is exceeded. Results are stored in `performance-report.md` for audit.
