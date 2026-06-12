import "server-only";
import * as cheerio from "cheerio";
import { safeFetch } from "@/lib/audit/safe-fetch";
import type { SiteRead } from "@/lib/scorecard/types";

/**
 * Quietly read a visitor's site to ENRICH and fact-check the write-up — never to
 * score them and never to crawl deeply. One page, hardened fetch (SSRF guard,
 * timeout, size cap), a handful of signals. This never throws: any failure
 * (blocked host, timeout, non-HTML, parse error) returns `{ ok: false }` so the
 * flow falls back silently to the visitor's own answers.
 */
export async function readSite(rawUrl: string): Promise<SiteRead> {
  try {
    const res = await safeFetch(rawUrl, { timeoutMs: 8_000, maxBytes: 1_000_000 });
    if (res.status >= 400) return { ok: false };
    if (!res.contentType?.toLowerCase().includes("html")) return { ok: false };

    const $ = cheerio.load(res.body);
    $("script, style, noscript, template").remove();

    const title = $("title").first().text().trim() || undefined;
    const metaDescription =
      $('meta[name="description"]').attr("content")?.trim() || undefined;
    const h1 = $("h1").first().text().trim() || undefined;
    const headings = $("h1, h2")
      .slice(0, 12)
      .map((_, el) => $(el).text().trim())
      .get()
      .filter(Boolean);

    const bodyText = $("body").text().replace(/\s+/g, " ").trim();
    const wordCount = bodyText ? bodyText.split(" ").length : 0;

    const jsonLdBlocks = $('script[type="application/ld+json"]');
    const hasJsonLd = jsonLdBlocks.length > 0;
    const ldText = jsonLdBlocks.text().toLowerCase();
    const hasFaqSchema = ldText.includes("faqpage");
    const detectedName =
      $('meta[property="og:site_name"]').attr("content")?.trim() || undefined;

    return {
      ok: true,
      finalUrl: res.finalUrl,
      title,
      metaDescription,
      h1,
      headings: headings.length ? headings : undefined,
      wordCount,
      hasJsonLd,
      hasFaqSchema,
      detectedName,
    };
  } catch {
    return { ok: false };
  }
}
