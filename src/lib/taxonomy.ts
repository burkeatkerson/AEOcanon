/**
 * Canonical taxonomy — the closed sets that content frontmatter is validated
 * against. Imported BOTH by `velite.config.ts` (build-time Zod enums that fail
 * the build on unknown tags) and by the app (labels, filters, navigation).
 *
 * Keep this file dependency-free so the Velite config bundler can import it.
 */

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

/** Industry verticals. Articles opt into a vertical hub via these tags. */
export const VERTICAL_SLUGS = [
  "saas",
  "ecommerce",
  "healthcare",
  "financial-services",
  "legal",
  "real-estate",
  "education",
  "hospitality",
  "home-services",
  "professional-services",
] as const;

export type VerticalSlug = (typeof VERTICAL_SLUGS)[number];

export const VERTICAL_LABELS: Record<VerticalSlug, string> = {
  saas: "SaaS",
  ecommerce: "E-commerce",
  healthcare: "Healthcare",
  "financial-services": "Financial Services",
  legal: "Legal",
  "real-estate": "Real Estate",
  education: "Education",
  hospitality: "Hospitality",
  "home-services": "Home Services",
  "professional-services": "Professional Services",
};

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
  return VERTICAL_LABELS[slug as VerticalSlug] ?? slug;
}
