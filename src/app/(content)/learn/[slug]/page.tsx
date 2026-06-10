import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/layout/container";
import { MDXContent } from "@/components/mdx";
import { FAQBlock } from "@/components/mdx/faq-block";
import { TableOfContents } from "@/components/library/reading/table-of-contents";
import { ArticleCard } from "@/components/library/cards/article-card";
import { TagLink } from "@/components/ui/tag";
import { JsonLd } from "@/components/seo/json-ld";
import {
  getAllArticles,
  getArticle,
  getAuthor,
  getRelatedArticles,
  getCoursesForArticle,
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
  const primaryTopic = article.topics[0];
  return buildMetadata({
    title: article.title,
    description: article.summary,
    path: article.url,
    type: "article",
    // Eyebrow must match structured-data's articleImage() so the og:image and
    // the JSON-LD image resolve to the same generated card when there's no cover.
    eyebrow: primaryTopic ? topicLabel(primaryTopic) : undefined,
    publishedTime: article.published,
    modifiedTime: article.updated,
    authors: author ? [author.name] : undefined,
    images: article.cover ? [article.cover.src] : undefined,
  });
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
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
  const partOfCourses = getCoursesForArticle(article.slug);
  const pillarVerticals = getVerticalsForArticle(article);
  const updatedDiffers = article.updated !== article.published;

  // Articles always carry at least one topic (enforced by the schema); the
  // first is treated as primary for the breadcrumb trail.
  const primaryTopic = article.topics[0];

  const jsonLd = graph([
    ...articleContentNodes(article, author),
    ...(author
      ? [
          personNode(author, {
            knowsAbout: article.topics.map(topicLabel),
          }),
        ]
      : []),
    breadcrumbNode([
      { name: "AEO School", path: "/learn" },
      ...(primaryTopic
        ? [
            {
              name: topicLabel(primaryTopic),
              path: `/topics/${primaryTopic}`,
            },
          ]
        : []),
      { name: article.title, path: article.url },
    ]),
  ]);

  return (
    <Container className="py-12">
      <JsonLd graph={jsonLd} />
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_200px] lg:gap-12">
        <article className="mx-auto max-w-[720px] min-w-0">
          {/* breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="text-muted flex flex-wrap gap-2 font-mono text-[11.5px]"
          >
            <Link href="/learn" className="hover:text-accent">
              AEO School
            </Link>
            {primaryTopic ? (
              <>
                <span className="text-faint">/</span>
                <Link
                  href={`/topics/${primaryTopic}`}
                  className="hover:text-accent"
                >
                  {topicLabel(primaryTopic)}
                </Link>
              </>
            ) : null}
            <span className="text-faint">/</span>
            <span className="text-ink">{article.title}</span>
          </nav>

          {/* header */}
          <header className="mt-4">
            <div className="flex flex-wrap gap-1.5">
              {article.topics.map((topic) => (
                <TagLink key={topic} href={`/topics/${topic}`}>
                  {topicLabel(topic)}
                </TagLink>
              ))}
            </div>
            <h1 className="mt-4 max-w-[20ch] text-[clamp(30px,4.4vw,46px)] leading-[1.06] font-medium tracking-[-0.02em]">
              {article.title}
            </h1>
            <p className="text-ink-2 mt-4 max-w-[58ch] font-serif text-[20px] leading-normal">
              {article.summary}
            </p>
            <div className="border-line text-muted mt-6 flex flex-wrap items-center gap-4 border-t pt-5 font-mono text-[11.5px]">
              {author ? (
                <span className="flex items-center gap-2.5">
                  <span className="bg-accent-soft border-line-2 text-accent grid size-10 place-items-center rounded-full border font-serif italic">
                    {author.name.charAt(0)}
                  </span>
                  <Link href={author.url} className="hover:text-accent">
                    <b className="text-ink">{author.name}</b>
                  </Link>
                </span>
              ) : null}
              <time dateTime={article.published}>
                {formatDate(article.published)}
              </time>
              <span>{article.metadata.readingTime} min read</span>
            </div>
          </header>

          {article.cover ? (
            <Image
              src={article.cover.src}
              alt={article.coverAlt ?? article.title}
              width={article.cover.width}
              height={article.cover.height}
              {...(article.cover.blurDataURL
                ? {
                    placeholder: "blur" as const,
                    blurDataURL: article.cover.blurDataURL,
                  }
                : {})}
              priority
              className="border-line mt-8 w-full rounded-lg border"
            />
          ) : null}

          {/* body */}
          <div className="prose mt-8">
            <MDXContent code={article.body} />
          </div>

          {article.faqs && article.faqs.length > 0 ? (
            <FAQBlock items={article.faqs} />
          ) : null}

          {updatedDiffers ? (
            <p className="text-muted mt-10 font-mono text-[11.5px]">
              Last updated{" "}
              <time dateTime={article.updated}>
                {formatDate(article.updated)}
              </time>
              .
            </p>
          ) : null}

          {(partOfCourses.length > 0 || pillarVerticals.length > 0) && (
            <section className="border-line mt-12 border-t pt-8">
              <h2 className="text-muted font-mono text-[11px] tracking-[0.1em] uppercase">
                Part of
              </h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {partOfCourses.map((course) => (
                  <li key={course.slug}>
                    <TagLink href={`/courses/${course.slug}`}>
                      Course: {course.title}
                    </TagLink>
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

        {/* sticky TOC */}
        <aside className="mt-12 hidden lg:mt-0 lg:block">
          <div className="sticky top-24">
            <TableOfContents toc={article.toc} />
          </div>
        </aside>
      </div>

      {related.length > 0 ? (
        <section className="border-line mt-16 border-t pt-10">
          <h2 className="text-[28px] font-medium tracking-tight">
            Related reading
          </h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item, i) => (
              <ArticleCard key={item.slug} article={item} index={i} />
            ))}
          </div>
        </section>
      ) : null}
    </Container>
  );
}
