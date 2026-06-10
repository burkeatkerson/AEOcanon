import { cn } from "@/lib/utils";

/**
 * The signature "lifted passage" motif — the one picture of what AEO physically
 * does. A page with a single answer-first passage highlighted, extracted, and
 * dropped into an AI answer that cites the source. Makes the most-repeated idea
 * on the site ("engines cite passages, not pages") concrete. Server-rendered,
 * token-styled, theme-aware.
 */
export function LiftedPassage({
  passage = "A passport renewal takes 6–8 weeks by standard mail.",
  source = "yoursite.com",
  className,
}: {
  passage?: string;
  source?: string;
  className?: string;
}) {
  return (
    <figure
      className={cn(
        "border-line bg-panel not-prose my-8 rounded-2xl border p-5 font-sans sm:p-6",
        className,
      )}
    >
      <div className="grid items-center gap-4 sm:grid-cols-[1fr_auto_1fr]">
        {/* the page */}
        <div className="border-line-2 bg-paper overflow-hidden rounded-xl border">
          <div className="border-line text-muted border-b px-4 py-2 font-mono text-[10px] tracking-[0.1em] uppercase">
            Your page
          </div>
          <div className="flex flex-col gap-2.5 p-4">
            {/* the answer-first, liftable passage */}
            <div className="border-accent bg-accent-soft text-ink rounded-md border px-3 py-2 text-[13px] leading-snug font-medium">
              {passage}
            </div>
            <span className="bg-line h-2 w-[92%] rounded" />
            <span className="bg-line h-2 w-full rounded" />
            <span className="bg-line h-2 w-[70%] rounded" />
            <span className="bg-line h-2 w-[84%] rounded" />
          </div>
        </div>

        {/* connector */}
        <div className="text-accent flex flex-row items-center justify-center gap-2 sm:flex-col">
          <svg
            width="34"
            height="34"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="rotate-90 sm:rotate-0"
            aria-hidden
          >
            <path d="M4 12h15" />
            <path d="M14 7l5 5-5 5" />
          </svg>
          <span className="font-mono text-[9.5px] tracking-[0.08em] uppercase">
            extracted
          </span>
        </div>

        {/* the AI answer */}
        <div className="border-line-2 bg-paper overflow-hidden rounded-xl border">
          <div className="border-line text-muted border-b px-4 py-2 font-mono text-[10px] tracking-[0.1em] uppercase">
            The AI answer
          </div>
          <div className="p-4">
            <p className="text-ink-2 text-[13px] leading-relaxed">
              <span className="bg-accent-soft text-ink rounded px-1 font-medium">
                {passage}
              </span>{" "}
              You can expedite it for an added fee.
            </p>
            <div className="border-line-2 text-accent mt-3 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px]">
              <span aria-hidden>↗</span>
              {source}
            </div>
          </div>
        </div>
      </div>

      <figcaption className="text-muted mt-4 text-center text-[12.5px] leading-relaxed">
        Engines cite <span className="text-ink-2 font-medium">passages, not pages</span> —
        write the sentence you want quoted, and put it first.
      </figcaption>
    </figure>
  );
}
