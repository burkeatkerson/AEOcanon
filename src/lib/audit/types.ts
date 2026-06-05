/**
 * Shared contracts for the audit tool. These types are the stable interface
 * between the (later) analyzer, the API route, the AI summary, and the UI. No
 * analysis logic lives here — only the shapes and a couple of pure helpers.
 *
 * `severity` deliberately distinguishes the two buckets the brief calls for:
 * a "quick-fix" (cheap, mechanical) vs a "structural" (deeper) issue.
 */

export type Severity = "quick-fix" | "structural";

export type FindingStatus = "pass" | "warn" | "fail" | "info";

export type FindingCategory =
  | "seo"
  | "ai-readiness"
  | "performance"
  | "crawlability"
  | "content"
  | "technical";

export interface Finding {
  /** Stable slug, e.g. "missing-meta-description". */
  id: string;
  category: FindingCategory;
  title: string;
  status: FindingStatus;
  severity: Severity;
  /** Factual description of what was observed (never speculative). */
  detail: string;
  /** Raw observed value, e.g. the actual <title> text. Optional. */
  evidence?: string;
  /** Suggested next step. Optional. */
  recommendation?: string;
}

export interface CoreWebVitals {
  lcpMs: number | null;
  cls: number | null;
  inpMs: number | null;
  fcpMs: number | null;
  tbtMs: number | null;
  /** Lighthouse performance score, 0–100. */
  performanceScore: number | null;
}

export interface AuditScores {
  /** Each 0–100. */
  seo: number;
  aiReadiness: number;
  performance: number;
  overall: number;
}

/** Validated input to an audit run. */
export interface AuditInput {
  url: string;
}

export interface AuditReport {
  url: string;
  normalizedUrl: string;
  /** ISO timestamp of when the page was fetched. */
  fetchedAt: string;
  /** Detected CMS/framework, or null if unknown. */
  platform: string | null;
  /** True if key content only appears after client-side JS. */
  requiresJavaScript: boolean;
  findings: Finding[];
  vitals: CoreWebVitals | null;
  scores: AuditScores;
}

// --- Pure helpers (no I/O) --------------------------------------------------

export function emptyScores(): AuditScores {
  return { seo: 0, aiReadiness: 0, performance: 0, overall: 0 };
}

/** Count findings by severity — handy for headline summaries. */
export function countBySeverity(findings: Finding[]): Record<Severity, number> {
  return findings.reduce<Record<Severity, number>>(
    (acc, finding) => {
      acc[finding.severity] += 1;
      return acc;
    },
    { "quick-fix": 0, structural: 0 },
  );
}
