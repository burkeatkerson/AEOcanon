import type { Branch } from "@/lib/scorecard/types";

/**
 * Isomorphic website-field handling. The single website field does two jobs:
 * capture the URL AND choose the branch. This runs on the client (to branch
 * instantly and decide whether to kick off the background read) and is safe to
 * import anywhere — no server-only deps. The server still re-validates every
 * fetched URL through the SSRF guard before reading.
 */

/** Hosts that are social/marketplace profiles, not an owned site engines crawl. */
const SOCIAL_HOSTS = [
  "facebook.com",
  "fb.com",
  "instagram.com",
  "linkedin.com",
  "twitter.com",
  "x.com",
  "tiktok.com",
  "youtube.com",
  "yelp.com",
  "nextdoor.com",
  "pinterest.com",
  "threads.net",
  "t.me",
  "wa.me",
  "linktr.ee",
  "google.com", // e.g. a Google Business Profile / maps link
  "g.page",
  "business.site", // Google's free site builder — not an owned domain
  "wixsite.com",
];

export interface WebsiteClassification {
  /** Empty input — proceed down the has_website branch with no read. */
  isBlank: boolean;
  /** A social/marketplace profile — treat as no owned site. */
  isSocial: boolean;
  /** Normalized https URL when it looks like a real owned site, else null. */
  url: string | null;
  /** The branch this input implies (before any explicit "no site" choice). */
  branch: Branch;
}

function hostMatches(host: string, suffix: string): boolean {
  return host === suffix || host.endsWith(`.${suffix}`);
}

/** Classify a raw website field value into a branch + normalized URL. */
export function classifyWebsite(raw: string): WebsiteClassification {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { isBlank: true, isSocial: false, url: null, branch: "has_website" };
  }

  const withProto = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  let parsed: URL;
  try {
    parsed = new URL(withProto);
  } catch {
    // Unparseable — keep it (we'll store the raw text) but don't try to read it.
    return { isBlank: false, isSocial: false, url: null, branch: "has_website" };
  }

  const host = parsed.hostname.replace(/^www\./, "").toLowerCase();
  const isSocial = SOCIAL_HOSTS.some((s) => hostMatches(host, s));
  if (isSocial) {
    return { isBlank: false, isSocial: true, url: null, branch: "no_website" };
  }

  return {
    isBlank: false,
    isSocial: false,
    url: parsed.toString(),
    branch: "has_website",
  };
}
