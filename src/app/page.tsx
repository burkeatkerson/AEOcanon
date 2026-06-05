import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { ArticleCard } from "@/components/article-card";
import {
  getFeaturedArticles,
  getAllArticles,
  getAllPaths,
  getAllVerticals,
} from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  ...buildMetadata({
    title: `${siteConfig.name} — Answer Engine & SEO Education`,
    description: siteConfig.description,
    path: "/",
  }),
  title: {
    absolute: `${siteConfig.name} — Become the Answer, Not Just a Result`,
  },
};

export default function HomePage() {
  const featured = getFeaturedArticles(3);
  const fallback =
    featured.length > 0 ? featured : getAllArticles().slice(0, 3);
  const paths = getAllPaths();
  const verticals = getAllVerticals();

  return (
    <Container className="py-16 sm:py-24">
      <section className="max-w-3xl">
        <p className="text-muted-foreground text-sm font-medium tracking-wide uppercase">
          Answer Engine Optimization &amp; SEO
        </p>
        <h1 className="font-heading mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          Become the answer, not just a result.
        </h1>
        <p className="text-muted-foreground mt-5 text-lg leading-relaxed">
          A growing library of answer-first guides on AEO and SEO — structured
          so both humans and answer engines can find, trust, and cite them.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/learn"
            className="bg-primary text-primary-foreground rounded-md px-5 py-2.5 text-sm font-medium hover:opacity-90"
          >
            Browse the Education Center
          </Link>
          <Link
            href="/paths"
            className="border-border hover:bg-muted rounded-md border px-5 py-2.5 text-sm font-medium"
          >
            Explore learning paths
          </Link>
        </div>
      </section>

      <section className="mt-20" aria-labelledby="featured-heading">
        <Reveal>
          <div className="flex items-baseline justify-between">
            <h2
              id="featured-heading"
              className="text-2xl font-semibold tracking-tight"
            >
              Start here
            </h2>
            <Link
              href="/learn"
              className="text-muted-foreground hover:text-foreground text-sm"
            >
              View all &rarr;
            </Link>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {fallback.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </Reveal>
      </section>

      <Reveal as="section" className="mt-20 grid gap-10 sm:grid-cols-2">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Learning paths
          </h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Ordered curricula that sequence articles into a course.
          </p>
          <ul className="mt-4 space-y-2">
            {paths.map((path) => (
              <li key={path.slug}>
                <Link
                  href={path.url}
                  className="hover:text-primary font-medium"
                >
                  {path.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">By industry</h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Vertical hubs that select the most relevant articles for your field.
          </p>
          <ul className="mt-4 space-y-2">
            {verticals.map((vertical) => (
              <li key={vertical.slug}>
                <Link
                  href={vertical.url}
                  className="hover:text-primary font-medium"
                >
                  {vertical.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </Container>
  );
}
