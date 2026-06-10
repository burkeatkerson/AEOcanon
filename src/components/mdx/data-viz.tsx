import { cn } from "@/lib/utils";

/**
 * Editorial data-viz for MDX — static, token-styled, theme-aware, prerendered
 * for AEO. Each visualizes numbers an article already cites; nothing here
 * invents data. Authors pass the figures as props.
 */

const TONE_COLOR: Record<string, string> = {
  ok: "var(--ok)",
  warn: "var(--warn)",
  bad: "var(--bad)",
};

/** Per-engine (or per-anything) share-of-voice bars. */
export function SovBars({
  data,
  caption,
  max = 100,
  unit = "",
}: {
  data: { label: string; value: number; color?: string }[];
  caption?: string;
  max?: number;
  unit?: string;
}) {
  return (
    <figure className="border-line bg-panel not-prose my-8 rounded-2xl border p-5 font-sans sm:p-6">
      {caption ? (
        <figcaption className="text-muted mb-4 font-mono text-[10.5px] tracking-[0.08em] uppercase">
          {caption}
        </figcaption>
      ) : null}
      <div className="flex flex-col gap-2.5">
        {data.map((d) => (
          <div
            key={d.label}
            className="grid grid-cols-[minmax(96px,140px)_1fr_auto] items-center gap-3 font-mono text-[12px]"
          >
            <span className="text-ink-2">{d.label}</span>
            <span className="bg-bg-2 h-4 overflow-hidden rounded">
              <span
                className="block h-full rounded"
                style={{
                  width: `${Math.max(2, (d.value / max) * 100)}%`,
                  background: d.color ?? "var(--accent)",
                }}
              />
            </span>
            <span className="text-ink-2 w-12 text-right">
              {d.value}
              {unit}
            </span>
          </div>
        ))}
      </div>
    </figure>
  );
}

/** Heatmap grid — rows × columns of tone-coloured cells (e.g. you × engines). */
export function Heatmap({
  columns,
  rows,
  caption,
  legend = true,
}: {
  columns: string[];
  rows: { label: string; cells: { value: string; tone?: "ok" | "warn" | "bad" }[] }[];
  caption?: string;
  legend?: boolean;
}) {
  return (
    <figure className="border-line bg-panel not-prose my-8 rounded-2xl border p-5 font-sans sm:p-6">
      {caption ? (
        <figcaption className="text-muted mb-4 font-mono text-[10.5px] tracking-[0.08em] uppercase">
          {caption}
        </figcaption>
      ) : null}
      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: `auto repeat(${columns.length}, 1fr)` }}
      >
        <div />
        {columns.map((c) => (
          <div key={c} className="text-muted p-1.5 text-center font-mono text-[10.5px]">
            {c}
          </div>
        ))}
        {rows.map((r) => (
          <div key={r.label} className="contents">
            <div className="text-ink-2 flex items-center pr-2 text-[13px]">{r.label}</div>
            {r.cells.map((cell, i) => (
              <div
                key={i}
                className="grid h-9 place-items-center rounded-[5px] text-[12px] font-semibold text-white"
                style={{ background: TONE_COLOR[cell.tone ?? "warn"] }}
              >
                {cell.value}
              </div>
            ))}
          </div>
        ))}
      </div>
      {legend ? (
        <div className="text-muted mt-3 flex gap-4 font-mono text-[11px]">
          <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full" style={{ background: "var(--ok)" }} /> strong</span>
          <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full" style={{ background: "var(--warn)" }} /> needs work</span>
          <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full" style={{ background: "var(--bad)" }} /> critical</span>
        </div>
      ) : null}
    </figure>
  );
}

/** 0–100 score gauge with a pin on a red→amber→green track. */
export function Gauge({
  value,
  label,
  caption,
}: {
  value: number;
  label?: string;
  caption?: string;
}) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <figure className="border-line bg-panel not-prose my-8 rounded-2xl border p-5 font-sans sm:p-6">
      {label ? (
        <figcaption className="text-muted mb-3 font-mono text-[10.5px] tracking-[0.08em] uppercase">
          {label}
        </figcaption>
      ) : null}
      <div
        className="relative h-3.5 rounded-full"
        style={{ background: "linear-gradient(90deg,var(--bad),var(--warn),var(--ok))" }}
      >
        <div
          className="bg-ink absolute top-[-7px] h-[28px] w-1 -translate-x-1/2 rounded-sm"
          style={{ left: `${pct}%` }}
        />
      </div>
      <div className="text-muted mt-2.5 flex justify-between font-mono text-[11px]">
        <span>At risk</span>
        <span className="text-ink font-serif text-[16px] not-italic">{value}</span>
        <span>Established</span>
      </div>
      {caption ? (
        <p className="text-muted mt-3 text-[12.5px] leading-relaxed">{caption}</p>
      ) : null}
    </figure>
  );
}

/** Narrowing funnel — stages losing volume (e.g. searches → answer → cited → clicked). */
export function Funnel({
  steps,
  caption,
}: {
  steps: { label: string; pct: number; note?: string; highlight?: boolean }[];
  caption?: string;
}) {
  return (
    <figure className="border-line bg-panel not-prose my-8 rounded-2xl border p-5 font-sans sm:p-6">
      <div className="flex flex-col items-center gap-1.5">
        {steps.map((s) => (
          <div
            key={s.label}
            className={cn(
              "flex items-center justify-center rounded-lg px-3 py-2.5 text-center font-mono text-[12.5px]",
              s.highlight ? "bg-accent text-white" : "bg-accent-soft text-accent-2",
            )}
            style={{ width: `${Math.max(16, s.pct)}%` }}
          >
            {s.label}
            {s.note ? (
              <span className={cn("ml-2 text-[11px]", s.highlight ? "text-white/80" : "text-muted")}>
                {s.note}
              </span>
            ) : null}
          </div>
        ))}
      </div>
      {caption ? (
        <figcaption className="text-muted mt-4 text-center text-[12.5px] leading-relaxed">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

/** Head-to-head versus split — two columns of contrasting criteria. */
export function VersusSplit({
  left,
  right,
  caption,
}: {
  left: { title: string; items: string[] };
  right: { title: string; items: string[] };
  caption?: string;
}) {
  return (
    <figure className="not-prose my-8 font-sans">
      <div className="border-line grid grid-cols-1 overflow-hidden rounded-2xl border sm:grid-cols-[1fr_auto_1fr]">
        <div className="border-line border-b p-5 sm:border-r sm:border-b-0">
          <div className="text-muted mb-3.5 font-mono text-[10.5px] tracking-[0.08em] uppercase">
            {left.title}
          </div>
          {left.items.map((t) => (
            <div key={t} className="text-ink-2 flex gap-2.5 py-[7px] text-[14px]">
              <span className="text-muted">◇</span>
              {t}
            </div>
          ))}
        </div>
        <div className="bg-bg-2 text-muted grid place-items-center px-4 py-2 font-serif italic">
          vs
        </div>
        <div className="p-5">
          <div className="text-accent mb-3.5 font-mono text-[10.5px] tracking-[0.08em] uppercase">
            {right.title}
          </div>
          {right.items.map((t) => (
            <div key={t} className="text-ink-2 flex gap-2.5 py-[7px] text-[14px]">
              <span className="text-accent">◆</span>
              {t}
            </div>
          ))}
        </div>
      </div>
      {caption ? (
        <figcaption className="text-muted mt-3 text-center text-[12.5px]">{caption}</figcaption>
      ) : null}
    </figure>
  );
}
