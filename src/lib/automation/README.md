# `src/lib/automation` — drip + broadcast engine

The executor behind the CRM's email automation. Read **`ADMIN_CRM.md`** (repo root)
for the full lifecycle diagram and the campaign-authoring runbook.

- `funnel.ts` — the sales funnel as data: `FUNNEL_RULES` map a capture
  (source/tags) to the drip campaign(s) to enroll into. `campaignsForCapture()` is
  consulted by `ingestLead()`. Edit here to change what enrolls whom.
- `enroll.ts` — `enrollByCampaignKey()`: idempotent enrollment (unique
  `(campaign_id, contact_id)`), seeds `next_run_at` from step 0's delay.
- `tick.ts` — **`runTick()`**: one pass of the engine. Advances due drip
  enrollments (send current step → advance/complete) and sends due broadcasts to
  their segment. Idempotent and safe to run on any cadence — the `email_sends`
  unique indexes prevent double-sends.

Triggered by `GET|POST /api/cron/tick` (Bearer `CRON_SECRET`; `vercel.json`
schedules it every 5 min). Sending itself is `src/lib/mailer`; the data model is
`src/lib/crm` + migration `0004`.
