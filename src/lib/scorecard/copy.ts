import type { Tier } from "@/lib/scorecard/types";

/**
 * Static, on-brand copy for the scorecard. Kept here (not inline in components)
 * so the wording is reviewable in one place and reusable across the UI and the
 * email/webhook payload.
 */

/** Intro screen shown before the first question. */
export const INTRO = {
  eyebrow: "The 8-Pillar AEO Scorecard",
  heading: "Is AI recommending you — or your competitor?",
  sub: "Eight quick questions. You'll get an instant grade across the eight pillars that decide who AI names, plus a playbook matched to your biggest gap.",
  meta: "8 questions · about a minute · no jargon",
  cta: "Start the scorecard",
} as const;

/** Email gate, shown after the last question (copy fixed by the brief). */
export const EMAIL_STEP = {
  heading: "Your scorecard is ready.",
  sub: "Tell us where to send it — you'll get your full breakdown and a playbook matched to your biggest gap, right now.",
  button: "Show my results",
  microcopy:
    "Your results and playbook, plus the occasional AEO insight. Unsubscribe anytime.",
} as const;

/** Tier blurb shown at the top of the results (copy fixed by the brief). */
export const TIER_BLURB: Record<Tier, string> = {
  "The Answer":
    "You're built to be cited. AI engines can read you, trust you, and quote you. Now it's about holding the lead.",
  Emerging:
    "You're on the radar. The foundation is there, but a few gaps are letting competitors get named ahead of you. Close them and you become the pick.",
  "At Risk":
    "You're slipping through the cracks. AI can find you, but it has little reason to recommend you yet — and competitors are filling that gap.",
  Invisible:
    "Right now, AI doesn't see you. When customers ask, it's naming someone else. The good news: every gap on this scorecard is fixable.",
};

/** Accent color used for the tier badge/grade ring. */
export const TIER_COLOR: Record<Tier, string> = {
  "The Answer": "var(--ok)",
  Emerging: "var(--c4)",
  "At Risk": "var(--warn)",
  Invisible: "var(--bad)",
};
