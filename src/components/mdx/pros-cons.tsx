/** Side-by-side pros and cons for a review. Static, scannable, balanced. */
export function ProsCons({
  pros,
  cons,
}: {
  pros: string[];
  cons: string[];
}) {
  return (
    <div className="not-prose my-8 grid gap-4 font-sans sm:grid-cols-2">
      <div className="rounded-2xl border border-ok/40 bg-[color-mix(in_oklab,var(--ok)_7%,var(--panel))] p-5">
        <p className="text-ok mb-3 font-mono text-[10.5px] tracking-[0.1em] uppercase">
          Pros
        </p>
        <ul className="flex flex-col gap-2">
          {pros.map((p) => (
            <li key={p} className="text-ink-2 flex gap-2.5 text-[14px] leading-snug">
              <span className="text-ok shrink-0">+</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-2xl border border-bad/40 bg-[color-mix(in_oklab,var(--bad)_7%,var(--panel))] p-5">
        <p className="text-bad mb-3 font-mono text-[10.5px] tracking-[0.1em] uppercase">
          Cons
        </p>
        <ul className="flex flex-col gap-2">
          {cons.map((c) => (
            <li key={c} className="text-ink-2 flex gap-2.5 text-[14px] leading-snug">
              <span className="text-bad shrink-0">−</span>
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
