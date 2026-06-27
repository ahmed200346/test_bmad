---
status: final
updated: 2026-06-27
colors:
  primary:
    main: "#4A6D8C" # Slate Blue - Subdued and professional
    light: "#A3B8C8"
    dark: "#2C425A"
  secondary:
    main: "#F8FAFC" # Off-White - Clean and airy
    light: "#FFFFFF"
    dark: "#E2E8F0"
  accent:
    success: "#86EFAC" # Soft Green
    warning: "#FDE68A" # Muted Amber
    critical: "#FCA5A5" # Deep Coral/Muted Red
typography:
  main: "Inter, sans-serif"
  heading: "Inter, sans-serif"
rounded:
  interactive: "8px"
  container: "12px"
spacing:
  base: "4px"
  container: "24px"
components:
  card: "rounded-container, white-bg, subtle-border"
  button: "rounded-interactive, primary-main, white-text"
---

# DESIGN.md: OptiTask Resource Orchestrator

## Brand & Style
The visual identity centers on **"Calm Productivity."** The goal is to provide a professional, high-trust environment that minimizes stress during complex resource orchestration. The aesthetic is modern, minimal, and focused, using generous white space to prevent data-overload in dashboards.

## Colors
Visual communication relies on a subdued palette to avoid cognitive fatigue.
- **Core:** `{colors.primary.main}` defines the brand's professional authority.
- **Canvas:** `{colors.secondary.main}` provides a breathable background for high-density data.
- **Semantic Indicators:**
  - **Safe Capacity:** `{colors.accent.success}`
  - **Fatigue Risk:** `{colors.accent.warning}`
  - **Constraint Breach:** `{colors.accent.critical}`

## Typography
A clean, geometric sans-serif (Inter) is used across the system.
- **Hierarchy:** High contrast between headings and body text is achieved through weight and scale rather than color, ensuring a professional look.
- **Data Display:** Tabular data uses a medium-weight mono-spaced variant for alignment and readability in heatmaps.

## Layout & Spacing
- **Grid:** A flexible 12-column grid for the PM Dashboard.
- **Breathability:** `{spacing.container}` padding is used around primary sections to separate the Resource Heatmap from the Risk Panel.

## Elevation & Depth
- **Flatness:** The design avoids heavy shadows, preferring subtle 1px borders (`{colors.secondary.dark}`) and white-on-off-white layering to create a clean, "sheet" based interface.

## Shapes
- **Softened Corners:** All interactive elements use `{rounded.interactive}` and containers use `{rounded.container}` to maintain a friendly, modern feel.

## Components
- **Feature Cards:** Used on the home page; `{components.card}` with line-art icons.
- **Resource Heatmap Cells:** Color-filled rectangles that transition from `{colors.accent.success}` to `{colors.accent.critical}`.
- **Override Modal:** A centered, high-focus container with a distinct `{colors.primary.main}` header.

## Do's and Don'ts
- **Do:** Use a subtle blue overlay on professional stock photography.
- **Do:** Use friendly line-art icons to categorize functionality.
- **Don't:** Use neon or high-saturation colors.
- **Don't:** Overcrowd the screen; prioritize white space over data density.
