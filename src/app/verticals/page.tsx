import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { getAllVerticals, getArticlesByVertical } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "AEO & SEO by Industry",
  description:
    "Industry hubs that pull the most relevant AEO and SEO guides from the library for your field.",
  path: "/verticals",
});

export default function VerticalsIndexPage() {
  const verticals = getAllVerticals();

  return (
    <Container className="py-16">
      <header className="max-w-3xl">
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          AEO &amp; SEO by Industry
        </h1>
        <p className="text-muted-foreground mt-3 text-lg leading-relaxed">
          Vertical hubs that pull the most relevant guides from the library for
          your field. Each hub is a view over the shared article pool.
        </p>
      </header>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {verticals.map((vertical) => {
          const count = getArticlesByVertical(vertical.industryTag).length;
          return (
            <Link
              key={vertical.slug}
              href={vertical.url}
              className="border-border hover:border-foreground/20 block rounded-xl border p-6 transition-colors"
            >
              <h2 className="text-xl font-semibold tracking-tight">
                {vertical.title}
              </h2>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                {vertical.summary}
              </p>
              <p className="text-muted-foreground mt-4 text-xs">
                {count} {count === 1 ? "article" : "articles"}
              </p>
            </Link>
          );
        })}
      </div>
    </Container>
  );
}
