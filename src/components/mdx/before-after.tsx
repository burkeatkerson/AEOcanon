import { cn } from "@/lib/utils";

/**
 * Before → after annotated example box. Shows a weak passage and its rewrite
 * side by side (stacked on small screens), with an optional note explaining why
 * the rewrite is more citable. Presentational only — no state, fully static, so
 * it renders into the prerendered HTML that answer engines parse.
 */
export function BeforeAfter({
  label,
  before,
  after,
  beforeLabel = "Before",
  afterLabel = "After",
  note,
}: {
  /** Optional concept name shown above the pair (e.g. "Answer-first opening"). */
  label?: string;
  before: string;
  after: string;
  beforeLabel?: string;
  afterLabel?: string;
  /** The annotation — why the rewrite wins. */
  note?: string;
}) {
  return (
    <figure className="not-prose border-line bg-panel my-8 overflow-hidden rounded-2xl border font-sans">
      {label ? (
        <p className="border-line text-muted border-b px-5 py-2.5 font-mono text-[10.5px] tracking-[0.1em] uppercase">
          {label}
        </p>
      ) : null}
      <div className="grid sm:grid-cols-2">
        <Panel tone="bad" label={beforeLabel} text={before} />
        <Panel
          tone="ok"
          label={afterLabel}
          text={after}
          className="border-line border-t sm:border-t-0 sm:border-l"
        />
      </div>
      {note ? (
        <figcaption className="border-line text-ink-2 border-t px-5 py-3.5 text-[13.5px] leading-relaxed">
          <span className="text-accent-2 font-mono text-[10.5px] tracking-[0.08em] uppercase">
            Why it works ·{" "}
          </span>
          {note}
        </figcaption>
      ) : null}
    </figure>
  );
}

function Panel({
  tone,
  label,
  text,
  className,
}: {
  tone: "bad" | "ok";
  label: string;
  text: string;
  className?: string;
}) {
  return (
    <div className={cn("px-5 py-4", className)}>
      <p
        className={cn(
          "mb-2 flex items-center gap-1.5 font-mono text-[10.5px] tracking-[0.1em] uppercase",
          tone === "bad" ? "text-bad" : "text-ok",
        )}
      >
        <span aria-hidden>{tone === "bad" ? "✕" : "✓"}</span>
        {label}
      </p>
      <p className="text-ink-2 text-[14.5px] leading-relaxed whitespace-pre-line">
        {text}
      </p>
    </div>
  );
}
