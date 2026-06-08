import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { MDXContent } from "@/components/mdx";
import { ArticleCard } from "@/components/library/cards/article-card";
import { JsonLd } from "@/components/seo/json-ld";
import {
  getAllVerticals,
  getVertical,
  getArticlesByVertical,
} from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import {
  breadcrumbNode,
  collectionPageNodes,
  graph,
} from "@/lib/structured-data";

export function generateStaticParams() {
  return getAllVerticals().map((vertical) => ({ slug: vertical.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const vertical = getVertical(slug);
  if (!vertical) return {};
  return buildMetadata({
    title: vertical.title,
    description: vertical.summary,
    path: vertical.url,
  });
}

export default async function VerticalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const vertical = getVertical(slug);
  if (!vertical) notFound();

  const articles = getArticlesByVertical(vertical.industryTag);

  const jsonLd = graph([
    ...collectionPageNodes(vertical),
    breadcrumbNode([
      { name: "Industries", path: "/verticals" },
      { name: vertical.title, path: vertical.url },
    ]),
  ]);

  return (
    <Container className="py-12">
      <JsonLd graph={jsonLd} />
      <nav
        aria-label="Breadcrumb"
        className="text-muted flex flex-wrap gap-2 font-mono text-[11.5px]"
      >
        <Link href="/verticals" className="hover:text-accent">
          Industries
        </Link>
        <span className="text-faint">/</span>
        <span className="text-ink">{vertical.title}</span>
      </nav>

      <header className="mt-4 max-w-3xl">
        <h1 className="text-[clamp(30px,4.4vw,46px)] leading-[1.06] font-medium tracking-[-0.02em]">
          {vertical.title}
        </h1>
        <p className="text-ink-2 mt-4 font-serif text-[20px] leading-normal">
          {vertical.summary}
        </p>
      </header>

      <div className="prose mt-8 max-w-[720px]">
        <MDXContent code={vertical.body} />
      </div>

      <section className="mt-12" aria-labelledby="articles-heading">
        <h2
          id="articles-heading"
          className="text-[28px] font-medium tracking-tight"
        >
          Guides for this industry
        </h2>
        {articles.length > 0 ? (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, i) => (
              <ArticleCard key={article.slug} article={article} index={i} />
            ))}
          </div>
        ) : (
          <p className="text-muted mt-4 text-sm">
            No articles tagged for this industry yet.
          </p>
        )}
      </section>
    </Container>
  );
}
