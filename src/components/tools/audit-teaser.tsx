"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

/**
 * Visual placeholder for the AEO analyzer input. The analysis backend exists
 * (src/lib/audit/*) but is intentionally NOT wired yet — submitting shows a
 * "launching soon" note. Replace `onSubmit` with the real action later.
 */
export function AuditTeaser() {
  const [url, setUrl] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
      className="mx-auto max-w-xl"
    >
      <div className="border-line-2 bg-panel focus-within:border-accent flex items-center gap-2 rounded-xl border p-2 transition-colors">
        <input
          type="url"
          inputMode="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="yourwebsite.com"
          aria-label="Your website URL"
          className="text-ink placeholder:text-faint w-full bg-transparent px-3 py-2 font-mono text-[14px] outline-none"
        />
        <button
          type="submit"
          className="bg-accent inline-flex shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 font-sans text-[14px] font-medium text-white transition-opacity hover:opacity-90"
        >
          Analyze <ArrowRight className="size-4" aria-hidden="true" />
        </button>
      </div>
      <p
        aria-live="polite"
        className="text-muted mt-3 text-center font-mono text-[11.5px]"
      >
        {submitted
          ? "The analyzer is being connected — it launches soon. Thanks for your patience."
          : "No signup to see your score · results in ~60 seconds"}
      </p>
    </form>
  );
}
