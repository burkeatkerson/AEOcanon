import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import {
  getAllArticles,
  getAllAuthors,
  getAllPaths,
  getAllVerticals,
  getAllPlaybooks,
  getUsedTopics,
} from "@/lib/content";

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

  const paths: MetadataRoute.Sitemap = getAllPaths().map((path) => ({
    url: absoluteUrl(path.url),
    lastModified: path.updated ?? path.published,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const verticals: MetadataRoute.Sitemap = getAllVerticals().map(
    (vertical) => ({
      url: absoluteUrl(vertical.url),
      lastModified: vertical.updated ?? vertical.published,
      changeFrequency: "monthly",
      priority: 0.6,
    }),
  );

  const authors: MetadataRoute.Sitemap = getAllAuthors().map((author) => ({
    url: absoluteUrl(author.url),
    changeFrequency: "monthly",
    priority: 0.4,
  }));

  const topics: MetadataRoute.Sitemap = getUsedTopics().map((topic) => ({
    url: absoluteUrl(`/topics/${topic.slug}`),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const playbooks: MetadataRoute.Sitemap = getAllPlaybooks().map((p) => ({
    url: absoluteUrl(p.url),
    lastModified: p.updated,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    ...staticRoutes,
    ...articles,
    ...paths,
    ...verticals,
    ...authors,
    ...topics,
    ...playbooks,
  ];
}
