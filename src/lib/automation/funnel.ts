/**
 * The sales funnel as data: which capture events enroll a contact into which
 * drip campaign. `ingestLead()` consults these rules after upserting a contact,
 * so the funnel is editable config in one place rather than branching logic
 * scattered across capture paths. Campaign keys refer to rows seeded in
 * supabase/migrations/0005_crm_seed.sql (or any campaign you later add).
 *
 * To change the funnel: edit these rules and/or the seeded campaigns. To add a
 * new entry point, push a rule whose `when` matches the ingest input. See
 * ADMIN_CRM.md for the authoring runbook.
 */
import type { ContactSource } from "@/lib/crm/enums";

export interface FunnelRule {
  /** Human label for logs. */
  label: string;
  /** Campaign key to enroll into (must exist and be a drip). */
  campaignKey: string;
  /** Match by capture source. */
  source?: ContactSource;
  /** Match if ANY of these tag names were applied on capture. */
  anyTag?: string[];
}

export const FUNNEL_RULES: FunnelRule[] = [
  {
    label: "Scorecard / learner → AEO Foundations course drip",
    campaignKey: "course-aeo-foundations",
    source: "scorecard",
  },
  {
    label: "Website / done-for-you interest → sales drip",
    campaignKey: "sales-website",
    anyTag: ["website-interest", "dfy-interest"],
  },
];

/** Resolve which campaign keys a freshly-captured contact should enroll into. */
export function campaignsForCapture(input: {
  source: ContactSource;
  tags?: string[];
}): string[] {
  const tags = new Set((input.tags ?? []).map((t) => t.trim()));
  const keys = new Set<string>();
  for (const rule of FUNNEL_RULES) {
    const sourceOk = rule.source ? rule.source === input.source : true;
    const tagOk = rule.anyTag ? rule.anyTag.some((t) => tags.has(t)) : true;
    if (rule.source === undefined && rule.anyTag === undefined) continue;
    if (sourceOk && tagOk) keys.add(rule.campaignKey);
  }
  return [...keys];
}
