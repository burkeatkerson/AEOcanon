import type { Metadata } from "next";
import { Kicker } from "@/components/ui/eyebrow";
import { TopicGrid } from "@/components/library/topic-grid";
import { getUsedTopics } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Topics — browse the AEO School by subject",
  description:
    "Browse every AEO and SEO subject in the school. Each topic collects the articles about it; courses sequence those same articles into a guided order.",
  path: "/topics",
});

export default function TopicsIndexPage() {
  const topics = getUsedTopics();

  return (
    <div className="py-14">
      <header className="max-w-3xl">
        <Kicker>Browse by subject</Kicker>
        <h1 className="mt-4 text-[clamp(34px,5vw,52px)] leading-[1.02] font-medium tracking-[-0.02em]">
          Topics
        </h1>
        <p className="text-ink-2 mt-5 text-[19px] leading-relaxed">
          Every subject in the AEO School. A topic gathers the articles written
          about it; a <a href="/courses">course</a> sequences those same
          articles into a guided order. Pick a subject to see everything we have
          on it.
        </p>
      </header>

      <div className="mt-10">
        <TopicGrid topics={topics} />
      </div>
    </div>
  );
}
