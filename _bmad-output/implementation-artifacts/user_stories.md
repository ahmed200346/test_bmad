---
status: final
updated: 2026-06-27
sources: [epics.md, ux-spec.md, SPEC-architect]
---

# User Stories: OptiTask Resource Orchestrator

## Epic 1: Foundational Resource & Task Management

### Story 1.1: Specialist Profile Management
**As a** Project Manager,
**I want** to create, edit, and deactivate specialist profiles including their skill tags, seniority, and weekly availability hours,
**So that** I have an accurate inventory of my team's capabilities and capacity.

**Acceptance Criteria:**
- **Given** the Specialist Management view
- **When** I create a new specialist with `name`, `skillTags` (array), `seniority` (enum), and `availabilityHoursPerWeek` (positive number)
- **Then** the specialist is persisted in the SQLite database and retrievable via API.
- **Given** an existing specialist
- **When** I update their seniority or availability
- **Then** the changes are saved and reflected in all current capacity calculations.
- **Given** a specialist is no longer on the project
- **When** I mark them as "Deactivated"
- **Then** they are excluded from new allocation searches but their historical assignments remain in the audit log.

### Story 1.2: Task Definition & Duration Validation
**As a** Project Manager,
**I want** to define tasks with specific durations and start/end date windows,
**So that** I can structure the project timeline and calculate the required effort.

**Acceptance Criteria:**
- **Given** the Task Creation modal
- **When** I enter a task duration less than 0.25 hours
- **Then** the system rejects the input with a validation error: "Task duration must be at least 0.25 hours."
- **Given** a valid duration and name
- **When** I save the task
- **Then** it is persisted as a node in the system's task graph.

### Story 1.3: Task Dependency Linking (DAG)
**As a** Project Manager,
**I want** to link tasks as prerequisites for others,
**So that** the system can enforce a strict execution order and prevent premature starts.

**Acceptance Criteria:**
- **Given** two tasks, Task A and Task B
- **When** I define Task A as a prerequisite for Task B
- **Then** a Finish-to-Start dependency is created.
- **Given** a dependency link
- **When** I attempt to create a circular dependency (e.g., A $\to$ B $\to$ A)
- **Then** the system blocks the action and notifies me: "Circular dependencies are not permitted."

### Story 1.4: Basic Resource Filtering
**As a** Project Manager,
**I want** to filter the specialist list by skill, seniority, and availability,
**So that** I can quickly identify the best-fit resource for a specific task.

**Acceptance Criteria:**
- **Given** the specialist directory
- **When** I select the "Senior" seniority filter and "TypeScript" skill tag
- **Then** only specialists matching both criteria are displayed.
- **Given** a date window
- **When** I filter by "Available"
- **Then** the list updates to show only those whose current load is $< 100\%$ for that window.

---

## Epic 2: Constraint & Allocation Engine

### Story 2.1: Time-Window Capacity Calculation
**As a** System Engine,
**I want** to calculate the sum of all allocated hours for a specialist within any specific weekly window,
**So that** the system can determine if a resource is over-allocated.

**Acceptance Criteria:**
- **Given** a specialist and a defined week (e.g., June 23-29)
- **When** the system queries the allocation table
- **Then** it returns the exact sum of all `allocatedHours` for that specialist in that window.

### Story 2.2: Hard Capacity Block (100% Limit)
**As a** Project Manager,
**I want** the system to block any assignment that would push a specialist's total load beyond 100% of their weekly availability,
**So that** I can guarantee a sustainable workload and prevent burnout.

**Acceptance Criteria:**
- **Given** a specialist with 40h/week availability and 38h already assigned
- **When** I attempt to assign a new 4h task
- **Then** the "Save" button is disabled and a violation warning appears: "Capacity Exceeded: This assignment would push the specialist to 105%."

### Story 2.3: Recovery Floor Enforcement
**As a** Specialist,
**I want** the system to enforce a minimum recharge time (Recovery Floor) between high-intensity tasks,
**So that** I can maintain high quality of work and avoid mental fatigue.

**Acceptance Criteria:**
- **Given** a task flagged as "High Intensity" (> 8 hours)
- **When** a PM attempts to schedule another intensive task within 24 hours of its completion
- **Then** the system blocks the assignment with the error: "Recovery Floor Violation: Specialist requires a minimum recharge period after intensive tasks."

