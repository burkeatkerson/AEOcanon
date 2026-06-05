import Link from "next/link";
import { Container } from "@/components/container";
import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-border/60 mt-24 border-t py-10">
      <Container className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-muted-foreground text-sm">
          &copy; 2026 {siteConfig.name}. Educational content on AEO &amp; SEO.
        </p>
        <nav aria-label="Footer">
          <ul className="text-muted-foreground flex flex-wrap gap-4 text-sm">
            <li>
              <Link href="/learn" className="hover:text-foreground">
                Education Center
              </Link>
            </li>
            <li>
              <Link href="/paths" className="hover:text-foreground">
                Learning Paths
              </Link>
            </li>
            <li>
              <Link href="/verticals" className="hover:text-foreground">
                Industries
              </Link>
            </li>
            <li>
              <a href="/llms.txt" className="hover:text-foreground">
                llms.txt
              </a>
            </li>
            <li>
              <a href="/feed.xml" className="hover:text-foreground">
                RSS
              </a>
            </li>
          </ul>
        </nav>
      </Container>
    </footer>
  );
}
