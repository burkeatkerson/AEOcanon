"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * SemanticSpace — an interactive picture of how embeddings turn meaning into
 * coordinates. Passages sit in a 2-D "meaning space"; pick a query and the
 * nearest passages (by real distance in this toy space) light up — exactly how
 * vector retrieval finds what to cite, by closeness of meaning, not keywords.
 * Illustrative positions, not a real embedding model — the copy says so.
 */

interface Point {
  id: string;
  label: string;
  x: number; // 0–100 meaning-space coords
  y: number;
}

// Three meaning clusters: price, setup, history — semantically grouped.
const PASSAGES: Point[] = [
  { id: "p1", label: "what a heat pump costs", x: 22, y: 26 },
  { id: "p2", label: "heat pump pricing by size", x: 30, y: 34 },
  { id: "p3", label: "is a heat pump worth it", x: 18, y: 40 },
  { id: "p4", label: "how to install a heat pump", x: 72, y: 30 },
  { id: "p5", label: "heat pump setup steps", x: 80, y: 38 },
  { id: "p6", label: "wiring a heat pump", x: 70, y: 46 },
  { id: "p7", label: "history of refrigeration", x: 48, y: 80 },
  { id: "p8", label: "who invented the heat pump", x: 58, y: 74 },
];

const QUERIES: { id: string; label: string; x: number; y: number }[] = [
  { id: "q1", label: "“how much to install a heat pump?”", x: 74, y: 34 },
  { id: "q2", label: "“cheapest heat pump option”", x: 24, y: 32 },
  { id: "q3", label: "“who created heat pumps”", x: 54, y: 78 },
];

const dist = (a: { x: number; y: number }, b: { x: number; y: number }) =>
  Math.hypot(a.x - b.x, a.y - b.y);

export function SemanticSpace() {
  const [q, setQ] = useState<string | null>(null);
  const query = QUERIES.find((x) => x.id === q) ?? null;

  // nearest 3 passages to the active query
  const ranked = query
    ? [...PASSAGES].sort((a, b) => dist(a, query) - dist(b, query))
    : [];
  const nearIds = new Set(ranked.slice(0, 3).map((p) => p.id));

  return (
    <section className="border-line bg-panel not-prose my-9 rounded-2xl border p-5 font-sans sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <p className="text-accent font-mono text-[10.5px] tracking-[0.1em] uppercase">
          Meaning space · vector retrieval
        </p>
      </div>
      <p className="text-ink-2 mt-2 text-[14.5px] leading-relaxed">
        Embeddings place every passage by <strong>meaning</strong>, so related
        ideas sit close together. Pick a query — the engine retrieves the{" "}
        <strong>nearest passages</strong>, even with no shared keywords.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {QUERIES.map((x) => (
          <button
            key={x.id}
            type="button"
            onClick={() => setQ(q === x.id ? null : x.id)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-[12.5px] transition-colors",
              q === x.id
                ? "border-accent bg-accent text-white"
                : "border-line-2 text-ink-2 hover:border-accent",
            )}
          >
            {x.label}
          </button>
        ))}
      </div>

      <div className="border-line-2 bg-paper mt-4 overflow-hidden rounded-xl border">
        <svg viewBox="0 0 100 92" className="h-auto w-full" role="img" aria-label="A 2-D meaning space: passages about cost, setup, and history form three clusters; a selected query highlights its nearest passages.">
          {/* subtle grid */}
          {[20, 40, 60, 80].map((g) => (
            <g key={g} stroke="var(--line)" strokeWidth="0.2">
              <line x1={g} y1="2" x2={g} y2="90" />
              <line x1="2" y1={g - 6} x2="98" y2={g - 6} />
            </g>
          ))}
          {/* connectors from query to nearest */}
          {query &&
            ranked.slice(0, 3).map((p) => (
              <line
                key={p.id}
                x1={query.x}
                y1={query.y}
                x2={p.x}
                y2={p.y}
                stroke="var(--accent)"
                strokeWidth="0.5"
                strokeDasharray="1.5 1.2"
                opacity="0.7"
              />
            ))}
          {/* passages */}
          {PASSAGES.map((p) => {
            const near = nearIds.has(p.id);
            const dim = query && !near;
            return (
              <g key={p.id} opacity={dim ? 0.3 : 1}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={near ? 2.6 : 2}
                  fill={near ? "var(--accent)" : "var(--c4)"}
                />
                <text
                  x={p.x}
                  y={p.y - 3.4}
                  textAnchor="middle"
                  fontSize="2.7"
                  fontFamily="var(--sans)"
                  fill={near ? "var(--ink)" : "var(--muted)"}
                  fontWeight={near ? 600 : 400}
                >
                  {p.label}
                </text>
              </g>
            );
          })}
          {/* query marker */}
          {query && (
            <g>
              <circle cx={query.x} cy={query.y} r="3.2" fill="none" stroke="var(--accent-2)" strokeWidth="0.8" />
              <circle cx={query.x} cy={query.y} r="1.3" fill="var(--accent-2)" />
            </g>
          )}
        </svg>
      </div>

      <p className="text-muted mt-3 text-[12.5px] leading-relaxed">
        {query ? (
          <>
            Retrieved: <span className="text-ink-2 font-medium">{ranked.slice(0, 3).map((p) => p.label).join(", ")}</span> —
            the closest in meaning, not the closest in wording.
          </>
        ) : (
          "Positions here are illustrative; a real model uses hundreds of dimensions. The idea is the same: closeness of meaning is what gets retrieved."
        )}
      </p>
    </section>
  );
}
