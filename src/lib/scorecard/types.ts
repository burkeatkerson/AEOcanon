import { z } from "zod";

/**
 * Shared contract for the 8-Pillar AEO Scorecard. These types are the single
 * source of truth for both the client UI (instant scoring + download) and the
 * server action (recompute + persist), so the two can never drift.
 */

/** The eight Canon pillars, in cascade / tie-break order (earliest wins a tie). */
export const PILLAR_KEYS = [
  "access",
  "alignment",
  "extractability",
  "authority",
  "credibility",
  "originality",
  "freshness",
  "adaptability",
] as const;

export type PillarKey = (typeof PILLAR_KEYS)[number];

/**
 * Which path a visitor took. The single website field decides it: a real owned
 * site → has_website (and a background read); "no site yet" or a social profile
 * → no_website (the off-site path). Stored as a clean enum for later campaign
 * segmentation.
 */
export type Branch = "has_website" | "no_website";

/** The four result tiers, by percent of the 24-point maximum (has_website only). */
export type Tier = "The Answer" | "Emerging" | "At Risk" | "Invisible";

/**
 * The resolved playbook key stored as the lead's `segment` — a closed enum a
 * later drip campaign branches on. Eight single-pillar playbooks plus two
 * tier overlays. Order matters: it doubles as the Postgres enum definition.
 */
export const SEGMENT_KEYS = [
  ...PILLAR_KEYS,
  "foundations", // overlay: served when everything is weak, OR the no-website path
  "hold-your-lead", // overlay: served when even the weakest pillar is strong
] as const;

export type Segment = (typeof SEGMENT_KEYS)[number];

/** The off-site questions (no-website branch). They frame the result, not score it. */
export const OFFSITE_KEYS = ["gbp", "reviews", "social", "discovery"] as const;
export type OffsiteKey = (typeof OFFSITE_KEYS)[number];

/**
 * One answer per question = the selected option index (0–3). Index order in
 * `QUESTIONS` is the canonical pillar order, so a complete set is 8 indices.
 */
export const answersSchema = z
  .array(z.number().int().min(0).max(3))
  .length(PILLAR_KEYS.length);

export type Answers = z.infer<typeof answersSchema>;

/** Off-site answers: one option index per off-site question, in OFFSITE_KEYS order. */
export const offsiteSchema = z
  .array(z.number().int().min(0).max(3))
  .length(OFFSITE_KEYS.length);

export type OffsiteAnswers = z.infer<typeof offsiteSchema>;

/** Per-pillar 0–3 score, keyed by pillar. */
export type PillarScores = Record<PillarKey, number>;

/** The full deterministic result for the scored (has_website) branch. */
export interface ScorecardResult {
  pillarScores: PillarScores;
  total: number;
  /** 0–100, rounded for display. */
  percent: number;
  tier: Tier;
  /** Lowest pillar (tie-break order) or a tier overlay. */
  segment: Segment;
  /** The pillar that drove the segment (null for tier overlays). */
  weakestPillar: PillarKey | null;
}

/**
 * Compact result of quietly reading the visitor's site in the background while
 * they answer. Enriches/fact-checks the write-up; never drives the score and
 * never surfaces an error (a failed read is simply `{ ok: false }`).
 */
export interface SiteRead {
  ok: boolean;
  finalUrl?: string;
  title?: string;
  metaDescription?: string;
  h1?: string;
  headings?: string[];
  wordCount?: number;
  hasJsonLd?: boolean;
  hasFaqSchema?: boolean;
  detectedName?: string;
}

/** Fields shared by both branches' submissions. */
const leadFields = {
  email: z.string().trim().email(),
  businessType: z.string().trim().max(120).optional().default(""),
  businessName: z.string().trim().max(200).optional().default(""),
  location: z.string().trim().max(200).optional().default(""),
  website: z.string().trim().max(300).optional().default(""),
  siteRead: z.unknown().optional(),
  /** Honeypot — must stay empty; a value means a bot filled it. */
  company: z.string().max(0).optional().default(""),
};

/** Payload the client posts to the submit action, discriminated by branch. */
export const submissionSchema = z.discriminatedUnion("branch", [
  z.object({ branch: z.literal("has_website"), answers: answersSchema, ...leadFields }),
  z.object({ branch: z.literal("no_website"), offsite: offsiteSchema, ...leadFields }),
]);

export type Submission = z.infer<typeof submissionSchema>;

/** Lead context every write-up request carries, so the model can personalize. */
const writeupLeadFields = {
  businessType: z.string().max(120).optional().default(""),
  businessName: z.string().max(200).optional().default(""),
  location: z.string().max(200).optional().default(""),
  website: z.string().max(300).optional().default(""),
};

/** Payload the client posts to the streaming write-up route. */
export const writeupSchema = z.discriminatedUnion("branch", [
  z.object({
    branch: z.literal("has_website"),
    answers: answersSchema,
    siteRead: z.unknown().optional(),
    ...writeupLeadFields,
  }),
  z.object({
    branch: z.literal("no_website"),
    offsite: offsiteSchema,
    ...writeupLeadFields,
  }),
]);

export type WriteupRequest = z.infer<typeof writeupSchema>;
