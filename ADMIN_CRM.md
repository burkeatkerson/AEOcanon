# Admin Section + CRM + Email Automation

The `/login` admin area, the CRM behind it, and the email automation engine. This
is the **backend environment**; the dashboard UI is a later phase. If you're an
agent or developer picking this up, read this file first — it's the map.

> Companion to `ARCHITECTURE.md` (the public site). Everything here lives under
> `src/lib/admin`, `src/lib/crm`, `src/lib/mailer`, `src/lib/automation`, the
> `src/app/admin` + `src/app/login` routes, `src/app/api/{cron,webhooks,unsubscribe}`,
> and migrations `0004`/`0005`.

## What this system does

1. **Gate** an admin area at `/login` for one operator (Burke).
2. **Unify** every lead source (scorecard, contact form, later: audit/manual/import)
   into one `contacts` model with an activity **timeline**, **tags**, and **segments**.
3. **Run a simple funnel**: captured contacts auto-enroll into **drip** campaigns
   (a course drip for learners, a website/sales drip for prospects) and can receive
   **broadcasts** to a segment.
4. **Send + track** email through Resend with suppression, unsubscribe, and webhook
   event tracking — idempotently, on a cron heartbeat.

There is **no visual automation builder** by design. Campaigns, steps, templates,
and segments are **data** (rows). Claude authors/edits them; the engine executes
them. The "How Claude authors …" runbook below is the workflow.

## Auth model

- **Single password.** `ADMIN_PASSWORD` (env) is checked with a constant-time HMAC
  compare in `src/lib/admin/session.ts` (`verifyPassword`). No Supabase Auth user,
  no user table.
- **Signed cookie session.** On success, `login()` (`src/lib/admin/actions.ts`)
  mints an HMAC-SHA256-signed token (`signSession`, keyed by `ADMIN_SESSION_SECRET`)
  into the `aeo_admin` httpOnly cookie (7-day expiry).
