-- Scorecard v2: the flow now branches (has a website vs. doesn't), opens with
-- business type, and collects location at the email step. The no-website branch
-- isn't pillar-scored, so the score columns become nullable. Apply with:
--   supabase db push
-- or paste into the SQL editor. Safe to run on a database that already has 0002.

-- Which path the visitor took — a clean enum for later campaign segmentation.
do $$ begin
  create type public.scorecard_branch as enum ('has_website', 'no_website');
exception when duplicate_object then null; end $$;

alter table public.scorecard_submissions
  add column if not exists business_type text,
  add column if not exists location      text,
  add column if not exists branch        public.scorecard_branch not null default 'has_website',
  add column if not exists site_read     jsonb;

-- The no-website branch has no 0–24 score, so these no longer apply to every row.
alter table public.scorecard_submissions
  alter column pillar_scores drop not null,
  alter column total_score   drop not null,
  alter column percent       drop not null,
  alter column tier          drop not null;

create index if not exists scorecard_submissions_branch_idx
  on public.scorecard_submissions (branch);
