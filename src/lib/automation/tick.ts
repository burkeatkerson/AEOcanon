import "server-only";
import { createServiceClient } from "@/lib/db/supabase/server";
import { getContact } from "@/lib/crm/contacts";
import { getCampaign, getSteps } from "@/lib/crm/campaigns";
import { logActivity } from "@/lib/crm/activities";
import { resolveSegmentContacts } from "@/lib/crm/segments";
import { getTemplate } from "@/lib/mailer/templates";
import { sendEmail } from "@/lib/mailer/send";
import type { Campaign, CampaignStep, Contact } from "@/lib/crm/types";

/**
 * The automation executor. `runTick()` is idempotent and safe to run on any
 * cadence (Vercel Cron every 5 min, or manual curl): the DB's unique indexes on
 * email_sends make double-sends impossible even if two ticks overlap.
 *
 * Two jobs per tick:
 *  1. Drips  — advance every active enrollment whose step is due, sending the
 *     current step then scheduling the next (delay is absolute from enrollment
 *     start, so re-timing one step never cascades).
 *  2. Broadcasts — send due `broadcast` campaigns to their segment. A broadcast's
 *     body is its step 0, so it reuses the same content model as drips.
 *
 * Both degrade gracefully with no RESEND_API_KEY (sends record as `queued`).
 */

const DRIP_BATCH = 100;
const BROADCAST_CONTACT_CAP = 2000; // safety cap per tick; logged if exceeded

export interface TickSummary {
  drips: { processed: number; sent: number; completed: number; canceled: number };
  broadcasts: { campaigns: number; sent: number };
  ranAt: string;
}

/** Pick the effective subject/html/text for a step, falling back to its template. */
async function resolveContent(
  step: CampaignStep,
  templateCache: Map<string, { subject: string; html: string; text: string | null } | null>,
): Promise<{ subject: string; html: string; text: string | null } | null> {
  let tpl: { subject: string; html: string; text: string | null } | null = null;
  if (step.template_key) {
    if (!templateCache.has(step.template_key)) {
      const t = await getTemplate(step.template_key);
      templateCache.set(
        step.template_key,
        t ? { subject: t.subject, html: t.html, text: t.text } : null,
      );
    }
    tpl = templateCache.get(step.template_key) ?? null;
  }
  const subject = step.subject ?? tpl?.subject;
  const html = step.html ?? tpl?.html;
  if (!subject || !html) return null;
  return { subject, html, text: step.text ?? tpl?.text ?? null };
}

async function cancelEnrollment(
  id: string,
  status: "canceled" | "unsubscribed",
): Promise<void> {
  const supabase = createServiceClient();
  await supabase
    .from("enrollments")
    .update({ status, completed_at: new Date().toISOString(), next_run_at: null })
    .eq("id", id);
}

async function processDrips(): Promise<TickSummary["drips"]> {
  const supabase = createServiceClient();
  const now = new Date().toISOString();
  const summary = { processed: 0, sent: 0, completed: 0, canceled: 0 };

  const { data: due } = await supabase
    .from("enrollments")
    .select("*")
    .eq("status", "active")
    .not("next_run_at", "is", null)
    .lte("next_run_at", now)
    .order("next_run_at", { ascending: true })
    .limit(DRIP_BATCH);

  if (!due || due.length === 0) return summary;

  const templateCache = new Map<
    string,
    { subject: string; html: string; text: string | null } | null
  >();
  const campaignCache = new Map<string, { campaign: Campaign; steps: CampaignStep[] } | null>();

  for (const enrollment of due) {
    summary.processed++;

    const contact = await getContact(enrollment.contact_id);
    if (!contact || contact.unsubscribed_all) {
      await cancelEnrollment(enrollment.id, "unsubscribed");
      summary.canceled++;
      continue;
    }

    if (!campaignCache.has(enrollment.campaign_id)) {
      const campaign = await getCampaign(enrollment.campaign_id);
      campaignCache.set(
        enrollment.campaign_id,
        campaign ? { campaign, steps: await getSteps(campaign.id) } : null,
      );
    }
    const bundle = campaignCache.get(enrollment.campaign_id);
    if (!bundle) {
      await cancelEnrollment(enrollment.id, "canceled");
      summary.canceled++;
      continue;
    }
    const { campaign, steps } = bundle;

    // Respect campaign lifecycle: paused holds, archived cancels.
    if (campaign.status === "paused") continue;
    if (campaign.status !== "active") {
      await cancelEnrollment(enrollment.id, "canceled");
      summary.canceled++;
      continue;
    }

    const step = steps[enrollment.current_step];
    if (!step) {
      await completeEnrollment(enrollment.id);
      summary.completed++;
      continue;
    }

    const content = await resolveContent(step, templateCache);
    if (content) {
      const result = await sendEmail({
        contact: { id: contact.id, email: contact.email, name: contact.name },
        subject: content.subject,
        html: content.html,
        text: content.text,
        campaignId: campaign.id,
        stepId: step.id,
        enrollmentId: enrollment.id,
        fromName: campaign.from_name,
        fromEmail: campaign.from_email,
        replyTo: campaign.reply_to,
        dedupe: "enrollment_step",
      });

      if (result.status === "suppressed") {
        await cancelEnrollment(enrollment.id, "unsubscribed");
        summary.canceled++;
        continue;
      }
      if (result.status === "error") {
        // Transient (e.g. record insert failed). Leave it due; retry next tick.
        continue;
      }
      if (result.status === "sent" || result.status === "queued") {
        summary.sent++;
        await logActivity(contact.id, {
          type: "email_sent",
          title: `Sent "${content.subject}"`,
          data: { campaign_key: campaign.key, step: enrollment.current_step },
        });
      }
      // sent | queued | failed | duplicate → advance past this step.
    }

    await advanceEnrollment(enrollment.id, enrollment.enrolled_at, enrollment.current_step, steps);
    if (enrollment.current_step + 1 >= steps.length) summary.completed++;
  }

  return summary;
}

