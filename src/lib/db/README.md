# `src/lib/db` — application data (Supabase)

This directory holds **application data** access, kept strictly separate from
content:

- **Content** (articles, paths, verticals, authors) lives in MDX under
  `content/`, is the single source of truth, and is queried through
  `src/lib/content.ts`. It is version-controlled and built statically by Velite.
  **It never touches a database.**
- **Application data** — audit results and captured leads (and any future
  account/progress features) — lives in **Supabase**. All access goes through
  this module.

## Layout

- `supabase/server.ts` — `server-only`.
  - `createServiceClient()` — service-role, bypasses RLS, for trusted server
    writes (storing audits/leads). Never import into client code.
  - `createSupabaseServerClient()` — request-scoped SSR client (anon key) for
    future user-scoped reads under RLS.
- `supabase/client.ts` — `createSupabaseBrowserClient()` for client components.
- `types.ts` — `Database` types matching the migration (regenerate with
  `npm run db:types` once a project id is set).

## Schema

Migrations (apply with `supabase db push` or the project's SQL editor). All
tables have RLS enabled with no public policies → deny-by-default, service-role
only:

- `0001_init.sql` — `audits`, `leads`.
- `0002_scorecard.sql` / `0003_scorecard_branch.sql` — `scorecard_submissions`
  + the public `playbooks` storage bucket.
- `0004_crm.sql` — the **admin CRM + email automation** tables (`contacts`, `tags`,
  `segments`, `activities`, `notes`, `email_templates`, `campaigns`,
  `campaign_steps`, `enrollments`, `email_sends`, `suppressions`). See
  **`ADMIN_CRM.md`** (repo root) for the model, invariants, and runbook.
- `0005_crm_seed.sql` — idempotent starter data (funnel campaigns, segments, tags,
  templates).

`types.ts` hand-mirrors all of the above; the CRM enum unions come from
`src/lib/crm/enums.ts` so the typed client and app logic never drift.

## Who writes to the DB

- **Scorecard** (`src/lib/scorecard/actions.ts`) → `scorecard_submissions` +
  CRM ingest.
- **Contact form** (`src/app/(marketing)/contact/actions.ts`) → CRM ingest.
- **CRM / automation** (`src/lib/crm`, `src/lib/mailer`, `src/lib/automation`) →
  all `0004`/`0005` tables, via the service client behind the admin session or the
  cron secret.

Required env vars are in `.env.example` (`NEXT_PUBLIC_SUPABASE_URL`,
`NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`; admin/automation vars
documented in `ADMIN_CRM.md`).
