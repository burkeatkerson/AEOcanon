/**
 * Typed access to the State of AEO survey data. The numbers live in a plain JSON
 * file (src/data/state-of-aeo-2026.json) so they can be updated without touching
 * the page — drop in verified results and flip `status` to "final". Everything
 * here is the single source of truth the report page and its JSON-LD read from.
 */
import raw from "@/data/state-of-aeo-2026.json";

export interface ChartDatum {
  label: string;
  value: number;
  /** Optional display override (e.g. "15%"); defaults to `${value}${unit}`. */
  display?: string;
}

export interface Chart {
  type: "hbar";
  unit: string;
  max: number;
  data: ChartDatum[];
}

export interface Finding {
  /** Anchor + stable id so each stat is independently linkable. */
  id: string;
  question: string;
  /** Standalone, quotable, answer-first stat sentence. */
  stat: string;
  detail: string;
  chart: Chart;
  source?: string;
}

export interface Methodology {
  sampleSize: number;
  fieldStart: string;
  fieldEnd: string;
  method: string;
  population: string;
  margin?: string;
  notes?: string;
}

export interface ExecutiveSummaryItem {
  findingId: string;
  sentence: string;
}

export interface StateOfAeo {
  status: "placeholder" | "final";
  edition: string;
  title: string;
  subtitle: string;
  published: string;
  updated: string;
  authorSlug: string;
  methodologyCredit: string;
  canonicalPath: string;
  license: string;
  licenseLabel: string;
  placeholderNote: string;
  executiveSummary: ExecutiveSummaryItem[];
  findings: Finding[];
  methodology: Methodology;
}

export const stateOfAeo2026 = raw as StateOfAeo;

/** Resolve a finding by id (e.g. for the executive summary links). */
export function getFinding(id: string): Finding | undefined {
  return stateOfAeo2026.findings.find((f) => f.id === id);
}

/** True while the dataset still holds illustrative placeholder figures. */
export function isPlaceholder(): boolean {
  return stateOfAeo2026.status === "placeholder";
}
