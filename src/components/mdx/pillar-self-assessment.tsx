"use client";

import { useState } from "react";
import Link from "next/link";
import { PILLARS } from "@/lib/canon";
import { cn } from "@/lib/utils";

/**
 * Eight-pillar self-assessment. Rate yourself on each Canon pillar (Not started /
 * Partial / Solid) for a quick profile of where you stand, your weakest pillar in
 * cascade order, and a link to fix it. Pure client-side — no network, no
 * persistence.
 */

const LEVELS = [
  { value: 0, label: "Not started" },
  { value: 1, label: "Partial" },
  { value: 2, label: "Solid" },
] as const;

const ITEMS = PILLARS.map((p) => ({
  title: p.title,
  sub: p.sub,
  layer: p.layer,
  href: `/pillars/${p.title.toLowerCase()}`,
}));

const MAX = ITEMS.length * 2;

export function PillarSelfAssessment() {
  const [ratings, setRatings] = useState<Record<string, number>>({});

  const set = (title: string, value: number) =>
    setRatings((prev) => ({ ...prev, [title]: value }));

  const rated = Object.keys(ratings).length;
  const total = Object.values(ratings).reduce((a, b) => a + b, 0);
  const pct = Math.round((total / MAX) * 100);

  // Weakest pillar = lowest rating, earliest in cascade order on a tie.
  const weakest =
    rated > 0
      ? ITEMS.reduce<{ title: string; href: string; score: number } | null>(
          (worst, p) => {
            const score = ratings[p.title];
            if (score === undefined) return worst;
            if (!worst || score < worst.score)
              return { title: p.title, href: p.href, score };
            return worst;
          },
          null,
        )
      : null;

  return (
    <section className="border-line bg-panel not-prose my-9 rounded-2xl border p-6 font-sans">
      <div className="flex items-center justify-between gap-4">
        <p className="text-accent font-mono text-[10.5px] tracking-[0.1em] uppercase">
          The 8-pillar self-assessment
        </p>
        {rated > 0 ? (
          <p className="text-ink font-mono text-[12px]">
            {total} / {MAX}
          </p>
        ) : null}
      </div>
      <p className="text-ink-2 mt-2 text-[14.5px] leading-relaxed">
        Rate yourself honestly on each pillar. The pillars cascade — a weak one
        early on caps everything below it — so your earliest low score is where to
        start. Nothing is saved or sent anywhere.
      </p>

      {rated > 0 ? (
        <div className="bg-bg-2 mt-4 h-1.5 overflow-hidden rounded-full">
          <div
            className="bg-accent h-full rounded-full transition-[width] duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
      ) : null}

      <div className="mt-5 flex flex-col gap-3">
        {ITEMS.map((p) => {
          const current = ratings[p.title];
          return (
            <div
              key={p.title}
              className="border-line-2 bg-paper flex flex-col gap-2 rounded-xl border p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <Link
                  href={p.href}
                  className="text-ink hover:text-accent text-[14.5px] font-semibold"
                >
                  {p.title}
                </Link>
                <span className="text-muted ml-2 font-mono text-[10.5px] tracking-[0.08em] uppercase">
                  {p.layer}
                </span>
                <span className="text-ink-2 block text-[13px] leading-snug">
                  {p.sub}
                </span>
              </div>
              <div className="flex shrink-0 gap-1">
                {LEVELS.map((lvl) => (
                  <button
                    key={lvl.value}
                    type="button"
                    onClick={() => set(p.title, lvl.value)}
                    className={cn(
                      "rounded-lg border px-2.5 py-1.5 text-[12px] font-medium transition-colors",
                      current === lvl.value
                        ? "border-accent bg-accent text-white"
                        : "border-line-2 text-ink-2 hover:border-accent",
                    )}
                  >
                    {lvl.label}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {weakest && rated === ITEMS.length ? (
        <div className="border-line mt-5 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-ink-2 text-[14px] leading-relaxed">
            <span className="text-ink font-medium">
              Start with {weakest.title}.
            </span>{" "}
            It&apos;s your earliest, lowest-rated pillar — the highest-leverage fix.{" "}
            <Link href={weakest.href} className="text-accent">
              Open the {weakest.title} pillar →
            </Link>
          </p>
          <button
            type="button"
            onClick={() => window.print()}
            className="border-accent bg-accent-soft text-accent-2 hover:bg-accent hover:text-white inline-flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2 text-[13.5px] font-medium transition-colors"
          >
            <span aria-hidden>⎙</span> Print my result
          </button>
        </div>
      ) : (
        <p className="text-muted mt-5 text-[13px]">
          Rate all eight pillars to see your weakest one and where to start.
        </p>
      )}
    </section>
  );
}
