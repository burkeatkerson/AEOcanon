import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/container";
import { MDXContent } from "@/components/mdx";
import { Tag } from "@/components/tag";
import { JsonLd } from "@/components/seo/json-ld";
import { topicLabel } from "@/lib/taxonomy";
import { getAllPaths, getPath, getPathWithArticles } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbNode, courseNode, graph } from "@/lib/structured-data";

export function generateStaticParams() {
  return getAllPaths().map((path) => ({ slug: path.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const path = getPath(slug);
  if (!path) return {};
  return buildMetadata({
    title: path.title,
    description: path.summary,
    path: path.url,
  });
}

export default async function PathPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const path = getPathWithArticles(slug);
  if (!path) notFound();

  const jsonLd = graph([
    courseNode(path, path.articles),
    breadcrumbNode([
      { name: "Learning Paths", path: "/paths" },
      { name: path.title, path: path.url },
    ]),
  ]);

  return (
    <Container className="py-12">
      <JsonLd graph={jsonLd} />
      <nav aria-label="Breadcrumb" className="text-muted-foreground text-sm">
        <Link href="/paths" className="hover:text-foreground">
          Learning Paths
        </Link>
        <span className="mx-2">/</span>
        <span>{path.title}</span>
      </nav>

      <header className="mt-4 max-w-3xl">
        <div className="flex flex-wrap items-center gap-2">
          <Tag className="capitalize">{path.level}</Tag>
          <span className="text-muted-foreground text-xs">
            {path.articles.length}{" "}
            {path.articles.length === 1 ? "article" : "articles"}
            {path.estimatedHours ? ` · ~${path.estimatedHours}h` : null}
          </span>
        </div>
        <h1 className="font-heading mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
          {path.title}
        </h1>
        <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
          {path.summary}
        </p>
      </header>

      <div className="border-border/60 mt-8 border-t pt-8">
        <div className="prose max-w-3xl">
          <MDXContent code={path.body} />
        </div>
      </div>

      <section className="mt-10" aria-labelledby="curriculum-heading">
        <h2
          id="curriculum-heading"
          className="text-2xl font-semibold tracking-tight"
        >
          Curriculum
        </h2>
        <ol className="mt-6 space-y-3">
          {path.articles.map((article, i) => (
            <li key={article.slug}>
              <Link
                href={article.url}
                className="border-border hover:border-foreground/20 flex gap-4 rounded-xl border p-5 transition-colors"
              >
                <span
                  className="bg-muted text-muted-foreground flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <span className="min-w-0">
                  <span className="block font-semibold tracking-tight">
                    {article.title}
                  </span>
                  <span className="text-muted-foreground mt-1 line-clamp-2 block text-sm">
                    {article.summary}
                  </span>
                  <span className="text-muted-foreground mt-2 flex flex-wrap gap-1.5 text-xs">
                    {article.topics.slice(0, 2).map((topic) => (
                      <span key={topic}>{topicLabel(topic)}</span>
                    ))}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </Container>
  );
}
