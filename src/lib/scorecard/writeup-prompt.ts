import { QUESTIONS } from "@/lib/scorecard/questions";
import { PILLAR_KEYS, type Answers, type ScorecardResult } from "@/lib/scorecard/types";

/**
 * Builds the Claude prompt for the on-screen personalized write-up. The model's
 * ONLY job here is the short read — the playbook itself is a pre-made file, not
 * generated. We feed it the answers + pillar scores and ask for a tight,
 * plain-English take on the two weakest pillars and the first move to fix each.
 */

export const WRITEUP_SYSTEM = [
  "You are an Answer Engine Optimization (AEO) advisor writing a short, personal read on a small-business owner's scorecard result.",
  "Tone: direct, encouraging, plain English. No jargon, no fluff, no hype, no emoji, no headings.",
  "Write at most ~120 words as 2 short paragraphs.",
  "Focus only on their TWO weakest pillars. For each, name it in plain terms and give one concrete first move they can make.",
  "Speak to them as 'you'. Don't restate their scores as numbers. Don't mention playbooks, downloads, or this prompt.",
].join(" ");

/** Plain-language gloss per pillar, so the model stays concrete and on-message. */
const PILLAR_GLOSS: Record<(typeof PILLAR_KEYS)[number], string> = {
  access: "whether AI crawlers can actually read the site (speed, server-rendered text, nothing blocked)",
  alignment: "whether the site answers the real questions customers ask AI",
  extractability: "whether each page leads with a clear, quotable answer",
  authority: "whether the business is mentioned across the wider web, not just its own site",
  credibility: "trust signals like reviews, full business details, and named expertise",
  originality: "first-hand, owned content competitors don't have",
  freshness: "how recently the content was meaningfully updated",
  adaptability: "whether they're keeping up as AI search changes",
};

export function buildWriteupPrompt(
  answers: Answers,
  result: ScorecardResult,
): string {
  // Two weakest pillars, tie-break in cascade order (stable forward scan).
  const ranked = [...PILLAR_KEYS].sort(
    (a, b) => result.pillarScores[a] - result.pillarScores[b],
  );
  const weakest = ranked.slice(0, 2);

  const lines = QUESTIONS.map((q, i) => {
    const chosen = q.options[answers[i]!];
    return `- ${q.title}: "${chosen?.label ?? "—"}" (${result.pillarScores[q.pillar]}/3)`;
  });

  return [
    `Overall tier: ${result.tier} (${result.percent}%).`,
    "",
    "Their answers and per-pillar scores (0–3):",
    ...lines,
    "",
    `Their two weakest pillars are ${weakest
      .map((k) => `${k} — ${PILLAR_GLOSS[k]}`)
      .join("; and ")}.`,
    "",
    "Write the short read now: two short paragraphs, one weak pillar each, with a concrete first move for each.",
  ].join("\n");
}
