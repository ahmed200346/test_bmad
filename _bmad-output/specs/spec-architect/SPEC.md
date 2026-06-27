---
id: SPEC-architect
version: 1.1
date: 2026-06-27
companions: [data-model.md, architecture-diagrams.md, security-constraints.md, performance-constraints.md, recovery-floor.md, migration-strategy.md, verification-plan.md]
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

- Local SQLite persistence with AES‑256 encryption at rest.
- Pure TypeScript logic for constraint engines.
- Server‑driven state updates (Server Actions) over TLS 1.3.
- Local‑first, zero‑config deployment; authentication via JWT‑based OAuth2.
- Role‑aware data boundaries enforced in the data access layer; audit logs are tamper‑evident.
- Task duration minimum: 0.25 hours.
- Prerequisites must be complete before task start.
- Specialist load ≤ 100 % per week unless overridden.
- Recovery floor rules enforced for intensive tasks (tasks > 8 hours or flagged high‑fatigue).
- Constraint evaluation: under 100 ms for standard operations, verified on a reference machine (Intel i7‑12700K, 16 GB RAM, SSD).
- Dashboard render: under 2 s for medium‑sized data sets.
## Non-goals

- Cloud synchronization and multi-user collaboration.
- Complex authentication systems.
- Non-deterministic constraint evaluation.

## Success signal

The system is considered successful when at least 95 % of valid task allocation requests are processed without manual overrides, and all specialist fatigue alerts are displayed correctly. Success is verified by automated integration tests that simulate 1,000 allocation scenarios and assert that the override rate remains ≤ 5 % and that fatigue alerts are emitted for specialists exceeding 80 % of their weekly capacity.
