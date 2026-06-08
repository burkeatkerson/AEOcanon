"use client";

import { useState } from "react";
import Link from "next/link";
import { PILLARS, LAYERS, type CanonLayer } from "@/lib/canon";
import { cn } from "@/lib/utils";

/** Deep-dive article URL for a pillar (slugs are aeo-pillar-<title>). */
function pillarHref(title: string): string {
  return `/learn/aeo-pillar-${title.toLowerCase()}`;
}

/**
 * Interactive map of the AEO Canon: three layers, eight pillars. Each pillar is
 * a link to its deep-dive, and its canonical principle is rendered inline (so
 * the map is meaningful in static HTML for AI extraction). Selecting a layer
 * focuses it and dims the others — a client interaction layered on top of fully
 * server-rendered content.
 */
export function CanonMap() {
  const [focus, setFocus] = useState<CanonLayer | "all">("all");

  return (
    <section className="border-line bg-panel not-prose my-9 rounded-2xl border p-5 font-sans sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-muted font-mono text-[10.5px] tracking-[0.1em] uppercase">
          The AEO Canon · 3 layers · 8 pillars
        </p>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            aria-pressed={focus === "all"}
            onClick={() => setFocus("all")}
            className={cn(
              "rounded-full border px-3 py-1 text-[12px] transition-colors",
              focus === "all"
                ? "border-ink bg-ink text-bg"
                : "border-line-2 text-ink-2 hover:border-accent",
            )}
          >
            All
          </button>
          {LAYERS.map((layer) => (
            <button
              key={layer.name}
              type="button"
              aria-pressed={focus === layer.name}
              onClick={() => setFocus(layer.name)}
              className={cn(
                "rounded-full border px-3 py-1 text-[12px] transition-colors",
                focus === layer.name
                  ? "text-bg"
                  : "border-line-2 text-ink-2 hover:border-accent",
              )}
              style={
                focus === layer.name
                  ? { background: layer.color, borderColor: layer.color }
                  : undefined
              }
            >
              {layer.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-5">
        {LAYERS.map((layer) => {
          const dimmed = focus !== "all" && focus !== layer.name;
          const pillars = PILLARS.filter((p) => p.layer === layer.name);
          return (
            <div
              key={layer.name}
              className={cn(
                "transition-opacity",
                dimmed && "opacity-35",
              )}
            >
              <div
                className="mb-2.5 flex items-baseline gap-2 font-mono text-[10.5px] tracking-[0.12em] uppercase"
                style={{ color: layer.color }}
              >
                {layer.name}
                <span className="text-muted font-serif text-[12px] tracking-normal normal-case italic">
                  · {layer.question}
                </span>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {pillars.map((p) => (
                  <Link
                    key={p.n}
                    href={pillarHref(p.title)}
                    className="group border-line bg-paper hover:border-accent block rounded-xl border p-4 transition-colors"
                    style={{ borderTopColor: layer.color, borderTopWidth: 3 }}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="grid size-7 shrink-0 place-items-center rounded-full font-mono text-[12px] text-white"
                        style={{ background: layer.color }}
                      >
                        {p.n}
                      </span>
                      <span className="text-ink font-serif text-[17px] leading-none">
                        {p.title}
                      </span>
                    </div>
                    <p className="text-ink-2 mt-2.5 text-[13.5px] leading-snug italic">
                      {p.principle}
                    </p>
                    <span className="text-accent mt-3 inline-block font-mono text-[11px] opacity-0 transition-opacity group-hover:opacity-100">
                      Read the {p.title} pillar →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-muted mt-5 text-[12.5px] leading-relaxed">
        Read the layers top to bottom — each assumes the one above it is in
        place. Select a pillar to open its deep-dive.
      </p>
    </section>
  );
}
