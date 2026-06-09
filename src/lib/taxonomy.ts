/**
 * Canonical taxonomy — the closed sets that content frontmatter is validated
 * against. Imported BOTH by `velite.config.ts` (build-time Zod enums that fail
 * the build on unknown tags) and by the app (labels, filters, navigation).
 *
 * Keep this file lightweight so the Velite config bundler can import it.
 */
import { INDUSTRY_SLUGS, industryName } from "./industries";

/** Educational topic clusters. An article must carry at least one. */
export const TOPIC_SLUGS = [
  "aeo-fundamentals",
  "answer-engines",
  "structured-data",
  "content-strategy",
  "technical-seo",
  "on-page-seo",
  "keyword-research",
  "link-building",
  "local-seo",
  "analytics-measurement",
] as const;

export type TopicSlug = (typeof TOPIC_SLUGS)[number];

export const TOPIC_LABELS: Record<TopicSlug, string> = {
  "aeo-fundamentals": "AEO Fundamentals",
  "answer-engines": "Answer Engines",
  "structured-data": "Structured Data",
  "content-strategy": "Content Strategy",
  "technical-seo": "Technical SEO",
  "on-page-seo": "On-Page SEO",
  "keyword-research": "Keyword Research",
  "link-building": "Link Building",
  "local-seo": "Local SEO",
  "analytics-measurement": "Analytics & Measurement",
};

/** One-line description per topic — used on topic landing pages and listings. */
export const TOPIC_DESCRIPTIONS: Record<TopicSlug, string> = {
  "aeo-fundamentals":
    "The core concepts of Answer Engine Optimization — what it is, how AI answers are built, and why being cited is the new visibility.",
  "answer-engines":
    "How AI answer engines like ChatGPT, Perplexity, and Google AI Overviews retrieve, rank, and cite the sources they quote.",
  "structured-data":
    "Schema.org markup and structured data that help engines parse, understand, and trust what your page is about.",
  "content-strategy":
    "Planning, writing, and structuring content so it earns AI citations and search rankings at the same time.",
  "technical-seo":
    "Crawlability, rendering, and speed — the technical foundations that make your site readable to machines.",
  "on-page-seo":
    "Optimizing individual pages — headings, answer-first passages, internal links — for both search and AI.",
  "keyword-research":
    "Finding the real questions and conversational queries your audience asks, and the intent behind them.",
  "link-building":
    "Earning the links, brand mentions, and off-site authority that answer engines use to decide whom to trust.",
  "local-seo":
    "Getting found by AI and search for location-based, near-me, and service-area queries.",
  "analytics-measurement":
    "Tracking rankings, citation share, and AI referral traffic to prove what is actually working.",
};

export function topicDescription(slug: string): string {
  return TOPIC_DESCRIPTIONS[slug as TopicSlug] ?? "";
}

/** Industry verticals. Articles opt into an industry library via these tags. */
// Verticals are the local-business industries defined in src/lib/industries.ts.
// Article frontmatter `verticals[]` and an industry library's `industryTag`
// validate against this closed set.
export const VERTICAL_SLUGS = INDUSTRY_SLUGS;
export { industryName };

/** Drives which JSON-LD an article emits. */
export const ARTICLE_SCHEMA_TYPES = ["Article", "HowTo", "FAQPage"] as const;
export type ArticleSchemaType = (typeof ARTICLE_SCHEMA_TYPES)[number];

/** Difficulty levels for learning paths. */
export const PATH_LEVELS = ["beginner", "intermediate", "advanced"] as const;
export type PathLevel = (typeof PATH_LEVELS)[number];

export function topicLabel(slug: string): string {
  return TOPIC_LABELS[slug as TopicSlug] ?? slug;
}

export function verticalLabel(slug: string): string {
  return industryName(slug);
}
