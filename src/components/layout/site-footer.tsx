import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Logo } from "@/components/brand/logo";
import { footerNav } from "@/lib/navigation";
import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-line bg-paper mt-2 border-t pt-13 pb-16">
      <Container>
        <div className="grid gap-9 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <Logo className="mb-4" />
            <p className="text-ink-2 max-w-[34ch] text-sm leading-relaxed">
              {siteConfig.description}
            </p>
          </div>
          {footerNav.map((column) => (
            <div key={column.title}>
              <h2 className="text-muted mb-3.5 font-mono text-[11px] tracking-[0.1em] uppercase">
                {column.title}
              </h2>
              <ul className="flex flex-col gap-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-ink-2 hover:text-accent text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="text-muted mt-12 font-mono text-[11px]">
          &copy; 2026 {siteConfig.name}. Educational content on AEO &amp; SEO.
        </p>
      </Container>
    </footer>
  );
}
