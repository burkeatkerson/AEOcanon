import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/tag";
import { ArticleCard } from "@/components/library/cards/article-card";
import { JsonLd } from "@/components/seo/json-ld";
import {
  getUsedTopics,
  getArticlesByTopic,
  getCoursesForTopic,
} from "@/lib/content";
import { topicLabel, topicDescription } from "@/lib/taxonomy";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbNode, graph, topicPageNodes } from "@/lib/structured-data";

export function generateStaticParams() {
  return getUsedTopics().map((topic) => ({ slug: topic.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const articles = getArticlesByTopic(slug);
  if (articles.length === 0) return {};
  const label = topicLabel(slug);
  return buildMetadata({
    title: `${label} — articles & courses`,
    description: topicDescription(slug),
    path: `/topics/${slug}`,
  });
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const articles = getArticlesByTopic(slug);
  // Only topics with content get a page (generateStaticParams enforces this).
  if (articles.length === 0) notFound();

  const label = topicLabel(slug);
  const description = topicDescription(slug);
  const courses = getCoursesForTopic(slug);
  const path = `/topics/${slug}`;

  const jsonLd = graph([
    ...topicPageNodes({ name: label, description, path }),
    breadcrumbNode([
      { name: "AEO School", path: "/learn" },
      { name: "Topics", path: "/topics" },
      { name: label, path },
    ]),
  ]);

  return (
    <Container className="py-12">
      <JsonLd graph={jsonLd} />

      <nav
        aria-label="Breadcrumb"
        className="text-muted flex flex-wrap gap-2 font-mono text-[11.5px]"
      >
        <Link href="/learn" className="hover:text-accent">
          AEO School
        </Link>
        <span className="text-faint">/</span>
        <Link href="/topics" className="hover:text-accent">
          Topics
        </Link>
        <span className="text-faint">/</span>
        <span className="text-ink">{label}</span>
      </nav>

      <header className="mt-4 max-w-3xl">
        <h1 className="text-[clamp(30px,4.4vw,46px)] leading-[1.06] font-medium tracking-[-0.02em]">
          {label}
        </h1>
        <p className="text-ink-2 mt-4 font-serif text-[20px] leading-normal">
          {description}
        </p>
        <p className="text-muted mt-4 font-mono text-[11.5px]">
          {articles.length} {articles.length === 1 ? "article" : "articles"}
          {courses.length > 0
            ? ` · in ${courses.length} ${courses.length === 1 ? "course" : "courses"}`
            : null}
        </p>
      </header>

      <section className="mt-10" aria-labelledby="topic-articles">
        <h2
          id="topic-articles"
          className="text-[26px] font-medium tracking-tight"
        >
          Articles in {label}
        </h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, i) => (
            <ArticleCard key={article.slug} article={article} index={i} />
          ))}
        </div>
      </section>

      {courses.length > 0 ? (
        <section
          className="border-line mt-14 border-t pt-10"
          aria-labelledby="topic-courses"
        >
          <div className="mb-6 flex items-baseline justify-between">
            <h2
              id="topic-courses"
              className="text-[26px] font-medium tracking-tight"
            >
              Courses that use this topic
            </h2>
            <Link href="/courses" className="text-accent font-mono text-[12px]">
              All courses →
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {courses.map((course) => (
              <Link
                key={course.slug}
                href={course.url}
                className="border-line hover:border-accent bg-paper text-ink flex flex-col gap-3 rounded-2xl border p-6 no-underline transition-transform hover:-translate-y-[2px]"
              >
                <div className="flex items-center justify-between">
                  <Badge className="capitalize">{course.level}</Badge>
                  <span className="text-muted font-mono text-[11px]">
                    {course.items.length}{" "}
                    {course.items.length === 1 ? "lesson" : "lessons"}
                  </span>
                </div>
                <h3 className="text-[20px] font-medium">{course.title}</h3>
                <p className="text-ink-2 text-[14px] leading-relaxed">
                  {course.summary}
                </p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <p className="mt-12">
        <Link
          href="/topics"
          className="text-muted hover:text-accent font-mono text-[12px]"
        >
          ← All topics
        </Link>
      </p>
    </Container>
  );
}
