import { useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { FAMILIES } from "@/lib/industries";
import { BUSINESS_TYPE_STEP as C } from "@/lib/scorecard/copy";

const OTHER = "__other__";

/**
 * The opening screen — business type as the first question, not a form field, so
 * the quiz feels already underway. A native select (grouped by industry family,
 * thumb-friendly on mobile) plus a "something else" free-text option. The value
 * stored is the human-readable industry name (or the free text).
 */
export function BusinessTypeStep({
  value,
  onSubmit,
}: {
  value: string;
  onSubmit: (businessType: string) => void;
}) {
  // Seed the control from a previously chosen value (back navigation).
  const known = FAMILIES.flatMap((f) => f.verticals).find(
    (v) => v.name === value,
  );
  const [choice, setChoice] = useState<string>(
    value ? (known ? value : OTHER) : "",
  );
  const [other, setOther] = useState<string>(value && !known ? value : "");

  const resolved = choice === OTHER ? other.trim() : choice;
  const canContinue = resolved.length > 0;

  return (
    <div>
      <span className="text-accent font-mono text-[11px] tracking-[0.14em] uppercase">
        {C.eyebrow}
      </span>
      <h2 className="mt-3 max-w-[20ch] text-[clamp(24px,4vw,34px)] leading-[1.1] font-medium tracking-[-0.02em]">
        {C.prompt}
      </h2>
      <p className="text-ink-2 mt-3 text-[15px] leading-relaxed">{C.sub}</p>

      <form
        className="mt-7 flex flex-col gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (canContinue) onSubmit(resolved);
        }}
      >
        <label className="relative block">
          <span className="sr-only">Industry</span>
          <select
            value={choice}
            onChange={(e) => setChoice(e.target.value)}
            className="border-line-2 bg-paper text-ink focus:border-accent w-full appearance-none rounded-xl border px-4 py-3.5 pr-11 text-[16px] outline-none transition-colors"
          >
            <option value="" disabled>
              {C.placeholder}
            </option>
            {FAMILIES.map((family) => (
              <optgroup key={family.id} label={family.name}>
                {family.verticals.map((v) => (
                  <option key={v.slug} value={v.name}>
                    {v.name}
                  </option>
                ))}
              </optgroup>
            ))}
            <option value={OTHER}>{C.otherLabel}</option>
          </select>
          <ChevronDown
            className="text-muted pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2"
            aria-hidden
          />
        </label>

        {choice === OTHER ? (
          <label className="block">
            <span className="sr-only">Describe your business</span>
            <input
              type="text"
              autoFocus
              value={other}
              onChange={(e) => setOther(e.target.value)}
              placeholder={C.otherPlaceholder}
              className="border-line-2 bg-paper text-ink placeholder:text-faint focus:border-accent w-full rounded-xl border px-4 py-3.5 text-[16px] outline-none transition-colors"
            />
          </label>
        ) : null}

        <button
          type="submit"
          disabled={!canContinue}
          className="bg-ink text-bg hover:bg-accent hover:text-white mt-2 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-md px-6 py-[15px] text-[15px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40"
        >
          {C.cta} <ArrowRight className="size-4" aria-hidden />
        </button>
      </form>
    </div>
  );
}
