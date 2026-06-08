/**
 * CSS/SVG data-viz components for MDX articles — no image files required, fully
 * static, theme-aware. Registered in the MDX map so authors can drop them into
 * any `.mdx`. Designed to make long-form content scannable for humans and
 * clearly structured for AI extraction.
 */
import { cn } from "@/lib/utils";

/** Answer-first summary box — an extractable TL;DR. Great at the top of a piece. */
export function KeyTakeaways({
  items,
  title = "Key takeaways",
}: {
  items: string[];
  title?: string;
}) {
  return (
    <aside className="border-accent bg-accent-soft my-7 rounded-xl border border-dashed p-5 font-sans">
      <p className="text-accent-2 mb-2.5 font-mono text-[10.5px] tracking-[0.1em] uppercase">
        {title}
      </p>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li
            key={item}
            className="text-ink-2 flex gap-2.5 text-[14.5px] leading-snug"
          >
            <span className="text-accent">▸</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}

/** A single headline figure + caption. */
export function Stat({
  value,
  label,
  color = "var(--accent)",
}: {
  value: string;
  label: string;
  color?: string;
}) {
  return (
    <div className="border-line bg-panel rounded-xl border p-5">
      <div
        className="font-serif text-[clamp(34px,5vw,52px)] leading-none tracking-[-0.02em]"
        style={{ color }}
      >
        {value}
      </div>
      <div className="text-ink-2 mt-2.5 text-[13.5px] leading-snug">
        {label}
      </div>
    </div>
  );
}

/** Grid wrapper for multiple <Stat> blocks. */
export function StatGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-8 grid gap-4 font-sans sm:grid-cols-2 lg:grid-cols-3">
      {children}
    </div>
  );
}

interface Bar {
  label: string;
  value: number;
  display?: string;
  color?: string;
  emphasis?: boolean;
}

/** Horizontal labeled bar chart — ideal for correlation / comparison data. */
export function BarChart({
  data,
  caption,
  max,
}: {
  data: Bar[];
  caption?: string;
  max?: number;
}) {
  const ceiling = max ?? Math.max(...data.map((d) => d.value));
  return (
    <figure className="border-line bg-panel my-8 rounded-xl border p-6 font-sans">
      {caption ? (
        <figcaption className="text-muted mb-4 font-mono text-[10.5px] tracking-[0.08em] uppercase">
          {caption}
        </figcaption>
      ) : null}
      <div className="flex flex-col gap-3">
        {data.map((d) => (
          <div
            key={d.label}
            className="grid grid-cols-[minmax(120px,160px)_1fr_auto] items-center gap-3 text-[12.5px]"
          >
            <span
              className={cn("text-ink-2", d.emphasis && "text-ink font-medium")}
            >
              {d.label}
            </span>
            <span className="bg-bg-2 h-4 overflow-hidden rounded">
              <span
                className="block h-full rounded"
                style={{
                  width: `${Math.max(2, (d.value / ceiling) * 100)}%`,
                  background: d.color ?? "var(--accent)",
                }}
              />
            </span>
            <span className="text-ink-2 text-right font-mono text-[11.5px]">
              {d.display ?? d.value}
            </span>
          </div>
        ))}
      </div>
    </figure>
  );
}

/** Numbered steps — for "the moves" / how-to sequences. */
export function Steps({
  items,
}: {
  items: { title: string; body?: string }[] | string[];
}) {
  const normalized = items.map((item) =>
    typeof item === "string" ? { title: item } : item,
  );
  return (
    <ol className="my-8 flex flex-col gap-4 font-sans">
      {normalized.map((step, i) => (
        <li key={step.title} className="grid grid-cols-[40px_1fr] gap-4">
          <span className="text-accent font-serif text-[32px] leading-none">
            {i + 1}
          </span>
          <div>
            <p className="text-ink font-medium">{step.title}</p>
            {step.body ? (
              <p className="text-muted mt-1 text-[14px] leading-relaxed">
                {step.body}
              </p>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}

/** Centered editorial pull quote (the pillar principle, a key line). */
export function PullQuote({
  children,
  cite,
}: {
  children: React.ReactNode;
  cite?: string;
}) {
  return (
    <figure className="border-accent my-9 border-y py-7 text-center font-sans">
      <blockquote className="text-ink mx-auto max-w-[28ch] font-serif text-[clamp(22px,3vw,28px)] leading-tight italic">
        {children}
      </blockquote>
      {cite ? (
        <figcaption className="text-muted mt-4 font-mono text-[11px]">
          {cite}
        </figcaption>
      ) : null}
    </figure>
  );
}
