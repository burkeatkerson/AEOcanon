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

See `supabase/migrations/0001_init.sql` (`audits`, `leads`; RLS enabled with no
public policies → deny-by-default, service-role only). Apply with
`supabase db push` or via the project's SQL editor.

## Not yet wired

The clients and schema exist, but no feature writes to them yet — lead capture
and audit persistence are built in their respective phases. Required env vars are
in `.env.example` (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
`SUPABASE_SERVICE_ROLE_KEY`).
