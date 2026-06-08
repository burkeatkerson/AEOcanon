import { cn } from "@/lib/utils";

/** Muted mono label above a section heading. */
export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "text-muted font-mono text-[11.5px] tracking-[0.14em] uppercase",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Accent mono kicker — used at the top of heroes and feature blocks. */
export function Kicker({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "text-accent font-mono text-[11px] tracking-[0.14em] uppercase",
        className,
      )}
    >
      {children}
    </span>
  );
}
