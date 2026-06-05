import "server-only";
import { pagespeedApiKey } from "@/lib/env";
import type { CoreWebVitals } from "./types";

/**
 * Google PageSpeed Insights (Lighthouse) v5 client. Returns typed Core Web
 * Vitals for an audited URL. This calls Google's API directly (a trusted
 * endpoint), so it does NOT go through the SSRF `safeFetch` — but it still
 * carries a hard timeout. Lab metrics come from the Lighthouse result; INP is a
 * field metric pulled from CrUX when available.
 */
export type PageSpeedStrategy = "mobile" | "desktop";

const ENDPOINT = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";

interface LighthouseAudit {
  numericValue?: number;
}

interface PsiResponse {
  lighthouseResult?: {
    categories?: { performance?: { score?: number | null } };
    audits?: Record<string, LighthouseAudit | undefined>;
  };
  loadingExperience?: {
    metrics?: {
      INTERACTION_TO_NEXT_PAINT?: { percentile?: number };
    };
  };
}

function metric(
  audits: Record<string, LighthouseAudit | undefined> | undefined,
  key: string,
): number | null {
  const value = audits?.[key]?.numericValue;
  return typeof value === "number" ? value : null;
}

export async function getPageSpeed(
  url: string,
  strategy: PageSpeedStrategy = "mobile",
  timeoutMs = 30_000,
): Promise<CoreWebVitals> {
  const params = new URLSearchParams({
    url,
    strategy,
    key: pagespeedApiKey(),
  });
  params.append("category", "performance");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  let data: PsiResponse;
  try {
    const res = await fetch(`${ENDPOINT}?${params.toString()}`, {
      signal: controller.signal,
      headers: { accept: "application/json" },
    });
    if (!res.ok) {
      throw new Error(`PageSpeed Insights request failed (${res.status}).`);
    }
    data = (await res.json()) as PsiResponse;
  } finally {
    clearTimeout(timer);
  }

  const audits = data.lighthouseResult?.audits;
  const score = data.lighthouseResult?.categories?.performance?.score;
  const inp =
    data.loadingExperience?.metrics?.INTERACTION_TO_NEXT_PAINT?.percentile;

  return {
    lcpMs: metric(audits, "largest-contentful-paint"),
    cls: metric(audits, "cumulative-layout-shift"),
    inpMs: typeof inp === "number" ? inp : null,
    fcpMs: metric(audits, "first-contentful-paint"),
    tbtMs: metric(audits, "total-blocking-time"),
    performanceScore:
      typeof score === "number" ? Math.round(score * 100) : null,
  };
}
