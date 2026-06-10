import Link from "next/link";
import { PILLARS, LAYERS } from "@/lib/canon";
import { PillarMark } from "./pillar-mark";
import { cn } from "@/lib/utils";

/**
 * The Canon Spine — the recurring "you are here" motif. The eight pillars as
 * their metaphor glyphs, in cascade order across the three layers, with the
 * current article's pillar(s) lit and the rest dimmed. Reinforces the framework
 * and the cascade (gates in order) on every concept page. Fully server-rendered
 * and token-styled; each glyph links to its deep-dive.
 *
 * Usage in MDX:
 *   <CanonSpine active="extractability" />
 *   <CanonSpine active="access, alignment" />
 *   <CanonSpine />              (overview — "the whole machine")
 */
export function CanonSpine({
  active,
  caption,
}: {
  active?: string;
  caption?: string;
}) {
  const activeSet = new Set(
    (active ?? "")
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean),
  );
  const hasActive = activeSet.size > 0;
  const activePillars = PILLARS.filter((p) =>
    activeSet.has(p.title.toLowerCase()),
  );

  return (
    <section className="border-line bg-panel not-prose my-8 rounded-2xl border p-5 font-sans sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-muted font-mono text-[10.5px] tracking-[0.1em] uppercase">
          The AEO Canon · the cascade
        </p>
        <div className="flex flex-wrap gap-3">
          {LAYERS.map((l) => (
            <span
              key={l.name}
              className="text-muted flex items-center gap-1.5 font-mono text-[10px] tracking-[0.06em] uppercase"
            >
              <span
                className="size-2 rounded-full"
                style={{ background: l.color }}
              />
              {l.name}
            </span>
          ))}
        </div>
      </div>

      {/* the rail */}
      <div className="mt-5 overflow-x-auto pb-1">
        <div className="relative flex min-w-[520px] justify-between gap-1">
          {/* baseline behind the nodes (icon centre ≈ 18px) */}
          <span
            className="bg-line absolute top-[18px] right-3 left-3 h-px"
            aria-hidden
          />
          {PILLARS.map((p) => {
            const on = !hasActive || activeSet.has(p.title.toLowerCase());
            const lit = hasActive && activeSet.has(p.title.toLowerCase());
            return (
              <Link
                key={p.n}
                href={`/pillars/${p.title.toLowerCase()}`}
                title={`${p.title} — ${p.sub}`}
                className="group relative flex flex-1 flex-col items-center gap-1.5"
              >
                <span
                  className={cn(
                    "grid size-9 place-items-center rounded-full border-2 transition-all",
                    !on && "opacity-35",
                  )}
                  style={
                    lit
                      ? { background: p.color, borderColor: p.color }
                      : { background: "var(--panel)", borderColor: p.color }
                  }
                >
                  <PillarMark
                    pillar={p.title}
                    size={18}
                    style={lit ? { color: "#fff" } : undefined}
                  />
                </span>
                <span
                  className={cn(
                    "text-center font-mono text-[9px] tracking-[0.04em] uppercase",
                    lit
                      ? "text-ink font-medium"
                      : on
                        ? "text-muted"
                        : "text-faint",
                  )}
                >
                  {p.title}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* context line */}
      <div className="border-line mt-4 border-t pt-4">
        {hasActive && activePillars.length > 0 ? (
          <div className="flex flex-col gap-2">
            {activePillars.map((p) => (
              <p key={p.n} className="text-ink-2 text-[14px] leading-relaxed">
                <span className="text-ink font-medium">
                  Pillar {p.n} · {p.title}
                </span>{" "}
                — <span className="italic">{p.principle}</span>
              </p>
            ))}
            {caption ? (
              <p className="text-muted text-[13px]">{caption}</p>
            ) : null}
          </div>
        ) : (
          <p className="text-ink-2 text-[14px] leading-relaxed">
            {caption ?? (
              <>
                Walk the gates in order — the first one you fail is your
                highest-leverage fix.{" "}
                <Link
                  href="/learn/aeo-canon-diagnostic"
                  className="text-accent"
                >
                  Run the diagnostic →
                </Link>
              </>
            )}
          </p>
        )}
      </div>
    </section>
  );
}
