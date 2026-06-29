-- Demo seed data for manual testing and E2E scenarios

INSERT OR IGNORE INTO specialists (id, name, skillTags, seniority, availabilityHoursPerWeek, isActive)
VALUES (1, 'Marcus Chen', '["TypeScript","React","Architecture"]', 'Senior', 40, 1);

INSERT OR IGNORE INTO specialists (id, name, skillTags, seniority, availabilityHoursPerWeek, isActive)
VALUES (2, 'Elena Park', '["Next.js","Node.js"]', 'Senior', 40, 1);

INSERT OR IGNORE INTO tasks (id, name, duration, startDate, endDate, status) VALUES
(1, 'Platform Migration', 50, '2026-07-01', '2026-07-15', 'Pending'),
(2, 'API Integration', 8, '2026-06-20', '2026-07-15', 'Pending'),
(3, 'Dashboard Redesign', 16, '2026-07-10', '2026-07-20', 'Pending');

-- Slippage risk: parent ends after child starts (task 2 ends 2026-07-15, task 3 starts 2026-07-10)
INSERT OR IGNORE INTO dependencies (parentTaskId, childTaskId) VALUES (2, 3);

-- Existing chain for circular-dependency manual testing (A -> B; adding B -> A triggers cycle)
INSERT OR IGNORE INTO dependencies (parentTaskId, childTaskId) VALUES (1, 2);
