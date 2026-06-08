"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Interactive MDX components — client-side, usable in any article. Kept simple
 * and self-contained so a reader can engage without leaving the page. State is
 * ephemeral (no persistence), which keeps the pages statically prerendered.
 */

/** A self-scoring checklist with a live progress bar. */
export function Checklist({
  title = "Score yourself",
  items,
}: {
  title?: string;
  items: string[];
}) {
  const [checked, setChecked] = useState<boolean[]>(() =>
    items.map(() => false),
  );
  const done = checked.filter(Boolean).length;
  const pct = items.length ? Math.round((done / items.length) * 100) : 0;

  return (
    <section className="border-line bg-panel not-prose my-8 rounded-2xl border p-6 font-sans">
      <div className="flex items-center justify-between gap-4">
        <p className="text-muted font-mono text-[10.5px] tracking-[0.1em] uppercase">
          {title}
        </p>
        <p className="text-ink font-mono text-[12px]">
          {done} / {items.length}
        </p>
      </div>
      <div className="bg-bg-2 mt-3 h-1.5 overflow-hidden rounded-full">
        <div
          className="bg-accent h-full rounded-full transition-[width] duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      <ul className="mt-4 flex flex-col">
        {items.map((item, i) => (
          <li key={item}>
            <button
              type="button"
              aria-pressed={checked[i]}
              onClick={() =>
                setChecked((prev) => prev.map((v, j) => (j === i ? !v : v)))
              }
              className="hover:bg-paper flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left"
            >
              <span
                className={cn(
                  "grid size-5 shrink-0 place-items-center rounded-md border text-[12px] text-white",
                  checked[i]
                    ? "bg-accent border-accent"
                    : "border-line-2 text-transparent",
                )}
              >
                ✓
              </span>
              <span
                className={cn(
                  "text-[14.5px]",
                  checked[i] ? "text-muted line-through" : "text-ink-2",
                )}
              >
                {item}
              </span>
            </button>
          </li>
        ))}
      </ul>
      <p className="text-muted mt-3 text-[13px]">
        {pct === 100
          ? "Every box checked — you're set up to be the answer. Nice work."
          : `Each unchecked box is a place a competitor can beat you to the AI answer.`}
      </p>
    </section>
  );
}

