# Recovery Floor Rule

An **intensive task** is defined as any task whose estimated duration exceeds 8 hours **or** whose associated specialist fatigue score (computed as allocatedHours / availabilityHoursPerWeek) would exceed 0.8. For such tasks, the system enforces a **recovery floor** of at least 24 hours between the end of the intensive task and the start of the next allocated task for the same specialist.

The recovery floor rule is evaluated during allocation. If a proposed allocation would violate the floor, the allocation is rejected unless the PM provides an explicit override (see CAP‑4). The rule is logged as an `OverrideEvent` with `reason: "recovery floor violation"`.
