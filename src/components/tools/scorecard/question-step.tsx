import { Check } from "lucide-react";
import type { Question } from "@/lib/scorecard/questions";
import { cn } from "@/lib/utils";

/**
 * A single question screen: pillar eyebrow, prompt, and four single-select
 * options. Point values are intentionally never rendered. Selecting an option
 * advances the quiz (handled by the parent).
 */
export function QuestionStep({
  question,
  selected,
  onSelect,
  onBack,
  canGoBack,
}: {
  question: Question;
  selected: number | undefined;
  onSelect: (optionIndex: number) => void;
  onBack: () => void;
  canGoBack: boolean;
}) {
  return (
    <div>
      <div className="flex items-center gap-2.5">
        <span
          className="size-2.5 rounded-full"
          style={{ background: question.color }}
          aria-hidden
        />
        <span className="text-muted font-mono text-[11px] tracking-[0.1em] uppercase">
          {question.title} · {question.layer}
        </span>
      </div>

      <h2 className="mt-3 max-w-[26ch] text-[clamp(22px,3.2vw,32px)] leading-[1.12] font-medium tracking-[-0.015em]">
        {question.prompt}
      </h2>

      <fieldset className="mt-7">
        <legend className="sr-only">{question.prompt}</legend>
        <div className="flex flex-col gap-3">
          {question.options.map((option, i) => {
            const isSelected = selected === i;
            return (
              <button
                key={i}
                type="button"
                onClick={() => onSelect(i)}
                aria-pressed={isSelected}
                className={cn(
                  "group flex items-center gap-3.5 rounded-xl border p-4 text-left transition-colors",
                  isSelected
                    ? "border-accent bg-accent-soft"
                    : "border-line-2 bg-paper hover:border-accent",
                )}
              >
                <span
                  className={cn(
                    "grid size-6 shrink-0 place-items-center rounded-full border transition-colors",
                    isSelected
                      ? "border-accent bg-accent text-white"
                      : "border-line-2 text-transparent group-hover:border-accent",
                  )}
                  aria-hidden
                >
                  <Check className="size-3.5" strokeWidth={3} />
                </span>
                <span
                  className={cn(
                    "text-[15px] leading-snug",
                    isSelected ? "text-ink font-medium" : "text-ink-2",
                  )}
                >
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>

      {canGoBack ? (
        <button
          type="button"
          onClick={onBack}
          className="text-muted hover:text-accent mt-6 cursor-pointer font-mono text-[12px]"
        >
          ← Back
        </button>
      ) : null}
    </div>
  );
}
