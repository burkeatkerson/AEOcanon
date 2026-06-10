import { cn } from "@/lib/utils";

/**
 * Timeline — a clean vertical timeline for sequences in time (a model's
 * knowledge cutoff vs. now, an AEO ramp week-by-week, the shift in AI search).
 * Static, token-styled, theme-aware. Reads cleanly as an ordered list when an
 * engine lifts it.
 */
export function Timeline({
  items,
  caption,
}: {
  items: { label: string; body: string; highlight?: boolean }[];
  caption?: string;
}) {
  return (
    <figure className="not-prose my-8 font-sans">
      <div className="border-line flex flex-col border-l-2 pl-6">
        {items.map((it, i) => (
          <div key={i} className="relative pb-6 last:pb-0">
            <span
              className={cn(
                "border-bg absolute top-1 left-[-30px] size-3.5 rounded-full border-[3px]",
                it.highlight ? "bg-accent-2" : "bg-accent",
              )}
            />
            <div
              className={cn(
                "font-mono text-[11.5px] tracking-[0.04em]",
                it.highlight ? "text-accent-2" : "text-accent",
              )}
            >
              {it.label}
            </div>
            <div className="text-ink-2 mt-1 text-[14.5px] leading-relaxed">
              {it.body}
            </div>
          </div>
        ))}
      </div>
      {caption ? (
        <figcaption className="text-muted mt-3 text-[12.5px] leading-relaxed">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
