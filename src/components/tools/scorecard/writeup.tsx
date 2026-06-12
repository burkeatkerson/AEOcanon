import { useEffect, useRef } from "react";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { AlertTriangle, ArrowRight, Check, DollarSign, Sparkles, Star } from "lucide-react";
import { resultSchema } from "@/lib/scorecard/result-schema";
import type { WriteupRequest } from "@/lib/scorecard/types";

/**
 * Streams the personalized result as a structured object and renders each
 * framework section in its own scannable block as it arrives (headline → gap →
 * cost → fixes → strength → bottom line → close). The model interprets the
 * lead's ratings through the interpretation framework server-side; this is the
 * presentation. If the stream fails, a graceful static fallback takes its place
 * so the result still reads well.
 */
export function Writeup({
  payload,
  fallback,
}: {
  payload: WriteupRequest;
  fallback: string;
}) {
  const { object, submit, isLoading, error, stop } = useObject({
    api: "/api/scorecard/writeup",
    schema: resultSchema,
  });
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    submit(payload);
    return () => stop();
    // payload is a stable, memoized value for the lifetime of this result.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showSkeleton = !object && isLoading;
  const failed = !!error && !object;

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

          {object?.gap ? (
            <Block
              icon={<AlertTriangle className="size-4" aria-hidden />}
              tone="warn"
              label={object.gapTitle ? `Biggest gap · ${object.gapTitle}` : "Your biggest gap"}
            >
              {object.gap}
            </Block>
          ) : null}

          {object?.costing ? (
            <Block
              icon={<DollarSign className="size-4" aria-hidden />}
              tone="bad"
              label="What it's costing you"
            >
              {object.costing}
            </Block>
          ) : null}

          {object?.fixes && object.fixes.length > 0 ? (
            <div>
              <SectionLabel>Your top fixes</SectionLabel>
              <ul className="mt-2.5 flex flex-col gap-2">
                {object.fixes.filter(Boolean).map((fix, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="bg-accent-soft text-accent mt-0.5 grid size-5 shrink-0 place-items-center rounded-full">
                      <Check className="size-3" strokeWidth={3} aria-hidden />
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
