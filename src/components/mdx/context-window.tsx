"use client";

import { useState } from "react";

/**
 * ContextWindow — an interactive picture of the token budget an answer engine
 * works inside. The question, the retrieved passages, and reserved answer space
 * all share one fixed window. Drag the controls and watch passages stop fitting —
 * the concrete reason engines retrieve a few tight passages, not whole pages.
 */

const CAP = 8000; // illustrative window size (tokens)
const SYSTEM = 500;
const QUESTION = 80;
const ANSWER = 900; // reserved headroom for the reply

export function ContextWindow() {
  const [count, setCount] = useState(6);
  const [size, setSize] = useState(180);

  const budget = CAP - SYSTEM - QUESTION - ANSWER;
  const fit = Math.max(0, Math.min(count, Math.floor(budget / size)));
  const dropped = count - fit;
  const usedByPassages = fit * size;
  const total = SYSTEM + QUESTION + usedByPassages + ANSWER;

  const seg = (tokens: number) => `${(tokens / CAP) * 100}%`;

  return (
    <section className="border-line bg-panel not-prose my-9 rounded-2xl border p-5 font-sans sm:p-6">
      <p className="text-accent font-mono text-[10.5px] tracking-[0.1em] uppercase">
        The context window · a fixed token budget
      </p>
      <p className="text-ink-2 mt-2 text-[14.5px] leading-relaxed">
        Everything the model considers at once — the question, the retrieved
        passages, and room for the answer — shares <strong>one fixed window</strong>.
        Add passages or make them longer, and some stop fitting.
      </p>

      {/* the window */}
      <div className="border-line-2 bg-paper mt-4 rounded-xl border p-4">
        <div className="bg-bg-2 flex h-9 overflow-hidden rounded-md">
          <div className="grid place-items-center bg-c2 text-[9px] text-white" style={{ width: seg(SYSTEM) }} title="System prompt">
            sys
          </div>
          <div className="grid place-items-center bg-c6 text-[9px] text-white" style={{ width: seg(QUESTION) }} title="Question" />
          {Array.from({ length: fit }).map((_, i) => (
            <div
              key={i}
              className="border-paper grid place-items-center border-r bg-accent text-[9px] text-white"
              style={{ width: seg(size) }}
              title={`Passage ${i + 1}`}
            >
              {size >= 140 ? `p${i + 1}` : ""}
            </div>
          ))}
          <div className="grid place-items-center bg-c3 text-[9px] text-white" style={{ width: seg(ANSWER) }} title="Reserved for the answer">
            answer
          </div>
          <div className="flex-1" />
        </div>
        <div className="text-muted mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10px]">
          <span><span className="inline-block size-2 rounded-sm align-middle bg-c2" /> system</span>
          <span><span className="inline-block size-2 rounded-sm align-middle bg-accent" /> retrieved passages</span>
          <span><span className="inline-block size-2 rounded-sm align-middle bg-c3" /> answer headroom</span>
        </div>
      </div>

      {/* controls */}
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="text-ink-2 flex justify-between text-[13.5px]">
            Passages retrieved <span className="font-mono">{count}</span>
          </span>
          <input type="range" min={1} max={14} value={count} onChange={(e) => setCount(+e.target.value)} className="accent-accent mt-2 w-full" />
        </label>
        <label className="block">
          <span className="text-ink-2 flex justify-between text-[13.5px]">
            Tokens per passage <span className="font-mono">{size}</span>
          </span>
          <input type="range" min={80} max={600} step={20} value={size} onChange={(e) => setSize(+e.target.value)} className="accent-accent mt-2 w-full" />
        </label>
      </div>

      <p className="border-line mt-4 border-t pt-4 text-[14px] leading-relaxed">
        <span className="text-ink font-medium">
          {fit} of {count} passages fit
        </span>
        {dropped > 0 ? (
          <span className="text-bad">
            {" "}
            — {dropped} dropped for lack of room.
          </span>
        ) : (
          <span className="text-ok"> — all fit, with room to spare.</span>
        )}{" "}
        <span className="text-muted">
          (~{total.toLocaleString()} of {CAP.toLocaleString()} tokens used.)
        </span>{" "}
        Tight, self-contained passages win the limited space — the budget reason
        to write answer-first.
      </p>
    </section>
  );
}
