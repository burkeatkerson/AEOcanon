import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Kicker } from "@/components/ui/eyebrow";
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
    <Container className="py-14">
      <header className="max-w-3xl">
        <Kicker>By industry</Kicker>
        <h1 className="mt-4 text-[clamp(34px,5vw,52px)] leading-[1.02] font-medium tracking-[-0.02em]">
          AEO &amp; SEO by Industry
        </h1>
        <p className="text-ink-2 mt-5 text-[19px] leading-relaxed">
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
              className="border-line hover:border-accent bg-paper text-ink rounded-2xl border p-6 no-underline transition-transform hover:-translate-y-[2px]"
            >
              <h2 className="text-[21px] font-medium">{vertical.title}</h2>
              <p className="text-ink-2 mt-2 text-[14px] leading-relaxed">
                {vertical.summary}
              </p>
              <p className="text-faint mt-4 font-mono text-[11px]">
                {count} {count === 1 ? "article" : "articles"}
              </p>
            </Link>
          );
        })}
      </div>
    </Container>
  );
}
