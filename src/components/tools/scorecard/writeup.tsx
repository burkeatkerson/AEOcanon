import { useEffect, useRef, useState } from "react";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import {
  ArrowRight,
  Check,
  DollarSign,
  Gauge,
  Sparkles,
  Star,
  TrendingUp,
} from "lucide-react";
import { MAX_SCORE } from "@/lib/scorecard/scoring";
import { QUESTIONS } from "@/lib/scorecard/questions";
import { resultSchema } from "@/lib/scorecard/result-schema";
import type {
  PillarKey,
  PillarScores,
  ScorecardResult,
  WriteupRequest,
} from "@/lib/scorecard/types";

/** Score at which a business reaches the top tier, "The Answer" (80%). */
const ANSWER_PCT = 80;

/**
 * Streams the personalized result as a structured object and renders each
 * framework section in its own scannable block as it arrives. The shape is
 * analytical and benefit-led: a distance-to-goal readout (how far from being the
 * business AI recommends), then each weak pillar walked from where they are →
 * what strong looks like → what they gain. The model interprets the lead's
 * ratings through the interpretation framework server-side; this is the
 * presentation. If the stream fails, a graceful static fallback takes its place.
 */
export function Writeup({
  payload,
  result,
  fallback,
}: {
  payload: WriteupRequest;
  result: ScorecardResult | null;
  fallback: string;
}) {
  const { object, submit, isLoading, error } = useObject({
    api: "/api/scorecard/writeup",
    schema: resultSchema,
  });
  const started = useRef(false);
  // Safety net: if nothing has streamed in after a while (route slow/down),
  // fall back to the static read rather than spin forever.
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    submit(payload);
    // NOTE: deliberately no stop() on cleanup — React StrictMode double-invokes
    // effects in dev, and aborting here would kill the only request and (with the
    // run-once guard) never resubmit, leaving the read stuck loading.
    const t = setTimeout(() => setTimedOut(true), 30_000);
    return () => clearTimeout(t);
    // payload is a stable, memoized value for the lifetime of this result.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const failed = (!!error || timedOut) && !object;
  const showSkeleton = !object && !failed;

  return (
    <div className="border-line bg-paper rounded-2xl border p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <Sparkles className="text-accent size-4" aria-hidden />
        <span className="text-muted font-mono text-[11px] tracking-[0.1em] uppercase">
          Your personalized read
        </span>
      </div>

      {failed ? (
        <p className="text-ink-2 mt-4 text-[15px] leading-relaxed">{fallback}</p>
      ) : showSkeleton ? (
        <Skeleton />
      ) : (
        <div className="mt-4 flex flex-col gap-5">
          {object?.headline ? (
            <p className="text-ink font-serif text-[19px] leading-snug">
              {object.headline}
            </p>
          ) : null}

          {/* Distance to goal — deterministic bar (scored branch) + AI read. */}
          {result || object?.distance ? (
            <DistanceToGoal result={result} read={object?.distance} />
          ) : null}

          {/* The climb: each weak pillar, where you are → what strong looks like. */}
          {object?.gapAnalysis && object.gapAnalysis.length > 0 ? (
            <div>
              <SectionLabel>
                Your biggest gaps — and what closing them wins you
              </SectionLabel>
              <div className="mt-3 flex flex-col gap-3">
                {object.gapAnalysis.filter(Boolean).map((g, i) => (
                  <GapCard
                    key={i}
                    pillar={g?.pillar}
                    current={g?.current}
                    strong={g?.strong}
                    benefit={g?.benefit}
                    scores={result?.pillarScores}
                  />
                ))}
              </div>
            </div>
          ) : null}

          {object?.costing ? (
            <Block
              icon={<DollarSign className="size-4" aria-hidden />}
              tone="bad"
              label="What the gap is costing you"
            >
              {object.costing}
            </Block>
          ) : null}

          {object?.fixes && object.fixes.length > 0 ? (
            <div>
              <SectionLabel>Where to start</SectionLabel>
              <ul className="mt-2.5 flex flex-col gap-2">
                {object.fixes.filter(Boolean).map((fix, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="bg-accent-soft text-accent mt-0.5 grid size-5 shrink-0 place-items-center rounded-full font-mono text-[11px] font-semibold">
                      {i + 1}
                    </span>
                    <span className="text-ink-2 text-[15px] leading-relaxed">
                      {fix}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {object?.strength ? (
            <Block
              icon={<Star className="size-4" aria-hidden />}
              tone="ok"
              label="What you're already doing right"
            >
              {object.strength}
            </Block>
          ) : null}

          {object?.bottomLine ? (
            <div className="border-line border-t pt-4">
              <SectionLabel>The bottom line</SectionLabel>
              <p className="text-ink mt-2 text-[15px] leading-relaxed font-medium">
                {object.bottomLine}
              </p>
            </div>
          ) : null}

          {object?.close ? (
            <p className="text-ink-2 flex items-start gap-2 text-[14.5px] leading-relaxed">
              <ArrowRight className="text-accent mt-1 size-4 shrink-0" aria-hidden />
              <span>{object.close}</span>
            </p>
          ) : null}

          {isLoading ? <TypingDots /> : null}
        </div>
      )}
    </div>
  );
}

/**
 * The distance-to-goal readout. For the scored branch, a deterministic bar shows
 * exactly how far their score sits below "The Answer" (80%) — the analytical
 * "how far do I have to go". The model's `distance` sentence sits beneath it.
 */
function DistanceToGoal({
  result,
  read,
}: {
  result: ScorecardResult | null;
  read: string | undefined;
}) {
  return (
    <div className="border-line-2 bg-bg-2/50 rounded-xl border p-4">
      <div className="text-accent flex items-center gap-2 font-mono text-[10.5px] tracking-[0.1em] uppercase">
        <Gauge className="size-3.5" aria-hidden />
        How far to “The Answer”
      </div>

      {result ? (
        <div className="mt-3">
          <div className="text-muted mb-1.5 flex items-center justify-between font-mono text-[11px]">
            <span className="text-ink font-semibold">You: {result.percent}%</span>
            <span>Recommended-by-AI: {ANSWER_PCT}%+</span>
          </div>
          <div className="bg-bg-2 relative h-2.5 overflow-hidden rounded-full">
            {/* target zone */}
            <div
              className="absolute inset-y-0 right-0 rounded-r-full"
              style={{
                width: `${100 - ANSWER_PCT}%`,
                background: "color-mix(in oklab, var(--ok) 22%, transparent)",
              }}
            />
            {/* their progress */}
            <div
              className="bg-accent relative h-full rounded-full"
              style={{ width: `${result.percent}%` }}
            />
            {/* the 80% line */}
            <div
              className="absolute inset-y-0"
              style={{
                left: `${ANSWER_PCT}%`,
                width: "2px",
                background: "var(--ok)",
              }}
              aria-hidden
            />
          </div>
          <p className="text-muted mt-2 font-mono text-[11px]">
            {result.percent >= ANSWER_PCT ? (
              <>You’re in the zone AI recommends from — now hold the lead.</>
            ) : (
              <>
                <TrendingUp className="mr-1 inline size-3" aria-hidden />
                {Math.max(0, ANSWER_PCT - result.percent)} points to go ·{" "}
                {Math.max(
                  0,
                  Math.ceil((ANSWER_PCT / 100) * MAX_SCORE) - result.total,
                )}{" "}
                of {MAX_SCORE} on the board
              </>
            )}
          </p>
        </div>
      ) : null}

      {read ? (
        <p className="text-ink-2 mt-3 text-[15px] leading-relaxed">{read}</p>
      ) : null}
    </div>
  );
}

/** Look up a pillar's 0–3 score from the model's free-text pillar name. */
function scoreForPillar(
  name: string | undefined,
  scores: PillarScores | undefined,
): number | null {
  if (!name || !scores) return null;
  const n = name.trim().toLowerCase();
  const match = QUESTIONS.find(
    (q) => q.title.toLowerCase() === n || q.pillar === (n as PillarKey),
  );
  return match ? scores[match.pillar] : null;
}

/** One weak pillar: where you are (score X/3) → what strong looks like → payoff. */
function GapCard({
  pillar,
  current,
  strong,
  benefit,
  scores,
}: {
  pillar: string | undefined;
  current: string | undefined;
  strong: string | undefined;
  benefit: string | undefined;
  scores: PillarScores | undefined;
}) {
  const score = scoreForPillar(pillar, scores);
  return (
    <div className="border-line bg-panel rounded-xl border p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-ink text-[15px] font-semibold">{pillar}</span>
        {score !== null ? (
          <span className="text-muted flex items-center gap-1.5 font-mono text-[11px]">
            <span className="text-warn font-semibold">{score}/3</span>
            <ArrowRight className="size-3" aria-hidden />
            <span className="text-ok font-semibold">3/3</span>
          </span>
        ) : null}
      </div>
      {current ? (
        <p className="text-ink-2 mt-2 text-[14px] leading-relaxed">
          <span className="text-muted font-medium">Now: </span>
          {current}
        </p>
      ) : null}
      {strong ? (
        <p className="text-ink-2 mt-1.5 text-[14px] leading-relaxed">
          <span className="text-muted font-medium">Strong looks like: </span>
          {strong}
        </p>
      ) : null}
      {benefit ? (
        <p
          className="mt-2.5 flex items-start gap-2 rounded-lg px-3 py-2 text-[14px] leading-relaxed"
          style={{
            background: "color-mix(in oklab, var(--ok) 8%, transparent)",
          }}
        >
          <Check
            className="text-ok mt-0.5 size-3.5 shrink-0"
            strokeWidth={3}
            aria-hidden
          />
          <span className="text-ink-2">{benefit}</span>
        </p>
      ) : null}
    </div>
  );
}

const TONE: Record<string, { border: string; bg: string; text: string }> = {
  warn: { border: "var(--warn)", bg: "var(--warn)", text: "var(--warn)" },
  bad: { border: "var(--bad)", bg: "var(--bad)", text: "var(--bad)" },
  ok: { border: "var(--ok)", bg: "var(--ok)", text: "var(--ok)" },
};

function Block({
  icon,
  tone,
  label,
  children,
}: {
  icon: React.ReactNode;
  tone: keyof typeof TONE | string;
  label: string;
  children: React.ReactNode;
}) {
  const c = TONE[tone] ?? TONE.warn!;
  return (
    <div
      className="rounded-xl border p-4"
      style={{
        borderColor: `color-mix(in oklab, ${c.border} 35%, transparent)`,
        background: `color-mix(in oklab, ${c.bg} 7%, transparent)`,
      }}
    >
      <div
        className="flex items-center gap-2 font-mono text-[10.5px] tracking-[0.1em] uppercase"
        style={{ color: c.text }}
      >
        {icon}
        {label}
      </div>
      <p className="text-ink-2 mt-2 text-[15px] leading-relaxed">{children}</p>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-muted font-mono text-[10.5px] tracking-[0.1em] uppercase">
      {children}
    </span>
  );
}

function Skeleton() {
  return (
    <div className="mt-4 flex flex-col gap-3" aria-hidden>
      {[100, 92, 78].map((w, i) => (
        <div
          key={i}
          className="bg-bg-2 h-3.5 animate-pulse rounded-full"
          style={{ width: `${w}%` }}
        />
      ))}
      <span className="text-faint mt-1 inline-flex items-center gap-1.5 text-[13px]">
        Interpreting your answers
        <TypingDots />
      </span>
    </div>
  );
}

function TypingDots() {
  return (
    <span className="inline-flex gap-0.5">
      {["0s", "0.15s", "0.3s"].map((delay) => (
        <span
          key={delay}
          className="bg-faint inline-block size-1.5 animate-pulse rounded-full"
          style={{ animationDelay: delay }}
        />
      ))}
    </span>
  );
}
