# Architecture & System Layout — OptiTask Resource Orchestrator

## Conceptual Layer Cake

```mermaid
graph TD
    subgraph UI_Layer [UI Layer]
        Dashboard[PM Dashboard]
        SpecialistView[Specialist Health View]
        TaskPlanner[Task Planner/DAG]
        AdminView[Administration View]
    end

    subgraph App_Layer [Application Layer]
        Orchestration[CRUD Orchestration]
        RoleFilter[Role-Aware View Filter]
        Validation[Zod Input Validation]
    end

    subgraph Domain_Layer [Domain Layer - Pure TS]
        CapacityEngine[Capacity Engine]
        DependencyEngine[Dependency Engine]
        OverridePolicy[Override Policy]
        RiskIntel[Risk Intelligence]
    end

    subgraph Data_Layer [Data Layer]
        Repository[Typed Repositories]
        SQLite[(Local SQLite DB)]
        Migrations[Migration Runner]
    end

    UI_Layer --> App_Layer
    App_Layer --> Domain_Layer
    App_Layer --> Data_Layer
    Domain_Layer --> Data_Layer
```

## Module Boundaries

### Core Domain Modules
- **Specialist Management:** CRUD for specialist profiles and availability.
- **Task Management:** CRUD for tasks and DAG dependency links.
- **Allocation Management:** Logic for assigning specialists to tasks and validating against constraints.
- **Override Management:** Process for documenting and tracking capacity debt.
- **Audit & Monitoring:** Append-only event store for all state changes.

### Intelligence & Privacy Modules
- **Personal Health Shield:** Generates utilization heatmaps and fatigue alerts for specialists.
- **Risk Intelligence:** Analyzes the DAG for schedule drift and critical path risks.
- **Privacy Boundary:** Enforces data filtering based on the role (PM, Specialist, Auditor) at the service level.
