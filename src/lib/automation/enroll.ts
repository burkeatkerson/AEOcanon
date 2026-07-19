import "server-only";
import { createServiceClient } from "@/lib/db/supabase/server";
import { getCampaignByKey, getSteps } from "@/lib/crm/campaigns";
import { logActivity } from "@/lib/crm/activities";
import type { Enrollment } from "@/lib/crm/types";

/**
 * Enroll a contact into a drip campaign. The unique (campaign_id, contact_id)
 * constraint makes this idempotent — a repeat call is a no-op. `next_run_at` is
 * seeded from step 0's `send_after_minutes` so the very first email honors its
 * delay (usually 0 = send on the next tick). Only `active` drips accept new
 * enrollments.
 */
export async function enrollByCampaignKey(
  contactId: string,
  campaignKey: string,
): Promise<Enrollment | null> {
  const campaign = await getCampaignByKey(campaignKey);
  if (!campaign) {
    console.warn(`[automation] enroll: unknown campaign "${campaignKey}"`);
    return null;
  }
  if (campaign.type !== "drip" || campaign.status !== "active") return null;

  const steps = await getSteps(campaign.id);
  const firstStep = steps[0];
  if (!firstStep) return null;

  const firstDelayMin = firstStep.send_after_minutes ?? 0;
  const nextRunAt = new Date(Date.now() + firstDelayMin * 60_000).toISOString();

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("enrollments")
    .insert({
      campaign_id: campaign.id,
      contact_id: contactId,
      status: "active",
      current_step: 0,
      next_run_at: nextRunAt,
    })
    .select("*")
    .single();

  if (error) {
    // 23505 = already enrolled; that's the idempotent happy path.
    if (error.code !== "23505") {
      console.error("[automation] enroll insert failed:", error.message);
    }
    return null;
  }

  await logActivity(contactId, {
    type: "enrolled",
    title: `Enrolled in "${campaign.name}"`,
    data: { campaign_key: campaign.key, campaign_id: campaign.id },
  });
  return data;
}
