-- 8-Pillar AEO Scorecard: lead capture + the public bucket the matched playbook
-- PDFs are served from. Apply with the Supabase CLI:
--   supabase db push
-- or paste into the SQL editor of your project.

-- Closed enums so the drip campaign branches on clean values, never free text.
do $$ begin
  create type public.scorecard_tier as enum (
    'The Answer', 'Emerging', 'At Risk', 'Invisible'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.playbook_segment as enum (
    -- eight single-pillar playbooks (cascade / tie-break order)
    'access', 'alignment', 'extractability', 'authority',
    'credibility', 'originality', 'freshness', 'adaptability',
    -- two tier overlays
    'foundations', 'hold-your-lead'
  );
exception when duplicate_object then null; end $$;

-- One tidy row per completed scorecard.
create table if not exists public.scorecard_submissions (
  id            uuid primary key default gen_random_uuid(),
  email         text not null,
  business_name text,
  website       text,
  answers       jsonb not null,                  -- 8 selected option indices (0–3)
  pillar_scores jsonb not null,                  -- { access: 0–3, ... }
  total_score   smallint not null,               -- 0–24
  percent       smallint not null,               -- 0–100
  tier          public.scorecard_tier not null,
  segment       public.playbook_segment not null, -- resolved playbook = drip segment
  created_at    timestamptz not null default now()
);

create index if not exists scorecard_submissions_created_at_idx
  on public.scorecard_submissions (created_at desc);
create index if not exists scorecard_submissions_segment_idx
  on public.scorecard_submissions (segment);
create index if not exists scorecard_submissions_email_idx
  on public.scorecard_submissions (email);

-- Deny-by-default: enable RLS and add NO anon/authenticated policies, so only
-- the service-role key (used server-side) can read/write. Mirrors 0001_init.
alter table public.scorecard_submissions enable row level security;

-- Public bucket holding the pre-made playbook PDFs (keys: <segment>.pdf). Public
-- read so the download resolves on-screen instantly with no signed-URL latency.
-- Upload the 10 PDFs as access.pdf, alignment.pdf, …, foundations.pdf,
-- hold-your-lead.pdf.
insert into storage.buckets (id, name, public)
values ('playbooks', 'playbooks', true)
on conflict (id) do update set public = excluded.public;

-- Allow anonymous read of objects in the playbooks bucket (writes stay
-- service-role only, the Supabase default).
do $$ begin
  create policy "Public read of playbook PDFs"
    on storage.objects for select
    to anon, authenticated
    using (bucket_id = 'playbooks');
exception when duplicate_object then null; end $$;
