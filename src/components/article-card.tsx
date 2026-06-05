import Link from "next/link";
import type { Article } from "@/lib/content";
import { topicLabel } from "@/lib/taxonomy";
import { Tag } from "@/components/tag";

/** Summary card for an article in index/listing contexts. */
export function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="group border-border hover:border-foreground/20 relative flex flex-col rounded-xl border p-5 transition-colors">
      <div className="flex flex-wrap gap-1.5">
        {article.topics.slice(0, 2).map((topic) => (
          <Tag key={topic}>{topicLabel(topic)}</Tag>
        ))}
      </div>
      <h3 className="mt-3 text-lg font-semibold tracking-tight">
        <Link href={article.url} className="after:absolute after:inset-0">
          {article.title}
        </Link>
      </h3>
      <p className="text-muted-foreground mt-2 line-clamp-3 text-sm leading-relaxed">
        {article.summary}
      </p>
      <p className="text-muted-foreground mt-4 text-xs">
        {article.metadata.readingTime} min read
      </p>
    </article>
  );
}
