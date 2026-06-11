"use server";

import { createServiceClient } from "@/lib/db/supabase/server";
import { scorecardWebhookUrl } from "@/lib/env";
import { playbookUrl } from "@/lib/scorecard/playbooks";
import { scoreSubmission } from "@/lib/scorecard/scoring";
import { submissionSchema, type Submission } from "@/lib/scorecard/types";

/**
 * Persist a scorecard submission and fire the (optional) lead webhook. Called
 * from the client AFTER results already render — it never gates the on-screen
 * download. Scores are recomputed server-side from the raw answers; client-sent
 * scores are never trusted. Returns a tiny status so the UI can show a quiet
 * "saved / couldn't save" note without ever blocking the results.
 */
export async function submitScorecard(
  input: Submission,
): Promise<{ ok: boolean; segment: string | null }> {
  const parsed = submissionSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, segment: null };
  }
  const { email, businessName, website, answers, company } = parsed.data;

  // Honeypot: a filled "company" field means a bot. Accept silently, store nothing.
  if (company && company.length > 0) {
    return { ok: true, segment: null };
  }

  const result = scoreSubmission(answers);

  try {
    const supabase = createServiceClient();
    const { error } = await supabase.from("scorecard_submissions").insert({
      email,
      business_name: businessName || null,
      website: website || null,
      answers,
      pillar_scores: result.pillarScores,
      total_score: result.total,
      percent: result.percent,
      tier: result.tier,
      segment: result.segment,
    });
    if (error) {
      console.error("[scorecard] insert failed:", error.message);
      return { ok: false, segment: result.segment };
    }
  } catch (err) {
    console.error("[scorecard] persistence error:", err);
    return { ok: false, segment: result.segment };
  }

  // Fire the lead webhook (first touch of a future drip). Best-effort: failures
  // are logged and swallowed so the visitor's results are never affected.
  await fireLeadWebhook({
    email,
    businessName: businessName || null,
    website: website || null,
    segment: result.segment,
    tier: result.tier,
    percent: result.percent,
    playbookUrl: playbookUrl(result.segment),
  });

  return { ok: true, segment: result.segment };
}

interface LeadEvent {
  email: string;
  businessName: string | null;
  website: string | null;
  segment: string;
  tier: string;
  percent: number;
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
