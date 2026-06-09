"use client";

import { useState } from "react";
import type { ChartDatum } from "@/lib/research/state-of-aeo";
import { cn } from "@/lib/utils";

/**
 * Lightweight horizontal bar chart for survey results. Hand-rolled (no chart
 * library, no localStorage), theme-aware, and paired with a real <table> data
 * fallback rendered in the DOM — which serves screen readers AND gives answer
 * engines a clean, extractable representation of every figure.
 */
export function ResearchChart({
  data,
  unit = "%",
  max = 100,
  caption,
  tableCaption,
}: {
  data: ChartDatum[];
  unit?: string;
  max?: number;
  caption?: string;
  tableCaption: string;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const fmt = (d: ChartDatum) => d.display ?? `${d.value}${unit}`;

  return (
    <figure className="border-line bg-panel my-7 rounded-2xl border p-5 font-sans sm:p-6">
      {/* Visual bars — decorative; the table below is the accessible source. */}
      <div className="flex flex-col gap-3" aria-hidden="true">
        {data.map((d, i) => {
          const active = hovered === null || hovered === i;
          return (
            <div
              key={d.label}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className={cn(
                "grid grid-cols-[minmax(120px,200px)_1fr_auto] items-center gap-3 transition-opacity",
                !active && "opacity-40",
              )}
            >
              <span className="text-ink-2 text-[13px] leading-snug">
                {d.label}
              </span>
              <span className="bg-bg-2 h-5 overflow-hidden rounded">
                <span
                  className="bg-accent block h-full rounded transition-[width] duration-500"
                  style={{ width: `${Math.max(1.5, (d.value / max) * 100)}%` }}
                />
              </span>
              <span className="text-ink w-12 text-right font-mono text-[12.5px] font-medium">
                {fmt(d)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Accessible + AI-extractable data table (always in the DOM). */}
      <details className="border-line mt-4 border-t pt-3">
        <summary className="text-muted hover:text-accent cursor-pointer font-mono text-[11px] tracking-[0.06em] uppercase">
          Show data table
        </summary>
        <table className="mt-3 w-full border-collapse text-[13px]">
          <caption className="sr-only">{tableCaption}</caption>
          <thead>
            <tr>
              <th
                scope="col"
                className="border-line text-muted border-b px-2 py-1.5 text-left font-mono text-[10px] tracking-[0.05em] uppercase"
              >
                Response
              </th>
              <th
                scope="col"
                className="border-line text-muted border-b px-2 py-1.5 text-right font-mono text-[10px] tracking-[0.05em] uppercase"
              >
                Share
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.label}>
                <th
                  scope="row"
                  className="border-line text-ink-2 border-b px-2 py-1.5 text-left font-normal"
                >
                  {d.label}
                </th>
                <td className="border-line text-ink border-b px-2 py-1.5 text-right font-mono">
                  {fmt(d)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>

      {caption ? (
        <figcaption className="text-muted mt-3 text-[12px] leading-relaxed">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