async function completeEnrollment(id: string): Promise<void> {
  const supabase = createServiceClient();
  await supabase
    .from("enrollments")
    .update({
      status: "completed",
      completed_at: new Date().toISOString(),
      next_run_at: null,
    })
    .eq("id", id);
}

/** Move to the next step, scheduling next_run_at absolutely from enrollment start. */
async function advanceEnrollment(
  id: string,
  enrolledAt: string,
  currentStep: number,
  steps: CampaignStep[],
): Promise<void> {
  const next = currentStep + 1;
  const nextStep = steps[next];
  if (!nextStep) {
    await completeEnrollment(id);
    return;
  }
  const base = new Date(enrolledAt).getTime();
  const nextRunAt = new Date(
    base + (nextStep.send_after_minutes ?? 0) * 60_000,
  ).toISOString();
  const supabase = createServiceClient();
  await supabase
    .from("enrollments")
    .update({
      current_step: next,
      next_run_at: nextRunAt,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
}

async function processBroadcasts(): Promise<TickSummary["broadcasts"]> {
  const supabase = createServiceClient();
  const now = new Date().toISOString();
  const summary = { campaigns: 0, sent: 0 };

  const { data: dueCampaigns } = await supabase
    .from("campaigns")
    .select("*")
    .eq("type", "broadcast")
    .eq("status", "active")
    .not("scheduled_at", "is", null)
    .lte("scheduled_at", now)
    .is("sent_at", null)
    .limit(5);

  if (!dueCampaigns || dueCampaigns.length === 0) return summary;

  for (const campaign of dueCampaigns) {
    summary.campaigns++;
    const steps = await getSteps(campaign.id);
    const content = steps[0]
      ? await resolveContent(steps[0], new Map())
      : null;
    if (!content || !campaign.segment_id) {
      // Nothing to send / no audience — mark handled so it doesn't re-queue.
      await markBroadcastSent(campaign.id);
      continue;
    }

    let recipients: Contact[] = await resolveSegmentContacts(campaign.segment_id);
    if (recipients.length > BROADCAST_CONTACT_CAP) {
      console.warn(
        `[automation] broadcast ${campaign.key}: ${recipients.length} recipients exceeds cap ${BROADCAST_CONTACT_CAP}; truncating this tick`,
      );
      recipients = recipients.slice(0, BROADCAST_CONTACT_CAP);
    }

    for (const contact of recipients) {
      const result = await sendEmail({
        contact: { id: contact.id, email: contact.email, name: contact.name },
        subject: content.subject,
        html: content.html,
        text: content.text,
        campaignId: campaign.id,
        dedupe: "broadcast",
        fromName: campaign.from_name,
        fromEmail: campaign.from_email,
        replyTo: campaign.reply_to,
      });
      if (result.status === "sent" || result.status === "queued") {
        summary.sent++;
        await logActivity(contact.id, {
          type: "email_sent",
          title: `Broadcast "${content.subject}"`,
          data: { campaign_key: campaign.key },
        });
      }
    }
    await markBroadcastSent(campaign.id);
  }

  return summary;
}

async function markBroadcastSent(id: string): Promise<void> {
  const supabase = createServiceClient();
  await supabase
    .from("campaigns")
    .update({ sent_at: new Date().toISOString(), status: "archived" })
    .eq("id", id);
}

/** Run one automation tick: drips first, then due broadcasts. */
export async function runTick(): Promise<TickSummary> {
  const drips = await processDrips();
  const broadcasts = await processBroadcasts();
  return { drips, broadcasts, ranAt: new Date().toISOString() };
}
