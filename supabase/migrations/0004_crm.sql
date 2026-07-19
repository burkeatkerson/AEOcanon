-- CRM + email automation backend. This is the data layer behind the /login admin
-- section: a unified contact model fed by every lead source, an activity timeline,
-- tags + segments for organizing, and a drip/broadcast email engine that Claude
-- authors as data (campaigns + steps + templates live in rows, not a visual
-- builder). Apply with the Supabase CLI:
--   supabase db push
-- or paste into the SQL editor. Safe to run on a database that already has 0001–0003.
--
-- Access model: like 0001–0003, every table has RLS ENABLED with NO anon/
-- authenticated policies (deny-by-default). All reads/writes happen through
-- trusted server code using the service-role key, gated by the admin session
-- (simple ADMIN_PASSWORD + signed cookie) or the cron secret. There is no
-- Supabase Auth user. See ADMIN_CRM.md for the full model.

create extension if not exists "pgcrypto";

-- ── Enums ────────────────────────────────────────────────────────────────────
-- Closed value sets so campaign logic, segmentation, and the timeline branch on
-- clean values, never free text.

do $$ begin
  create type public.contact_source as enum (
    'scorecard', 'contact_form', 'audit', 'manual', 'import'
  );
exception when duplicate_object then null; end $$;

-- Funnel lifecycle stage. Deliberately simple; the dashboard moves contacts
-- along this as they progress.
do $$ begin
  create type public.contact_stage as enum (
    'new', 'engaged', 'qualified', 'customer', 'unqualified'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.segment_kind as enum ('static', 'dynamic');
exception when duplicate_object then null; end $$;

-- Every kind of thing that can land on a contact's timeline.
do $$ begin
  create type public.activity_type as enum (
    'form_submitted', 'scorecard_completed', 'note_added', 'stage_changed',
    'tag_added', 'tag_removed', 'enrolled', 'unenrolled',
    'email_sent', 'email_delivered', 'email_opened', 'email_clicked',
    'email_bounced', 'email_complained', 'unsubscribed', 'booked_call'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.campaign_type as enum ('drip', 'broadcast');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.campaign_status as enum ('draft', 'active', 'paused', 'archived');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.enrollment_status as enum (
    'active', 'completed', 'paused', 'canceled', 'unsubscribed'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.email_send_status as enum (
    'queued', 'sent', 'delivered', 'opened', 'clicked',
    'bounced', 'complained', 'failed', 'suppressed'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.suppression_reason as enum (
    'unsubscribe', 'bounce', 'complaint', 'manual'
  );
exception when duplicate_object then null; end $$;

-- ── Contacts ─────────────────────────────────────────────────────────────────
-- The unified person. One row per email; every lead source upserts here via
-- src/lib/crm/ingest.ts. Email is stored lowercased by the app; the unique index
-- on lower(email) is the hard guarantee.
create table if not exists public.contacts (
  id                uuid primary key default gen_random_uuid(),
  email             text not null,
  name              text,
  business_name     text,
  business_type     text,
  website           text,
  location          text,
  source            public.contact_source not null default 'manual',
  stage             public.contact_stage  not null default 'new',
  unsubscribed_all  boolean not null default false,
  metadata          jsonb   not null default '{}'::jsonb,
  first_seen_at     timestamptz not null default now(),
  last_activity_at  timestamptz not null default now(),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create unique index if not exists contacts_email_lower_idx
  on public.contacts (lower(email));
create index if not exists contacts_stage_idx on public.contacts (stage);
create index if not exists contacts_source_idx on public.contacts (source);
create index if not exists contacts_last_activity_idx
  on public.contacts (last_activity_at desc);

-- ── Tags ─────────────────────────────────────────────────────────────────────
create table if not exists public.tags (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  color       text,                       -- optional UI hint, e.g. "#7c3aed"
  created_at  timestamptz not null default now()
);
create unique index if not exists tags_name_idx on public.tags (lower(name));

create table if not exists public.contact_tags (
  contact_id  uuid not null references public.contacts (id) on delete cascade,
  tag_id      uuid not null references public.tags (id)     on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (contact_id, tag_id)
);
create index if not exists contact_tags_tag_idx on public.contact_tags (tag_id);

-- ── Segments ─────────────────────────────────────────────────────────────────
-- A named group of contacts. `static` segments have explicit membership rows;
-- `dynamic` segments are resolved at query time from the `definition` rule set
-- (see src/lib/crm/segments.ts for the rule shape).
create table if not exists public.segments (
  id           uuid primary key default gen_random_uuid(),
  key          text not null,             -- stable slug, e.g. "scorecard-at-risk"
  name         text not null,
  description  text,
  kind         public.segment_kind not null default 'static',
  definition   jsonb not null default '{}'::jsonb,   -- rules for dynamic segments
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create unique index if not exists segments_key_idx on public.segments (key);

create table if not exists public.segment_members (
  segment_id  uuid not null references public.segments (id) on delete cascade,
  contact_id  uuid not null references public.contacts (id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (segment_id, contact_id)
);
create index if not exists segment_members_contact_idx
  on public.segment_members (contact_id);

-- ── Activities (timeline) ────────────────────────────────────────────────────
-- Append-only. The contact's full history: captures, emails, stage moves, notes.
create table if not exists public.activities (
  id          uuid primary key default gen_random_uuid(),
  contact_id  uuid not null references public.contacts (id) on delete cascade,
  type        public.activity_type not null,
  title       text not null,
  data        jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now(),
  created_at  timestamptz not null default now()
);
create index if not exists activities_contact_idx
  on public.activities (contact_id, occurred_at desc);
create index if not exists activities_type_idx on public.activities (type);

-- ── Notes (editable) ─────────────────────────────────────────────────────────
-- Freeform admin notes. Unlike activities these can be edited/deleted.
create table if not exists public.notes (
  id          uuid primary key default gen_random_uuid(),
  contact_id  uuid not null references public.contacts (id) on delete cascade,
  body        text not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists notes_contact_idx
  on public.notes (contact_id, created_at desc);

-- ── Email templates ──────────────────────────────────────────────────────────
-- Reusable, variable-interpolated ({{first_name}} …) email bodies. Steps and
-- broadcasts may reference a template by key or inline their own subject/body.
create table if not exists public.email_templates (
  id           uuid primary key default gen_random_uuid(),
  key          text not null,             -- stable slug, e.g. "course-welcome"
  name         text not null,
  subject      text not null,
  html         text not null,
  text         text,
  description  text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create unique index if not exists email_templates_key_idx
  on public.email_templates (key);

-- ── Campaigns ────────────────────────────────────────────────────────────────
-- A `drip` is a timed sequence (steps below); a `broadcast` is a one-off send to
-- a segment at `scheduled_at`. Claude authors these as rows.
create table if not exists public.campaigns (
  id           uuid primary key default gen_random_uuid(),
  key          text not null,             -- stable slug, e.g. "course-aeo-foundations"
  name         text not null,
  description  text,
  type         public.campaign_type   not null default 'drip',
  status       public.campaign_status not null default 'draft',
  segment_id   uuid references public.segments (id) on delete set null,
  from_name    text,
  from_email   text,
  reply_to     text,
  scheduled_at timestamptz,               -- broadcast: when to send
  sent_at      timestamptz,               -- broadcast: when it went out
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create unique index if not exists campaigns_key_idx on public.campaigns (key);
create index if not exists campaigns_status_idx on public.campaigns (status);
create index if not exists campaigns_type_status_idx on public.campaigns (type, status);

-- ── Campaign steps (drip) ────────────────────────────────────────────────────
-- Ordered steps. `send_after_minutes` is the offset from enrollment start (not
-- from the previous step) so re-timing one step never cascades. Each step either
-- references a template by key or inlines its own subject/html/text.
create table if not exists public.campaign_steps (
  id                 uuid primary key default gen_random_uuid(),
  campaign_id        uuid not null references public.campaigns (id) on delete cascade,
  step_order         int  not null,       -- 0-based
  send_after_minutes int  not null default 0,
  template_key       text references public.email_templates (key) on delete set null,
  subject            text,
  html               text,
  text               text,
  created_at         timestamptz not null default now(),
  unique (campaign_id, step_order)
);
create index if not exists campaign_steps_campaign_idx
  on public.campaign_steps (campaign_id, step_order);

-- ── Enrollments ──────────────────────────────────────────────────────────────
-- A contact progressing through a drip. `next_run_at` is when the current step
-- is due; the tick engine advances it. The unique constraint prevents a contact
-- being enrolled in the same campaign twice.
create table if not exists public.enrollments (
  id           uuid primary key default gen_random_uuid(),
  campaign_id  uuid not null references public.campaigns (id) on delete cascade,
  contact_id   uuid not null references public.contacts (id)  on delete cascade,
  status       public.enrollment_status not null default 'active',
  current_step int not null default 0,
  next_run_at  timestamptz,
  enrolled_at  timestamptz not null default now(),
  completed_at timestamptz,
  updated_at   timestamptz not null default now(),
  unique (campaign_id, contact_id)
);
-- Partial index: the tick engine only ever scans active, due enrollments.
create index if not exists enrollments_due_idx
  on public.enrollments (next_run_at)
  where status = 'active';
create index if not exists enrollments_contact_idx on public.enrollments (contact_id);

-- ── Email sends (log) ────────────────────────────────────────────────────────
-- One row per email we attempt. The partial-unique (enrollment_id, step_id)
-- constraint makes drip sends idempotent: the tick engine can run repeatedly and
-- never double-send a step. Broadcast sends dedupe on (campaign_id, contact_id).
create table if not exists public.email_sends (
  id                  uuid primary key default gen_random_uuid(),
  contact_id          uuid references public.contacts (id) on delete set null,
  campaign_id         uuid references public.campaigns (id) on delete set null,
  step_id             uuid references public.campaign_steps (id) on delete set null,
  enrollment_id       uuid references public.enrollments (id) on delete set null,
  template_key        text,
  to_email            text not null,
  subject             text not null,
  status              public.email_send_status not null default 'queued',
  provider_message_id text,               -- Resend id, for webhook correlation
  error               text,
  created_at          timestamptz not null default now(),
  sent_at             timestamptz,
  delivered_at        timestamptz,
  opened_at           timestamptz,
  clicked_at          timestamptz
);
create index if not exists email_sends_contact_idx on public.email_sends (contact_id);
create index if not exists email_sends_campaign_idx on public.email_sends (campaign_id);
create index if not exists email_sends_provider_idx on public.email_sends (provider_message_id);
create index if not exists email_sends_created_idx on public.email_sends (created_at desc);
-- Idempotency: a given drip step is sent to a given enrollment at most once.
create unique index if not exists email_sends_enrollment_step_idx
  on public.email_sends (enrollment_id, step_id)
  where enrollment_id is not null and step_id is not null;
-- Idempotency: a broadcast reaches a given contact at most once.
create unique index if not exists email_sends_broadcast_idx
  on public.email_sends (campaign_id, contact_id)
  where campaign_id is not null and enrollment_id is null;

-- ── Suppressions ─────────────────────────────────────────────────────────────
-- Global send-block list. Every send checks here first. Populated by unsubscribe
-- links, Resend bounce/complaint webhooks, or manual admin action.
create table if not exists public.suppressions (
  email       text primary key,           -- lowercased
  reason      public.suppression_reason not null,
  source      text,                       -- free-text origin, e.g. "resend:bounce"
  created_at  timestamptz not null default now()
);

-- ── RLS: deny-by-default on every new table ──────────────────────────────────
alter table public.contacts         enable row level security;
alter table public.tags             enable row level security;
alter table public.contact_tags     enable row level security;
alter table public.segments         enable row level security;
alter table public.segment_members  enable row level security;
alter table public.activities       enable row level security;
alter table public.notes            enable row level security;
alter table public.email_templates  enable row level security;
alter table public.campaigns        enable row level security;
alter table public.campaign_steps   enable row level security;
alter table public.enrollments      enable row level security;
alter table public.email_sends      enable row level security;
alter table public.suppressions     enable row level security;
