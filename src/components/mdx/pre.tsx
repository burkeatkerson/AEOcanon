"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Copy-enabled wrapper for fenced code blocks. Mapped to the `pre` element in the
 * MDX registry, so every code fence (highlighted by rehype-pretty-code at build
 * time) automatically gets a Copy button. The inner <pre> stays a `.prose`
 * descendant, so the existing dark code styling is preserved; the button reads
 * the block's text from the DOM and writes it to the clipboard. Ephemeral state
 * only — the page remains statically prerendered.
 */
export function Pre({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLPreElement>) {
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  async function copy() {
    const text = ref.current?.textContent ?? "";
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable (e.g. insecure context) — fail silently.
    }
  }

  return (
    <div className="group relative">
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Copied" : "Copy code"}
        className={cn(
          "absolute top-2.5 right-2.5 z-10 rounded-md border px-2.5 py-1 font-mono text-[11px] transition-colors",
          copied
            ? "border-ok/50 text-ok"
            : "border-white/15 text-white/60 hover:border-white/30 hover:text-white/90",
        )}
      >
        {copied ? "Copied ✓" : "Copy"}
      </button>
      <pre ref={ref} className={className} {...props}>
        {children}
      </pre>
    </div>
  );
}
