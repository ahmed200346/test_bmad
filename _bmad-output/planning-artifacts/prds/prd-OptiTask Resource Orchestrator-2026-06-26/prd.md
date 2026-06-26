---
title: OptiTask Resource Orchestrator
status: draft
created: 2026-06-26
updated: 2026-06-26
---

# Product Requirements Document: OptiTask Resource Orchestrator

## 1. Executive Summary
OptiTask is a specialized **Capacity Engine** designed for professional services to solve the chronic problem of resource over-allocation and prerequisite failures. Unlike traditional project management tools that act as passive "digital lists," OptiTask actively enforces operational constraints to prevent burnout and schedule slips. 

The system treats human time as a finite, non-linear resource and utilizes a topological task-graph to ensure a strict, risk-aware execution order.

## 2. Goals & Objectives
### 2.1 Primary Objective
To provide a zero-config, local-first resource orchestration tool that guarantees no specialist is booked beyond 100% of their available capacity and no task starts before its prerequisites are met.

## 3. Target Personas
| Persona | Role | Key Need |
| :--- | :--- | :--- |
| **Project Manager (PM)** | Orchestrator | Needs to assign resources without causing burnout or violating dependencies. |
| **Specialist** | Executor | Needs visibility into their own load to manage fatigue and advocate for recharge. |
| **Auditor** | Overseer | Needs a tamper-proof record of how resources were allocated over time. |

## 4. User Journeys (Simplified)
### 4.1 The "Safe Assign" Flow
*PM $\rightarrow$ Selects Specialist $\rightarrow$ Assigns Task $\rightarrow$ Engine checks current total load $\rightarrow$ If $< 100\%$, assignment is committed; else, system blocks and suggests alternatives.*

### 4.2 The "Emergency Override" Flow
*PM $\rightarrow$ Identifies high-priority emergency $\rightarrow$ Forces assignment $> 100\%$ $\rightarrow$ Engine grants override but logs "Capacity Debt" and flags the resource as "High Risk" in the utilization heatmap.*

### 4.3 The "Dependency Watch" Flow
*Specialist $\rightarrow$ Completes Task A $\rightarrow$ Engine triggers "Ready" status for Task B $\rightarrow$ PM receives notification that the dependency wall has been removed.*

## 5. Functional Requirements

### 5.1 Pillar 1: Constraint-Based Allocation
| ID | Requirement | Priority | Note |
| :--- | :--- | :--- | :--- |
| **FR-1.1** | The system shall calculate total capacity load per specialist within any given time window. | P0 | Core Engine |
| **FR-1.2** | The system shall block any assignment that results in a specialist's load exceeding 100%. | P0 | Hard Constraint |
| **FR-1.3** | The system shall enforce a "Recovery Floor" (min. recharge time) between intensive tasks. | P1 | Psychology-driven |
| **FR-1.4** | The system shall allow PMs to override capacity blocks for high-priority tasks. | P1 | Expert Override |
| **FR-1.5** | Every override must be linked to a priority level and recorded as "Capacity Debt." | P2 | Accountability |

### 5.2 Pillar 2: Topological Dependency Management
| ID | Requirement | Priority | Note |
| :--- | :--- | :--- | :--- |
| **FR-2.1** | Tasks shall be organized in a Directed Acyclic Graph (DAG) to define execution order. | P0 | Core Logic |
| **FR-2.2** | A task shall be marked as "Blocked" until all defined prerequisites are marked "Complete." | P0 | Hard Constraint |
| **FR-2.3** | The system shall flag "Schedule Risks" if a prerequisite task's completion date is pushed beyond the start date of the dependent task. | P1 | Risk Intelligence |
| **FR-2.4** | The system shall support "Fluid Dependencies," allowing partial resource shifting between overlapping tasks. | P2 | Optimization |

### 5.3 Pillar 3: Utilization Intelligence (Personal Health Shield)
| ID | Requirement | Priority | Note |
| :--- | :--- | :--- | :--- |
| **FR-3.1** | The system shall generate real-time Heatmaps of specialist utilization. | P0 | Visualization |
| **FR-3.2** | **Privacy Wall:** Detailed heatmaps shall be visible only to the assigned specialist. | P0 | Anti-Surveillance |
| **FR-3.3** | The PM shall see a simplified "Status" (Available / At Capacity / Overloaded) for each specialist. | P0 | Management View |
| **FR-3.4** | The system shall alert specialists when their burn rate suggests a high probability of fatigue. | P2 | Proactive Health |

### 5.4 Pillar 4: Enterprise-Grade Data Management
| ID | Requirement | Priority | Note |
| :--- | :--- | :--- | :--- |
| **FR-4.1** | The system shall provide CRUD operations for Specialists, Tasks, and Allocations. | P0 | Basic Ops |
| **FR-4.2** | Users shall be able to filter resources by skill, seniority, and availability. | P1 | Searchability |
| **FR-4.3** | Every change to a resource allocation must be written to an immutable audit log. | P0 | Integrity |
| **FR-4.4** | All task durations must be strictly positive (minimum 0.25 hours). | P0 | Input Validation |

## 6. Non-Functional Requirements (NFRs)
| Category | Requirement | Target |
| :--- | :--- | :--- |
| **Architecture** | Framework | Next.js (App Router) with Server Actions |
| **Storage** | Persistence | Local SQLite file (Zero-config portability) |
| **UI/UX** | Aesthetic | "High-end Enterprise" using Tailwind CSS & Lucide Icons |
| **Logic** | Implementation | Pure TypeScript; No AI/ML dependencies |
| **Performance** | Responsiveness | Constraint checks should execute in $< 100ms$ |

## 7. Constraints & Out-of-Scope
- **No Multi-user Auth:** The system assumes a single-tenant local environment; complex OAuth/JWT flows are currently out of scope.
- **No Real-time Sync:** No WebSockets; standard Server Action revalidation is utilized for state updates.
- **No Automatic Scheduling:** The engine *prevents* bad assignments but does not *automatically* suggest the "optimal" schedule (that is the PM's job).
- **No External Integrations:** No Jira/Trello API integration; all data is managed internally via SQLite.
