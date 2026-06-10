import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import {
  getAllArticles,
  getAllAuthors,
  getAllCourses,
  getAllVerticals,
  getAllPlaybooks,
  getAllPillars,
  getAllGlossary,
  getUsedTopics,
} from "@/lib/content";

/** Most recent `updated` date across a set of articles, or undefined if empty. */
function latestUpdated(articles: { updated: string }[]): string | undefined {
  let max: string | undefined;
  for (const a of articles) {
    if (!max || a.updated > max) max = a.updated;
  }
  return max;
}

/** Generated from every content collection; lastModified tracks `updated`. */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/canon"), changeFrequency: "monthly", priority: 0.9 },
    {
      url: absoluteUrl("/state-of-aeo-2026"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    { url: absoluteUrl("/learn"), changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/pillars"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/courses"), changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/topics"), changeFrequency: "weekly", priority: 0.8 },
    {
      url: absoluteUrl("/authority"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/industries"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    { url: absoluteUrl("/tools"), changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/glossary"), changeFrequency: "weekly", priority: 0.7 },
    { url: absoluteUrl("/pricing"), changeFrequency: "monthly", priority: 0.8 },
    {
      url: absoluteUrl("/whitepaper"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: absoluteUrl("/manifesto"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    { url: absoluteUrl("/audit"), changeFrequency: "monthly", priority: 0.7 },
  ];

  const articles: MetadataRoute.Sitemap = getAllArticles().map((article) => ({
    url: absoluteUrl(article.url),
    lastModified: article.updated,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const courses: MetadataRoute.Sitemap = getAllCourses().flatMap((course) => [
    {
      url: absoluteUrl(`/courses/${course.slug}`),
      lastModified: course.updated,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    ...course.lessons.map((lesson) => ({
      url: absoluteUrl(`/courses/${course.slug}/${lesson.slug}`),
      lastModified: course.updated,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ]);

  const verticals: MetadataRoute.Sitemap = getAllVerticals().map(
    (vertical) => ({
      url: absoluteUrl(vertical.url),
      lastModified: vertical.updated ?? vertical.published,
      changeFrequency: "monthly",
      priority: 0.6,
    }),
  );

  const allArticles = getAllArticles();

  const authors: MetadataRoute.Sitemap = getAllAuthors().map((author) => ({
    url: absoluteUrl(author.url),
    lastModified: latestUpdated(
      allArticles.filter((a) => a.author === author.slug),
    ),
    changeFrequency: "monthly",
    priority: 0.4,
  }));

  const topics: MetadataRoute.Sitemap = getUsedTopics().map((topic) => ({
    url: absoluteUrl(`/topics/${topic.slug}`),
    lastModified: latestUpdated(
      allArticles.filter((a) => a.topics.some((t) => t === topic.slug)),
    ),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const playbooks: MetadataRoute.Sitemap = getAllPlaybooks().map((p) => ({
    url: absoluteUrl(p.url),
    lastModified: p.updated,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const pillars: MetadataRoute.Sitemap = getAllPillars().map((p) => ({
    url: absoluteUrl(p.url),
    lastModified: p.updated,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const glossary: MetadataRoute.Sitemap = getAllGlossary().map((t) => ({
    url: absoluteUrl(t.url),
    lastModified: t.updated,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [
    ...staticRoutes,
    ...articles,
    ...courses,
    ...verticals,
    ...authors,
    ...topics,
    ...playbooks,
    ...pillars,
    ...glossary,
  ];
}
