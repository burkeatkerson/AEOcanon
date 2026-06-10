"use client";

import { useMemo, useState } from "react";
import { PILLARS } from "@/lib/canon";
import { cn } from "@/lib/utils";

/**
 * Interactive AEO audit checklist. Walks the eight Canon pillars and their
 * canonical moves, scoring how many you can honestly check off — per pillar and
 * overall — with a print button for a shareable result. Pure client-side state,
 * no network, no persistence, so the host page stays statically rendered.
 */

const ITEMS = PILLARS.map((p) => ({
  title: p.title,
  layer: p.layer,
  sub: p.sub,
  href: `/pillars/${p.title.toLowerCase()}`,
  moves: p.moves,
}));

const TOTAL = ITEMS.reduce((n, p) => n + p.moves.length, 0);

export function AeoAuditChecklist() {
  const [done, setDone] = useState<Set<string>>(new Set());

  const toggle = (key: string) =>
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const checked = done.size;
  const pct = Math.round((checked / TOTAL) * 100);
  const verdict = useMemo(() => {
    if (checked === 0) return "Start checking the boxes you can honestly tick.";
    if (pct >= 85) return "Strong foundation — you're doing the work that gets cited. Hold the gains and measure.";
    if (pct >= 60) return "Solid, with real gaps. Fix the unchecked items in the earliest layer first.";
    if (pct >= 30) return "Early days. Work top-down: an unchecked box in Foundation outranks any below it.";
    return "Mostly unaddressed — and that's the opportunity. Start at the top of the list.";
  }, [checked, pct]);

  return (
    <section className="border-line bg-panel not-prose my-9 rounded-2xl border p-6 font-sans">
      <div className="flex items-center justify-between gap-4">
        <p className="text-accent font-mono text-[10.5px] tracking-[0.1em] uppercase">
          The AEO audit checklist
        </p>
        <p className="text-ink font-mono text-[12px]">
          {checked} / {TOTAL}
        </p>
      </div>
      <p className="text-ink-2 mt-2 text-[14.5px] leading-relaxed">
        Tick every item you can honestly say is true of your site today. Your
        score is grouped by pillar so you can see where the gaps are — work the
        earliest unchecked layer first. Nothing is saved or sent anywhere.
      </p>

      <div className="bg-bg-2 mt-4 h-1.5 overflow-hidden rounded-full">
        <div
          className="bg-accent h-full rounded-full transition-[width] duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="mt-5 flex flex-col gap-5">
        {ITEMS.map((p) => {
          const pDone = p.moves.filter((_, i) =>
            done.has(`${p.title}:${i}`),
          ).length;
          return (
            <div key={p.title}>
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-ink text-[14px] font-semibold">
                  {p.title}
                  <span className="text-muted ml-2 font-mono text-[10.5px] tracking-[0.08em] uppercase">
                    {p.layer}
                  </span>
                </p>
                <span
                  className={cn(
                    "font-mono text-[11px]",
                    pDone === p.moves.length ? "text-ok" : "text-muted",
                  )}
                >
                  {pDone}/{p.moves.length}
                </span>
              </div>
              <ul className="mt-2 flex flex-col gap-px">
                {p.moves.map((move, i) => {
                  const key = `${p.title}:${i}`;
                  const isOn = done.has(key);
                  return (
                    <li key={key}>
                      <label className="hover:bg-paper flex cursor-pointer items-start gap-3 rounded-lg px-2 py-1.5">
                        <input
                          type="checkbox"
                          checked={isOn}
                          onChange={() => toggle(key)}
                          className="accent-accent mt-0.5 size-4 shrink-0"
                        />
                        <span
                          className={cn(
                            "text-[14px] leading-snug",
                            isOn ? "text-muted line-through" : "text-ink-2",
                          )}
                        >
                          {move}
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="border-line mt-5 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-ink-2 text-[14px] leading-relaxed">
          <span className="text-ink font-medium">{verdict}</span>
        </p>
        <button
          type="button"
          onClick={() => window.print()}
          className="border-accent bg-accent-soft text-accent-2 hover:bg-accent hover:text-white inline-flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2 text-[13.5px] font-medium transition-colors"
        >
          <span aria-hidden>⎙</span> Print my result
        </button>
      </div>
    </section>
  );
}
