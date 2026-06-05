import { absoluteUrl, siteConfig } from "@/lib/site";
import { getAllArticles, getAuthor } from "@/lib/content";

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

/** RSS 2.0 feed for the Education Center, generated from the article pool. */
export function GET() {
  const articles = getAllArticles();
  const self = absoluteUrl("/feed.xml");
  const lastBuild = articles[0]
    ? new Date(articles[0].updated).toUTCString()
    : new Date(0).toUTCString();

  const items = articles
    .map((article) => {
      const author = getAuthor(article.author);
      return [
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
        .join("\n");
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.name)} — Education Center</title>
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
