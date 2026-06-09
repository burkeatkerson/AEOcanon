"use client";

import { useState } from "react";
import Link from "next/link";
import { PILLARS } from "@/lib/canon";
import { cn } from "@/lib/utils";

/** One diagnostic yes/no question per pillar, in cascade order. */
const QUESTIONS: { question: string; ifNo: string }[] = [
  {
    question:
      "Can AI crawlers (GPTBot, ClaudeBot, PerplexityBot) fetch your content as server-rendered HTML, without being blocked or hidden behind JavaScript?",
    ifNo: "Engines literally cannot read you. Nothing below matters until this is fixed.",
  },
  {
    question:
      "Are your pages built around the actual questions people ask AI — with those questions used as headings?",
    ifNo: "You may be the best answer to a question no one is asking. Realign to real queries first.",
  },
  {
    question:
      "Does each section answer its question in a complete, self-contained opening sentence?",
    ifNo: "Your answer is hard to lift. Engines cite passages, so make the first sentence quotable.",
  },
  {
    question:
      "Is your brand mentioned and corroborated across reputable third-party sites, not just your own?",
    ifNo: "The web doesn't vouch for you yet. Build off-site mentions before fine-tuning on-page work.",
  },
  {
    question:
      "Does every important claim carry an inline statistic, quotation, or named source?",
    ifNo: "Your claims read as assertions. Show your work — evidence measurably raises AI visibility.",
  },
  {
    question:
      "Do your best pages contain first-hand data or insight that exists nowhere else?",
    ifNo: "You're echoing infinite generic content. Become the primary source engines have to cite.",
  },
  {
    question:
      "Is your key content substantively updated and showing a visible, recent date?",
    ifNo: "Undated or stale content reads as expired. Refresh substantively and show the date.",
  },
  {
    question:
      "Do you measure your citation share per engine and treat each tactic as a testable hypothesis?",
    ifNo: "You're flying blind as engines change. Instrument share of voice and adapt on evidence.",
  },
];

function pillarHref(title: string): string {
  return `/pillars/${title.toLowerCase()}`;
}

/**
 * Step-through diagnostic for the AEO Canon. Walks the eight pillars in cascade
 * order, one yes/no gate at a time, then names the FIRST broken gate — the place
 * to start work — with a link to that pillar's deep-dive.
 */
