"use client";

import { useState } from "react";
import { PILLARS, LAYERS } from "@/lib/canon";
import { cn } from "@/lib/utils";

/** Interactive 8-pillar explorer: pick a pillar (left) to read its detail (right). */
export function PillarExplorer() {
  const [active, setActive] = useState(1);
  const pillar = PILLARS.find((p) => p.n === active) ?? PILLARS[0]!;
  const next = PILLARS.find((p) => p.n === active + 1);

  return (
    <div className="border-line grid overflow-hidden rounded-[18px] border md:grid-cols-[340px_1fr]">
      {/* list */}
      <div className="border-line bg-paper border-b md:border-r md:border-b-0">
        {LAYERS.map((layer) => (
          <div
            key={layer.name}
            className="border-line border-b last:border-b-0"
          >
            <div
              className="flex items-center gap-2 px-5 pt-3.5 pb-2 font-mono text-[10px] tracking-[0.13em] uppercase"
              style={{ color: layer.color }}
            >
              {layer.name}
              <span className="text-muted font-serif text-[12px] tracking-normal normal-case italic">
                · {layer.question}
              </span>
            </div>
            {PILLARS.filter((p) => p.layer === layer.name).map((p) => (
              <button
                key={p.n}
                type="button"
                onClick={() => setActive(p.n)}
                className={cn(
                  "grid w-full grid-cols-[30px_1fr] items-center gap-3 border-l-[3px] px-5 py-3 text-left",
                  active === p.n
                    ? "bg-panel"
                    : "hover:bg-panel border-transparent",
                )}
                style={
                  active === p.n ? { borderLeftColor: layer.color } : undefined
                }
              >
                <span
                  className="border-line-2 grid size-[30px] place-items-center rounded-full border font-mono text-[12px]"
                  style={
                    active === p.n
                      ? {
                          background: layer.color,
                          borderColor: layer.color,
                          color: "#fff",
                        }
                      : { color: layer.color }
                  }
                >
                  {p.n}
                </span>
                <span>
                  <span className="block font-serif text-[15.5px]">
                    {p.title}
                  </span>
                  <span className="text-muted block text-[11.5px]">
                    {p.sub}
                  </span>
                </span>
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* detail */}
      <div className="bg-panel p-8 sm:p-9">
        <div
          className="mb-4 flex items-center gap-2.5 font-mono text-[10.5px] tracking-[0.12em] uppercase"
          style={{ color: pillar.color }}
        >
          <span className="font-serif text-[13px]">
            Pillar {String(pillar.n).padStart(2, "0")}
          </span>{" "}
          · {pillar.layer}
        </div>
        <h2 className="text-[clamp(26px,3.4vw,32px)] leading-tight font-medium">
          {pillar.title}
        </h2>
        <p
          className="mt-4 border-l-[3px] py-1 pl-5 font-serif text-[21px] leading-snug italic"
          style={{ borderColor: pillar.color }}
        >
          {pillar.principle}
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="border-line bg-paper rounded-xl border p-4.5">
            <span className="text-muted mb-2 block font-mono text-[9.5px] tracking-[0.12em] uppercase">
              The metaphor
            </span>
            <p className="text-ink-2 text-[14.5px] leading-snug">
              {pillar.metaphor}
            </p>
          </div>
          <div
            className="border-line rounded-xl border p-4.5"
            style={{
              background: `color-mix(in oklab, ${pillar.color} 8%, var(--paper))`,
            }}
          >
            <span className="text-muted mb-2 block font-mono text-[9.5px] tracking-[0.12em] uppercase">
              The evidence
            </span>
            <div
              className="font-serif text-[34px] leading-none tracking-[-0.02em]"
              style={{ color: pillar.color }}
            >
              {pillar.big}
            </div>
            <div className="text-ink-2 mt-2 text-[12.5px] leading-snug">
              {pillar.src}
            </div>
          </div>
        </div>

        <div className="mt-5">
          <span className="text-muted mb-3 block font-mono text-[9.5px] tracking-[0.12em] uppercase">
            The moves
          </span>
          <ul className="flex flex-col gap-2.5">
            {pillar.moves.map((m) => (
              <li
                key={m}
                className="text-ink-2 flex gap-3 text-[15px] leading-snug"
              >
                <span className="font-mono" style={{ color: pillar.color }}>
                  →
                </span>
                {m}
              </li>
            ))}
          </ul>
        </div>

        <div className="border-line text-muted mt-6 flex items-center justify-between border-t pt-4.5 font-mono text-[11.5px]">
          <span>
            {next
              ? `Next gate → ${next.title}`
              : "The posture everything else depends on"}
          </span>
        </div>
      </div>
    </div>
  );
}
