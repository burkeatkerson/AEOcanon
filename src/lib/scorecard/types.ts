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

/** The four result tiers, by percent of the 24-point maximum. */
export type Tier = "The Answer" | "Emerging" | "At Risk" | "Invisible";

/**
 * The resolved playbook key stored as the lead's `segment` — a closed enum a
 * later drip campaign branches on. Eight single-pillar playbooks plus two
 * tier overlays. Order matters: it doubles as the Postgres enum definition.
 */
export const SEGMENT_KEYS = [
  ...PILLAR_KEYS,
  "foundations", // overlay: served when everything is weak (Invisible tier)
  "hold-your-lead", // overlay: served when even the weakest pillar is strong
] as const;

export type Segment = (typeof SEGMENT_KEYS)[number];

/**
 * One answer per question = the selected option index (0–3). Index order in
 * `QUESTIONS` is the canonical pillar order, so a complete set is 8 indices.
 */
export const answersSchema = z
  .array(z.number().int().min(0).max(3))
  .length(PILLAR_KEYS.length);

export type Answers = z.infer<typeof answersSchema>;

/** Per-pillar 0–3 score, keyed by pillar. */
export type PillarScores = Record<PillarKey, number>;

/** The full deterministic result derived from a set of answers. */
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

/** Payload the client posts to the submit action (after the email gate). */
export const submissionSchema = z.object({
  email: z.string().trim().email(),
  businessName: z.string().trim().max(200).optional().or(z.literal("")),
  website: z.string().trim().max(300).optional().or(z.literal("")),
  answers: answersSchema,
  /** Honeypot — must stay empty; a value means a bot filled it. */
  company: z.string().max(0).optional().default(""),
});

export type Submission = z.infer<typeof submissionSchema>;
