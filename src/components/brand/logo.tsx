import Link from "next/link";
import { cn } from "@/lib/utils";
import { BrandMark } from "./brand-mark";
import { Wordmark } from "./wordmark";

/** Primary horizontal lockup: symbol + wordmark. Used in nav and footer. */
export function Logo({
  href = "/",
  markSize = 26,
  className,
  wordmarkClassName,
}: {
  href?: string;
  markSize?: number;
  className?: string;
  wordmarkClassName?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "text-ink inline-flex items-center gap-[11px] no-underline",
        className,
      )}
      aria-label="AEO Canon — home"
    >
      <BrandMark size={markSize} />
      <Wordmark className={cn("text-[20px]", wordmarkClassName)} />
    </Link>
  );
}
