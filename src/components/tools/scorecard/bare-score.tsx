import { NO_WEBSITE, TIER_BLURB, TIER_COLOR } from "@/lib/scorecard/copy";
import type { ScorecardResult } from "@/lib/scorecard/types";

/**
 * The free, instant score shown the moment the questions finish — BEFORE the
 * email gate, computed with zero AI. For the scored branch it's the grade ring +
 * tier; for the no-website branch it's a starting-point read (never a grade,
 * never a failing score).
 */
export function BareScore({ result }: { result: ScorecardResult }) {
  const tierColor = TIER_COLOR[result.tier];
  return (
    <div className="text-center">
      <span className="text-muted font-mono text-[11px] tracking-[0.14em] uppercase">
        Your free score
      </span>
      <div className="mt-4 flex items-center justify-center gap-5">
        <div
          className="grid size-[100px] place-items-center rounded-full border-[3px] font-serif"
          style={{
            borderColor: tierColor,
            color: tierColor,
            background: `color-mix(in oklab, ${tierColor} 10%, transparent)`,
          }}
        >
          <span className="text-[32px] leading-none font-medium">
            {result.percent}
            <span className="text-[15px]">%</span>
          </span>
        </div>
        <div className="text-left">
          <p
            className="text-[clamp(24px,3.6vw,34px)] leading-none font-medium tracking-[-0.02em]"
            style={{ color: tierColor }}
          >
            {result.tier}
          </p>
          <p className="text-muted mt-1.5 font-mono text-[12px]">
            {result.total} / 24 points
          </p>
        </div>
      </div>
      <p className="text-ink-2 mx-auto mt-5 max-w-[52ch] text-[15px] leading-relaxed">
        {TIER_BLURB[result.tier]}
      </p>
    </div>
  );
}

/** The no-website branch's free, instant starting-point read (no grade). */
export function BareStartingPoint() {
  return (
    <div className="text-center">
      <span className="text-accent font-mono text-[11px] tracking-[0.14em] uppercase">
        {NO_WEBSITE.eyebrow}
      </span>
      <h2 className="mx-auto mt-4 max-w-[22ch] text-[clamp(22px,3.6vw,32px)] leading-[1.12] font-medium tracking-[-0.02em]">
        {NO_WEBSITE.bareHeadline}
      </h2>
      <p className="text-ink-2 mx-auto mt-4 max-w-[52ch] text-[15px] leading-relaxed">
        {NO_WEBSITE.blurb}
      </p>
    </div>
  );
}
