import { PILLARS } from "@/lib/canon";
import type { PillarKey } from "@/lib/scorecard/types";

/**
 * The eight scorecard questions — one per Canon pillar, in pillar order. Each is
 * single-select with four options carrying a hidden point value (3/2/1/0). The
 * points exist for scoring only and are NEVER rendered to the visitor.
 *
 * Pillar titles, layers, and colors come from the Canon (`@/lib/canon`) so the
 * quiz, the /pillars pages, and the results breakdown can never drift.
 */

export interface QuestionOption {
  label: string;
  /** Hidden scoring value. Never shown in the UI. */
  points: 0 | 1 | 2 | 3;
}

export interface Question {
  pillar: PillarKey;
  /** Pillar display title (from Canon), e.g. "Access". */
  title: string;
  /** Canon layer label, e.g. "Foundation". */
  layer: string;
  /** CSS var for the layer color, e.g. "var(--c2)". */
  color: string;
  /** The question prompt shown to the visitor. */
  prompt: string;
  options: QuestionOption[];
}

/** Per-pillar prompt + the four options (already in 3→0 order). */
const QUESTION_COPY: Record<
  PillarKey,
  { prompt: string; options: [string, string, string, string] }
> = {
  access: {
    prompt: "When AI tools try to read your website, what are they working with?",
    options: [
      "A fast, mobile-friendly site of normal text pages — nothing hidden behind logins or popups",
      "Mostly fine, but a few pages are slow or stuck behind forms",
      "It's slow, heavy, or built mostly from images and PDFs",
      "Not sure — I don't really control how it's built",
    ],
  },
  alignment: {
    prompt: "How well does your site match the questions customers actually ask?",
    options: [
      "I have pages built around the real questions customers ask out loud",
      "My content touches those questions, but only indirectly",
      "My site mostly lists my services, not customer questions",
      "I don't really know what my customers ask AI",
    ],
  },
  extractability: {
    prompt: "When one of your pages answers a question, where's the answer?",
    options: [
      "Right at the top, in a clear sentence or two",
      "It's there, but a few paragraphs down",
      "Mixed into long marketing copy",
      "My pages don't directly answer questions",
    ],
  },
  authority: {
    prompt: "Beyond your own site, how present is your business across the web?",
    options: [
      "We're mentioned on directories, reviews, press, and other sites",
      "A handful of mentions out there",
      "Barely anything beyond our own pages",
      "Nothing I'm aware of",
    ],
  },
  credibility: {
    prompt: "What trust signals does your site show?",
    options: [
      "Real reviews, full business details, named people with credentials",
      "Some reviews and clear contact info",
      "Just a basic contact page",
      "Little to none",
    ],
  },
  originality: {
    prompt: "How different is your content from every competitor's?",
    options: [
      "We share our own data, photos, process, or take — things only we have",
      "Some original pieces mixed with standard info",
      "About the same as everyone else in our field",
      "It's generic or templated",
    ],
  },
  freshness: {
    prompt: "When did you last meaningfully update your content?",
    options: [
      "Within the last month",
      "In the last few months",
      "Over a year ago",
      "I can't remember",
    ],
  },
  adaptability: {
    prompt: "How are you keeping up as AI search changes?",
    options: [
      "We actively track it and adjust our site",
      "We've made a few recent changes",
      "We know it's shifting but haven't acted",
      "This is the first time I'm really looking",
    ],
  },
};

/** Options always descend 3 → 0 (best answer first). */
const POINTS: [3, 2, 1, 0] = [3, 2, 1, 0];

/**
 * The questions, ordered by Canon pillar number (1–8) — which is also the
 * tie-break order. Built from the Canon so labels/colors stay in sync.
 */
export const QUESTIONS: Question[] = [...PILLARS]
  .sort((a, b) => a.n - b.n)
  .map((pillar) => {
    const key = pillar.title.toLowerCase() as PillarKey;
    const copy = QUESTION_COPY[key];
    return {
      pillar: key,
      title: pillar.title,
      layer: pillar.layer,
      color: pillar.color,
      prompt: copy.prompt,
      options: copy.options.map((label, i) => ({
        label,
        points: POINTS[i]!,
      })),
    };
  });

export const QUESTION_COUNT = QUESTIONS.length;
