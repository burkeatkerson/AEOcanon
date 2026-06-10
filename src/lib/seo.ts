import type { Metadata } from "next";
import { absoluteUrl, ogImageUrl, OG_IMAGE_SIZE, siteConfig } from "@/lib/site";

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
  /** Short kicker rendered on the generated social card, e.g. "AEO School". */
  eyebrow,
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
  eyebrow?: string;
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  images?: string[];
}): Metadata {
  const url = absoluteUrl(path);
  // Prefer an explicit image (e.g. an article cover); otherwise fall back to the
  // dynamically generated branded card so EVERY page has a large social image.
  const ogImages = images?.length
    ? images.map((src) => ({ url: absoluteUrl(src) }))
    : [
        {
          url: ogImageUrl({ title, eyebrow }),
          width: OG_IMAGE_SIZE.width,
          height: OG_IMAGE_SIZE.height,
          alt: title,
        },
      ];

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
      images: ogImages,
      ...(type === "article" ? { publishedTime, modifiedTime, authors } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: siteConfig.twitter,
      images: ogImages.map((img) => img.url),
    },
  };
}
