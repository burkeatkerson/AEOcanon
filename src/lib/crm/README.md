# `src/lib/crm` — CRM domain layer

Typed helpers over the service-role Supabase client for the admin CRM. Start with
**`ADMIN_CRM.md`** (repo root) for the full model, auth, and authoring runbook.

- `enums.ts` — the closed value sets (single source of truth; also feeds `db/types.ts`).
- `types.ts` — row-type aliases + zod contracts (e.g. `ingestLeadSchema`).
- `contacts.ts` — upsert / get / list / stage. Identity is `lower(email)`.
- `activities.ts` — append-only timeline (`logActivity`, `getTimeline`).
- `notes.ts` — editable admin notes.
- `tags.ts` — get-or-create labels + attach/detach.
- `segments.ts` — static membership + dynamic rule resolver (`resolveSegmentContactIds`).
- `campaigns.ts` — campaign + step lookups shared with the automation engine.
- `ingest.ts` — **`ingestLead()`**, the one entry point every capture path calls
  (upsert + activity + tags + funnel enrollment). Best-effort, non-throwing.
- `actions.ts` — `"use server"` dashboard mutations, each `requireAdmin()`-guarded.

All modules are `server-only` and assume the caller is already authorized (admin
session or a trusted capture path). Auth lives in `src/lib/admin`; sending in
`src/lib/mailer`; the drip/broadcast executor in `src/lib/automation`.
