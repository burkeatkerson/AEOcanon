/** Slim progress indicator: "Question X of N" + a filled bar. */
export function ProgressBar({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="mb-7">
      <div className="text-muted mb-2 flex items-center justify-between font-mono text-[11px] tracking-[0.08em] uppercase">
        <span>
          Question {current} of {total}
        </span>
        <span aria-hidden>{pct}%</span>
      </div>
      <div
        className="bg-bg-2 h-1.5 overflow-hidden rounded-full"
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={`Question ${current} of ${total}`}
      >
        <div
          className="bg-accent h-full rounded-full transition-[width] duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
