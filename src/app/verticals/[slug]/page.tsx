import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/container";
import { MDXContent } from "@/components/mdx";
import { ArticleCard } from "@/components/article-card";
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

  // The hub queries the shared pool — it never stores copies of articles.
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
      <nav aria-label="Breadcrumb" className="text-muted-foreground text-sm">
        <Link href="/verticals" className="hover:text-foreground">
          Industries
        </Link>
        <span className="mx-2">/</span>
        <span>{vertical.title}</span>
      </nav>

      <header className="mt-4 max-w-3xl">
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          {vertical.title}
        </h1>
        <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
          {vertical.summary}
        </p>
      </header>

      <div className="border-border/60 mt-8 border-t pt-8">
        <div className="prose max-w-3xl">
          <MDXContent code={vertical.body} />
        </div>
      </div>

      <section className="mt-12" aria-labelledby="articles-heading">
        <h2
          id="articles-heading"
          className="text-2xl font-semibold tracking-tight"
        >
          Guides for this industry
        </h2>
        {articles.length > 0 ? (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground mt-4 text-sm">
            No articles tagged for this industry yet.
          </p>
        )}
      </section>
    </Container>
  );
}
