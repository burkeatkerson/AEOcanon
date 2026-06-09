"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * "Cite this study" block — the move that makes the page a primary source.
 * Shows a pre-formatted citation and the canonical URL, with one-click copy.
 * No persistence; the "Copied" state is ephemeral.
 */
export function CiteThis({
  citation,
  url,
}: {
  citation: string;
  url: string;
}) {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (label: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // Clipboard unavailable (e.g. insecure context) — selection still works.
    }
  };

  return (
    <section
      aria-labelledby="cite-heading"
      className="border-accent bg-accent-soft not-prose my-10 rounded-2xl border p-6 font-sans"
    >
      <div className="flex items-center justify-between gap-4">
        <h2
          id="cite-heading"
          className="text-accent-2 font-mono text-[11px] tracking-[0.1em] uppercase"
        >
          Cite this study
        </h2>
        <button
          type="button"
          onClick={() => copy("citation", citation)}
          className="border-accent text-accent hover:bg-accent rounded-full border px-4 py-1.5 font-mono text-[11.5px] transition-colors hover:text-white"
        >
          {copied === "citation" ? "Copied ✓" : "Copy citation"}
        </button>
      </div>

      <p className="text-ink mt-4 text-[14.5px] leading-relaxed">{citation}</p>

      <div className="border-line-2 mt-4 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
        <code className="text-ink-2 font-mono text-[12.5px] break-all">
          {url}
        </code>
        <button
          type="button"
          onClick={() => copy("url", url)}
          className={cn(
            "text-muted hover:text-accent shrink-0 font-mono text-[11px]",
          )}
        >
          {copied === "url" ? "Copied ✓" : "Copy URL"}
        </button>
      </div>

      <p className="text-muted mt-4 text-[12px] leading-relaxed">
        Free to cite and republish with attribution under CC BY 4.0. A link to
        the canonical URL is appreciated.
      </p>
    </section>
  );
}
