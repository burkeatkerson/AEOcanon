import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Kicker } from "@/components/ui/eyebrow";
import { Badge } from "@/components/ui/tag";
import { getAllPaths, getPathWithArticles } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Learning Paths",
  description:
    "Guided curricula that sequence articles from the library into a course — from AEO fundamentals to advanced structured data.",
  path: "/paths",
});

const LEVEL_COLORS = ["var(--c3)", "var(--c4)", "var(--c5)", "var(--c6)"];

export default function PathsIndexPage() {
  const paths = getAllPaths();

  return (
    <Container className="py-14">
      <header className="max-w-3xl">
        <Kicker>Guided courses</Kicker>
        <h1 className="mt-4 text-[clamp(34px,5vw,52px)] leading-[1.02] font-medium tracking-[-0.02em]">
          Learning Paths
        </h1>
        <p className="text-ink-2 mt-5 text-[19px] leading-relaxed">
          Ordered curricula that sequence articles from the library into a
          guided course. The articles stay the single source of truth — paths
          just set the order.
        </p>
      </header>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {paths.map((path, i) => {
          const resolved = getPathWithArticles(path.slug);
          const count = resolved?.articles.length ?? 0;
          const color = LEVEL_COLORS[i % LEVEL_COLORS.length];
          return (
            <Link
              key={path.slug}
              href={path.url}
              className="border-line hover:border-accent bg-paper text-ink flex flex-col gap-3 rounded-2xl border p-6 no-underline transition-transform hover:-translate-y-[2px]"
            >
              <div className="flex items-center justify-between">
                <Badge
                  className="capitalize"
                  style={{ color, borderColor: color }}
                >
                  {path.level}
                </Badge>
                <span className="text-muted font-mono text-[11px]">
                  {count} {count === 1 ? "article" : "articles"}
                  {path.estimatedHours ? ` · ~${path.estimatedHours}h` : null}
                </span>
              </div>
              <h2 className="text-[22px] font-medium">{path.title}</h2>
              <p className="text-ink-2 text-[14px] leading-relaxed">
                {path.summary}
              </p>
            </Link>
          );
        })}
      </div>
    </Container>
  );
}
