/**
 * Typed content query layer — the ONLY module the app imports content through.
 * Routes, SEO infra, sitemap, RSS, etc. consume these functions; nothing reads
 * `.velite` output or raw MDX directly. This keeps the article pool as the
 * single source of truth and makes paths/verticals pure *views* over it.
 */
import {
  articles as rawArticles,
  authors as rawAuthors,
  paths as rawPaths,
  verticals as rawVerticals,
  type Article,
  type Author,
  type LearningPath,
  type Vertical,
} from "#velite";

export type { Article, Author, LearningPath, Vertical };

/** A learning path with its `items` resolved to full, ordered articles. */
export type PathWithArticles = LearningPath & { articles: Article[] };

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

// --- Learning paths ---------------------------------------------------------

export function getAllPaths(): LearningPath[] {
  return [...rawPaths];
}

export function getPath(slug: string): LearningPath | undefined {
  return rawPaths.find((p) => p.slug === slug);
}

/**
 * Resolve a path's ordered `items` slugs to full articles. Build-time
 * validation guarantees every slug resolves, but we filter defensively.
 */
export function getPathWithArticles(
  slug: string,
): PathWithArticles | undefined {
  const path = getPath(slug);
  if (!path) return undefined;
  const articles = path.items
    .map((itemSlug) => getArticle(itemSlug))
    .filter((a): a is Article => a !== undefined);
  return { ...path, articles };
}

/** Paths (pillars) that include the given article — for back-linking. */
export function getPathsForArticle(articleSlug: string): LearningPath[] {
  return getAllPaths().filter((p) => p.items.includes(articleSlug));
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

/** Vertical hubs (pillars) an article belongs to via its `verticals` tags. */
export function getVerticalsForArticle(article: Article): Vertical[] {
  return getAllVerticals().filter((v) =>
    article.verticals.includes(v.industryTag),
  );
}