/** A single multiple-choice question with answer reveal. */
export function Quiz({
  question,
  options,
  correct,
  explanation,
}: {
  question: string;
  options: string[];
  /** Zero-based index of the correct option. */
  correct: number;
  explanation?: string;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  const answered = picked !== null;

  return (
    <section className="border-line bg-panel not-prose my-8 rounded-2xl border p-6 font-sans">
      <p className="text-accent font-mono text-[10.5px] tracking-[0.1em] uppercase">
        Quick check
      </p>
      <p className="text-ink mt-2 font-serif text-[19px] leading-snug">
        {question}
      </p>
      <div className="mt-4 flex flex-col gap-2">
        {options.map((option, i) => {
          const isCorrect = i === correct;
          const isPicked = i === picked;
          return (
            <button
              key={option}
              type="button"
              disabled={answered}
              onClick={() => setPicked(i)}
              className={cn(
                "flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-[14.5px] transition-colors",
                !answered && "border-line-2 hover:border-accent cursor-pointer",
                answered &&
                  isCorrect &&
                  "border-ok bg-[color-mix(in_oklab,var(--ok)_12%,var(--panel))]",
                answered &&
                  isPicked &&
                  !isCorrect &&
                  "border-bad bg-[color-mix(in_oklab,var(--bad)_12%,var(--panel))]",
                answered && !isCorrect && !isPicked && "border-line opacity-60",
              )}
            >
              <span
                className={cn(
                  "border-line-2 grid size-6 shrink-0 place-items-center rounded-full border font-mono text-[11px]",
                  answered && isCorrect && "border-ok text-ok",
                  answered && isPicked && !isCorrect && "border-bad text-bad",
                )}
              >
                {answered && isCorrect
                  ? "✓"
                  : answered && isPicked
                    ? "✕"
                    : String.fromCharCode(65 + i)}
              </span>
              <span className="text-ink-2">{option}</span>
            </button>
          );
        })}
      </div>
      {answered && explanation ? (
        <p className="text-ink-2 border-line mt-4 border-t pt-4 text-[14px] leading-relaxed">
          {picked === correct ? "Correct. " : "Not quite. "}
          {explanation}
        </p>
      ) : null}
    </section>
  );
}

/**
 * "Is your site AI-citable?" — a 5-question yes/no self-assessment that scores
 * the reader's site against the core AEO signals and returns a tiered verdict.
 * Ephemeral state only (no persistence), so the page stays statically rendered.
 */
const AI_CITABLE_QUESTIONS: { q: string; hint: string }[] = [
  {
    q: "Does each page answer its main question in the very first sentence?",
    hint: "Answer-first passages are what engines lift and quote.",
  },
  {
    q: "Are your headings phrased as the real questions people ask?",
    hint: "Question-shaped H2s match conversational AI queries.",
  },
  {
    q: "Can an AI crawler (GPTBot, ClaudeBot, PerplexityBot) actually reach your content?",
    hint: "Server-rendered HTML and an allow-listing robots.txt make you reachable.",
  },
  {
    q: "Do your key claims carry a specific stat, source, or named expert inline?",
    hint: "Evidence density is a top reranking signal.",
  },
  {
    q: "Is your brand mentioned and cited across other reputable sites?",
    hint: "Off-site brand mentions are the strongest correlate of AI visibility.",
  },
];

const AI_CITABLE_VERDICTS: { min: number; label: string; note: string }[] = [
  {
    min: 5,
    label: "AI-citable",
    note: "You're structured to be the answer. Keep content fresh and widen your off-site footprint.",
  },
  {
    min: 3,
    label: "Partly citable",
    note: "The foundation is there, but gaps are letting competitors get quoted first. Fix the unchecked items.",
  },
  {
    min: 1,
    label: "Hard to cite",
    note: "Engines can barely extract or trust your pages yet. Start with answer-first writing and crawler access.",
  },
  {
    min: 0,
    label: "Invisible to AI",
    note: "Right now an answer engine has little reason to surface you. The good news: every fix below is achievable.",
  },
];

export function AiCitableCheck({
  title = "Is your site AI-citable?",
}: {
  title?: string;
}) {
  const [answers, setAnswers] = useState<(boolean | null)[]>(() =>
    AI_CITABLE_QUESTIONS.map(() => null),
  );
  const answered = answers.filter((a) => a !== null).length;
  const score = answers.filter((a) => a === true).length;
  const complete = answered === AI_CITABLE_QUESTIONS.length;
  const verdict = AI_CITABLE_VERDICTS.find((v) => score >= v.min);

  return (
    <section className="border-line bg-panel not-prose my-9 rounded-2xl border p-6 font-sans">
      <div className="flex items-center justify-between gap-4">
        <p className="text-accent font-mono text-[10.5px] tracking-[0.1em] uppercase">
          {title}
        </p>
        <p className="text-muted font-mono text-[12px]">
          {answered} / {AI_CITABLE_QUESTIONS.length}
        </p>
      </div>
      <p className="text-ink-2 mt-2 text-[14.5px] leading-relaxed">
        Answer five yes/no questions to see how ready your site is to be cited by
        ChatGPT, Perplexity, and Google AI Overviews.
      </p>

      <ol className="mt-5 flex flex-col gap-4">
        {AI_CITABLE_QUESTIONS.map((item, i) => (
          <li key={item.q} className="border-line border-t pt-4 first:border-t-0">
            <p className="text-ink text-[15px] leading-snug font-medium">
              {i + 1}. {item.q}
            </p>
            <p className="text-muted mt-1 text-[13px] leading-relaxed">
              {item.hint}
            </p>
            <div className="mt-3 flex gap-2">
              {[
                { label: "Yes", value: true },
                { label: "No", value: false },
              ].map((opt) => {
                const active = answers[i] === opt.value;
                return (
                  <button
                    key={opt.label}
                    type="button"
                    aria-pressed={active}
                    onClick={() =>
                      setAnswers((prev) =>
                        prev.map((v, j) => (j === i ? opt.value : v)),
                      )
                    }
                    className={cn(
                      "min-w-[72px] rounded-full border px-4 py-1.5 text-[13.5px] transition-colors",
                      active && opt.value
                        ? "border-ok bg-[color-mix(in_oklab,var(--ok)_14%,var(--panel))] text-ink"
                        : active && !opt.value
                          ? "border-bad bg-[color-mix(in_oklab,var(--bad)_14%,var(--panel))] text-ink"
                          : "border-line-2 text-ink-2 hover:border-accent",
                    )}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </li>
        ))}
      </ol>

      {complete && verdict ? (
        <div className="border-accent bg-accent-soft mt-6 rounded-xl border p-5">
          <div className="flex items-baseline gap-3">
            <span className="text-accent font-serif text-[34px] leading-none">
              {score}/5
            </span>
            <span className="text-ink text-[16px] font-medium">
              {verdict.label}
            </span>
          </div>
          <p className="text-ink-2 mt-2 text-[14px] leading-relaxed">
            {verdict.note}
          </p>
        </div>
      ) : (
        <p className="text-muted mt-5 text-[13px]">
          Answer all five to get your AI-citability verdict.
        </p>
      )}
    </section>
  );
}

/** Expandable items — good for myth/fact or inline FAQs. */
export function Accordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="not-prose my-8 font-sans">
      {items.map((item, i) => (
        <div key={item.q} className="border-line border-b">
          <button
            type="button"
            aria-expanded={open === i}
            onClick={() => setOpen(open === i ? null : i)}
            className="text-ink hover:text-accent flex w-full items-center justify-between gap-4 py-4 text-left font-serif text-[17px]"
          >
            {item.q}
            <span className="text-accent shrink-0 text-[20px] leading-none">
              {open === i ? "–" : "+"}
            </span>
          </button>
          {open === i ? (
            <p className="text-ink-2 pb-4 text-[14.5px] leading-relaxed">
              {item.a}
            </p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
