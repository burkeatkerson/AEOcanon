import { cn } from "@/lib/utils";

/**
 * The AEO Canon symbol — the descending "first-result" mark: three ranked bars
 * with the coral accent flag, meaning "the cited, first answer." Inherits theme
 * via CSS variables. Drop the flag (`withFlag={false}`) at favicon sizes.
 */
export function BrandMark({
  size = 26,
  withFlag = true,
  className,
}: {
  size?: number;
  withFlag?: boolean;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden="true"
      className={cn("block", className)}
    >
      <rect x="12" y="16" width="40" height="7" rx="3.5" fill="var(--accent)" />
      <rect x="12" y="29" width="30" height="7" rx="3.5" fill="var(--line-2)" />
      <rect x="12" y="42" width="20" height="7" rx="3.5" fill="var(--line-2)" />
      {withFlag ? (
        <circle cx="55" cy="19.5" r="6" fill="var(--accent-2)" />
      ) : null}
    </svg>
  );
}
