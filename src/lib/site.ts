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
  /**
   * Booking link for sales/service conversations. The prominent, primary way
   * for prospects to reach Burke — used across service CTAs and the /contact
   * hub. Override per-environment via NEXT_PUBLIC_CALENDLY_URL.
   */
  calendlyUrl:
    process.env.NEXT_PUBLIC_CALENDLY_URL ??
    "https://calendly.com/atkerson/phonecall",
  /** Organization entity reused across JSON-LD graphs. */
  organization: {
    name: "AEO Canon",
    legalName: "AEO Canon",
    /**
     * Brand logo for Organization JSON-LD. STOPGAP: points at the SVG mark.
     * Replace with a raster (PNG ≥112×112, solid/transparent bg) per Google's
     * logo guidelines when one is available.
     */
    logo: "/logo.svg",
    /**
     * Verified canonical profiles for the Organization (`sameAs`). Left empty
     * until real URLs are confirmed — emitting unverified/placeholder profiles
     * is worse than omitting them. Add the real X / LinkedIn / GitHub URLs here.
     */
    sameAs: [] as string[],
  },
} as const;

/** Build an absolute URL from a site-relative path (always leading slash). */
export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Deterministic URL for the dynamically generated social card (`/og`). Used by
 * both the metadata layer (OpenGraph/Twitter) and JSON-LD `image` so a page's
 * social image and its structured-data image are always the same asset.
 */
export function ogImageUrl(opts: { title: string; eyebrow?: string }): string {
  const params = new URLSearchParams({ title: opts.title });
  if (opts.eyebrow) params.set("eyebrow", opts.eyebrow);
  return absoluteUrl(`/og?${params.toString()}`);
}

/** Canonical dimensions of the generated OG card, shared by route + metadata. */
export const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const;
