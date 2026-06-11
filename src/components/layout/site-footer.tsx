import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Logo } from "@/components/brand/logo";
import { TopicMark } from "@/components/library/topic-mark";
import { footerNav } from "@/lib/navigation";
import { siteConfig } from "@/lib/site";
import { PILLARS } from "@/lib/canon";
import { topicLabel } from "@/lib/taxonomy";
import {
  getUsedTopics,
  getArticle,
  getAllVerticals,
  getAllGlossary,
  getAllTools,
  getAllPlaybooks,
} from "@/lib/content";

type FootLink = { href: string; label: string };

/**
 * Resolve a curated list of cornerstone slugs to real articles, so the footer's
 * "read next" links can never point at a deleted page. Missing slugs drop out.
 */
function pickReads(items: { slug: string; label: string }[]): FootLink[] {
  return items
    .map(({ slug, label }) => {
      const article = getArticle(slug);
      return article ? { href: article.url, label } : null;
    })
    .filter((x): x is FootLink => x !== null);
}

/** A mono section label, optionally linking to the section's index. */
function FootHeading({ children, href }: { children: string; href?: string }) {
  const cls =
    "text-muted mb-3.5 font-mono text-[11px] tracking-[0.1em] uppercase";
  return href ? (
    <Link href={href} className={`${cls} hover:text-accent block`}>
      {children}
    </Link>
  ) : (
    <h2 className={cls}>{children}</h2>
  );
}

function LinkList({ links }: { links: FootLink[] }) {
  return (
    <ul className="flex flex-col gap-2.5">
      {links.map((link) => (
        <li key={link.href + link.label}>
          <Link
            href={link.href}
            className="text-ink-2 hover:text-accent text-sm leading-snug"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function SiteFooter() {
  const topics = getUsedTopics();
  const verticals = getAllVerticals();
  const glossaryCount = getAllGlossary().length;
  const toolCount = getAllTools().length;
  const playbookCount = getAllPlaybooks().length;

  const startHere = pickReads([
    { slug: "what-is-aeo", label: "What is AEO?" },
    { slug: "aeo-explained-simply", label: "AEO explained simply" },
    { slug: "aeo-vs-seo", label: "AEO vs SEO" },
    { slug: "how-ai-engines-choose-citations", label: "How AI picks who to cite" },
    { slug: "30-day-aeo-plan", label: "The 30-day AEO plan" },
    { slug: "business-case-for-aeo", label: "The business case for AEO" },
  ]);

  const keepReading = pickReads([
    { slug: "answer-first-sentence", label: "Write the answer first" },
    { slug: "nine-properties-citable-passage", label: "9 traits of a citable passage" },
    { slug: "how-aeo-and-seo-work-together", label: "How AEO & SEO work together" },
    { slug: "mentions-vs-backlinks", label: "Mentions vs backlinks" },
    { slug: "why-isnt-my-site-cited-by-ai", label: "Why AI isn't citing you" },
    { slug: "get-products-recommended-by-ai", label: "Get recommended by AI" },
  ]);

  const exploreLinks: FootLink[] = [
    { href: "/learn", label: "AEO school" },
    { href: "/glossary", label: `Glossary — ${glossaryCount} terms` },
    { href: "/topics", label: "Topics" },
    { href: "/courses", label: "Courses" },
    { href: "/tools", label: `Tools — ${toolCount}` },
    { href: "/authority", label: `Authority playbooks — ${playbookCount}` },
    { href: "/articles", label: "Full article archive" },
  ];

  const industryLinks: FootLink[] = [
    ...verticals.map((v) => ({ href: v.url, label: v.title })),
    { href: "/industries", label: "All industries →" },
  ];

  // Reuse the curated static columns (Services, The Canon); the rest is dynamic.
  const staticCols = footerNav.filter((c) => c.title !== "Learn");

  return (
    <footer className="border-line bg-paper mt-2 border-t">
      <Container className="pt-14 pb-10">
        {/* Band 1 — brand + start-here + curated columns */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.8fr_1.1fr_1fr_1fr]">
          <div>
            <Logo className="mb-4" />
            <p className="text-ink-2 max-w-[36ch] text-sm leading-relaxed">
              {siteConfig.description}
            </p>
            <p className="text-muted mt-4 text-sm">
              Written by{" "}
              <Link
                href="/authors/burke-atkerson"
                className="text-ink-2 hover:text-accent underline-offset-2 hover:underline"
              >
                Burke Atkerson
              </Link>
            </p>
            <Link
              href="/learn/what-is-aeo"
              className="border-line-2 text-ink hover:border-accent hover:text-accent mt-6 inline-flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-[12px] transition-colors"
            >
              New here? Start with the basics →
            </Link>
          </div>

          <div>
            <FootHeading href="/learn">Start here</FootHeading>
            <LinkList links={startHere} />
          </div>

          {staticCols.map((column) => (
            <div key={column.title}>
              <FootHeading>{column.title}</FootHeading>
              <LinkList links={column.links} />
            </div>
          ))}
        </div>

        {/* Band 2 — browse by topic (the discovery centerpiece) */}
        <div className="border-line mt-12 border-t pt-10">
          <div className="mb-5 flex items-baseline justify-between gap-4">
            <h2 className="text-ink text-[15px] font-medium tracking-tight">
              Browse by topic
            </h2>
            <Link
              href="/topics"
              className="text-muted hover:text-accent font-mono text-[11px]"
            >
              All topics →
            </Link>
          </div>
          <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {topics.map((t) => (
              <li key={t.slug}>
                <Link
                  href={`/topics/${t.slug}`}
                  className="border-line bg-panel hover:border-accent group flex items-center gap-2.5 rounded-xl border px-3 py-2.5 transition-colors"
                >
                  <TopicMark topic={t.slug} size={18} />
                  <span className="min-w-0 flex-1">
                    <span className="text-ink-2 group-hover:text-ink block truncate text-[13px] leading-tight">
                      {topicLabel(t.slug)}
                    </span>
                  </span>
                  <span className="text-muted font-mono text-[10.5px]">
                    {t.count}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Band 3 — deeper discovery columns */}
        <div className="border-line mt-10 grid gap-10 border-t pt-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <FootHeading href="/learn">Keep reading</FootHeading>
            <LinkList links={keepReading} />
          </div>
          <div>
            <FootHeading>Explore by format</FootHeading>
            <LinkList links={exploreLinks} />
          </div>
          <div>
            <FootHeading href="/industries">By industry</FootHeading>
            <LinkList links={industryLinks} />
          </div>
          <div>
            <FootHeading href="/pillars">The 8 pillars</FootHeading>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5">
              {PILLARS.map((p) => (
                <li key={p.title}>
                  <Link
                    href={`/pillars/${p.title.toLowerCase()}`}
                    className="text-ink-2 hover:text-accent group flex items-center gap-2 text-sm"
                  >
                    <span
                      aria-hidden
                      className="size-2 shrink-0 rounded-full"
                      style={{ background: p.color }}
                    />
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>

      {/* Bottom bar */}
      <div className="border-line border-t">
        <Container className="flex flex-wrap items-center justify-between gap-3 py-6">
          <p className="text-muted font-mono text-[11px]">
            &copy; 2026 {siteConfig.name}. Educational content on AEO &amp; SEO.
          </p>
          <p className="text-muted font-mono text-[11px]">
            Be the answer AI recommends.
          </p>
        </Container>
      </div>
    </footer>
  );
}
