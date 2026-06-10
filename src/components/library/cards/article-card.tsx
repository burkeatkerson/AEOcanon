import Link from "next/link";
import type { Article } from "@/lib/content";
import { topicLabel } from "@/lib/taxonomy";
import { Thumbnail } from "@/components/library/thumbnail";
import { topicColor } from "@/components/library/topic-mark";
import { cn } from "@/lib/utils";

/**
 * Summary card for an article in index/listing contexts. Leads with a generated,
 * topic-consistent thumbnail (see Thumbnail) so the archive is scannable and
 * beautiful at any scale, then the topic, title, summary, and reading time.
 */
export function ArticleCard({
  article,
  className,
}: {
  article: Article;
  /** Accepted for backwards-compatibility; no longer used (colour is by topic). */
  index?: number;
  className?: string;
}) {
  const topic = article.topics[0];
  const color = topicColor(topic);
  return (
    <article
      className={cn(
        "group border-line bg-paper hover:border-accent relative flex flex-col overflow-hidden border transition-colors",
        className,
      )}
    >
      <Thumbnail slug={article.slug} topic={topic} />
      <div className="flex flex-1 flex-col gap-2.5 p-6">
        <span
          className="font-mono text-[10.5px] tracking-[0.08em] uppercase"
          style={{ color }}
        >
          {topic ? topicLabel(topic) : "Article"}
        </span>
        <h3 className="text-[19px] leading-snug font-medium">
          <Link href={article.url} className="after:absolute after:inset-0">
            {article.title}
          </Link>
        </h3>
        <p className="text-muted line-clamp-3 text-[13.5px] leading-relaxed">
          {article.summary}
        </p>
        <p className="text-faint mt-auto pt-2 font-mono text-[10.5px]">
          {article.metadata.readingTime} min read
        </p>
      </div>
    </article>
  );
}
