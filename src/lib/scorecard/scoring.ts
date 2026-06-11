import { QUESTIONS } from "@/lib/scorecard/questions";
import {
  PILLAR_KEYS,
  type Answers,
  type PillarKey,
  type PillarScores,
  type ScorecardResult,
  type Segment,
  type Tier,
} from "@/lib/scorecard/types";

/**
 * Deterministic scoring for the 8-Pillar Scorecard. Pure functions, no I/O — so
 * the client can score instantly (and resolve the download with zero latency)
 * and the server can recompute the exact same result from the raw answers
 * before persisting, never trusting client-sent scores.
 */

/** 8 pillars × 3 points = 24. */
export const MAX_SCORE = QUESTIONS.length * 3;

/** Map a complete answer set (option indices) to per-pillar 0–3 scores. */
export function scorePillars(answers: Answers): PillarScores {
  const scores = {} as PillarScores;
  QUESTIONS.forEach((q, i) => {
    const option = q.options[answers[i]!];
    scores[q.pillar] = option ? option.points : 0;
  });
  return scores;
}

/** Tier from total score, by percent of the 24-point maximum. */
export function tierFor(total: number): Tier {
  const pct = (total / MAX_SCORE) * 100;
  if (pct >= 80) return "The Answer";
  if (pct >= 55) return "Emerging";
  if (pct >= 30) return "At Risk";
  return "Invisible";
}

/**
 * The lowest-scoring pillar, breaking ties in cascade order (PILLAR_KEYS is
 * defined earliest-wins, so a simple forward scan does it).
 */
function weakestPillar(scores: PillarScores): PillarKey {
  let worst: PillarKey = PILLAR_KEYS[0];
  for (const key of PILLAR_KEYS) {
    if (scores[key] < scores[worst]) worst = key;
  }
  return worst;
}

/**
 * Resolve the playbook key (= lead segment) for a result:
 * - Invisible tier  → "foundations" overlay (everything's weak)
 * - The Answer tier → "hold-your-lead" overlay (even the weakest pillar is strong)
 * - otherwise       → the weakest single pillar (tie-break order)
 */
export function resolveSegment(
  scores: PillarScores,
  tier: Tier,
): { segment: Segment; weakest: PillarKey | null } {
  if (tier === "Invisible") return { segment: "foundations", weakest: null };
  if (tier === "The Answer")
    return { segment: "hold-your-lead", weakest: null };
  const weakest = weakestPillar(scores);
  return { segment: weakest, weakest };
}

/** The full result for a set of answers — the one entry point both sides use. */
export function scoreSubmission(answers: Answers): ScorecardResult {
  const pillarScores = scorePillars(answers);
  const total = (Object.values(pillarScores) as number[]).reduce(
    (a, b) => a + b,
    0,
  );
  const percent = Math.round((total / MAX_SCORE) * 100);
  const tier = tierFor(total);
  const { segment, weakest } = resolveSegment(pillarScores, tier);
  return { pillarScores, total, percent, tier, segment, weakestPillar: weakest };
}
