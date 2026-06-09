import Link from "next/link";
import { topicLabel, topicDescription } from "@/lib/taxonomy";
import type { TopicWithCount } from "@/lib/content";

const TOPIC_COLORS = [
  "var(--c1)",
  "var(--c2)",
  "var(--c3)",
  "var(--c4)",
  "var(--c5)",
  "var(--c6)",
];

/**
 * Grid of topic cards linking to each topic landing page. Shared by the /topics
 * index and the AEO School's Topics tab so the two never drift.
 */
export function TopicGrid({ topics }: { topics: TopicWithCount[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {topics.map((topic, i) => {
        const color = TOPIC_COLORS[i % TOPIC_COLORS.length];
        return (
          <Link
            key={topic.slug}
            href={`/topics/${topic.slug}`}
            className="border-line hover:border-accent bg-paper text-ink flex flex-col gap-2 rounded-2xl border p-6 no-underline transition-transform hover:-translate-y-[2px]"
            style={{ boxShadow: `inset 0 4px 0 ${color}` }}
          >
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="text-[18px] font-medium">
                {topicLabel(topic.slug)}
              </h3>
              <span className="text-muted shrink-0 font-mono text-[11px]">
                {topic.count} {topic.count === 1 ? "article" : "articles"}
              </span>
            </div>
            <p className="text-ink-2 text-[13.5px] leading-relaxed">
              {topicDescription(topic.slug)}
            </p>
          </Link>
        );
      })}
    </div>
  );
}