- **Two gates:**
  1. `src/proxy.ts` (Next 16's renamed `middleware`) redirects unauthenticated
     `/admin/*` → `/login`, and `/login` → `/admin` when already signed in. Coarse,
     runs at the edge of the request.
  2. `requireAdmin()` (`src/lib/admin/guard.ts`) is the **authoritative** gate,
     called in every admin layout/page/route handler and **every admin server
     action** (`src/lib/crm/actions.ts`). This matters: a proxy matcher can be
     bypassed and server actions are POSTs to their own route, so per Next's
     data-security guidance auth is re-checked inside each action.
- **Why RLS is deny-all + service role.** All the CRM tables have RLS enabled with
  no anon/authenticated policies (see `0004`). Because there's no Supabase Auth
  user, the admin has no JWT; every read/write goes through the service-role client
  (`createServiceClient`, `src/lib/db/supabase/server.ts`) inside trusted server
  code that has already checked the admin session or the cron secret. This mirrors
  the existing audit/scorecard pattern (`0001`–`0003`).
- **To add more admins or swap to Supabase Auth later:** replace the password check
  in `actions.ts` and `session.ts` with Supabase Auth sign-in, keep `requireAdmin()`
  as the single choke point (swap its body), and add RLS policies keyed on
  `auth.uid()` if you want direct client access. Nothing else needs to change.

## Data model (migration `0004_crm.sql`)

```
contacts ──┬── activities        (append-only timeline)
           ├── notes             (editable admin notes)
           ├── contact_tags ── tags
           ├── segment_members ── segments   (static membership)
           ├── enrollments ── campaigns ── campaign_steps
           └── email_sends   (per-email ledger; also FK to campaigns/steps/enrollments)
suppressions   (global send-block list, keyed by email)
email_templates (reusable bodies, keyed by slug)
```

Key rules baked into the schema:
- **Identity** is `lower(email)` (unique index). The app always lowercases email.
- **Idempotent drip sends**: partial-unique `email_sends(enrollment_id, step_id)`.
  The tick engine can run repeatedly and never double-send a step.
- **Idempotent broadcasts**: partial-unique `email_sends(campaign_id, contact_id)
  where enrollment_id is null`.
- **No double-enroll**: unique `enrollments(campaign_id, contact_id)`.
- **Absolute step timing**: `campaign_steps.send_after_minutes` is measured from
  enrollment start, not from the previous step — re-timing one step never cascades.

Enums (Postgres + mirrored in `src/lib/crm/enums.ts`, the single source of truth
shared by the DB types and the app): `contact_source`, `contact_stage`,
`segment_kind`, `activity_type`, `campaign_type`, `campaign_status`,
`enrollment_status`, `email_send_status`, `suppression_reason`.

Typed client: `src/lib/db/types.ts` hand-mirrors these tables. Regenerate with
`npm run db:types` once the live schema is pushed (set the project id first).

## Automation lifecycle

```
capture → ingestLead() ──► upsert contact + activity + tags + enroll (funnel.ts)
                                                   │
                          enrollments.next_run_at ◄┘
                                                   │
   cron (/api/cron/tick, every 5m on Vercel) ──► runTick()
                                                   │
        ┌──────────────────────────────────────────┴───────────────┐
        ▼                                                            ▼
   process drips                                              process broadcasts
   (due enrollments → send current step → advance)      (due broadcast campaigns →
        │                                                 send step 0 to segment)
        ▼
   sendEmail() → suppression check → email_sends row (idempotency) → Resend
        │                                                            │
        ▼                                                            ▼
   Resend webhook (/api/webhooks/resend) ──► update email_sends + timeline + auto-suppress
        │
   unsubscribe link (/api/unsubscribe) ──► suppression + unsubscribed_all + cancel enrollments
```

- **Cron.** `GET|POST /api/cron/tick` requires `Authorization: Bearer $CRON_SECRET`.
  On Vercel, setting `CRON_SECRET` makes Vercel Cron send it automatically
  (`vercel.json` schedules every 5 min). Trigger by hand:
  `curl -H "Authorization: Bearer $CRON_SECRET" https://<host>/api/cron/tick`.
- **Degradation.** With no `RESEND_API_KEY`, sends are recorded `queued` and the
  enrollment still advances — the whole system runs (and is testable) without email
  configured. Set `RESEND_API_KEY` + `MARKETING_FROM_EMAIL` (a verified sender) to
  deliver for real.
- **Broadcast body** = the campaign's `campaign_steps[0]` (broadcasts reuse the
  drip content model; no separate body column).

## How Claude authors a campaign / segment / template

Because there's no builder, authoring = writing rows (a SQL migration like
`0005_crm_seed.sql`, or dashboard actions once the UI exists). Runbook:

**A drip campaign**
1. Insert a `campaigns` row: `type='drip'`, `status='active'`, a stable `key`, and
   optionally a `segment_id` (used for reporting/manual sends, not enrollment).
2. Insert `campaign_steps` (step_order 0,1,2…), each with `send_after_minutes`
   (offset from enrollment) and either inline `subject`/`html`/`text` or a
   `template_key`.
3. To make it auto-enroll on capture, add a rule to `FUNNEL_RULES` in
   `src/lib/automation/funnel.ts` (match by `source` and/or `anyTag`).
4. Bodies may use `{{first_name}} {{name}} {{email}} {{site_url}} {{site_name}}
   {{unsubscribe_url}}` plus any extra vars passed to the send. The base layout and
   unsubscribe footer/headers are added automatically (`src/lib/mailer/render.ts`).

**A broadcast**
1. Insert a `campaigns` row: `type='broadcast'`, `status='active'`,
   `segment_id=<target>`, `scheduled_at=<when>`.
2. Insert one `campaign_steps` row (step_order 0) as the body.
3. The next tick after `scheduled_at` sends it to the segment (deduped per contact),
   then marks it `sent_at` + `archived`. Or call `scheduleBroadcast()` from the
   dashboard.

**A segment**
- *Static*: `segments.kind='static'`, then add `segment_members` rows (or
  `addToSegment()`).