export function CanonDiagnostic() {
  const [step, setStep] = useState(0); // 0..7 questions, 8 = results
  const [answers, setAnswers] = useState<(boolean | null)[]>(() =>
    PILLARS.map(() => null),
  );

  const answer = (value: boolean) => {
    setAnswers((prev) => prev.map((v, i) => (i === step ? value : v)));
    setStep((s) => s + 1);
  };

  const reset = () => {
    setAnswers(PILLARS.map(() => null));
    setStep(0);
  };

  const atResults = step >= PILLARS.length;
  const firstFail = answers.findIndex((a) => a === false);
  const pillar = PILLARS[Math.min(step, PILLARS.length - 1)]!;
  const q = QUESTIONS[Math.min(step, QUESTIONS.length - 1)]!;

  return (
    <section className="border-line bg-panel not-prose my-9 rounded-2xl border p-6 font-sans">
      <div className="flex items-center justify-between gap-4">
        <p className="text-accent font-mono text-[10.5px] tracking-[0.1em] uppercase">
          Canon diagnostic
        </p>
        <p className="text-muted font-mono text-[12px]">
          {atResults ? "Result" : `Gate ${step + 1} / ${PILLARS.length}`}
        </p>
      </div>

      {/* progress */}
      <div className="bg-bg-2 mt-3 h-1.5 overflow-hidden rounded-full">
        <div
          className="bg-accent h-full rounded-full transition-[width] duration-300"
          style={{
            width: `${(Math.min(step, PILLARS.length) / PILLARS.length) * 100}%`,
          }}
        />
      </div>

      {!atResults ? (
        <div className="mt-5">
          <div
            className="flex items-center gap-2 font-mono text-[10.5px] tracking-[0.12em] uppercase"
            style={{ color: pillar.color }}
          >
            <span className="font-serif text-[13px]">
              Pillar {String(pillar.n).padStart(2, "0")}
            </span>
            · {pillar.title} · {pillar.layer}
          </div>
          <p className="text-ink mt-3 font-serif text-[19px] leading-snug">
            {q.question}
          </p>
          <div className="mt-5 flex gap-2.5">
            <button
              type="button"
              onClick={() => answer(true)}
              className="border-ok bg-[color-mix(in_oklab,var(--ok)_10%,var(--panel))] text-ink hover:bg-[color-mix(in_oklab,var(--ok)_18%,var(--panel))] min-w-[96px] rounded-full border px-5 py-2 text-[14px] font-medium transition-colors"
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => answer(false)}
              className="border-bad bg-[color-mix(in_oklab,var(--bad)_10%,var(--panel))] text-ink hover:bg-[color-mix(in_oklab,var(--bad)_18%,var(--panel))] min-w-[96px] rounded-full border px-5 py-2 text-[14px] font-medium transition-colors"
            >
              No
            </button>
          </div>
          {step > 0 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="text-muted hover:text-accent mt-4 font-mono text-[11.5px]"
            >
              ← Back
            </button>
          ) : null}
        </div>
      ) : (
        <div className="mt-5">
          {firstFail === -1 ? (
            <div className="border-ok rounded-xl border bg-[color-mix(in_oklab,var(--ok)_8%,var(--panel))] p-5">
              <p className="text-ink font-serif text-[20px] leading-snug">
                Every gate holds.
              </p>
              <p className="text-ink-2 mt-2 text-[14px] leading-relaxed">
                You pass all eight pillars. Your work now is Adaptability —
                instrument citation share per engine and keep what the data
                confirms as the engines change.
              </p>
            </div>
          ) : (
            <div
              className="rounded-xl border p-5"
              style={{
                borderColor: PILLARS[firstFail]!.color,
                background: `color-mix(in oklab, ${PILLARS[firstFail]!.color} 8%, var(--panel))`,
              }}
            >
              <p className="text-muted font-mono text-[10.5px] tracking-[0.12em] uppercase">
                Your first broken gate
              </p>
              <p className="text-ink mt-2 font-serif text-[22px] leading-tight">
                Pillar {PILLARS[firstFail]!.n}: {PILLARS[firstFail]!.title}
              </p>
              <p className="text-ink-2 mt-2 text-[14.5px] leading-relaxed">
                {QUESTIONS[firstFail]!.ifNo} Because the Canon is a cascade, this
                is where to start — fixing pillars below it won't help until this
                one holds.
              </p>
              <Link
                href={pillarHref(PILLARS[firstFail]!.title)}
                className="text-accent mt-3 inline-block font-mono text-[12px]"
              >
                Read the {PILLARS[firstFail]!.title} pillar →
              </Link>
            </div>
          )}

          {/* recap */}
          <ul className="mt-5 flex flex-col gap-1.5">
            {PILLARS.map((p, i) => (
              <li
                key={p.n}
                className="border-line flex items-center gap-3 border-b py-2 text-[13.5px] last:border-b-0"
              >
                <span
                  className={cn(
                    "grid size-5 shrink-0 place-items-center rounded-full text-[11px] text-white",
                    answers[i] ? "bg-ok" : "bg-bad",
                  )}
                >
                  {answers[i] ? "✓" : "✕"}
                </span>
                <Link
                  href={pillarHref(p.title)}
                  className="text-ink-2 hover:text-accent"
                >
                  {p.n}. {p.title}
                </Link>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={reset}
            className="border-line-2 text-ink-2 hover:border-accent mt-5 rounded-full border px-4 py-1.5 font-mono text-[11.5px]"
          >
            ↻ Run again
          </button>
        </div>
      )}
    </section>
  );
}
