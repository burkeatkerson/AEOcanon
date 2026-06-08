import Link from "next/link";
import { cn } from "@/lib/utils";

/** Uppercase mono category label (the design's `.cat` / `.tag`). */
export function Tag({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "text-accent font-mono text-[10.5px] tracking-[0.08em] uppercase",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Rounded, bordered chip (the design's `.path__badge` / `.pill`). */
export function Badge({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      className={cn(
        "border-line-2 text-muted inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] tracking-[0.08em] uppercase",
        className,
      )}
      style={style}
    >
      {children}
    </span>
  );
}

/** A linked tag (topic/vertical filter chips). */
export function TagLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "border-line bg-paper text-ink-2 hover:border-accent inline-flex items-center rounded-full border px-3 py-1.5 font-mono text-[11px] transition-colors",
        className,
      )}
    >
      {children}
    </Link>
  );
}
