"use client";

import { useState } from "react";
import type { KnowledgeQuestion } from "@/lib/courses";
import { cn } from "@/lib/utils";

/**
 * A lesson knowledge check — a short set of multiple-choice questions that
 * reveal the correct answer and an explanation once picked, with a running
 * score. Vanilla React state, no persistence, so the page stays static.
 */
export function KnowledgeCheck({
  questions,
}: {
  questions: KnowledgeQuestion[];
}) {
  const [picked, setPicked] = useState<(number | null)[]>(() =>
    questions.map(() => null),
  );
  const answered = picked.filter((p) => p !== null).length;
  const score = picked.filter((p, i) => p === questions[i]!.correct).length;
  const done = answered === questions.length;

  return (
    <section className="border-line bg-panel not-prose my-8 rounded-2xl border p-6 font-sans">
      <div className="flex items-center justify-between gap-4">
        <p className="text-accent font-mono text-[10.5px] tracking-[0.1em] uppercase">
          Knowledge check
        </p>
        <p className="text-muted font-mono text-[12px]">
          {answered} / {questions.length}
        </p>
      </div>

      <ol className="mt-4 flex flex-col gap-6">
        {questions.map((q, qi) => {
          const chosen = picked[qi];
          const isAnswered = chosen !== null;
          return (
            <li key={q.question}>
              <p className="text-ink font-serif text-[18px] leading-snug">
                {qi + 1}. {q.question}
              </p>
              <div className="mt-3 flex flex-col gap-2">
                {q.options.map((option, oi) => {
                  const isCorrect = oi === q.correct;
                  const isPicked = oi === chosen;
                  return (
                    <button
                      key={option}
                      type="button"
                      disabled={isAnswered}
                      onClick={() =>
                        setPicked((prev) =>
                          prev.map((v, j) => (j === qi ? oi : v)),
                        )
                      }
                      className={cn(
                        "flex items-center gap-3 rounded-xl border px-4 py-2.5 text-left text-[14.5px] transition-colors",
                        !isAnswered &&
                          "border-line-2 hover:border-accent cursor-pointer",
                        isAnswered &&
                          isCorrect &&
                          "border-ok bg-[color-mix(in_oklab,var(--ok)_12%,var(--panel))]",
                        isAnswered &&
                          isPicked &&
                          !isCorrect &&
                          "border-bad bg-[color-mix(in_oklab,var(--bad)_12%,var(--panel))]",
                        isAnswered &&
                          !isCorrect &&
                          !isPicked &&
                          "border-line opacity-60",
                      )}
                    >
                      <span
                        className={cn(
                          "border-line-2 grid size-6 shrink-0 place-items-center rounded-full border font-mono text-[11px]",
                          isAnswered && isCorrect && "border-ok text-ok",
                          isAnswered &&
                            isPicked &&
                            !isCorrect &&
                            "border-bad text-bad",
                        )}
                      >
                        {isAnswered && isCorrect
                          ? "✓"
                          : isAnswered && isPicked
                            ? "✕"
                            : String.fromCharCode(65 + oi)}
                      </span>
                      <span className="text-ink-2">{option}</span>
                    </button>
                  );
                })}
              </div>
              {isAnswered ? (
                <p className="text-ink-2 border-line mt-3 border-l-2 pl-3 text-[13.5px] leading-relaxed">
                  {chosen === q.correct ? "Correct. " : "Not quite. "}
                  {q.explanation}
                </p>
              ) : null}
            </li>
          );
        })}
      </ol>

      {done ? (
        <p className="border-line text-ink mt-6 border-t pt-4 font-mono text-[13px]">
          You scored {score} / {questions.length}.{" "}
          {score === questions.length
            ? "Perfect — you've got this lesson down."
            : "Review the lesson above, then continue."}
        </p>
      ) : null}
    </section>
  );
}
