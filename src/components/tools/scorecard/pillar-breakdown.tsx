import { QUESTIONS } from "@/lib/scorecard/questions";
import type { PillarKey, PillarScores } from "@/lib/scorecard/types";
import { cn } from "@/lib/utils";

const LEVEL_LABEL = ["Critical", "Weak", "Solid", "Strong"] as const;

/** Per-pillar breakdown: one row per pillar, a 0–3 bar in the layer color. */
export function PillarBreakdown({
  scores,
  weakest,
}: {
  scores: PillarScores;
  weakest: PillarKey | null;
}) {
  return (
    <div className="border-line bg-panel rounded-2xl border p-5 sm:p-6">
      <h3 className="text-muted font-mono text-[11px] tracking-[0.1em] uppercase">
        Pillar breakdown
      </h3>
      <ul className="mt-4 flex flex-col gap-3.5">
        {QUESTIONS.map((q) => {
          const score = scores[q.pillar];
          const isWeakest = weakest === q.pillar;
          return (
            <li key={q.pillar} className="flex items-center gap-3">
              <div className="flex w-[34%] min-w-0 items-center gap-2 sm:w-[28%]">
                <span
                  className="size-2 shrink-0 rounded-full"
                  style={{ background: q.color }}
                  aria-hidden
                />
                <span
                  className={cn(
                    "truncate text-[14px]",
                    isWeakest ? "text-ink font-semibold" : "text-ink-2",
                  )}
                >
                  {q.title}
                </span>
              </div>
              <div className="bg-bg-2 relative h-2 flex-1 overflow-hidden rounded-full">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(score / 3) * 100}%`,
                    background: q.color,
                  }}
                />
              </div>
              <span
                className={cn(
                  "w-[64px] shrink-0 text-right font-mono text-[11px]",
                  isWeakest ? "text-ink" : "text-muted",
                )}
              >
                {LEVEL_LABEL[score]}
              </span>
            </li>
          );
        })}
      </ul>
      {weakest ? (
        <p className="text-muted border-line mt-4 border-t pt-3.5 text-[12.5px] leading-relaxed">
          Your weakest pillar sets your starting point — that&rsquo;s the
          playbook we matched you to below.
        </p>
      ) : null}
    </div>
  );
}
