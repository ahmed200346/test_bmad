---
status: final
updated: 2026-06-27
inputDocuments: 
  - /home/sigma/Desktop/bmad_test/test_bmad/_bmad-output/planning-artifacts/prds/prd-OptiTask Resource Orchestrator-2026-06-26/prd.md
  - /home/sigma/Desktop/bmad_test/test_bmad/_bmad-output/specs/spec-architect/SPEC.md
  - /home/sigma/Desktop/bmad_test/test_bmad/_bmad-output/planning-artifacts/ux-designs/ux-test_bmad-2026-06-27/DESIGN.md
  - /home/sigma/Desktop/bmad_test/test_bmad/_bmad-output/planning-artifacts/ux-designs/ux-test_bmad-2026-06-27/EXPERIENCE.md
  - /home/sigma/Desktop/bmad_test/test_bmad/_bmad-output/specs/spec-ux/ux-spec.md
  - /home/sigma/Desktop/bmad_test/test_bmad/_bmad-output/implementation-artifacts/tasks.md
---

# OptiTask Resource Orchestrator - Epic Breakdown

## Overview
This document decomposes the requirements for the OptiTask Resource Orchestrator into high-level epics. Each epic represents a significant block of user value and technical capability.

## Requirements Inventory

### Functional Requirements
FR1: Calculate total capacity load per specialist within any given time window.
FR2: Block any assignment that results in a specialist's load exceeding 100%.
FR3: Enforce a "Recovery Floor" (min. recharge time) between intensive tasks.
FR4: Allow PMs to override capacity blocks for high-priority tasks.
FR5: Link overrides to a priority level and record as "Capacity Debt."
FR6: Organize tasks in a Directed Acyclic Graph (DAG) to define execution order.
FR7: Mark tasks as "Blocked" until all prerequisites are marked "Complete."
FR8: Flag "Schedule Risks" if a prerequisite task's completion date is pushed beyond the start date of the dependent task.
FR9: Support "Fluid Dependencies" for partial resource shifting.
FR10: Generate real-time Heatmaps of specialist utilization.
FR11: Detailed heatmaps visible only to the assigned specialist (Privacy Wall).
FR12: Simplified "Status" (Available/At Capacity/Overloaded) for PMs.
FR13: Alert specialists when burn rate suggests high probability of fatigue.
FR14: CRUD operations for Specialists, Tasks, and Allocations.
FR15: Filter resources by skill, seniority, and availability.
FR16: Immutable audit log for all resource allocation changes.
FR17: All task durations must be strictly positive (minimum 0.25 hours).

### NonFunctional Requirements
NFR1: Next.js (App Router) with Server Actions.
NFR2: Local SQLite persistence.
NFR3: Aesthetic "High-end Enterprise" using Tailwind CSS & Lucide Icons.
NFR4: Pure TypeScript implementation.
NFR5: Constraint checks execute in < 100ms.
NFR6: Dashboard render in < 2s.

### Additional Requirements
- AES-256 encryption at rest for SQLite database.
- TLS 1.3 for all Server Actions.
- JWT-based OAuth2 authentication.
- Role-aware data boundaries (PMs see aggregate, Specialists see personal).
- Tamper-evident audit logs with cryptographic hash chaining.
- Constraint evaluation verified on reference machine (Intel i7-12700K, 16GB RAM).

### UX Design Requirements
UX-DR1: Implementation of "Calm Productivity" aesthetic (subdued blue/white palette).
UX-DR2: Home Page with hero section and functionality showcase grid.
UX-DR3: Resource Heatmap grid (Color-coded: Green $\to$ Amber $\to$ Red).
UX-DR4: Risk Panel for schedule slips and dependency violations.
UX-DR5: Allocation interface with real-time validation and "Request Override" modal.
UX-DR6: Specialist view with a personal fatigue monitor.
UX-DR7: Responsive design for desktop (PM Dashboard).
UX-DR8: Role-based redirection (Specialists $\to$ Personal Dashboard).
UX-DR9: Accessibility: high contrast for alerts, keyboard navigation for allocation.
UX-DR10: Professional stock imagery with blue tint overlays.

---

## Epic List

### Epic 1: Foundational Resource & Task Management
**Goal:** Establish the core data models and basic CRUD operations for specialists and tasks.
- **Stories:**
  - Story 1.1: Specialist Profile Management
  - Story 1.2: Task Definition & Duration Validation
  - Story 1.3: Task Dependency Linking (DAG)
  - Story 1.4: Basic Resource Filtering

### Epic 2: Constraint & Allocation Engine
**Goal:** Implement the core logic that prevents over-allocation and enforces dependencies.
- **Stories:**
  - Story 2.1: Time-Window Capacity Calculation
  - Story 2.2: Hard Capacity Block (100% Limit)
  - Story 2.3: Recovery Floor Enforcement
  - Story 2.4: Topological Dependency Blocking
  - Story 2.5: Constraint Override Flow & Capacity Debt

### Epic 3: Intelligence & Visualization (The Dashboard)
**Goal:** Transform raw constraint data into actionable insights for PMs and Specialists.
- **Stories:**
  - Story 3.1: PM Resource Heatmap (Aggregate View)
  - Story 3.2: Specialist Personal Heatmap (Privacy Wall)
  - Story 3.3: Schedule Risk Detection (Slippage)
  - Story 3.4: Fatigue Alerting & Burn Rate Monitoring
  - Story 3.5: Home Page & Functionality Showcase

### Epic 4: Security, Privacy & Integrity
**Goal:** Secure the local-first environment and ensure the auditability of all resource decisions.
- **Stories:**
  - Story 4.1: AES-256 Encryption at Rest
  - Story 4.2: JWT-based OAuth2 Authentication
  - Story 4.3: Role-Based Data Access Boundaries (RBAC)
  - Story 4.4: Tamper-Evident Cryptographic Audit Log
  - Story 4.5: TLS 1.3 Enforcement for Server Actions

### Epic 5: Technical Hardening & Performance
**Goal:** Ensure the system meets strict performance targets and is reliably deployable.
- **Stories:**
  - Story 5.1: Performance Benchmark Suite (Latency/Render)
  - Story 5.2: Database Migration & Versioning System
  - Story 5.3: Automated Allocation Scenario Testing (1k cases)
  - Story 5.4: CI Pipeline Integration
