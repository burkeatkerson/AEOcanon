import Link from "next/link";
import { Container } from "@/components/container";
import { siteConfig } from "@/lib/site";

const NAV = [
  { href: "/learn", label: "Education Center" },
  { href: "/paths", label: "Learning Paths" },
  { href: "/verticals", label: "Industries" },
] as const;

export function SiteHeader() {
  return (
    <header className="border-border/60 bg-background/80 sticky top-0 z-40 border-b backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-6">
        <Link
          href="/"
          className="font-heading text-lg font-semibold tracking-tight"
        >
          {siteConfig.name}
        </Link>
        <nav aria-label="Primary">
          <ul className="flex items-center gap-1 text-sm">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="hover:bg-muted text-muted-foreground hover:text-foreground rounded-md px-3 py-2 transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </header>
  );
}
