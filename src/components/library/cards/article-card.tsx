import Link from "next/link";
import type { Article } from "@/lib/content";
import { topicLabel } from "@/lib/taxonomy";
import { cn } from "@/lib/utils";

/** Category color cycling (the Spectrum "no rainbow, consistent" treatment). */
const ACCENTS = ["var(--c5)", "var(--c3)", "var(--c1)", "var(--c6)"];

/** Summary card for an article in index/listing contexts (design `.acard`). */
export function ArticleCard({
  article,
  index = 0,
  className,
}: {
  article: Article;
  index?: number;
  className?: string;
}) {
  const accent = ACCENTS[index % ACCENTS.length];
  return (
    <article
      className={cn(
        "group border-line bg-paper hover:border-accent relative flex flex-col gap-2.5 border p-6 transition-colors",
        className,
      )}
      style={{ boxShadow: `inset 0 3px 0 ${accent}` }}
    >
      <span
        className="font-mono text-[10.5px] tracking-[0.08em] uppercase"
        style={{ color: accent }}
      >
        {article.topics[0] ? topicLabel(article.topics[0]) : "Article"}
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
    </article>
  );
}