### Story 2.4: Topological Dependency Blocking
**As a** System Engine,
**I want** to keep a task in a "Blocked" state until all its defined prerequisites are marked "Complete,"
**So that** work doesn't start on tasks that cannot be finished.

**Acceptance Criteria:**
- **Given** Task B depends on Task A
- **When** Task A is "In Progress" or "Pending"
- **Then** Task B is visually marked as "Blocked" and cannot be assigned to a specialist.
- **When** Task A is marked "Complete"
- **Then** Task B transitions to "Ready" and is available for allocation.

### Story 2.5: Constraint Override Flow & Capacity Debt
**As a** Project Manager,
**I want** the ability to force an assignment that violates capacity or dependency rules for urgent needs,
**So that** the project can handle emergencies while still tracking the resulting "Capacity Debt."

**Acceptance Criteria:**
- **Given** a capacity violation (e.g., 110% load)
- **When** I click "Request Override"
- **Then** a modal appears requiring a "Priority Level" and a "Rationale" (text).
- **When** I submit the override
- **Then** the assignment is committed, and a record is added to the `capacity_debt` table capturing the excess hours and the rationale.

---

## Epic 3: Intelligence & Visualization (The Dashboard)

### Story 3.1: PM Resource Heatmap (Aggregate View)
**As a** Project Manager,
**I want** a high-level grid visualization of all specialists' workloads across the current time window,
**So that** I can identify at a glance who is overloaded and who has spare capacity.

**Acceptance Criteria:**
- **Given** the PM Dashboard
- **When** I view the Heatmap
- **Then** each specialist is represented by a cell color-coded as:
  - **Green:** $< 80\%$ load
  - **Amber:** $80\% \to 100\%$ load
  - **Red:** $> 100\%$ (Override active)
- **When** I hover over a cell
- **Then** a tooltip displays the exact hours assigned vs availability.

### Story 3.2: Specialist Personal Heatmap (Privacy Wall)
**As a** Specialist,
**I want** to see my own detailed utilization and fatigue projections, but keep this view private from other specialists,
**So that** I can manage my own health and advocate for recharge without fear of surveillance.

**Acceptance Criteria:**
- **Given** I am logged in as a Specialist
- **When** I access the "My Load" view
- **Then** I see a detailed hourly breakdown of my assignments.
- **Given** another Specialist is logged in
- **When** they attempt to access my detailed heatmap via URL
- **Then** the system returns a 403 Forbidden error.

### Story 3.3: Schedule Risk Detection (Slippage)
**As a** Project Manager,
**I want** the system to automatically flag "Schedule Risks" when a prerequisite task's end date slips beyond the start date of its dependent task,
**So that** I can proactively adjust the schedule before the project is delayed.

**Acceptance Criteria:**
- **Given** Task A $\to$ Task B dependency
- **When** Task A's `endDate` is updated to be after Task B's `startDate`
- **Then** Task B is highlighted in the Risk Panel with a "Slippage" warning.

### Story 3.4: Fatigue Alerting & Burn Rate Monitoring
**As a** Specialist,
**I want** a proactive alert when my burn rate suggests a high probability of fatigue,
**So that** I can notify the PM and adjust the workload before burnout occurs.

**Acceptance Criteria:**
- **Given** my weekly load is $> 80\%$ for two consecutive weeks
- **When** I log into the dashboard
- **Then** a high-visibility "Fatigue Warning" alert is displayed.

### Story 3.5: Home Page & Functionality Showcase
**As a** User,
**I want** a modern, professional landing page that describes the la-first nature and core capabilities of OptiTask,
**So that** I can understand the tool's value and navigate to the appropriate dashboard.

**Acceptance Criteria:**
- **Given** the root URL
- **When** the page loads
- **Then** I see the "Calm Productivity" aesthetic (subdued blue/white palette).
- **Then** I see a grid of feature cards with line-art icons for: *Resource Management, Dependency Mapping, Smart Allocation, Sustainability, and Auditability*.
- **Then** professional stock imagery with blue tint overlays is displayed.

---

## Epic 4: Security, Privacy & Integrity

### Story 4.1: AES-256 Encryption at Rest
**As a** System Administrator,
**I want** the local SQLite database to be encrypted using AES-256,
**So that** sensitive resource and capacity data is protected from unauthorized local access.

