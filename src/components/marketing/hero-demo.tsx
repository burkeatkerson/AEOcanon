"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Interactive hero demo: a live answer-engine chat that rotates through common
 * trades, showing the assistant name a competitor or two — and pointedly not the
 * visitor. It makes the abstract "AI names one business" problem personal in a
 * few seconds, and invites the visitor to pick their own trade. Decorative: the
 * page's value proposition lives in server-rendered copy beside it; this island
 * only enriches it. Fully static and readable under prefers-reduced-motion.
 */

const BAD = "var(--bad)";

type Scenario = { chip: string; q: string; a: React.ReactNode };

const SCENARIOS: Scenario[] = [
  {
    chip: "HVAC",
    q: "Who’s the best HVAC company near me for a new system?",
    a: (
      <>
        A couple of well-reviewed options near you are{" "}
        <b style={{ color: BAD }}>[a competitor]</b> and{" "}
        <b style={{ color: BAD }}>[a national directory]</b>…
      </>
    ),
  },
  {
    chip: "Plumbing",
    q: "I need an emergency plumber near me, open right now.",
    a: (
      <>
        For urgent help nearby, people often call{" "}
        <b style={{ color: BAD }}>[a big franchise]</b> or{" "}
        <b style={{ color: BAD }}>[a directory listing]</b>…
      </>
    ),
  },
  {
    chip: "Roofing",
    q: "Who should I call to replace my roof after the storm?",
    a: (
      <>
        A few reputable roofers in your area are{" "}
        <b style={{ color: BAD }}>[a competitor]</b> and{" "}
        <b style={{ color: BAD }}>[a contractor across town]</b>…
      </>
    ),
  },
  {
    chip: "Dental",
    q: "Best dentist near me taking new patients?",
    a: (
      <>
        Highly rated nearby options include{" "}
        <b style={{ color: BAD }}>[a dental group]</b> and{" "}
        <b style={{ color: BAD }}>[a competing practice]</b>…
      </>
    ),
  },
  {
    chip: "Legal",
    q: "Top-rated personal-injury lawyer in my area?",
    a: (
      <>
        Some well-reviewed firms near you are{" "}
        <b style={{ color: BAD }}>[a large firm]</b> and{" "}
        <b style={{ color: BAD }}>[a lawyer-directory site]</b>…
      </>
    ),
  },
  {
    chip: "Med spa",
    q: "Where’s the best place near me for Botox?",
    a: (
      <>
        Popular nearby choices are{" "}
        <b style={{ color: BAD }}>[a competitor]</b> and{" "}
        <b style={{ color: BAD }}>[a chain location]</b>…
      </>
    ),
  },
];

type Phase = "asking" | "thinking" | "answered";

function TypingDots() {
  return (
    <div className="bg-bg-2 border-line flex items-center gap-1.5 self-start rounded-2xl rounded-bl-[5px] border px-4 py-4">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="bg-muted size-1.5 rounded-full motion-safe:animate-pulse"
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </div>
  );
}

export function HeroDemo() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [phase, setPhase] = useState<Phase>("asking");

  useEffect(() => {
    // Reduced motion: show the whole exchange at once, no looping.
    if (reduce) {
      setPhase("answered");
      return;
    }
    setPhase("asking");
    const toThinking = setTimeout(() => setPhase("thinking"), 650);
    const toAnswered = setTimeout(() => setPhase("answered"), 1750);
    const toNext = setTimeout(
      () => setActive((i) => (i + 1) % SCENARIOS.length),
      5200,
    );
    return () => {
      clearTimeout(toThinking);
      clearTimeout(toAnswered);
      clearTimeout(toNext);
    };
  }, [active, reduce]);

  const s = SCENARIOS[active]!;
  const fade = (delay = 0) =>
    reduce
      ? { initial: false as const }
      : {
          initial: { opacity: 0, y: 8 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.3, delay },
        };

  return (
    <div>
      <div className="border-line bg-panel overflow-hidden rounded-[20px] border shadow-[0_40px_80px_-50px_rgba(0,0,0,0.5)]">
        <div className="border-line text-muted flex items-center gap-2 border-b px-[18px] py-3 font-mono text-[11px]">
          <span className="bg-accent size-2 rounded-full motion-safe:animate-pulse" />
          A customer, right now
        </div>
        <div className="flex min-h-[208px] flex-col gap-3 p-[22px]">
          <motion.div
            key={`q-${active}`}
            {...fade()}
            className="bg-accent self-end rounded-2xl rounded-br-[5px] px-4 py-3 text-[14.5px] leading-snug text-white"
          >
            {s.q}
          </motion.div>

          {phase === "thinking" ? (
            <TypingDots />
          ) : phase === "answered" ? (
            <>
              <motion.div
                key={`a-${active}`}
                {...fade()}
                className="bg-bg-2 border-line text-ink-2 max-w-[88%] self-start rounded-2xl rounded-bl-[5px] border px-4 py-3 text-[14.5px] leading-snug"
              >
                {s.a}
              </motion.div>
              <motion.div
                key={`p-${active}`}
                {...fade(reduce ? 0 : 0.15)}
                className="bg-ink text-bg self-end rounded-2xl rounded-br-[5px] px-4 py-3 font-serif text-[14.5px] italic"
              >
                …and not you. Yet.
              </motion.div>
            </>
          ) : null}
        </div>
      </div>

      <div className="mt-3.5 flex flex-wrap items-center gap-2">
        <span className="text-muted mr-1 font-mono text-[11px]">
          Try your trade:
        </span>
        {SCENARIOS.map((sc, i) => (
          <button
            key={sc.chip}
            type="button"
            onClick={() => setActive(i)}
            aria-pressed={i === active}
            className={cn(
              "cursor-pointer rounded-full border px-3 py-1 font-mono text-[11.5px] transition-colors",
              i === active
                ? "border-accent bg-accent-soft text-accent"
                : "border-line-2 bg-panel text-ink-2 hover:border-accent hover:text-accent",
            )}
          >
            {sc.chip}
          </button>
        ))}
      </div>
    </div>
  );
}
