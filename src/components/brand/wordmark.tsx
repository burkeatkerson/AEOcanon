import { cn } from "@/lib/utils";

/**
 * The AEO Canon wordmark — bold roman "AEO" + italic accent "Canon". Pure text
 * (no image), inherits theme via tokens. Use `tone="reversed"` on dark/accent
 * surfaces where the ink color won't read.
 */
export function Wordmark({
  className,
  tone = "default",
}: {
  className?: string;
  tone?: "default" | "reversed";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-baseline font-serif tracking-[-0.01em] whitespace-nowrap",
        className,
      )}
    >
      <span
        className={cn(
          "font-semibold",
          tone === "reversed" ? "text-white" : "text-ink",
        )}
      >
        AEO
      </span>
      <span
        className={cn(
          "ml-[0.24em] font-medium italic",
          tone === "reversed" ? "text-white" : "text-accent",
        )}
      >
        Canon
      </span>
    </span>
  );
}
