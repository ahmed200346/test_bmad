# Retrospective: Epic 2 - Constraint & Allocation Engine

## Epic Goal
Implement the core logic that prevents over-allocation and enforces dependencies.

## Implementation Summary
- **Story 2.1 (Capacity Calculation):** Implemented weekly window sum calculations.
- **Story 2.2 (Hard Capacity Block):** Enforced 100% weekly availability limit.
- **Story 2.3 (Recovery Floor):** Implemented 24h recharge gap for high-intensity tasks.
- **Story 2.4 (Topological Blocking):** Implemented state transitions (Blocked $\to$ Ready) based on prerequisite completion.
- **Story 2.5 (Override Flow):** Implemented a bypass mechanism for urgent needs with mandatory rationale and "Capacity Debt" tracking.

## AC Verification
- [x] Capacity sums calculated per window.
- [x] Assignments $> 100\%$ are blocked without override.
- [x] Recovery floor prevents back-to-back intensive tasks.
- [x] Tasks remain blocked until prerequisites are complete.
- [x] Overrides capture rationale and record debt.

## Lessons Learned
- Calculating capacity in sliding windows is computationally more expensive than fixed weeks; optimized queries were necessary.
- Override flow required a separate table to ensure auditability of "Capacity Debt".

## Status
**Verified: Done**
