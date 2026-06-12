import { useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import { WEBSITE_STEP as C } from "@/lib/scorecard/copy";
import { classifyWebsite } from "@/lib/scorecard/website";

/**
 * The single website field — framed as a free benefit ("we'll check it for
 * you"), not a request. It does two jobs: captures the URL AND decides the
 * branch. Optional: a blank still proceeds (has_website, no read). "I don't have
 * one yet" or a social profile routes to the no-website branch. Submitting a
 * real URL hands the parent the normalized URL so the background read can start.
 */
export function WebsiteStep({
  value,
  onSubmit,
  onBack,
}: {
  value: string;
  /** raw = what they typed (stored); readUrl = normalized URL to read, or null. */
  onSubmit: (args: { raw: string; readUrl: string | null; noSite: boolean }) => void;
  onBack: () => void;
}) {
  const [site, setSite] = useState(value);
  const classification = classifyWebsite(site);

  const proceed = () => {
    const c = classifyWebsite(site);
    onSubmit({
      raw: site.trim(),
      readUrl: c.url,
      noSite: c.branch === "no_website",
    });
  };

  return (
    <div>
      <h2 className="max-w-[20ch] text-[clamp(24px,4vw,34px)] leading-[1.1] font-medium tracking-[-0.02em]">
        {C.prompt}
      </h2>
      <p className="text-ink-2 mt-3 max-w-[46ch] text-[15px] leading-relaxed">
        {C.sub}
      </p>

      <form
        className="mt-7 flex flex-col gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          proceed();
        }}
      >
        <div className="border-line-2 bg-paper focus-within:border-accent flex items-center gap-2 rounded-xl border px-3 transition-colors">
          <Search className="text-faint size-4 shrink-0" aria-hidden />
          <input
            type="text"
            inputMode="url"
            autoComplete="url"
            value={site}
            onChange={(e) => setSite(e.target.value)}
            placeholder={C.placeholder}
            aria-label="Your website"
            className="text-ink placeholder:text-faint w-full bg-transparent py-3.5 font-mono text-[15px] outline-none"
          />
        </div>

        <p className="text-muted min-h-[1.25rem] text-[12.5px]" aria-live="polite">
          {classification.url ? C.checking : ""}
          {classification.isSocial
            ? "That looks like a social profile — we'll treat it as your starting point."
            : ""}
        </p>

        <button
          type="submit"
          className="bg-ink text-bg hover:bg-accent hover:text-white inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-md px-6 py-[15px] text-[15px] font-medium transition-colors"
        >
          {C.cta} <ArrowRight className="size-4" aria-hidden />
        </button>

        <button
          type="button"
          onClick={() => onSubmit({ raw: "", readUrl: null, noSite: true })}
          className="border-line-2 text-ink-2 hover:border-accent hover:text-accent mt-1 inline-flex w-full cursor-pointer items-center justify-center rounded-md border px-6 py-3 text-[14px] font-medium transition-colors"
        >
          {C.noSite}
        </button>

        <button
          type="button"
          onClick={onBack}
          className="text-muted hover:text-accent mx-auto mt-1 cursor-pointer font-mono text-[12px]"
        >
          ← Back
        </button>
      </form>
    </div>
  );
}
