/**
 * Central site configuration. Single source of truth for brand-level constants
 * consumed by SEO infra (metadata, JSON-LD, sitemap, robots, llms.txt, RSS).
 */

const FALLBACK_URL = "https://aeocanon.com";

/** Absolute site origin, no trailing slash. Override via NEXT_PUBLIC_SITE_URL. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? FALLBACK_URL
).replace(/\/$/, "");

export const siteConfig = {
  name: "AEO Canon",
  shortName: "AEOcanon",
  url: SITE_URL,
  /** Answer-first one-liner used as the default meta description. */
  description:
    "Practical, answer-first guidance on Answer Engine Optimization (AEO) and SEO — a continuously expanding library for marketers and operators.",
  locale: "en_US",
  twitter: "@aeocanon",
  /** Organization entity reused across JSON-LD graphs. */
  organization: {
    name: "AEO Canon",
    legalName: "AEO Canon",
  },
} as const;

/** Build an absolute URL from a site-relative path (always leading slash). */
export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
