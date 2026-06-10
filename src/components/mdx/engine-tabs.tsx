"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * EngineTabs — a compact interactive tab panel for showing how the same thing
 * differs across answer engines (or any small set of options) without stacking
 * paragraphs. Keeps a comparison scannable instead of word-heavy.
 */
export function EngineTabs({
  tabs,
  label,
}: {
  tabs: { label: string; body: string }[];
  label?: string;
}) {
  const [active, setActive] = useState(0);
  const current = tabs[active] ?? tabs[0];
  return (
    <section className="border-line bg-panel not-prose my-8 overflow-hidden rounded-2xl border font-sans">
      {label ? (
        <p className="border-line text-muted border-b px-5 py-2.5 font-mono text-[10.5px] tracking-[0.1em] uppercase">
          {label}
        </p>
      ) : null}
      <div className="border-line flex flex-wrap gap-0.5 border-b px-2 pt-2">
        {tabs.map((t, i) => (
          <button
            key={t.label}
            type="button"
            onClick={() => setActive(i)}
            className={cn(
              "-mb-px cursor-pointer rounded-t-lg border-b-2 px-3.5 py-2 font-mono text-[12px] transition-colors",
              active === i
                ? "border-accent text-ink"
                : "border-transparent text-muted hover:text-ink-2",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="text-ink-2 px-5 py-4 text-[14.5px] leading-relaxed">
        {current?.body}
      </div>
    </section>
  );
}
