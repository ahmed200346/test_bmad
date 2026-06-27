# Verification & Test Plan

## Unit Tests
- **CAP‑1–CAP‑8:** Each capability has a dedicated test suite covering happy‑path, validation failures, and override scenarios.
- **Data Model:** Verify foreign‑key constraints (e.g., `Task.id → DependencyEdge.fromTaskId/toTaskId`) and cascade delete behavior.
- **Capacity Debt:** Ensure `OverrideEvent` records capacity debt accurately and that debt clears after a configurable grace period.

## Integration Tests
- Simulate a full workflow: create specialists, define tasks with dependencies, allocate resources, trigger overrides, and verify audit logs.
- Performance benchmarks (see `performance-constraints.md`) are run after each integration test batch.
- Security tests: attempt to access specialist health data as a PM and ensure access is denied; verify that all API endpoints require valid JWTs.

## Acceptance Criteria
- ≥ 95 % of allocation requests succeed without manual overrides.
- All specialist fatigue alerts appear when utilization exceeds 80 % of weekly capacity.
- No security violations detected in OWASP‑ZAP scan (baseline).
- Performance targets defined in `performance-constraints.md` are met on the reference hardware.

## Self‑Validate Sweep
The spec will be re‑validated after each change by running the above test suite. Any failures will be logged as `event` entries in the `.memlog.md` and must be addressed before the spec is considered finalized.
