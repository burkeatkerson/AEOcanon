import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A single question screen with a labelled eyebrow and big, thumb-friendly
 * single-select options. Used for both the eight scored pillar questions and the
 * off-site questions — the score (when any) is computed elsewhere; this is pure
 * UI. Hidden point values are never rendered. Selecting advances the quiz.
 */
export function ChoiceStep({
  eyebrow,
  color,
  prompt,
  options,
  selected,
  onSelect,
  onBack,
  canGoBack,
}: {
  eyebrow: string;
  color: string;
  prompt: string;
  options: string[];
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
          style={{ background: color }}
          aria-hidden
        />
        <span className="text-muted font-mono text-[11px] tracking-[0.1em] uppercase">
          {eyebrow}
        </span>
      </div>

      <h2 className="mt-3 max-w-[26ch] text-[clamp(21px,3.4vw,30px)] leading-[1.14] font-medium tracking-[-0.015em]">
        {prompt}
      </h2>

      <fieldset className="mt-6">
        <legend className="sr-only">{prompt}</legend>
        <div className="flex flex-col gap-2.5">
          {options.map((label, i) => {
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
                    : "border-line-2 bg-paper hover:border-accent active:border-accent",
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
                  {label}
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
