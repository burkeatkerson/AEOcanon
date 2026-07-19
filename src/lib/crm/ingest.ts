import "server-only";
import { enrollByCampaignKey } from "@/lib/automation/enroll";
import { campaignsForCapture } from "@/lib/automation/funnel";
import { logActivity } from "./activities";
import { upsertContact } from "./contacts";
import { addTag } from "./tags";
import { ACTIVITY_TYPE_VALUES, type ActivityType } from "./enums";
import { ingestLeadSchema, type Contact, type IngestLeadInput } from "./types";

/**
 * The one entry point every lead-capture path calls (scorecard, contact form,
 * audit, manual import). It upserts the contact, records the capture on the
 * timeline, applies tags, and auto-enrolls into whatever drip the funnel map
 * (funnel.ts) selects for this source/tags — plus any explicit campaign keys.
 *
 * Fully best-effort and non-throwing: a capture flow should never fail because a
 * CRM side-effect did. Returns the contact and the campaign keys enrolled into.
 */
export async function ingestLead(
  input: IngestLeadInput,
): Promise<{ contact: Contact | null; enrolled: string[] }> {
  const parsed = ingestLeadSchema.safeParse(input);
  if (!parsed.success) {
    console.error("[crm] ingestLead: invalid input", parsed.error.flatten());
    return { contact: null, enrolled: [] };
  }
  const data = parsed.data;

  const contact = await upsertContact({
    email: data.email,
    name: data.name ?? null,
    business_name: data.businessName ?? null,
    business_type: data.businessType ?? null,
    website: data.website ?? null,
    location: data.location ?? null,
    source: data.source,
    metadata: data.metadata,
  });
  if (!contact) return { contact: null, enrolled: [] };

  if (data.activity) {
    const type: ActivityType = (
      ACTIVITY_TYPE_VALUES as readonly string[]
    ).includes(data.activity.type)
      ? (data.activity.type as ActivityType)
      : "form_submitted";
    await logActivity(contact.id, {
      type,
      title: data.activity.title,
      data: data.activity.data,
    });
  }

  const tags = data.tags ?? [];
  for (const tag of tags) await addTag(contact.id, tag);

  // Funnel-driven enrollment + any explicit campaigns the caller named.
  const keys = new Set<string>([
    ...campaignsForCapture({ source: data.source, tags }),
    ...(data.enrollCampaignKeys ?? []),
  ]);
  const enrolled: string[] = [];
  for (const key of keys) {
    const enrollment = await enrollByCampaignKey(contact.id, key);
    if (enrollment) enrolled.push(key);
  }

  return { contact, enrolled };
}
