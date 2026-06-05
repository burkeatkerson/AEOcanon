-- Audit tool application data. Kept entirely separate from MDX content (which
-- is the git-versioned source of truth). Apply with the Supabase CLI:
--   supabase db push
-- or paste into the SQL editor of your project.

create extension if not exists "pgcrypto";

-- A completed website audit and its normalized result.
create table if not exists public.audits (
  id             uuid primary key default gen_random_uuid(),
  url            text not null,            -- URL as submitted
  normalized_url text not null,            -- canonicalized URL actually fetched
  scores         jsonb,                    -- AuditScores (see src/lib/audit/types.ts)
  report         jsonb,                    -- full AuditReport
  platform       text,                     -- detected CMS/platform, if any
  created_at     timestamptz not null default now()
);

create index if not exists audits_created_at_idx on public.audits (created_at desc);

-- A captured lead, optionally linked to the audit that produced it.
create table if not exists public.leads (
  id          uuid primary key default gen_random_uuid(),
  email       text not null,
  site_url    text,
  audit_id    uuid references public.audits (id) on delete set null,
  intent      text,                        -- detected/declared intent
  details     jsonb,                       -- personalization answers
  booked      boolean not null default false,
  created_at  timestamptz not null default now()
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_audit_id_idx on public.leads (audit_id);

-- Deny-by-default: enable RLS and add NO policies for anon/authenticated, so
-- only the service-role key (used server-side) can read/write. Public access to
-- these tables only ever happens through trusted server code.
alter table public.audits enable row level security;
alter table public.leads  enable row level security;
