---
id: SPEC-architect
companions: [data-model.md, architecture-diagrams.md]
sources: [/home/sigma/Desktop/bmad_test/test_bmad/_bmad-output/planning-artifacts/architecture/architect.md]
---

> **Canonical contract.** This SPEC and the files in `companions:` are the complete, preservation-validated contract for what to build, test, and validate. Source documents listed in frontmatter are for traceability only — consult them only if you need narrative rationale or prose color this contract intentionally omits.

# OptiTask Resource Orchestrator

## Why

Solve the problem of project managers allocating work to specialists while enforcing capacity limits, prerequisites, and recovery floors, ensuring a fair and sustainable workload for specialists in a local-first, zero-config environment.

## Capabilities

- **CAP-1**
  - **intent:** PMs can create, edit, and deactivate specialists with skill, seniority, and workload profiles.
  - **success:** Specialist records are persisted and retrievable.
- **CAP-2**
  - **intent:** PMs can create, edit, and manage dependency links between tasks.
  - **success:** Tasks with valid durations and dependencies are persisted.
- **CAP-3**
  - **intent:** PMs can assign specialists to tasks over a time window.
  - **success:** Assignments are blocked if they violate capacity or dependency rules.
- **CAP-4**
  - **intent:** PMs can explicitly override constraints for urgent assignments.
  - **success:** Overrides capture priority, rationale, and create capacity debt records.
- **CAP-5**
  - **intent:** System maintains an immutable history of all changes and overrides.
  - **success:** Audit events are append-only and traceable.
- **CAP-6**
  - **intent:** Specialists receive detailed utilization heatmaps and fatigue alerts.
  - **success:** View reflects individual utilization and flags fatigue based on rules.
- **CAP-7**
  - **intent:** System flags schedule risks where dependencies slip beyond task start dates.
  - **success:** Risk indicators appear on the dashboard for affected tasks.
- **CAP-8**
  - **intent:** Role-based boundaries restrict PMs to aggregate status and specialists to detailed personal data.
  - **success:** Data access layer enforces role-based filtering.

## Constraints

- Local SQLite persistence.
- Pure TypeScript logic for constraint engines.
- Server-driven state updates (Server Actions).
- Local-first, zero-config (no auth/sync complexity).
- Role-aware data boundaries enforced in the data access layer.
- Task duration minimum: 0.25 hours.
- Prerequisites must be complete before task start.
- Specialist load ≤ 100% unless overridden.
- Recovery floor rules enforced for intensive tasks.
- Constraint evaluation: under 100ms for standard operations.
- Dashboard render: under 2s for medium-sized data sets.

## Non-goals

- Cloud synchronization and multi-user collaboration.
- Complex authentication systems.
- Non-deterministic constraint evaluation.

## Success signal

A PM can successfully allocate a set of tasks to specialists, with the system correctly blocking invalid allocations and recording necessary overrides, while specialists can view their own fatigue alerts without the PM seeing their private health data.
