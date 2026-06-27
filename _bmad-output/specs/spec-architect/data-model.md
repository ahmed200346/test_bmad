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

## Key Invariants

- **Task Duration:** `Task.durationHours >= 0.25`.
- **Dependency Order:** `Task.startDate` cannot be before all its prerequisites' `Task.endDate`.
- **Capacity Limit:** Sum of `Allocation.allocatedHours` for a specialist in a time window must be $\le$ `Specialist.availabilityHoursPerWeek` unless an `OverrideEvent` exists.
- **Recovery Floor:** Intensive tasks must be separated by a minimum recovery interval (defined in domain rules).
