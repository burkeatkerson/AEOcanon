import type { Metadata } from "next";
import { absoluteUrl, siteConfig } from "@/lib/site";

/**
 * Central metadata builder. Every route derives its Next `Metadata` from
 * frontmatter through this helper so title/description/canonical/OG/Twitter are
 * consistent and the canonical URL is always set (and always absolute, recomputed
 * from NEXT_PUBLIC_SITE_URL at request time rather than baked at content build).
 */
export function buildMetadata({
  title,
  description,
  path,
  type = "website",
  publishedTime,
  modifiedTime,
  authors,
  images,
}: {
  title: string;
  description: string;
  /** Site-relative canonical path, e.g. "/learn/what-is-aeo". */
  path: string;
  type?: "website" | "article" | "profile";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  images?: string[];
}): Metadata {
  const url = absoluteUrl(path);
  const ogImages = images?.map((src) => absoluteUrl(src));

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type,
      url,
      title,
      description,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      ...(ogImages ? { images: ogImages } : {}),
      ...(type === "article" ? { publishedTime, modifiedTime, authors } : {}),
    },
    twitter: {
      card: ogImages ? "summary_large_image" : "summary",
      title,
      description,
      site: siteConfig.twitter,
      ...(ogImages ? { images: ogImages } : {}),
    },
  };
}
