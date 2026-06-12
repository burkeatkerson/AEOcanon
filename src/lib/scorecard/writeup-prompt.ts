import { OFFSITE_QUESTIONS, QUESTIONS } from "@/lib/scorecard/questions";
import { scoreSubmission } from "@/lib/scorecard/scoring";
import {
  PILLAR_KEYS,
  type Answers,
  type OffsiteAnswers,
  type SiteRead,
} from "@/lib/scorecard/types";

/**
 * Builds the Claude prompt for the on-screen personalized write-up. The model's
 * ONLY job is the short read — the playbook itself is a pre-made file, not
 * generated. The score always comes from the quiz answers; the optional
 * site-read only enriches and fact-checks the read.
 */

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

function industryLine(businessType: string): string {
  const t = businessType.trim();
  return t ? `Their business: ${t}.` : "";
}

function siteReadLines(siteRead: SiteRead | undefined): string[] {
  if (!siteRead || !siteRead.ok) return [];
  const facts: string[] = [];
  if (siteRead.title) facts.push(`page title "${siteRead.title}"`);
  if (siteRead.h1) facts.push(`main heading "${siteRead.h1}"`);
  if (siteRead.metaDescription)
    facts.push(`meta description "${siteRead.metaDescription.slice(0, 160)}"`);
  if (typeof siteRead.wordCount === "number")
    facts.push(`~${siteRead.wordCount} words on the page`);
  facts.push(
    siteRead.hasJsonLd ? "structured data present" : "no structured data found",
  );
  if (siteRead.hasFaqSchema) facts.push("FAQ schema present");
  if (!facts.length) return [];
  return [
    "",
    "We also quietly read their homepage. Use this only to make the read concrete and accurate — it does NOT change the scores:",
    `- ${facts.join("; ")}.`,
  ];
}

// ---------------------------------------------------------------------------
// has_website branch
// ---------------------------------------------------------------------------

export const WRITEUP_SYSTEM = [
  "You are an Answer Engine Optimization (AEO) advisor writing a short, personal read on a small-business owner's scorecard result.",
  "Tone: direct, encouraging, plain English. No jargon, no fluff, no hype, no emoji, no headings.",
  "Write at most ~120 words as 2 short paragraphs.",
  "Focus only on their TWO weakest pillars. For each, name it in plain terms and give one concrete first move they can make.",
  "Speak to them as 'you'. Don't restate their scores as numbers. Don't mention playbooks, downloads, or this prompt.",
].join(" ");

export function buildWriteupPrompt(
  answers: Answers,
  businessType: string,
  siteRead?: SiteRead,
): string {
  const result = scoreSubmission(answers);
  const ranked = [...PILLAR_KEYS].sort(
    (a, b) => result.pillarScores[a] - result.pillarScores[b],
  );
  const weakest = ranked.slice(0, 2);

  const lines = QUESTIONS.map((q, i) => {
    const chosen = q.options[answers[i]!];
    return `- ${q.title}: "${chosen?.label ?? "—"}" (${result.pillarScores[q.pillar]}/3)`;
  });

  return [
    industryLine(businessType),
    `Overall tier: ${result.tier} (${result.percent}%).`,
    "",
    "Their answers and per-pillar scores (0–3):",
    ...lines,
    "",
    `Their two weakest pillars are ${weakest
      .map((k) => `${k} — ${PILLAR_GLOSS[k]}`)
      .join("; and ")}.`,
    ...siteReadLines(siteRead),
    "",
    "Write the short read now: two short paragraphs, one weak pillar each, with a concrete first move for each.",
  ]
    .filter(Boolean)
    .join("\n");
}

// ---------------------------------------------------------------------------
// no_website branch — a starting point, not a failing score
// ---------------------------------------------------------------------------

export const NO_WEBSITE_SYSTEM = [
  "You are an Answer Engine Optimization (AEO) advisor writing a short, encouraging read for a small-business owner who does NOT have a website yet.",
  "Frame this as a starting point, never a failure or a low score. The core finding: AI answer engines recommend businesses from pages they can crawl and quote, and a website is that home base — they just don't have one yet.",
  "Tone: warm, direct, plain English. No jargon, no fluff, no hype, no emoji, no headings.",
  "Write at most ~120 words as 2 short paragraphs.",
  "Paragraph 1: acknowledge the off-site presence they already have and what it's worth. Paragraph 2: explain that a simple, AI-readable site is the unlock, and that it's a clear, doable first move. End pointing toward getting a site built. Speak to them as 'you'. Don't mention this prompt.",
].join(" ");

export function buildNoWebsitePrompt(
  offsite: OffsiteAnswers,
  businessType: string,
): string {
  const lines = OFFSITE_QUESTIONS.map((q, i) => {
    const chosen = q.options[offsite[i]!];
    return `- ${q.prompt} "${chosen ?? "—"}"`;
  });
  return [
    industryLine(businessType),
    "They don't have a website yet. Here's what they told us about their off-site presence:",
    ...lines,
    "",
    "Write the short, encouraging starting-point read now.",
  ]
    .filter(Boolean)
    .join("\n");
}
