import type { Metadata } from "next";
import { Kicker } from "@/components/ui/eyebrow";
import { ArticleBrowser } from "@/components/library/article-browser";
import { getAllArticles } from "@/lib/content";
import { TOPIC_SLUGS } from "@/lib/taxonomy";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Article archive — search every AEO guide",
  description:
    "Search, filter, and sort the full AEO School archive — every free article on answer-engine optimization, SEO, and AI fundamentals, in one place.",
  path: "/articles",
});

export default function ArticlesPage() {
  const articles = getAllArticles();
  const usedTopics = TOPIC_SLUGS.filter((topic) =>
    articles.some((a) => a.topics.some((t) => t === topic)),
  );

  return (
    <div className="py-10 pb-20">
      <header className="max-w-3xl">
        <Kicker>The archive</Kicker>
        <h1 className="mt-4 text-[clamp(34px,5vw,52px)] leading-[1.02] font-medium tracking-[-0.02em]">
          Every article
        </h1>
        <p className="text-ink-2 mt-5 text-[19px] leading-relaxed">
          {articles.length} free articles on answer-engine optimization, SEO,
          and how AI actually works. Search by name, filter by topic, and sort
          to find exactly what you need.
        </p>
      </header>

      <div className="mt-10">
        <ArticleBrowser articles={articles} topics={[...usedTopics]} />
      </div>
    </div>
  );
}
