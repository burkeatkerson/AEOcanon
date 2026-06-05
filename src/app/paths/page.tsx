import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { Tag } from "@/components/tag";
import { getAllPaths, getPathWithArticles } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Learning Paths",
  description:
    "Guided curricula that sequence articles from the library into a course — from AEO fundamentals to advanced structured data.",
  path: "/paths",
});

export default function PathsIndexPage() {
  const paths = getAllPaths();

  return (
    <Container className="py-16">
      <header className="max-w-3xl">
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          Learning Paths
        </h1>
        <p className="text-muted-foreground mt-3 text-lg leading-relaxed">
          Ordered curricula that sequence articles from the library into a
          guided course. The articles stay the single source of truth — paths
          just set the order.
        </p>
      </header>

      <div className="mt-10 space-y-4">
        {paths.map((path) => {
          const resolved = getPathWithArticles(path.slug);
          const count = resolved?.articles.length ?? 0;
          return (
            <Link
              key={path.slug}
              href={path.url}
              className="border-border hover:border-foreground/20 block rounded-xl border p-6 transition-colors"
            >
              <div className="flex flex-wrap items-center gap-2">
                <Tag className="capitalize">{path.level}</Tag>
                <span className="text-muted-foreground text-xs">
                  {count} {count === 1 ? "article" : "articles"}
                  {path.estimatedHours ? ` · ~${path.estimatedHours}h` : null}
                </span>
              </div>
              <h2 className="mt-3 text-xl font-semibold tracking-tight">
                {path.title}
              </h2>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                {path.summary}
              </p>
            </Link>
          );
        })}
      </div>
    </Container>
  );
}
