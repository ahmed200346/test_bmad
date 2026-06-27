# Migration & Versioning Strategy

All schema changes to the SQLite database are managed by the built‑in `Migration Runner`. Migrations are versioned as sequential integers (`001_initial.sql`, `002_add_override_event.sql`, …) stored in the `migrations/` folder at the project root.

- **Versioning:** Each migration file includes a `-- version: X` comment and a checksum.
- **Ordering:** Migrations are applied in ascending order; the current schema version is stored in the `meta` table.
- **Rollback:** For each forward migration, a corresponding down‑migration (`down_002_add_override_event.sql`) is provided. Rollbacks are only allowed on unreleased versions; production rollbacks must be performed via a manual data migration plan.

The migration process is automated in CI: on each successful build, the CI job runs `npm run migrate` which applies pending migrations on a fresh test database and validates that the schema matches the expected version. Any migration failure aborts the deployment.
