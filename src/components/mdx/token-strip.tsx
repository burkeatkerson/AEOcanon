"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * TokenStrip — type a sentence and watch it split into the tokens a model
 * actually reads. An approximation (real tokenizers use learned vocabularies),
 * but it makes the abstract "models read tokens, not words" idea concrete, and
 * shows why token count — not word count — is the unit that matters.
 */

// Rough, illustrative sub-word tokenizer: words split into ~3–4 char pieces,
// punctuation and numbers stand alone. Not a real BPE vocabulary.
function tokenize(text: string): string[] {
  const out: string[] = [];
  const parts = text.match(/[A-Za-z]+|[0-9]+|[^\sA-Za-z0-9]/g) ?? [];
  for (const part of parts) {
    if (/^[A-Za-z]+$/.test(part) && part.length > 5) {
      // split long words into sub-word chunks
      for (let i = 0; i < part.length; i += 4) {
        out.push((i === 0 ? "" : "##") + part.slice(i, i + 4));
      }
    } else {
      out.push(part);
    }
  }
  return out;
}

const TONE = ["bg-accent-soft text-accent-2", "bg-bg-2 text-ink-2"];

export function TokenStrip({
  initial = "Answer engine optimization is reshaping search.",
}: {
  initial?: string;
}) {
  const [text, setText] = useState(initial);
  const tokens = useMemo(() => tokenize(text), [text]);
  const chars = text.length;
  const ratio = tokens.length ? (chars / tokens.length).toFixed(1) : "0";

  return (
    <section className="border-line bg-panel not-prose my-9 rounded-2xl border p-5 font-sans sm:p-6">
      <p className="text-accent font-mono text-[10.5px] tracking-[0.1em] uppercase">
        Tokenization · what the model reads
      </p>
      <p className="text-ink-2 mt-2 text-[14.5px] leading-relaxed">
        Models don&apos;t read words — they read <strong>tokens</strong> (whole
        words or word-pieces). Type below and watch your text split.
      </p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={2}
        className="border-line-2 bg-paper text-ink focus:border-accent mt-4 w-full resize-y rounded-xl border px-4 py-3 text-[14.5px] leading-relaxed outline-none"
      />

      <div className="mt-4 flex flex-wrap gap-1.5">
        {tokens.map((t, i) => (
          <span
            key={i}
            className={cn(
              "rounded-md px-2 py-1 font-mono text-[12.5px]",
              TONE[i % 2],
            )}
          >
            {t}
          </span>
        ))}
      </div>

      <div className="border-line mt-4 flex flex-wrap gap-6 border-t pt-4 font-mono text-[12px]">
        <span className="text-ink-2">
          <span className="text-accent font-medium">{tokens.length}</span> tokens
        </span>
        <span className="text-muted">{chars} characters</span>
        <span className="text-muted">≈ {ratio} chars / token</span>
      </div>
      <p className="text-muted mt-3 text-[12px] leading-relaxed">
        Illustrative only — real models use a learned vocabulary. The takeaway
        holds: token count (not word count) drives context limits and cost, so
        tight, plainly-worded passages go further.
      </p>
    </section>
  );
}
