import { PILLARS, LAYERS } from "@/lib/canon";
import { PillarMark } from "./pillar-mark";

/**
 * ThreeLayers — the AEO Canon's three layers (Foundation → Reputation →
 * Momentum) as a stacked diagram, each with its guiding question and its
 * pillars (by glyph). Turns the abstract "three layers" idea into one picture,
 * and reinforces the cascade: each layer assumes the one above is in place.
 */
export function ThreeLayers() {
  return (
    <section className="border-line bg-panel not-prose my-9 rounded-2xl border p-5 font-sans sm:p-6">
      <p className="text-muted font-mono text-[10.5px] tracking-[0.1em] uppercase">
        The AEO Canon · three layers
      </p>
      <div className="mt-4 flex flex-col gap-3">
        {LAYERS.map((layer, i) => {
          const pillars = PILLARS.filter((p) => p.layer === layer.name);
          return (
            <div
              key={layer.name}
              className="border-line bg-paper rounded-xl border p-4"
              style={{ borderTop: `4px solid ${layer.color}` }}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span
                  className="font-mono text-[11px] tracking-[0.12em] uppercase"
                  style={{ color: layer.color }}
                >
                  {String(i + 1).padStart(2, "0")} · {layer.name}
                </span>
                <span className="text-ink-2 font-serif text-[14px] italic">
                  {layer.question}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                {pillars.map((p) => (
                  <span
                    key={p.n}
                    className="text-ink-2 flex items-center gap-1.5 text-[13.5px]"
                  >
                    <PillarMark pillar={p.title} size={16} />
                    {p.title}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-muted mt-4 text-[12.5px] leading-relaxed">
        Read top to bottom — each layer assumes the one above it is in place. A
        brilliant page behind a blocked crawler is still invisible.
      </p>
    </section>
  );
}
