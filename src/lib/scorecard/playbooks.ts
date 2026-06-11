import type { Segment } from "@/lib/scorecard/types";

/**
 * The pre-made playbooks. Each `Segment` maps 1:1 to a PDF already sitting in
 * the public Supabase Storage bucket `playbooks/<segment>.pdf`. We never
 * generate these — we select the one matching the visitor's resolved segment.
 *
 * The public-object URL is fully deterministic, so the client can build the
 * download link the instant it resolves a segment — no API call, no latency.
 */

/** Public storage bucket holding the pre-made playbook PDFs. */
export const PLAYBOOK_BUCKET = "playbooks";

export interface Playbook {
  /** Short title shown on the download card. */
  title: string;
  /** One-line promise of what the playbook fixes. */
  blurb: string;
}

export const PLAYBOOKS: Record<Segment, Playbook> = {
  access: {
    title: "The Access Playbook",
    blurb: "Make every page readable to AI crawlers — fast, server-rendered, unblocked.",
  },
  alignment: {
    title: "The Alignment Playbook",
    blurb: "Build pages around the real questions your customers ask out loud.",
  },
  extractability: {
    title: "The Extractability Playbook",
    blurb: "Put the quotable answer first, in a passage AI can lift cleanly.",
  },
  authority: {
    title: "The Authority Playbook",
    blurb: "Earn the mentions across the web that AI already trusts.",
  },
  credibility: {
    title: "The Credibility Playbook",
    blurb: "Add the reviews, details, and named expertise that signal trust.",
  },
  originality: {
    title: "The Originality Playbook",
    blurb: "Become the primary source AI can't find anywhere else.",
  },
  freshness: {
    title: "The Freshness Playbook",
    blurb: "Keep content current so engines never read you as expired.",
  },
  adaptability: {
    title: "The Adaptability Playbook",
    blurb: "Build a system that keeps pace as AI search keeps changing.",
  },
  foundations: {
    title: "The AEO Foundations Playbook",
    blurb: "Start here: the first moves that make AI see you at all.",
  },
  "hold-your-lead": {
    title: "The Hold-Your-Lead Playbook",
    blurb: "You're built to be cited — here's how to stay the answer.",
  },
};

/**
 * Public download URL for a segment's playbook. Deterministic from the public
 * Supabase URL + bucket + key, so it resolves client-side with zero latency.
 * Requires `NEXT_PUBLIC_SUPABASE_URL` (inlined by Next at build time) and the
 * `playbooks` bucket to be public (see migration 0002).
 */
export function playbookUrl(segment: Segment): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) {
    throw new Error(
      "[scorecard] NEXT_PUBLIC_SUPABASE_URL is required to resolve playbook downloads.",
    );
  }
  return `${base.replace(/\/$/, "")}/storage/v1/object/public/${PLAYBOOK_BUCKET}/${segment}.pdf`;
}
