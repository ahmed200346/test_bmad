# Retrospective: Epic 4 - Security, Privacy & Integrity

## Epic Goal
Secure the local-first environment and ensure the auditability of all resource decisions.

## Implementation Summary
- **Story 4.1 (Encryption at Rest):** Integrated AES-256 encryption for the SQLite database.
- **Story 4.2 (JWT OAuth2):** Implemented secure signed JWT flow for authentication.
- **Story 4.3 (RBAC):** Enforced role-based data boundaries between PM and Specialist.
- **Story 4.4 (Cryptographic Audit Log):** Implemented hash-chaining for immutable audit records.
- **Story 4.5 (TLS 1.3):** Enforced TLS 1.3 for all server communication.

## AC Verification
- [x] Database is ciphertext when read externally.
- [x] JWTs are validated for every server action.
- [x] Specialists cannot access aggregate PM data.
- [x] Audit log chain breaks if any middle record is altered.
- [x] Non-TLS 1.3 connections are rejected.

## Lessons Learned
- Hash chaining for audit logs requires a strictly sequential write process to avoid race conditions.
- RBAC logic should be centralized in a middleware layer for consistency.

## Status
**Verified: Done**
