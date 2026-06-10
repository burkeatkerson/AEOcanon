import type { Article } from "@/lib/content";
import { ArticleCover } from "@/components/library/thumbnail";
import { cn } from "@/lib/utils";

/**
 * Summary card for an article. A typographic cover (the headline as the art, on a
 * topic-tinted ground) doubles as the linked heading; the body carries the summary
 * and reading time. Scannable and beautiful at any scale — colour is by topic.
 */
export function ArticleCard({
  article,
  className,
}: {
  article: Article;
  /** Accepted for backwards-compatibility; no longer used. */
  index?: number;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "group border-line bg-paper hover:border-accent relative flex flex-col overflow-hidden border transition-colors",
        className,
      )}
    >
      <ArticleCover
        slug={article.slug}
        topic={article.topics[0]}
        title={article.title}
        href={article.url}
      />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <p className="text-muted line-clamp-3 text-[13.5px] leading-relaxed">
          {article.summary}
        </p>
        <p className="text-faint mt-auto font-mono text-[10.5px]">
          {article.metadata.readingTime} min read
        </p>
      </div>
    </article>
  );
}
