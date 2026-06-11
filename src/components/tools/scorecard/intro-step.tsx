import { ArrowRight } from "lucide-react";
import { INTRO } from "@/lib/scorecard/copy";
import { QUESTIONS } from "@/lib/scorecard/questions";

/** Opening screen — sets expectations, then drops into question one. */
export function IntroStep({ onStart }: { onStart: () => void }) {
  return (
    <div className="text-center">
      <span className="text-accent font-mono text-[11px] tracking-[0.14em] uppercase">
        {INTRO.eyebrow}
      </span>
      <h2 className="mx-auto mt-4 max-w-[20ch] text-[clamp(26px,4vw,40px)] leading-[1.08] font-medium tracking-[-0.02em]">
        {INTRO.heading}
      </h2>
      <p className="text-ink-2 mx-auto mt-4 max-w-[50ch] text-[16px] leading-relaxed">
        {INTRO.sub}
      </p>

      <ul className="mt-7 flex flex-wrap justify-center gap-2">
        {QUESTIONS.map((q) => (
          <li
            key={q.pillar}
            className="border-line-2 bg-paper text-ink-2 rounded-full border px-3 py-1 text-[12.5px]"
            style={{ borderLeft: `3px solid ${q.color}` }}
          >
            {q.title}
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={onStart}
          className="bg-ink text-bg hover:bg-accent hover:text-white inline-flex cursor-pointer items-center gap-2 rounded-md px-6 py-[14px] text-[15px] font-medium transition-colors"
        >
          {INTRO.cta} <ArrowRight className="size-4" aria-hidden />
        </button>
        <p className="text-faint font-mono text-[11px]">{INTRO.meta}</p>
      </div>
    </div>
  );
}
