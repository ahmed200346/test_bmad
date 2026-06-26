# Technical Plan — OptiTask Resource Orchestrator

## 1. Purpose
This document translates the PRD into an implementation-ready technical plan for a local-first, zero-config resource orchestration application. It is designed for the current Next.js application scaffold and aligns with the stated constraints: local SQLite persistence, pure TypeScript logic, server-driven state updates, and a professional enterprise-style UI.

## 2. Product Scope Summary
The solution will provide a single-tenant desktop/web local application that allows project managers to allocate work to specialists while enforcing:
- capacity limits per specialist
- prerequisite-based task readiness
- recovery-floor constraints between intensive tasks
- immutable audit history for allocation activity
- privacy-aware utilization views

## 3. Architecture Principles
1. Prefer boring, stable technology over novelty.
2. Keep the constraint engine deterministic and testable.
3. Use server actions for state mutations and local persistence.
4. Keep all data local to avoid auth and sync complexity.
5. Separate domain logic from UI rendering to simplify evolution.
6. Make the privacy model explicit in both data access and UI composition.

## 4. Recommended Solution Architecture
### 4.1 Runtime Model
- Frontend: Next.js App Router with React Server Components and client islands where needed.
- Backend logic: TypeScript service layer and server actions.
- Persistence: SQLite file stored locally in the application data folder.
- Validation: Zod-based input validation for all create/update payloads.
- Styling: Tailwind CSS with a polished enterprise visual language.

### 4.2 Component Boundaries
- UI Layer: dashboards, forms, tables, charts, alerts
- Application Layer: CRUD orchestration, validation, role-aware view composition
- Domain Layer: capacity engine, dependency engine, override policy, risk evaluation
- Data Layer: SQLite schema, migrations, repository pattern

## 5. System Modules
### 5.1 Core Domain Modules
- Specialist Management
  - create, edit, deactivate specialists
  - store skill, seniority, availability, and workload profile
- Task Management
  - create, edit, mark complete, and manage dependency links
  - enforce positive duration rules
- Allocation Management
  - assign specialists to tasks over a time window
  - reject assignments that violate capacity or dependency rules
- Override Management
  - allow explicit override for urgent assignments
  - capture priority, rationale, and resulting capacity debt
- Audit and Monitoring
  - append-only history of changes and overrides
  - status tracking for high-risk resources

### 5.2 Privacy and Intelligence Modules
- Personal Health Shield
  - specialists receive detailed utilization heatmaps and fatigue alerts
  - PMs receive summarized status only
- Risk Intelligence
  - flag schedule risks where a dependency slips beyond a dependent task start date

## 6. Data Model
### 6.1 Core Entities
- Specialist
  - id
  - name
  - role
  - skillTags
  - seniority
  - availabilityHoursPerWeek
  - active
- Task
  - id
  - title
  - description
  - durationHours
  - startDate
  - endDate
  - status
  - priority
  - createdAt
  - updatedAt
- DependencyEdge
  - id
  - fromTaskId
  - toTaskId
  - dependencyType
- Allocation
  - id
  - taskId
  - specialistId
  - startDate
  - endDate
  - allocatedHours
  - source
  - createdAt
- OverrideEvent
  - id
  - allocationId
  - requestedBy
  - priorityLevel
  - rationale
  - capacityDebtAmount
  - createdAt
- AuditEvent
  - id
  - entityType
  - entityId
  - action
  - payloadJson
  - actor
  - createdAt

### 6.2 Key Invariants
- Task duration must be at least 0.25 hours.
- A task cannot be started before all prerequisite tasks are complete.
- A specialist’s effective load cannot exceed 100% for a given time window unless an override exists.
- Recovery floor rules must be enforced for back-to-back intensive assignments.

## 7. Domain Logic Design
### 7.1 Capacity Engine
The capacity engine will compute load by specialist over any selected time window and return:
- allowed / blocked decision
- overload amount
- recommended alternative specialists
- risk classification

The engine should be implemented as a pure TypeScript module so it can be tested independently of the UI.

### 7.2 Dependency Engine
The dependency engine will:
- validate the DAG structure
- compute task readiness
- detect dependency drift and schedule risks
- expose a clear blocked/ready state transition for UI consumption

### 7.3 Override Policy
Overrides are permitted only for high-priority situations and must always:
- require a priority level
- create a capacity debt record
- mark the affected specialist as high-risk in downstream views

## 8. Persistence and Data Access Strategy
### 8.1 Storage Approach
Use a single SQLite database file with a schema managed through migrations.

