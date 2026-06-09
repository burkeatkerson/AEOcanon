"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Citable-passage scorer. Paste a paragraph and get a live 9-point score against
 * the properties of an extractable passage. Pure client-side heuristics — no
 * network calls, no persistence — so the host article stays statically rendered.
 * It is intentionally a rough estimate, not a guarantee; the copy says so.
 */

type Status = "pass" | "warn" | "fail";

interface Check {
  name: string;
  status: Status;
  detail: string;
}

const FILLER_OPENERS =
  /^(in this (article|post|guide|piece)|there (are|is|'?s)|when it comes to|in today'?s|over the years|as (a|an|the|we)|welcome|have you ever|let'?s|in order to|first,?\s|nowadays|in the world of|it'?s no secret)/i;

const ORPHAN_OPENERS =
  /^(this|that|these|those|it|they|he|she|here|there|however|also|additionally|moreover|furthermore|but|and|so|because|which|such|then|thus|therefore)\b/i;

const ATTRIBUTION =
  /\b(according to|study|studies|research|researchers|data|survey|analysis|found that|reported|measured|per |source)\b/i;

const STOPWORDS = new Set([
  "the", "a", "an", "and", "or", "but", "of", "to", "in", "on", "for", "with",
  "is", "are", "was", "were", "be", "been", "it", "that", "this", "as", "at",
  "by", "from", "your", "you", "we", "they", "their", "its", "can", "will",
  "not", "than", "more", "most", "into", "if", "when", "how", "what", "which",
]);

function analyze(raw: string): { checks: Check[]; words: number } {
  const text = raw.trim();
  const words = text.length ? text.split(/\s+/).filter(Boolean) : [];
  const wc = words.length;
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const first = sentences[0] ?? text;
  const firstWords = first ? first.split(/\s+/).filter(Boolean).length : 0;
  const avgLen = sentences.length ? wc / sentences.length : wc;

  // Repetition / keyword-stuffing detection on content words.
  const freq = new Map<string, number>();
  for (const w of words) {
    const k = w.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (k.length > 3 && !STOPWORDS.has(k)) freq.set(k, (freq.get(k) ?? 0) + 1);
  }
  const maxRepeat = Math.max(0, ...freq.values());

  // Specificity: numbers + proper-noun-like tokens (capitalized, not sentence-start).
  const hasNumber = /\d/.test(text);
  const properNouns = (text.match(/(?<=[a-z,]\s)[A-Z][a-zA-Z]+/g) ?? []).length;

  const checks: Check[] = [
    {
      name: "Answer-first",
      ...(FILLER_OPENERS.test(first)
        ? { status: "fail" as Status, detail: "Opens with throat-clearing — lead with the answer itself." }
        : /\?\s*$/.test(first)
          ? { status: "warn" as Status, detail: "Opens with a question. State the answer in sentence one." }
          : { status: "pass" as Status, detail: "First sentence makes a direct claim." }),
    },
    {
      name: "Self-contained",
      ...(ORPHAN_OPENERS.test(first)
        ? { status: "fail" as Status, detail: `Starts with "${first.split(/\s+/)[0]}" — an orphan reference that needs prior context.` }
        : { status: "pass" as Status, detail: "Makes sense lifted out of context." }),
    },
    {
      name: "Right-sized (120–180w)",
      ...(wc >= 120 && wc <= 180
        ? { status: "pass" as Status, detail: `${wc} words — in the citable sweet spot.` }
        : wc >= 80 && wc <= 230
          ? { status: "warn" as Status, detail: `${wc} words — aim for 120–180.` }
          : { status: "fail" as Status, detail: `${wc} words — ${wc < 120 ? "too thin to fully answer" : "too long to lift whole"}.` }),
    },
    {
      name: "Specific",
      ...(hasNumber || properNouns >= 2
        ? { status: "pass" as Status, detail: "Contains concrete numbers or named specifics." }
        : properNouns === 1
          ? { status: "warn" as Status, detail: "Only one specific detail — add numbers or names." }
          : { status: "fail" as Status, detail: "Reads generic — no numbers, names, or specifics." }),
    },
    {
      name: "Evidenced",
      ...(hasNumber && (/%/.test(text) || ATTRIBUTION.test(text))
        ? { status: "pass" as Status, detail: "Has a statistic or attributed source." }
        : hasNumber || ATTRIBUTION.test(text)
          ? { status: "warn" as Status, detail: "Add an attributed stat or named source." }
          : { status: "fail" as Status, detail: "No evidence — claims are unsupported." }),
    },
    {
      name: "Single-purpose",
      ...(sentences.length >= 2 && sentences.length <= 7
        ? { status: "pass" as Status, detail: `${sentences.length} sentences — a focused, single answer.` }
        : sentences.length <= 10
          ? { status: "warn" as Status, detail: `${sentences.length} sentence${sentences.length === 1 ? "" : "s"} — keep one passage to one question.` }
          : { status: "fail" as Status, detail: `${sentences.length} sentences — likely covering several questions at once.` }),
    },
    {
      name: "Plainly written",
      ...(avgLen <= 22
        ? { status: "pass" as Status, detail: `~${Math.round(avgLen)} words/sentence — easy to parse.` }
        : avgLen <= 30
          ? { status: "warn" as Status, detail: `~${Math.round(avgLen)} words/sentence — tighten the long ones.` }
          : { status: "fail" as Status, detail: `~${Math.round(avgLen)} words/sentence — run-on sentences are hard to lift.` }),
    },
    {
      name: "Structurally clean",
      ...(maxRepeat <= 3
        ? { status: "pass" as Status, detail: "No keyword stuffing or repetition." }
        : maxRepeat <= 5
          ? { status: "warn" as Status, detail: "A word repeats often — check for keyword stuffing." }
          : { status: "fail" as Status, detail: "Heavy repetition reads as keyword stuffing (penalized)." }),
    },
    {
      name: "Quotable opener",
      ...(firstWords > 0 && firstWords <= 28
        ? { status: "pass" as Status, detail: `Opening sentence is ${firstWords} words — clean to quote.` }
        : firstWords <= 40
          ? { status: "warn" as Status, detail: `Opening sentence is ${firstWords} words — shorten it.` }
          : { status: "fail" as Status, detail: `Opening sentence is ${firstWords} words — too long to lift.` }),
    },
  ];

  return { checks, words: wc };
}

const TONE: Record<Status, { dot: string; text: string; glyph: string }> = {
  pass: { dot: "bg-ok", text: "text-ok", glyph: "✓" },
  warn: { dot: "bg-warn", text: "text-warn", glyph: "!" },
  fail: { dot: "bg-bad", text: "text-bad", glyph: "✕" },
};

export function PassageScorer({
  title = "Score your passage",
}: {
  title?: string;
}) {
  const [text, setText] = useState("");
  const { checks } = useMemo(() => analyze(text), [text]);
  const touched = text.trim().length > 0;

  const score = checks.reduce(
    (sum, c) => sum + (c.status === "pass" ? 1 : c.status === "warn" ? 0.5 : 0),
    0,
  );
  const rounded = Math.round(score * 10) / 10;
  const verdict =
    score >= 8
      ? "Highly citable — an engine can lift this cleanly."
      : score >= 6
        ? "Close. Fix the flagged items and it's quotable."
        : score >= 3
          ? "Workable raw material, but an engine would skip it as-is."
          : "Not yet extractable — rebuild it answer-first.";

  return (
    <section className="border-line bg-panel not-prose my-9 rounded-2xl border p-6 font-sans">
      <div className="flex items-center justify-between gap-4">
        <p className="text-accent font-mono text-[10.5px] tracking-[0.1em] uppercase">
          {title}
        </p>
        {touched ? (
          <p className="text-ink font-mono text-[12px]">
            {rounded} / 9
          </p>
        ) : null}
      </div>
      <p className="text-ink-2 mt-2 text-[14.5px] leading-relaxed">
        Paste a paragraph below. It&apos;s scored in your browser against the nine
        properties of a citable passage — nothing is sent anywhere.
      </p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
        placeholder="Paste a paragraph from your page…"
        className="border-line-2 bg-paper text-ink focus:border-accent mt-4 w-full resize-y rounded-xl border px-4 py-3 text-[14.5px] leading-relaxed outline-none"
      />

      {touched ? (
        <>
          <div className="bg-bg-2 mt-4 h-1.5 overflow-hidden rounded-full">
            <div
              className="bg-accent h-full rounded-full transition-[width] duration-300"
              style={{ width: `${(score / 9) * 100}%` }}
            />
          </div>
          <ul className="mt-4 flex flex-col gap-px">
            {checks.map((c) => {
              const t = TONE[c.status];
              return (
                <li
                  key={c.name}
                  className="hover:bg-paper flex items-start gap-3 rounded-lg px-2 py-2"
                >
                  <span
                    className={cn(
                      "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full text-[11px] text-white",
                      t.dot,
                    )}
                    aria-hidden
                  >
                    {t.glyph}
                  </span>
                  <span className="min-w-0">
                    <span className="text-ink text-[14px] font-medium">
                      {c.name}
                    </span>
                    <span className="text-ink-2 ml-2 text-[13.5px]">
                      {c.detail}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
          <p className="border-line text-ink-2 mt-4 border-t pt-4 text-[14px] leading-relaxed">
            <span className="text-ink font-medium">{verdict}</span> This is a quick
            heuristic, not a verdict from a real engine — use it to catch the
            obvious misses, then read the passage aloud as the answer to one
            question.
          </p>
        </>
      ) : (
        <p className="text-muted mt-4 text-[13px]">
          Your nine-point score appears here as you type.
        </p>
      )}
    </section>
  );
}
