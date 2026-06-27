# Data Model — OptiTask Resource Orchestrator

## Core Entities

### Specialist
- `id`: Unique identifier
- `name`: Full name
- `role`: Functional role
- `skillTags`: Array of expertise markers
- `seniority`: Experience level
- `availabilityHoursPerWeek`: Standard capacity
- `active`: Boolean status

### Task
- `id`: Unique identifier
- `title`: Short name
- `description`: Detailed scope
- `durationHours`: Estimated effort (min 0.25h)
- `startDate`: Planned start
- `endDate`: Planned end
- `status`: Current state (Ready, In-Progress, Complete, Blocked)
- `priority`: Urgency level
- `createdAt` / `updatedAt`: Timestamps

### DependencyEdge
- `id`: Unique identifier
- `fromTaskId`: Prerequisite task
- `toTaskId`: Dependent task
- `dependencyType`: Relationship type (e.g., Finish-to-Start)

### Allocation
- `id`: Unique identifier
- `taskId`: Referenced task
- `specialistId`: Referenced specialist
- `startDate`: Allocation start
- `endDate`: Allocation end
- `allocatedHours`: Effort assigned
- `source`: Origin of allocation
- `createdAt`: Timestamp

### OverrideEvent
- `id`: Unique identifier
- `allocationId`: Referenced allocation
- `requestedBy`: User initiating override
- `priorityLevel`: Urgency of override
- `rationale`: Justification for breaking constraint
- `capacityDebtAmount`: Resulting overload
- `createdAt`: Timestamp

### AuditEvent
- `id`: Unique identifier
- `entityType`: Type of object changed
- `entityId`: ID of object changed
- `action`: Operation performed
- `payloadJson`: State change details
- `actor`: User who performed the action
- `createdAt`: Timestamp

## Key Invariants & Relationships

- **Task Duration:** `Task.durationHours >= 0.25`.
- **Dependency Order:** `Task.startDate` cannot be before all its prerequisites' `Task.endDate`.
- **Foreign‑Key Relationships:** 
  - `Task.id` referenced by `DependencyEdge.fromTaskId` and `DependencyEdge.toTaskId`.
  - `Allocation.taskId` → `Task.id`.
  - `Allocation.specialistId` → `Specialist.id`.
  - `OverrideEvent.allocationId` → `Allocation.id`.
  - `AuditEvent.entityId` references the primary key of the entity type indicated by `entityType`.
- **Capacity Limit:** Sum of `Allocation.allocatedHours` for a specialist in a **weekly** time window must be ≤ `Specialist.availabilityHoursPerWeek` unless an `OverrideEvent` exists.
- **Capacity Debt Lifecycle:** When an `OverrideEvent` creates capacity debt, the `capacityDebtAmount` is recorded and must be cleared either by manual reconciliation or automatically after a configurable grace period (default 30 days). The debt is considered resolved when the specialist’s weekly allocated hours fall below the capacity limit.
- **Recovery Floor:** Intensive tasks (duration > 8 hours or fatigue score > 0.8) must be separated by a minimum **24 hour** recovery interval for the same specialist, unless an override is granted.


