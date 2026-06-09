import { cn } from "@/lib/utils";

/**
 * "Choose X if… / choose Y if…" decision block for versus comparisons. Two (or
 * three) labelled columns of criteria that help a reader self-select. Static and
 * presentational — renders into the prerendered HTML engines parse, and reads
 * cleanly as a set of mini-lists when lifted.
 */
export function DecisionBlock({
  options,
  title = "Which should you choose?",
}: {
  /** Each option: a label ("AEO") and the bullet criteria for picking it. */
  options: { label: string; when: string[] }[];
  title?: string;
}) {
  return (
    <section className="not-prose border-line bg-panel my-8 overflow-hidden rounded-2xl border font-sans">
      <p className="border-line text-muted border-b px-5 py-2.5 font-mono text-[10.5px] tracking-[0.1em] uppercase">
        {title}
      </p>
      <div
        className={cn(
          "grid",
          options.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2",
        )}
      >
        {options.map((opt, i) => (
          <div
            key={opt.label}
            className={
              i > 0 ? "border-line border-t sm:border-t-0 sm:border-l" : ""
            }
          >
            <p className="text-ink px-5 pt-4 text-[15px] font-medium">
              Choose <span className="text-accent">{opt.label}</span> if…
            </p>
            <ul className="flex flex-col gap-2 px-5 pt-3 pb-5">
              {opt.when.map((w) => (
                <li
                  key={w}
                  className="text-ink-2 flex gap-2.5 text-[14px] leading-snug"
                >
                  <span className="text-accent shrink-0">▸</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
