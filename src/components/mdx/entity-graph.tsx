"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * EntityGraph — an interactive picture of how AI comes to recognize you as one
 * trusted entity. Toggle independent sources that mention you; as more of the
 * web corroborates, the "recognition" the engine has climbs. Shows why mentions
 * and corroboration — not a single page — build a recognized entity.
 */

interface Source {
  id: string;
  label: string;
  // position on a circle around the centre (degrees)
  angle: number;
  weight: number; // how much this source adds to recognition
}

const SOURCES: Source[] = [
  { id: "wiki", label: "Wikipedia", angle: -90, weight: 22 },
  { id: "news", label: "Trade press", angle: -38, weight: 18 },
  { id: "reddit", label: "Reddit", angle: 14, weight: 14 },
  { id: "reviews", label: "Reviews", angle: 66, weight: 16 },
  { id: "linkedin", label: "LinkedIn", angle: 130, weight: 12 },
  { id: "podcast", label: "Podcasts", angle: 200, weight: 10 },
];

const R = 33; // ring radius in viewBox units
const CX = 50;
const CY = 44;
const pos = (angle: number) => ({
  x: CX + R * Math.cos((angle * Math.PI) / 180),
  y: CY + R * Math.sin((angle * Math.PI) / 180),
});

export function EntityGraph() {
  const [on, setOn] = useState<Record<string, boolean>>({
    wiki: true,
    news: true,
  });
  const active = SOURCES.filter((s) => on[s.id]);
  const score = Math.min(
    100,
    active.reduce((a, s) => a + s.weight, 0) + (active.length >= 4 ? 8 : 0),
  );
  const verdict =
    score >= 70
      ? "Recognized — the engine will confidently name and recommend you."
      : score >= 40
        ? "Emerging — you're known, but corroboration is thin."
        : score >= 1
          ? "Unsure — too few independent sources to trust."
          : "Invisible — nothing vouches for you yet.";

  return (
    <section className="border-line bg-panel not-prose my-9 rounded-2xl border p-5 font-sans sm:p-6">
      <p className="text-accent font-mono text-[10.5px] tracking-[0.1em] uppercase">
        Entity recognition · corroboration
      </p>
      <p className="text-ink-2 mt-2 text-[14.5px] leading-relaxed">
        Toggle the independent sources that mention you. AI recognizes you as a
        trusted <strong>entity</strong> when many sources{" "}
        <strong>corroborate</strong> each other — not because one page argued well.
      </p>

      <div className="mt-4 grid items-center gap-4 sm:grid-cols-[1fr_minmax(0,260px)]">
        <div className="border-line-2 bg-paper overflow-hidden rounded-xl border">
          <svg viewBox="0 0 100 88" className="h-auto w-full" role="img" aria-label="A central entity node surrounded by source nodes; active sources connect to the centre and raise its recognition.">
            {SOURCES.map((s) => {
              const p = pos(s.angle);
              const isOn = on[s.id];
              return (
                <line
                  key={"l" + s.id}
                  x1={CX}
                  y1={CY}
                  x2={p.x}
                  y2={p.y}
                  stroke="var(--accent)"
                  strokeWidth="0.7"
                  opacity={isOn ? 0.6 : 0}
                />
              );
            })}
            {SOURCES.map((s) => {
              const p = pos(s.angle);
              const isOn = on[s.id];
              return (
                <g key={s.id} opacity={isOn ? 1 : 0.4}>
                  <circle cx={p.x} cy={p.y} r="3" fill={isOn ? "var(--c4)" : "var(--line-2)"} />
                  <text x={p.x} y={p.y - 4.2} textAnchor="middle" fontSize="3" fontFamily="var(--sans)" fill="var(--muted)">
                    {s.label}
                  </text>
                </g>
              );
            })}
            {/* centre = you */}
            <circle cx={CX} cy={CY} r={6 + score / 22} fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth="0.8" />
            <text x={CX} y={CY + 1.4} textAnchor="middle" fontSize="3.6" fontFamily="var(--serif)" fill="var(--accent-2)" fontWeight={600}>
              You
            </text>
          </svg>
        </div>

        <div>
          <div className="flex flex-wrap gap-1.5">
            {SOURCES.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setOn((o) => ({ ...o, [s.id]: !o[s.id] }))}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[12px] transition-colors",
                  on[s.id]
                    ? "border-accent bg-accent text-white"
                    : "border-line-2 text-ink-2 hover:border-accent",
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
          <div className="mt-4">
            <div className="flex items-baseline justify-between">
              <span className="text-muted font-mono text-[10px] tracking-[0.1em] uppercase">
                Recognition
              </span>
              <span className="text-ink font-mono text-[12px]">{score}/100</span>
            </div>
            <div className="bg-bg-2 mt-1.5 h-2 overflow-hidden rounded-full">
              <div
                className="bg-accent h-full rounded-full transition-[width] duration-300"
                style={{ width: `${score}%` }}
              />
            </div>
            <p className="text-ink-2 mt-3 text-[13px] leading-relaxed">{verdict}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