### 8.2 Data Access Pattern
Implement a repository layer with typed operations for:
- specialists
- tasks
- dependencies
- allocations
- audit events
- overrides

### 8.3 Migration Strategy
- Create a schema migration file for each major release.
- Support a simple bootstrap script that initializes the database if it does not exist.
- Keep the migration layer deterministic and versioned.

## 9. API and Server Action Design
### 9.1 Server Actions
Use server actions for writes:
- createSpecialist
- updateSpecialist
- createTask
- updateTask
- createAllocation
- createOverride
- markTaskComplete
- revalidateDashboard

### 9.2 Read Paths
Use server components and route handlers to fetch dashboard data, specialist summaries, and task dependency views.

### 9.3 Validation Strategy
All inbound payloads should be validated with Zod before reaching the persistence layer.

## 10. UI / UX Structure
### 10.1 Primary Views
- Dashboard
  - PM overview of resource health and overload status
  - specialist summary cards
  - upcoming risk indicators
- Specialist View
  - personal load and recovery profile
  - detailed heatmap
  - fatigue alerts
- Task Planner View
  - DAG visualization or simplified dependency tree
  - block / ready status indicators
  - dependency risk flags
- Administration View
  - CRUD for specialists, tasks, and allocations
  - audit history and override logs

### 10.2 Interaction Patterns
- Allocation attempts should fail fast with a non-destructive validation message.
- Overrides should prompt for priority, rationale, and confirmation.
- Risk indicators should be visible without exposing private specialist detail to PMs.

## 11. Privacy Model
The application must implement a role-aware data boundary:
- PMs: see aggregate status and high-level capacity posture
- Specialists: see full personal utilization and fatigue data
- Auditors: see immutable history and change provenance

This is a hard architectural requirement and should be enforced in the data access layer rather than only in the UI.

## 12. Performance Targets
- constraint evaluation: under 100 ms for standard operations
- dashboard render: under 2 seconds for medium-sized data sets
- database reads: indexed for task, specialist, and allocation lookups

## 13. Testing Strategy
### 13.1 Unit Tests
- capacity calculation logic
- dependency readiness logic
- override policy logic
- validation rules

### 13.2 Integration Tests
- server action flow for allocation creation
- audit log persistence after overrides
- privacy-scoped view behavior

### 13.3 Manual Acceptance Tests
- safe allocation succeeds when within capacity
- blocked allocation fails with an explanatory message
- override is recorded and marked as debt
- dependency completion unlocks downstream tasks

## 14. Implementation Plan
### Phase 1 — Foundation
- scaffold the data model and sqlite schema
- create repository layer and migration runner
- wire initial dashboard shell and navigation

### Phase 2 — Core CRUD
- implement specialist, task, and allocation CRUD
- add input validation and audit event generation

### Phase 3 — Constraint Engine
- implement capacity checks
- implement dependency readiness and schedule risk rules
- add override handling and debt tracking

### Phase 4 — Intelligence and Privacy
- add heatmaps and summary views
- enforce role-based view filtering
- add specialist fatigue alerts

### Phase 5 — Hardening
- add automated tests and performance tuning
- polish UI states and error handling
- prepare local deployment documentation

## 15. Suggested Project Structure
- app/
  - page.tsx
  - dashboard/
  - specialists/
  - tasks/
  - allocations/
- lib/
  - db/
  - domain/
  - services/
  - types/
  - validation/
- components/
  - dashboard/
  - specialists/
  - tasks/
  - allocations/
- data/
  - .gitkeep

## 16. Risks and Mitigations
- Risk: dependency graph complexity may grow quickly.
  - Mitigation: keep the first version to a simple DAG model with clear validation.
- Risk: UI becomes too complex for the initial scope.
  - Mitigation: prioritize one PM dashboard and one specialist view first.
- Risk: privacy enforcement is bypassed accidentally.
  - Mitigation: enforce data filtering in the service layer, not just the presentation layer.
- Risk: performance degrades with larger datasets.
  - Mitigation: index frequently queried fields and keep constraint checks focused on affected ranges.

## 17. Delivery Readiness Criteria
The solution is ready for implementation when:
- the schema and core entities are defined
- the capacity and dependency engines are implemented and test-covered
- role-based access to utilization data is enforced
- the basic CRUD flows and dashboard experience are functional

## 18. Recommendation
The most practical implementation path is a Next.js App Router application with a local SQLite database, a typed repository layer, and a pure TypeScript domain engine for capacity and dependency constraints. This approach satisfies the PRD’s requirements while staying aligned with the current project stack and the “boring technology” principle.
