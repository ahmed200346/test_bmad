-- Initial Schema
CREATE TABLE IF NOT EXISTS specialists (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  skillTags TEXT,
  seniority TEXT CHECK(seniority IN ('Junior', 'Mid', 'Senior', 'Staff')),
  availabilityHoursPerWeek REAL NOT NULL,
  isActive BOOLEAN DEFAULT 1
);

CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  duration REAL NOT NULL,
  startDate TEXT,
  endDate TEXT,
  status TEXT DEFAULT 'Pending'
);

CREATE TABLE IF NOT EXISTS dependencies (
  parentTaskId INTEGER,
  childTaskId INTEGER,
  PRIMARY KEY (parentTaskId, childTaskId),
  FOREIGN KEY (parentTaskId) REFERENCES tasks(id),
  FOREIGN KEY (childTaskId) REFERENCES tasks(id)
);

CREATE TABLE IF NOT EXISTS allocations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  specialistId INTEGER,
  taskId INTEGER,
  hours REAL NOT NULL,
  windowStart TEXT,
  windowEnd TEXT,
  FOREIGN KEY (specialistId) REFERENCES specialists(id),
  FOREIGN KEY (taskId) REFERENCES tasks(id)
);

CREATE TABLE IF NOT EXISTS capacity_debt (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  allocationId INTEGER,
  priority TEXT,
  rationale TEXT,
  excessHours REAL,
  FOREIGN KEY (allocationId) REFERENCES allocations(id)
);

CREATE TABLE IF NOT EXISTS audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  action TEXT,
  data TEXT,
  hash TEXT,
  previousHash TEXT
);
