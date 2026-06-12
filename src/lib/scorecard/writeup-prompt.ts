import { OFFSITE_QUESTIONS, QUESTIONS } from "@/lib/scorecard/questions";
import { scoreSubmission } from "@/lib/scorecard/scoring";
import { PILLAR_KEYS, type SiteRead, type WriteupRequest } from "@/lib/scorecard/types";
import { NO_WEBSITE_ADDENDUM } from "@/lib/scorecard/interpretation-framework";

/**
 * Builds the USER message for the interpretation framework — the per-lead data
 * (framework §2). The framework itself is the cached system prompt; this is the
 * variable input it interprets. The score is always recomputed here from the
 * raw answers (client-sent scores are never trusted); the optional site-read
 * only enriches, and is explicitly flagged unavailable when missing so the model
 * never references pages it didn't see.
 */

function companyBlock(req: WriteupRequest): string {
  const lines = [
    `- Business name: ${req.businessName?.trim() || "(not provided)"}`,
    `- Industry / type: ${req.businessType?.trim() || "(not provided)"}`,
    `- Location: ${req.location?.trim() || "(not provided)"}`,
    `- Website: ${req.website?.trim() || "(none provided)"}`,
  ];
  return ["COMPANY", ...lines].join("\n");
}

function siteSignalsBlock(siteRead: SiteRead | undefined): string {
  if (!siteRead || !siteRead.ok) {
    return [
      "SITE SIGNALS",
      "- Unavailable. Run on the answers alone. Do NOT reference any specific page, heading, or wording from their site — you did not read it.",
    ].join("\n");
  }
  const facts: string[] = [];
  if (siteRead.finalUrl) facts.push(`- Read URL: ${siteRead.finalUrl}`);
  if (siteRead.title) facts.push(`- Page title: "${siteRead.title}"`);
  if (siteRead.h1) facts.push(`- Main heading (h1): "${siteRead.h1}"`);
  if (siteRead.headings?.length)
    facts.push(`- Headings seen: ${siteRead.headings.slice(0, 8).map((h) => `"${h}"`).join(", ")}`);
  if (siteRead.metaDescription)
    facts.push(`- Meta description: "${siteRead.metaDescription.slice(0, 200)}"`);
  if (typeof siteRead.wordCount === "number")
    facts.push(`- Homepage word count: ~${siteRead.wordCount}`);
  facts.push(
    `- Structured data (schema): ${siteRead.hasJsonLd ? "present" : "none found"}${siteRead.hasFaqSchema ? "; FAQ schema present" : ""}`,
  );
  return [
    "SITE SIGNALS (observed on their live homepage — use only these, don't extrapolate)",
    ...facts,
  ].join("\n");
}

function buildHasWebsiteContext(
  req: Extract<WriteupRequest, { branch: "has_website" }>,
): string {
  const result = scoreSubmission(req.answers);
  const ranked = [...PILLAR_KEYS].sort(
    (a, b) => result.pillarScores[a] - result.pillarScores[b],
  );

  const ratings = QUESTIONS.map((q, i) => {
    const chosen = q.options[req.answers[i]!];
    return `- ${q.title} (${result.pillarScores[q.pillar]}/3): "${chosen?.label ?? "—"}"`;
  });

  return [
    companyBlock(req),
    "",
    "EIGHT PILLAR RATINGS (0–3, with the exact answer they selected)",
    ...ratings,
    "",
    `OVERALL: ${result.total}/24 = ${result.percent}% → tier "${result.tier}".`,
    `WEAKEST PILLAR (priority order on ties): ${ranked[0]}. Next weakest: ${ranked[1]}.`,
    `STRONGEST PILLAR: ${ranked[ranked.length - 1]}.`,
    "",
    siteSignalsBlock(req.siteRead as SiteRead | undefined),
    "",
    "Now write this business's result in the exact output shape, filling every section.",
  ].join("\n");
}

function buildNoWebsiteContext(
  req: Extract<WriteupRequest, { branch: "no_website" }>,
): string {
  const offsite = OFFSITE_QUESTIONS.map((q, i) => {
    const chosen = q.options[req.offsite[i]!];
    return `- ${q.title} — ${q.prompt} → "${chosen ?? "—"}"`;
  });

  return [
    NO_WEBSITE_ADDENDUM,
    "",
    companyBlock(req),
    "",
    "OFF-SITE ANSWERS (this is what we have instead of pillar ratings)",
    ...offsite,
    "",
    "Now write this business's result in the exact output shape, filling every section.",
  ].join("\n");
}

/** Build the user message for whichever branch the request is. */
export function buildLeadContext(req: WriteupRequest): string {
  return req.branch === "no_website"
    ? buildNoWebsiteContext(req)
    : buildHasWebsiteContext(req);
}
