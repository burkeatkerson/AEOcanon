import type { Tier } from "@/lib/scorecard/types";

/**
 * Static, on-brand copy for the scorecard. Kept here (not inline in components)
 * so the wording is reviewable in one place and reusable across the UI and the
 * email/webhook payload.
 */

/** Business-type step — the first question, framed as the quiz already starting. */
export const BUSINESS_TYPE_STEP = {
  eyebrow: "The 8-Pillar AEO Scorecard",
  prompt: "First — what kind of business is this?",
  sub: "So we can read your result the way AI reads your industry.",
  placeholder: "Choose your industry…",
  otherLabel: "Something else",
  otherPlaceholder: "Tell us what you do",
  cta: "Continue",
} as const;

/** Website step — framed as a free benefit, with the no-site escape hatch. */
export const WEBSITE_STEP = {
  prompt: "What's your website?",
  sub: "We'll check your site for you while you answer — free. It only sharpens your result; you can skip it.",
  placeholder: "yourbusiness.com",
  noSite: "I don't have a website yet",
  cta: "Continue",
  checking: "We'll read it in the background while you answer.",
} as const;

/** Email gate, shown after the bare score (copy fixed by the brief). */
export const EMAIL_STEP = {
  heading: "See your full breakdown.",
  sub: "Your score is just the headline. Tell us where to send the full pillar-by-pillar breakdown, your personalized read, and a playbook matched to your biggest gap.",
  button: "Show my full results",
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

/**
 * The no-website branch is framed as a STARTING POINT, never a failing score.
 * The finding is simple: AEO begins with a site engines can read, and they
 * don't have one yet — so there's nothing wrong, just a clear first move.
 */
export const NO_WEBSITE = {
  eyebrow: "Your starting point",
  heading: "AEO starts with a site AI can actually read.",
  blurb:
    "Here's the honest read: answer engines like ChatGPT and Google's AI recommend businesses from pages they can crawl, quote, and trust. You're not behind — you just don't have that home base yet. Everything you already do off-site becomes the fuel once it's in place.",
  /** Headline on the bare (pre-email) screen. */
  bareHeadline: "You've got the makings — you just need a home base AI can read.",
  /** Primary CTA toward the build / done-for-you offer. */
  ctaTitle: "Let's build the site engines recommend.",
  ctaBody:
    "Our done-for-you build gives you a fast, AI-readable site wired to the eight pillars from day one — so you start getting named, not skipped.",
  ctaButton: "See how we build it",
} as const;
