import Link from "next/link";
import { cn } from "@/lib/utils";

const base =
  "inline-flex items-center rounded-full border border-border bg-muted/50 px-2.5 py-0.5 text-xs font-medium text-muted-foreground";

export function Tag({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <span className={cn(base, className)}>{children}</span>;
}

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
        base,
        "hover:text-foreground hover:border-foreground/30 transition-colors",
        className,
      )}
    >
      {children}
    </Link>
  );
}
