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
