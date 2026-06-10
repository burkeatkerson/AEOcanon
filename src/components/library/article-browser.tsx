"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { Article } from "@/lib/content";
import { topicLabel } from "@/lib/taxonomy";
import { ArticleCard } from "@/components/library/cards/article-card";
import { cn } from "@/lib/utils";

/**
 * Faceted archive browser over the server-prerendered article list. Composes a
 * text search, topic filter, and sort without leaving the statically generated
 * page — it only toggles which of the already-rendered cards are visible and in
 * what order. Supersedes the topic-only `ArticleFilter` for the /articles index.
 */
type SortKey = "newest" | "reading" | "title";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "newest", label: "Newest" },
  { key: "reading", label: "Reading time" },
  { key: "title", label: "A–Z" },
];

const chip =
  "cursor-pointer rounded-full border px-[13px] py-1.5 font-mono text-[11px] transition-colors";

export function ArticleBrowser({
  articles,
  topics,
}: {
  articles: Article[];
  topics: string[];
}) {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>("newest");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = articles.filter((a) => {
      if (topic && !a.topics.some((t) => t === topic)) return false;
      if (!q) return true;
      return (
        a.title.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q) ||
        a.topics.some((t) => topicLabel(t).toLowerCase().includes(q))
      );
    });

    list = [...list].sort((a, b) => {
      if (sort === "reading")
        return a.metadata.readingTime - b.metadata.readingTime;
      if (sort === "title") return a.title.localeCompare(b.title);
      return b.published.localeCompare(a.published);
    });
    return list;
  }, [articles, query, topic, sort]);

  return (
    <div>
      <div className="border-line bg-paper focus-within:border-accent mb-5 flex items-center gap-3 rounded-xl border px-4 transition-colors">
        <Search className="text-muted size-4.5 shrink-0" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search the archive…"
          className="text-ink placeholder:text-faint h-12 w-full bg-transparent text-[15px] outline-none"
          aria-label="Search articles"
          autoComplete="off"
          spellCheck={false}
        />
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Filter by topic"
        >
          <button
            type="button"
            onClick={() => setTopic(null)}
            aria-pressed={topic === null}
            className={cn(
              chip,
              topic === null
                ? "bg-ink text-bg border-ink"
                : "border-line bg-paper text-ink-2 hover:border-accent",
            )}
          >
            All
          </button>
          {topics.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTopic(t)}
              aria-pressed={topic === t}
              className={cn(
                chip,
                topic === t
                  ? "bg-ink text-bg border-ink"
                  : "border-line bg-paper text-ink-2 hover:border-accent",
              )}
            >
              {topicLabel(t)}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <span className="text-faint font-mono text-[10.5px] tracking-[0.08em] uppercase">
            Sort
          </span>
          {SORTS.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setSort(s.key)}
              aria-pressed={sort === s.key}
              className={cn(
                "cursor-pointer font-mono text-[11px] transition-colors",
                sort === s.key ? "text-accent" : "text-muted hover:text-ink",
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <p className="text-muted mt-5 font-mono text-[11px] tracking-[0.06em]">
        {visible.length} {visible.length === 1 ? "article" : "articles"}
      </p>

      <div className="mt-4 grid gap-px overflow-hidden sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
      {visible.length === 0 ? (
        <p className="text-muted mt-8 text-sm">
          No articles match your search. Try a different term or clear the topic
          filter.
        </p>
      ) : null}
    </div>
  );
}
