import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { Kicker } from "@/components/ui/eyebrow";
import { ArticleFilter } from "@/components/library/article-filter";
import { getAllArticles } from "@/lib/content";
import { TOPIC_SLUGS } from "@/lib/taxonomy";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Education Center",
  description:
    "Answer-first guides on Answer Engine Optimization (AEO) and SEO. Browse and filter the full library by topic.",
  path: "/learn",
});

export default function LearnIndexPage() {
  const articles = getAllArticles();
  const usedTopics = TOPIC_SLUGS.filter((topic) =>
    articles.some((a) => a.topics.some((t) => t === topic)),
  );

  return (
    <Container className="py-14">
      <header className="max-w-3xl">
        <Kicker>The school</Kicker>
        <h1 className="mt-4 text-[clamp(34px,5vw,52px)] leading-[1.02] font-medium tracking-[-0.02em]">
          Education Center
        </h1>
        <p className="text-ink-2 mt-5 text-[19px] leading-relaxed">
          Answer-first guides on Answer Engine Optimization and SEO. Filter by
          topic to find what you need.
        </p>
      </header>

      <div className="mt-10">
        <ArticleFilter articles={articles} topics={[...usedTopics]} />
      </div>
    </Container>
  );
}
