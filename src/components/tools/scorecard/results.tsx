import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Download, Sparkles } from "lucide-react";
import { PillarBreakdown } from "@/components/tools/scorecard/pillar-breakdown";
import { TIER_BLURB, TIER_COLOR } from "@/lib/scorecard/copy";
import type { Playbook } from "@/lib/scorecard/playbooks";
import type { Answers, ScorecardResult } from "@/lib/scorecard/types";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

/**
 * The results screen. Renders entirely from the client-computed result, so the
 * grade, breakdown, and download appear instantly — no network dependency. The
 * personalized write-up streams in from Claude as a progressive enhancement;
 * if it fails, a graceful static read takes its place.
 */
export function Results({
  result,
  answers,
  playbook,
  playbookHref,
  saveStatus,
}: {
  result: ScorecardResult;
  answers: Answers;
  playbook: Playbook;
  playbookHref: string;
  saveStatus: SaveStatus;
}) {
  const tierColor = TIER_COLOR[result.tier];

  return (
    <div>
      {/* Grade + tier */}
      <div className="text-center">
        <span className="text-muted font-mono text-[11px] tracking-[0.14em] uppercase">
          Your AEO scorecard
        </span>
        <div className="mt-4 flex items-center justify-center gap-5">
          <div
            className="grid size-[92px] place-items-center rounded-full border-[3px] font-serif"
            style={{
              borderColor: tierColor,
              color: tierColor,
              background: `color-mix(in oklab, ${tierColor} 10%, transparent)`,
            }}
          >
            <span className="text-[30px] leading-none font-medium">
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
        <p className="text-ink-2 mx-auto mt-5 max-w-[54ch] text-[16px] leading-relaxed">
          {TIER_BLURB[result.tier]}
        </p>
      </div>

      {/* Personalized write-up */}
      <Writeup answers={answers} />

      {/* Pillar breakdown */}
      <div className="mt-6">
        <PillarBreakdown
          scores={result.pillarScores}
          weakest={result.weakestPillar}
        />
      </div>

      {/* Primary action: the matched playbook download */}
      <div
        className="border-accent bg-panel mt-6 overflow-hidden rounded-2xl border shadow-[0_24px_60px_-44px_color-mix(in_oklab,var(--accent)_70%,transparent)]"
      >
        <div className="p-6 sm:p-7">
          <span className="text-accent inline-flex items-center gap-2 font-mono text-[10.5px] tracking-[0.12em] uppercase">
            <span
              className="size-[7px] rounded-full"
              style={{ background: "var(--ok)" }}
            />
            Your matched playbook · ready now
          </span>
          <h3 className="mt-3 text-[22px] leading-tight font-medium">
            {playbook.title}
          </h3>
          <p className="text-ink-2 mt-2 max-w-[52ch] text-[15px] leading-relaxed">
            {playbook.blurb}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <a
              href={playbookHref}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="bg-accent inline-flex items-center gap-2 rounded-md px-5 py-3 text-[15px] font-medium text-white transition-opacity hover:opacity-90"
            >
              <Download className="size-4" aria-hidden /> Download your playbook
            </a>
            <span className="text-muted text-[13px]" aria-live="polite">
              {saveStatus === "saved" || saveStatus === "saving"
                ? "We've also emailed you a copy."
                : saveStatus === "error"
                  ? "Download is ready — the emailed copy may be delayed."
                  : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Secondary CTA: the free audit */}
      <div className="border-line-2 bg-accent-soft mt-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl border px-6 py-5">
        <div>
          <h3 className="text-[17px] font-medium">
            Want the same read on your actual pages?
          </h3>
          <p className="text-ink-2 max-w-[52ch] text-[14px] leading-relaxed">
            Run our free AI Visibility Analyzer to see exactly what each engine
            does with your live site.
          </p>
        </div>
        <Link
          href="/audit"
          className="border-accent text-accent hover:bg-accent inline-flex shrink-0 items-center gap-2 rounded-md border px-5 py-2.5 text-[14px] font-medium transition-colors hover:text-white"
        >
          Try the free audit <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
    </div>
  );
}

/** Streams the short personalized read from /api/scorecard/writeup. */
function Writeup({ answers }: { answers: Answers }) {
  const [text, setText] = useState("");
  const [state, setState] = useState<"loading" | "done" | "error">("loading");
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const controller = new AbortController();

    (async () => {
      try {
        const res = await fetch("/api/scorecard/writeup", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ answers }),
          signal: controller.signal,
        });
        if (!res.ok || !res.body) throw new Error("no stream");
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let acc = "";
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          acc += decoder.decode(value, { stream: true });
          setText(acc);
        }
        setState("done");
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setState("error");
      }
    })();

    return () => controller.abort();
  }, [answers]);

  const fallback = `Your two biggest gaps right now are the lowest bars below. Start with the one at the top of the breakdown — it's the highest-leverage fix — then work down. The matched playbook walks you through the first moves step by step.`;

  return (
    <div className="border-line bg-paper mt-7 rounded-2xl border p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <Sparkles className="text-accent size-4" aria-hidden />
        <span className="text-muted font-mono text-[11px] tracking-[0.1em] uppercase">
          Your personalized read
        </span>
      </div>
      <div className="text-ink-2 mt-3 space-y-3 text-[15px] leading-relaxed whitespace-pre-line">
        {state === "error" ? (
          fallback
        ) : text ? (
          text
        ) : (
          <span className="text-faint inline-flex items-center gap-1.5">
            Reading your answers
            <span className="inline-flex gap-0.5">
              <Dot /> <Dot delay="0.15s" /> <Dot delay="0.3s" />
            </span>
          </span>
        )}
      </div>
    </div>
  );
}

function Dot({ delay = "0s" }: { delay?: string }) {
  return (
    <span
      className="bg-faint inline-block size-1.5 animate-pulse rounded-full"
      style={{ animationDelay: delay }}
    />
  );
}
