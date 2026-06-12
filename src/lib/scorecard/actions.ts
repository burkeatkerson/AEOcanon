"use server";

import { createServiceClient } from "@/lib/db/supabase/server";
import type { Json } from "@/lib/db/types";
import { scorecardWebhookUrl } from "@/lib/env";
import { playbookUrl } from "@/lib/scorecard/playbooks";
import { scoreSubmission } from "@/lib/scorecard/scoring";
import { submissionSchema, type Submission } from "@/lib/scorecard/types";

/**
 * Persist a scorecard submission and fire the (optional) lead webhook. Called
 * from the client AFTER the bare score + the gated result already render — it
 * never blocks the on-screen experience. For the scored (has_website) branch,
 * scores are recomputed server-side from the raw answers; client-sent scores
 * are never trusted. The no_website branch isn't pillar-scored — it's stored as
 * a starting point with the `foundations` segment. Returns a tiny status so the
 * UI can show a quiet "saved / couldn't save" note without ever blocking.
 */
export async function submitScorecard(
  input: Submission,
): Promise<{ ok: boolean; segment: string | null }> {
  const parsed = submissionSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, segment: null };
  }
  const data = parsed.data;

  // Honeypot: a filled "company" field means a bot. Accept silently, store nothing.
  if (data.company && data.company.length > 0) {
    return { ok: true, segment: null };
  }

  // Resolve the row depending on the branch.
  const row =
    data.branch === "has_website"
      ? (() => {
          const result = scoreSubmission(data.answers);
          return {
            answers: data.answers,
            pillar_scores: result.pillarScores,
            total_score: result.total,
            percent: result.percent,
            tier: result.tier,
            segment: result.segment,
          };
        })()
      : {
          answers: { offsite: data.offsite },
          pillar_scores: null,
          total_score: null,
          percent: null,
          tier: null,
          segment: "foundations" as const,
        };

  try {
    const supabase = createServiceClient();
    const { error } = await supabase.from("scorecard_submissions").insert({
      email: data.email,
      business_type: data.businessType || null,
      business_name: data.businessName || null,
      location: data.location || null,
      website: data.website || null,
      branch: data.branch,
      site_read: (data.siteRead as Json | undefined) ?? null,
      ...row,
    });
    if (error) {
      console.error("[scorecard] insert failed:", error.message);
      return { ok: false, segment: row.segment };
    }
  } catch (err) {
    console.error("[scorecard] persistence error:", err);
    return { ok: false, segment: row.segment };
  }

  // Fire the lead webhook (first touch of a future drip). Best-effort: failures
  // are logged and swallowed so the visitor's results are never affected.
  await fireLeadWebhook({
    email: data.email,
    businessType: data.businessType || null,
    businessName: data.businessName || null,
    location: data.location || null,
    website: data.website || null,
    branch: data.branch,
    segment: row.segment,
    tier: row.tier,
    percent: row.percent,
    playbookUrl: playbookUrl(row.segment),
  });

  return { ok: true, segment: row.segment };
}

interface LeadEvent {
  email: string;
  businessType: string | null;
  businessName: string | null;
  location: string | null;
  website: string | null;
  branch: string;
  segment: string;
  tier: string | null;
  percent: number | null;
  playbookUrl: string;
}

async function fireLeadWebhook(event: LeadEvent): Promise<void> {
  const url = scorecardWebhookUrl();
  if (!url) return; // No webhook configured yet — the drip is wired later.
  try {
    await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ type: "scorecard.completed", ...event }),
      // Don't let a slow consumer hold the request open.
      signal: AbortSignal.timeout(4000),
    });
  } catch (err) {
    console.error("[scorecard] webhook failed:", err);
  }
}
