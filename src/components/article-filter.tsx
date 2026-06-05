"use client";

import { useState } from "react";
import type { Article } from "@/lib/content";
import { topicLabel } from "@/lib/taxonomy";
import { ArticleCard } from "@/components/article-card";
import { cn } from "@/lib/utils";

/**
 * Client-side topic filter over a server-prerendered article list. The page
 * stays statically generated; this only toggles which cards are visible.
 */
export function ArticleFilter({
  articles,
  topics,
}: {
  articles: Article[];
  topics: string[];
}) {
  const [active, setActive] = useState<string | null>(null);
  const visible = active
    ? articles.filter((a) => a.topics.some((t) => t === active))
    : articles;

  const chip =
    "rounded-full border px-3 py-1 text-sm transition-colors cursor-pointer";

  return (
    <div>
      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label="Filter by topic"
      >
        <button
          type="button"
          onClick={() => setActive(null)}
          aria-pressed={active === null}
          className={cn(
            chip,
            active === null
              ? "bg-primary text-primary-foreground border-primary"
              : "border-border text-muted-foreground hover:text-foreground",
          )}
        >
          All
        </button>
        {topics.map((topic) => (
          <button
            key={topic}
            type="button"
            onClick={() => setActive(topic)}
            aria-pressed={active === topic}
            className={cn(
              chip,
              active === topic
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:text-foreground",
            )}
          >
            {topicLabel(topic)}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
      {visible.length === 0 ? (
        <p className="text-muted-foreground mt-8 text-sm">
          No articles in this topic yet.
        </p>
      ) : null}
    </div>
  );
}
