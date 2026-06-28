-- Add Users table for Auth and RBAC
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT CHECK(role IN ('PM', 'SPECIALIST')) NOT NULL,
  specialistId INTEGER,
  FOREIGN KEY (specialistId) REFERENCES specialists(id)
);

-- Seed an admin PM and a specialist
INSERT OR IGNORE INTO users (username, password_hash, role) VALUES ('admin', 'hashed_password_123', 'PM');
INSERT OR IGNORE INTO users (username, password_hash, role, specialistId) VALUES ('marcus', 'hashed_password_456', 'SPECIALIST', 1);