- *Dynamic*: `segments.kind='dynamic'` with a `definition` jsonb rule set —
  `{"all":[…]}` (AND) or `{"any":[…]}` (OR), where each rule is
  `{field, op, value}`. Fields: `source|stage|business_type|unsubscribed_all|tag`.
  Ops: `eq|neq|contains` (text) and `has` (tag). Resolver: `resolveSegmentContactIds`
  in `src/lib/crm/segments.ts`.

**A template**: insert an `email_templates` row with a stable `key`; reference it
from a step's `template_key`.

## Extension points & maintenance

- **New activity type** → add to the `activity_type` enum (`0004` + a migration)
  and `ACTIVITY_TYPE_VALUES` (`src/lib/crm/enums.ts`), then log it via `logActivity`.
- **New funnel entry** → push a rule in `funnel.ts` (and a tag on the capture path).
- **New ingestion source** → call `ingestLead({ source, … })` from the capture
  point (see the scorecard/contact examples in `src/lib/scorecard/actions.ts` and
  `src/app/(marketing)/contact/actions.ts`). Add the source to the `contact_source`
  enum if it's new.
- **New segment field/op** → extend `idsForRule` / `COLUMN_FIELDS` in `segments.ts`.
- **Dashboard mutations** → add to `src/lib/crm/actions.ts` (always `requireAdmin()`
  first).

### Known limitations / TODO (future work)
- **Audit lead source** isn't wired yet (no capture path writes it today); the
  `leads` table + `audit` source exist for when it is.
- **Failed sends aren't retried** — a Resend error marks the `email_sends` row
  `failed` and the drip advances (so it never gets stuck). Add a retry sweep if
  deliverability matters.
- **No send rate limiting / batching** on broadcasts beyond a per-tick cap
  (`BROADCAST_CONTACT_CAP` in `tick.ts`). Fine for a single operator; revisit at
  scale.
- **`RESEND_WEBHOOK_SECRET` optional** — when unset, webhook events are accepted
  unverified (dev convenience). Set it in production.
- **No login rate limiting** — the password compare is constant-time, but consider
  attempt throttling if the admin URL is exposed.
- **Reporting/analytics** (open/click rates, funnel conversion) is raw data in
  `email_sends`/`activities`; aggregation is a dashboard concern for the next phase.
- **Dynamic segments** are evaluated by fetching id sets — simple and correct, not
  optimized for very large lists.

## Environment variables

| Var | Purpose | Required |
|---|---|---|
| `ADMIN_PASSWORD` | The single admin login password | Yes (admin) |
| `ADMIN_SESSION_SECRET` | Signs the admin session cookie (+ unsubscribe tokens by default) | Yes (admin) |
| `CRON_SECRET` | Bearer secret for `/api/cron/tick`; Vercel Cron sends it automatically | Yes (automation) |
| `RESEND_API_KEY` | Deliver email (drips, broadcasts, transactional). Unset → sends record as `queued` | For real sends |
| `MARKETING_FROM_EMAIL` | Verified Resend sender for automation email; falls back to `CONTACT_FROM_EMAIL` | Recommended |
| `RESEND_WEBHOOK_SECRET` | Verifies Resend event webhooks (Svix scheme) | Prod recommended |
| `UNSUBSCRIBE_SECRET` | Signs unsubscribe tokens; falls back to `ADMIN_SESSION_SECRET` | Optional |
| `NEXT_PUBLIC_SUPABASE_URL` / `_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY` | DB access (existing) | Yes |

## Setup / verification

1. Apply migrations: `supabase db push` (or paste `0004`/`0005` into the SQL editor).
2. Set `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, `CRON_SECRET` in `.env.local`.
3. `npm run dev`, visit `/admin` → redirected to `/login`; wrong password rejected;
   correct password → dashboard with live counts; "Sign out" clears the session.
4. Submit the scorecard or contact form → a `contact` + `activity` appears and (for
   a mapped source) an `enrollment` with `next_run_at`.
5. `curl -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/tick`
   → JSON summary; a due step logs an `email_sends` row and advances the enrollment;
   re-running does **not** double-send.
6. Open an unsubscribe link → `suppressions` row, `unsubscribed_all=true`,
   active enrollments canceled; later sends to that email log as `suppressed`.
