/**
 * Typed content query layer — the ONLY module the app imports content through.
 * Routes, SEO infra, sitemap, RSS, etc. consume these functions; nothing reads
 * `.velite` output or raw MDX directly. This keeps the article pool as the
 * single source of truth and makes paths/verticals pure *views* over it.
 */
import {
  articles as rawArticles,
  authors as rawAuthors,
  verticals as rawVerticals,
  playbooks as rawPlaybooks,
  tools as rawTools,
  pillars as rawPillars,
  glossary as rawGlossary,
  news as rawNews,
  type Article,
  type Author,
  type Vertical,
  type Playbook,
  type ToolDoc,
  type PillarDoc,
  type GlossaryTerm,
  type NewsPost,
} from "#velite";
import { getAllCourses, getCourse, type Course } from "@/lib/courses";

export type {
  Article,
  Author,
  Vertical,
  Playbook,
  ToolDoc,
  PillarDoc,
  GlossaryTerm,
  NewsPost,
  Course,
};
export { getAllCourses, getCourse };

function byPublishedDesc(a: Article, b: Article): number {
  return b.published.localeCompare(a.published);
}

// --- Articles ---------------------------------------------------------------

export function getAllArticles(): Article[] {
  return [...rawArticles].sort(byPublishedDesc);
}

export function getArticle(slug: string): Article | undefined {
  return rawArticles.find((a) => a.slug === slug);
}

export function getFeaturedArticles(limit?: number): Article[] {
  const featured = getAllArticles().filter((a) => a.featured);
  return typeof limit === "number" ? featured.slice(0, limit) : featured;
}

export function getArticlesByTopic(topic: string): Article[] {
  return getAllArticles().filter((a) => a.topics.some((t) => t === topic));
}

export function getArticlesByVertical(tag: string): Article[] {
  return getAllArticles().filter((a) => a.verticals.some((v) => v === tag));
}

/** A topic with its article count — for topic listings and the topics index. */
export type TopicWithCount = { slug: string; count: number };

/**
 * Topics that have at least one published article, ordered by article count
 * (desc). Drives the /topics index so empty categories never surface.
 */
export function getUsedTopics(): TopicWithCount[] {
  const counts = new Map<string, number>();
  for (const article of getAllArticles()) {
    for (const topic of article.topics) {
      counts.set(topic, (counts.get(topic) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([slug, count]) => ({ slug, count }))
    .sort((a, b) => b.count - a.count || a.slug.localeCompare(b.slug));
}

/**
 * Courses whose lessons reuse at least one article carrying the given topic —
 * i.e. the guided curricula that draw on this topic's content.
 */
export function getCoursesForTopic(topic: string): Course[] {
  const slugs = new Set(getArticlesByTopic(topic).map((a) => a.slug));
  return getAllCourses().filter((c) =>
    c.lessons.some((l) => slugs.has(l.articleSlug)),
  );
}

/** Courses whose lessons reuse the given article — for back-linking. */
export function getCoursesForArticle(articleSlug: string): Course[] {
  return getAllCourses().filter((c) =>
    c.lessons.some((l) => l.articleSlug === articleSlug),
  );
}

export function getArticlesByAuthor(authorSlug: string): Article[] {
  return getAllArticles().filter((a) => a.author === authorSlug);
}

/**
 * Articles related by shared topics/verticals, scored by overlap. Used for the
 * topic-cluster internal-linking model on article pages.
 */
export function getRelatedArticles(article: Article, limit = 3): Article[] {
  const topics = new Set(article.topics);
  const verticals = new Set(article.verticals);

  return getAllArticles()
    .filter((a) => a.slug !== article.slug)
    .map((a) => {
      const topicOverlap = a.topics.filter((t) => topics.has(t)).length;
      const verticalOverlap = a.verticals.filter((v) =>
        verticals.has(v),
      ).length;
      return { article: a, score: topicOverlap * 2 + verticalOverlap };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.article);
}

// --- Authors ----------------------------------------------------------------

export function getAllAuthors(): Author[] {
  return [...rawAuthors];
}

export function getAuthor(slug: string): Author | undefined {
  return rawAuthors.find((a) => a.slug === slug);
}

// --- Verticals --------------------------------------------------------------

export function getAllVerticals(): Vertical[] {
  return [...rawVerticals];
}

export function getVertical(slug: string): Vertical | undefined {
  return rawVerticals.find((v) => v.slug === slug);
}

export function getVerticalByTag(tag: string): Vertical | undefined {
  return rawVerticals.find((v) => v.industryTag === tag);
}

/** Industry libraries an article belongs to via its `verticals` tags. */
export function getVerticalsForArticle(article: Article): Vertical[] {
  return getAllVerticals().filter((v) =>
    article.verticals.includes(v.industryTag),
  );
}

// --- Authority playbooks ----------------------------------------------------

export function getAllPlaybooks(): Playbook[] {
  return [...rawPlaybooks].sort((a, b) => a.title.localeCompare(b.title));
}

export function getPlaybook(slug: string): Playbook | undefined {
  return rawPlaybooks.find((p) => p.slug === slug);
}

// --- Tools (reviews, roundups, comparisons, guides) -------------------------

export function getAllTools(): ToolDoc[] {
  return [...rawTools].sort((a, b) => b.published.localeCompare(a.published));
}

export function getTool(slug: string): ToolDoc | undefined {
  return rawTools.find((t) => t.slug === slug);
}

export function getToolsByType(type: ToolDoc["type"]): ToolDoc[] {
  return getAllTools().filter((t) => t.type === type);
}

// --- Pillars (AEO Canon deep-dives) -----------------------------------------

export function getAllPillars(): PillarDoc[] {
  return [...rawPillars];
}

export function getPillar(slug: string): PillarDoc | undefined {
  return rawPillars.find((p) => p.slug === slug);
}

// --- Glossary (the AEO encyclopedia) ----------------------------------------

/** All glossary terms, sorted alphabetically by term. */
export function getAllGlossary(): GlossaryTerm[] {
  return [...rawGlossary].sort((a, b) =>
    a.term.localeCompare(b.term, "en", { sensitivity: "base" }),
  );
}

export function getGlossaryTerm(slug: string): GlossaryTerm | undefined {
  return rawGlossary.find((t) => t.slug === slug);
}

/**
 * Resolve a term's `related` slugs to full terms, dropping any that don't exist
 * yet — so an entry can safely link ahead to terms added in a later batch.
 */
export function getRelatedGlossary(term: GlossaryTerm): GlossaryTerm[] {
  return term.related
    .map((slug) => getGlossaryTerm(slug))
    .filter((t): t is GlossaryTerm => Boolean(t));
}

// --- News & updates (the timely, dated content stream) ----------------------

/** All news posts, newest first. */
export function getAllNews(): NewsPost[] {
  return [...rawNews].sort((a, b) => b.published.localeCompare(a.published));
}

export function getNews(slug: string): NewsPost | undefined {
  return rawNews.find((n) => n.slug === slug);
}

export function getNewsByCategory(category: string): NewsPost[] {
  return getAllNews().filter((n) => n.category === category);
}

/** The most recent news posts — for surfacing "latest" on other pages. */
export function getLatestNews(limit = 3): NewsPost[] {
  return getAllNews().slice(0, limit);
}