**Acceptance Criteria:**
- **Given** the application is installed
- **When** the database is initialized
- **Then** all data written to the `.db` file is encrypted at rest.
- **When** an unauthorized user attempts to read the `.db` file with a standard SQLite browser
- **Then** the data appears as ciphertext.

### Story 4.2: JWT-based OAuth2 Authentication
**As a** User,
**I want** to authenticate via a secure JWT-based flow,
**So that** my identity is verified before I can access the resource orchestrator.

**Acceptance Criteria:**
- **Given** the login page
- **When** I enter valid credentials
- **Then** the system issues a signed JWT.
- **When** I make a request to a Server Action
- **Then** the system validates the JWT in the header before processing the request.

### Story 4.3: Role-Based Data Access Boundaries (RBAC)
**As a** System Engine,
**I want** to enforce strict data boundaries between Project Managers and Specialists,
**So that** privacy is maintained and specialists only see their own detailed data.

**Acceptance Criteria:**
- **Given** a request for aggregate specialist data
- **When** the user role is `SPECIALIST`
- **Then** the system returns a 403 Forbidden or filters the result to only include the requester's data.
- **When** the user role is `PM`
- **Then** the system allows access to the aggregate heatmap and all specialist profiles.

### Story 4.4: Tamper-Evident Cryptographic Audit Log
**As a** Auditor,
**I want** every change to a resource allocation to be written to an immutable log using cryptographic hash chaining,
**So that** I can verify that no records have been altered after the fact.

**Acceptance Criteria:**
- **Given** an allocation change
- **When** the system saves the change
- **Then** a new entry is appended to the `audit_log` table.
- **Then** the entry's hash is calculated as `hash(current_data + previous_entry_hash)`.
- **When** a record in the middle of the log is modified
- **Then** the chain is broken, and a "Log Integrity Violation" is flagged during the next audit check.

### Story 4.5: TLS 1.3 Enforcement for Server Actions
**As a** Security Officer,
**I want** all communication between the client and the server to be encrypted via TLS 1.3,
**So that** data in transit is protected from eavesdropping.

**Acceptance Criteria:**
- **Given** a request to a Next.js Server Action
- **When** the connection is attempted over HTTP or an older TLS version
- **Then** the server rejects the connection and enforces a TLS 1.3 upgrade.

---

## Epic 5: Technical Hardening & Performance

### Story 5.1: Performance Benchmark Suite (Latency/Render)
**As a** Developer,
**I want** an automated suite that measures constraint check latency and dashboard render time,
**So that** I can ensure the system remains responsive as data scales.

**Acceptance Criteria:**
- **Given** the benchmark tool
- **When** I run the "Constraint Latency" test
- **Then** the average execution time for a standard allocation check must be $< 100\text{ms}$.
- **When** I run the "Dashboard Render" test
- **Then** the time to first meaningful paint for a medium data set must be $< 2\text{s}$.

### Story 5.2: Database Migration & Versioning System
**As a** Developer,
**I want** a structured migration runner to manage SQLite schema changes,
**So that** updates can be deployed to local environments without data loss.

**Acceptance Criteria:**
- **Given** a new migration script `002_add_fatigue_column.sql`
- **When** the application starts
- **Then** the system detects the pending migration and applies it to the local database.
- **Then** the `schema_version` table is updated to the new version.

### Story 5.3: Automated Allocation Scenario Testing (1k cases)
**As a** QA Engineer,
**I want** to run 1,000 simulated allocation scenarios through the engine,
**So that** I can verify that the constraint logic is robust and the override rate is $\le 5\%$.

**Acceptance Criteria:**
- **Given** a set of 1,000 random allocation requests
- **When** the test suite is executed
- **Then** all valid requests (within capacity) are processed without a block.
- **Then** all invalid requests are correctly blocked unless an override is provided.

### Story 5.4: CI Pipeline Integration
**As a** Developer,
**I want** the performance benchmarks and verification tests to run on every push to the main branch,
**So that** regressions are caught immediately.

**Acceptance Criteria:**
- **Given** a git push to `master`
- **When** the CI pipeline triggers
- **Then** the "Verification Plan" and "Performance Suite" are executed.
- **Then** the build is marked as "Failed" if any constraint check exceeds $100\text{ms}$ or any test fails.
