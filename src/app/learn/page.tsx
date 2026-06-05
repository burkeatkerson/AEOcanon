import type { Metadata } from "next";
import { Container } from "@/components/container";
import { ArticleFilter } from "@/components/article-filter";
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
  // Only surface topics that actually have content.
  const usedTopics = TOPIC_SLUGS.filter((topic) =>
    articles.some((a) => a.topics.some((t) => t === topic)),
  );

  return (
    <Container className="py-16">
      <header className="max-w-3xl">
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          Education Center
        </h1>
        <p className="text-muted-foreground mt-3 text-lg leading-relaxed">
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
