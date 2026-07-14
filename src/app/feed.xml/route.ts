import { absoluteUrl, siteConfig } from "@/lib/site";
import { getAllArticles, getAllNews, getAuthor } from "@/lib/content";
import { newsCategoryLabel } from "@/lib/taxonomy";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Built entirely from build-time content — prerender as a static file.
export const dynamic = "force-static";

/** RSS 2.0 feed for the AEO School, generated from the article pool. */
export function GET() {
  const articles = getAllArticles();
  const news = getAllNews();
  const self = absoluteUrl("/feed.xml");

  type FeedEntry = { published: string; updated: string; xml: string };

  const articleEntries: FeedEntry[] = articles.map((article) => {
    const author = getAuthor(article.author);
    return {
      published: article.published,
      updated: article.updated,
      xml: [
        "    <item>",
        `      <title>${escapeXml(article.title)}</title>`,
        `      <link>${absoluteUrl(article.url)}</link>`,
        `      <guid isPermaLink="true">${absoluteUrl(article.url)}</guid>`,
        `      <description>${escapeXml(article.summary)}</description>`,
        author
          ? `      <dc:creator>${escapeXml(author.name)}</dc:creator>`
          : "",
        `      <pubDate>${new Date(article.published).toUTCString()}</pubDate>`,
        ...article.topics.map(
          (topic) => `      <category>${escapeXml(topic)}</category>`,
        ),
        "    </item>",
      ]
        .filter(Boolean)
        .join("\n"),
    };
  });

  const newsEntries: FeedEntry[] = news.map((post) => {
    const author = getAuthor(post.author);
    return {
      published: post.published,
      updated: post.updated,
      xml: [
        "    <item>",
        `      <title>${escapeXml(post.title)}</title>`,
        `      <link>${absoluteUrl(post.url)}</link>`,
        `      <guid isPermaLink="true">${absoluteUrl(post.url)}</guid>`,
        `      <description>${escapeXml(post.summary)}</description>`,
        author
          ? `      <dc:creator>${escapeXml(author.name)}</dc:creator>`
          : "",
        `      <pubDate>${new Date(post.published).toUTCString()}</pubDate>`,
        `      <category>${escapeXml(newsCategoryLabel(post.category))}</category>`,
        "    </item>",
      ]
        .filter(Boolean)
        .join("\n"),
    };
  });

  const all = [...articleEntries, ...newsEntries].sort((a, b) =>
    b.published.localeCompare(a.published),
  );
  const latestUpdated = all
    .map((e) => e.updated)
    .sort((a, b) => b.localeCompare(a))[0];
  const lastBuild = new Date(latestUpdated ?? 0).toUTCString();
  const items = all.map((e) => e.xml).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.name)} — AEO School</title>
    <link>${absoluteUrl("/learn")}</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <atom:link href="${self}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
