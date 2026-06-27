# Security & Privacy Constraints

All data stored in the local SQLite database is encrypted at rest using AES‑256. All client‑server communication (including Server Actions) is protected by TLS 1.3. Users authenticate via an OAuth2 flow that issues signed JWTs; the JWT is verified on each request. Role‑based access control (RBAC) enforces that:

- **PMs** can read/write aggregate task and specialist data but cannot view specialist health‑related fields.
- **Specialists** can only read their own utilization and fatigue information.

Audit events are recorded in an append‑only `audit_log` table with cryptographic hash chaining to make tampering evident. The system also logs security‑relevant actions (login, token refresh, privilege elevation) for compliance review.
