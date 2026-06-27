# UX Specification: OptiTask Resource Orchestrator

## 1. Overview
The **OptiTask Resource Orchestrator** is a local-first tool designed to help Project Managers (PMs) allocate work to specialists while maintaining sustainable workloads. The UX aims to balance professional rigor (constraint enforcement, auditability) with a modern, "friendly" interface that reduces the cognitive load of resource management.

## 2. Visual Identity (Design)

### 2.1 Aesthetic Direction
- **Theme:** Modern, Professional, and Trustworthy.
- **Vibe:** "Calm Productivity" — avoiding high-contrast aggression in favor of a subdued, focused environment.
- **Layout:** Spacious, grid-based, utilizing white space to separate complex data sets (heatmaps, dependency lists).

### 2.2 Color Palette
- **Primary:** Subdued Blue (e.g., Slate Blue or Steel Blue). Used for primary actions, active states, and branding.
- **Secondary:** Clean White / Off-White. Used for backgrounds and primary content areas to maintain a bright, airy feel.
- **Accents:** 
  - **Success/Safe:** Soft Green (for capacity within limits).
  - **Warning/Risk:** Muted Amber (for fatigue alerts/schedule risks).
  - **Critical/Override:** Deep Coral or muted Red (for constraint violations and overrides).
- **Constraint:** No "neon" or overly bright colors; all tones should be professional and easy on the eyes for long-term use.

### 2.3 Typography & Iconography
- **Typography:** Sans-serif, modern typeface (e.g., Inter or Roboto) with clear hierarchical weights for data-heavy screens.
- **Icons:** A consistent, friendly line-art icon set. Icons should be used to categorize functionalities (e.g., a "user" icon for specialists, a "link" icon for dependencies, a "bolt" for overrides).

### 2.4 Imagery
- **Home Page:** High-quality, professional stock photography reflecting "Orchestration," "Collaboration," and "Focus." 
- **Theme:** Images should feature modern workspaces, abstract connections, and professional teamwork, filtered with a subtle blue tint or overlay to match the site's color scheme.

---

## 3. Experience & Architecture

### 3.1 User Personas
| Persona | Goal | Primary Interaction |
| :--- | :--- | :--- |
| **Project Manager (PM)** | Optimize allocation, ensure fairness, mitigate risks. | Aggregate dashboards, allocation tools, constraint overrides. |
| **Specialist** | Understand their workload, track personal fatigue. | Personal utilization heatmaps, task lists, fatigue alerts. |

### 3.2 Information Architecture (IA)

#### 3.2.1 Home Page (The Gateway)
- **Hero Section:** Clear value proposition of OptiTask.
- **Functionality Showcase:** A grid of "feature cards" with icons and brief descriptions:
    - *Resource Management:* Create and manage specialist profiles.
    - *Dependency Mapping:* Define how tasks relate.
    - *Smart Allocation:* Constraint-aware assignment.
    - *Sustainability Tracking:* Fatigue alerts and recovery floors.
    - *Auditability:* Immutable change history.
- **Visuals:** Thematic photos interspersed with feature descriptions.

#### 3.2.2 The PM Dashboard (Command Center)
- **Resource Heatmap:** A visual grid showing all specialists and their current weekly load (Color-coded: Green $\to$ Amber $\to$ Red).
- **Risk Panel:** List of schedule risks (e.g., "Task B depends on Task A which is delayed").
- **Quick Actions:** "Add Specialist," "New Task," "Run Allocation Check."

#### 3.2.3 Allocation Interface
- **Task Selector:** Search and select tasks to assign.
- **Specialist Selector:** Filter specialists by skill/seniority.
- **Validation Engine:** Real-time feedback. If an assignment violates a constraint (e.g., >100% load), the UI prevents the action and provides a "Request Override" button.
- **Override Modal:** A focused dialog requiring the PM to enter the *priority* and *rationale* for the override.

#### 3.2.4 Specialist View
- **Personal Utilization:** A focused view of their own workload over the time window.
- **Fatigue Monitor:** High-visibility alerts when load exceeds 80% or recovery floors are breached.

### 3.3 Key Interaction Flows

#### Flow A: Standard Task Allocation
1. PM selects a Task $\to$ Selects a Specialist.
2. System checks constraints (Capacity, Dependency).
3. **Success:** Assignment saved $\to$ Heatmap updates.
4. **Failure:** UI flags the violation $\to$ PM must either change the specialist or trigger an override.

#### Flow B: Constraint Override (The "Urgent" Path)
1. Constraint violation detected $\to$ PM clicks "Override."
2. Modal opens $\to$ PM enters "High Priority" and "Client Deadline" (Rationale).
3. System logs the override as "Capacity Debt" $\to$ Assignment saved.
4. Audit log updated with an immutable record of the decision.

---

## 4. Technical UX Constraints
- **Local-First Feel:** Instant transitions and optimistic UI updates to reflect the zero-config, local SQLite nature of the app.
- **Role-Based Filtering:** 
    - PMs see the full aggregate view.
    - Specialists are redirected to their personal dashboard upon login.
- **Accessibility:** High contrast for critical alerts (Fatigue/Risk) while maintaining the subdued blue/white palette for general navigation.
