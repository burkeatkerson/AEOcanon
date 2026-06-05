import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/container";
import { MDXContent } from "@/components/mdx";
import { FAQBlock } from "@/components/mdx/faq-block";
import { TableOfContents } from "@/components/table-of-contents";
import { ArticleCard } from "@/components/article-card";
import { TagLink } from "@/components/tag";
import { JsonLd } from "@/components/seo/json-ld";
import {
  getAllArticles,
  getArticle,
  getAuthor,
  getRelatedArticles,
  getPathsForArticle,
  getVerticalsForArticle,
} from "@/lib/content";
import { topicLabel, verticalLabel } from "@/lib/taxonomy";
import { buildMetadata } from "@/lib/seo";
import {
  articleContentNodes,
  breadcrumbNode,
  graph,
  personNode,
} from "@/lib/structured-data";

export function generateStaticParams() {
  return getAllArticles().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  const author = getAuthor(article.author);
  return buildMetadata({
    title: article.title,
    description: article.summary,
    path: article.url,
    type: "article",
    publishedTime: article.published,
    modifiedTime: article.updated,
    authors: author ? [author.name] : undefined,
    images: article.cover ? [article.cover.src] : undefined,
  });
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const author = getAuthor(article.author);
  const related = getRelatedArticles(article);
  const pillarPaths = getPathsForArticle(article.slug);
  const pillarVerticals = getVerticalsForArticle(article);
  const published = new Date(article.published);
  const updated = new Date(article.updated);

  const jsonLd = graph([
    ...articleContentNodes(article, author),
    ...(author ? [personNode(author)] : []),
    breadcrumbNode([
      { name: "Education Center", path: "/learn" },
      { name: article.title, path: article.url },
    ]),
  ]);

  return (
    <Container className="py-12">
      <JsonLd graph={jsonLd} />
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-12">
        <article className="min-w-0">
          <nav
            aria-label="Breadcrumb"
            className="text-muted-foreground text-sm"
          >
            <Link href="/learn" className="hover:text-foreground">
              Education Center
            </Link>
            <span className="mx-2">/</span>
            <span>{article.title}</span>
          </nav>

          <header className="mt-4">
            <div className="flex flex-wrap gap-1.5">
              {article.topics.map((topic) => (
                <TagLink key={topic} href={`/learn?topic=${topic}`}>
                  {topicLabel(topic)}
                </TagLink>
              ))}
            </div>
            <h1 className="font-heading mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              {article.title}
            </h1>
            <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
              {article.summary}
            </p>
            <div className="text-muted-foreground mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
              {author ? (
                <Link
                  href={author.url}
                  className="hover:text-foreground font-medium"
                >
                  {author.name}
                </Link>
              ) : null}
              <span aria-hidden="true">·</span>
              <time dateTime={article.published}>
                {published.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              <span aria-hidden="true">·</span>
              <span>{article.metadata.readingTime} min read</span>
            </div>
          </header>

          <div className="border-border/60 mt-8 border-t pt-8">
            <div className="prose">
              <MDXContent code={article.body} />
            </div>
          </div>

          {article.faqs && article.faqs.length > 0 ? (
            <FAQBlock items={article.faqs} />
          ) : null}

          {updated.getTime() !== published.getTime() ? (
            <p className="text-muted-foreground mt-10 text-sm">
              Last updated{" "}
              <time dateTime={article.updated}>
                {updated.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              .
            </p>
          ) : null}

          {(pillarPaths.length > 0 || pillarVerticals.length > 0) && (
            <section className="border-border/60 mt-12 border-t pt-8">
              <h2 className="text-sm font-semibold tracking-wide uppercase">
                Part of
              </h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {pillarPaths.map((path) => (
                  <li key={path.slug}>
                    <TagLink href={path.url}>Path: {path.title}</TagLink>
                  </li>
                ))}
                {pillarVerticals.map((vertical) => (
                  <li key={vertical.slug}>
                    <TagLink href={vertical.url}>
                      {verticalLabel(vertical.industryTag)}
                    </TagLink>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </article>

        <aside className="mt-12 lg:mt-0">
          <div className="lg:sticky lg:top-24">
            <TableOfContents toc={article.toc} />
          </div>
        </aside>
      </div>

      {related.length > 0 ? (
        <section className="border-border/60 mt-16 border-t pt-10">
          <h2 className="text-2xl font-semibold tracking-tight">
            Related reading
          </h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <ArticleCard key={item.slug} article={item} />
            ))}
          </div>
        </section>
      ) : null}
    </Container>
  );
}
