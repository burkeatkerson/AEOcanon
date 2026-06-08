import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { MDXContent } from "@/components/mdx";
import { Badge } from "@/components/ui/tag";
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
      <nav
        aria-label="Breadcrumb"
        className="text-muted flex flex-wrap gap-2 font-mono text-[11.5px]"
      >
        <Link href="/paths" className="hover:text-accent">
          Learning Paths
        </Link>
        <span className="text-faint">/</span>
        <span className="text-ink">{path.title}</span>
      </nav>

      <header className="mt-4 max-w-3xl">
        <div className="flex items-center gap-3">
          <Badge className="capitalize">{path.level}</Badge>
          <span className="text-muted font-mono text-[11px]">
            {path.articles.length}{" "}
            {path.articles.length === 1 ? "article" : "articles"}
            {path.estimatedHours ? ` · ~${path.estimatedHours}h` : null}
          </span>
        </div>
        <h1 className="mt-4 text-[clamp(30px,4.4vw,46px)] leading-[1.06] font-medium tracking-[-0.02em]">
          {path.title}
        </h1>
        <p className="text-ink-2 mt-4 font-serif text-[20px] leading-normal">
          {path.summary}
        </p>
      </header>

      <div className="prose mt-8 max-w-[720px]">
        <MDXContent code={path.body} />
      </div>

      <section className="mt-10" aria-labelledby="curriculum-heading">
        <h2
          id="curriculum-heading"
          className="text-[28px] font-medium tracking-tight"
        >
          Curriculum
        </h2>
        <ol className="mt-6 flex flex-col gap-3">
          {path.articles.map((article, i) => (
            <li key={article.slug}>
              <Link
                href={article.url}
                className="border-line hover:border-accent bg-paper flex gap-4 rounded-2xl border p-5 no-underline transition-colors"
              >
                <span
                  className="bg-accent grid size-8 shrink-0 place-items-center rounded-full font-serif text-sm text-white"
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <span className="min-w-0">
                  <span className="text-ink block font-medium">
                    {article.title}
                  </span>
                  <span className="text-muted mt-1 line-clamp-2 block text-[13.5px]">
                    {article.summary}
                  </span>
                  <span className="text-faint mt-2 flex flex-wrap gap-2 font-mono text-[10.5px]">
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
