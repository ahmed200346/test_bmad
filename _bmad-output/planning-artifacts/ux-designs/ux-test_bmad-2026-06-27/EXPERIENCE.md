---
status: final
updated: 2026-06-27
sources: [ux-spec.md, SPEC-architect]
---

# EXPERIENCE.md: OptiTask Resource Orchestrator

## Foundation
- **Form-Factor:** Web Application (Desktop optimized for PM Dashboard).
- **UI System:** Custom implementation following the visual identity in `DESIGN.md`.
- **Core Philosophy:** Local-first, zero-config responsiveness. Every interaction should feel instantaneous.

## Information Architecture
The site is structured as a progressive funnel from general value to detailed management.

### 1. Home Page (The Gateway)
- **Hero:** High-level value proposition.
- **Functionality Grid:** Feature cards with line-art icons.
    - *Resource Management* $\to$ Specialist profiles.
    - *Dependency Mapping* $\to$ Task relations.
    - *Smart Allocation* $\to$ Constraint-aware assignment.
    - *Sustainability Tracking* $\to$ Fatigue/Recovery.
    - *Auditability* $\to$ Immutable history.
- **Imagery:** Theme-consistent professional photos with a subtle blue tint.

### 2. PM Dashboard (Command Center)
- **Resource Heatmap:** The central view. Color-coded by `{colors.accent.success}`, `{colors.accent.warning}`, and `{colors.accent.critical}` based on weekly load.
- **Risk Panel:** Real-time listing of schedule slips and dependency violations.
- **Action Bar:** Quick-entry points for adding specialists or tasks.

### 3. Allocation Interface
- **Task & Specialist Selectors:** Searchable filters.
- **Validation Engine:** Immediate visual feedback on constraint status.
- **Override Flow:** A forced-rationale modal for urgent assignments.

### 4. Specialist View
- **Personal Utilization:** Focused view of individual workload.
- **Fatigue Monitor:** High-visibility alerts when load $>$ 80%.

## Voice and Tone
- **Brand Voice:** Professional, Supportive, Objective.
- **Microcopy:** Clear and descriptive. Instead of "Error," use "Constraint Violation: Specialist exceeds 100% capacity."

## Component Patterns
- **Heatmap Cells:** Interactive tiles. Hover reveals a tooltip with exact hours allocated.
- **Feature Cards:** Minimalist container `{components.card}` with a clear call-to-action (CTA) for each functionality.
- **Override Modal:** High-contrast focus mode to emphasize the gravity of creating "capacity debt."

## State Patterns
- **Valid State:** Soft green indicators `{colors.accent.success}` and "Save" button active.
- **Violation State:** Red indicators `{colors.accent.critical}`, "Save" button disabled, "Request Override" button primary.
- **Loading State:** Shimmer effect on data-heavy grids (Heatmaps) to maintain a local-first feel.

## Interaction Primitives
- **Drag-and-Drop:** Future state for task allocation on the heatmap.
- **Real-time Validation:** Constraints are checked on every selection change, not just on save.

## Accessibility Floor
- **Contrast:** High contrast for critical alerts (`{colors.accent.critical}`) against the `{colors.secondary.main}` background.
- **Focus:** Full keyboard navigation for the Allocation Interface.
- **Cues:** Color-coded states are always accompanied by text labels (e.g., "Warning: Fatigue Risk").

## Key Flows

### Flow A: Sustainable Allocation (The Happy Path)
- **Protagonist:** Sarah (PM).
- **Goal:** Assign "API Integration" to "Marcus (Senior Dev)".
- **Journey:** 
    1. Sarah opens the Allocation Interface.
    2. Selects "API Integration" task $\to$ Selects "Marcus".
    3. System validates: Marcus is at 60% load $\to$ **Success**.
    4. Sarah clicks "Save" $\to$ Marcus's cell on the Heatmap updates to 75%.
- **Climax:** A perfectly balanced schedule with no fatigue alerts.

### Flow B: The Urgent Override (The Debt Path)
- **Protagonist:** Sarah (PM).
- **Goal:** Force a critical fix onto an overloaded specialist to meet a client deadline.
- **Journey:**
    1. Sarah selects a task and an overloaded specialist.
    2. System flags a **Constraint Violation** (110% load).
    3. Sarah clicks "Request Override".
    4. Sarah enters rationale: "Critical client bug; fix required by EOD Friday."
    5. System saves assignment and marks it as "Capacity Debt."
- **Climax:** The urgent task is allocated, but the immutable audit log now captures the rationale and the resulting fatigue risk.
