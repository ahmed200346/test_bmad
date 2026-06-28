# Error Report: app/actions/risks.ts

## Logical: Incorrect Load Calculation
**Location:** Lines 201-207
**Issue:** The query `SELECT SUM(hours) FROM allocations WHERE specialistId = s.id` calculates the total hours allocated across the entire project history, not the current weekly window.
**Consequence:** Specialists will be flagged as "Overloaded" as soon as their lifetime hours exceed their weekly capacity, leading to false-positive risks.
