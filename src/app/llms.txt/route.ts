import { absoluteUrl, siteConfig } from "@/lib/site";
import { getAllArticles, getAllPaths, getAllVerticals } from "@/lib/content";

// Built entirely from build-time content — prerender as a static file.
export const dynamic = "force-static";

/**
 * /llms.txt — an llms.txt-format guide for AI crawlers (https://llmstxt.org).
 * As an AEO vendor, publishing this is on-brand: it points answer engines
 * straight at our best, most citable content. Built from the content layer.
 */
export function GET() {
  const articles = getAllArticles();
  const paths = getAllPaths();
  const verticals = getAllVerticals();

  const lines: string[] = [];
  lines.push(`# ${siteConfig.name}`);
  lines.push("");
  lines.push(`> ${siteConfig.description}`);
  lines.push("");
  lines.push(
    "All content is answer-first and structured for extraction. Articles are the single source of truth; learning paths and industry hubs are curated views over them.",
  );
  lines.push("");

  lines.push("## Education Center (articles)");
  lines.push("");
  for (const article of articles) {
    lines.push(
      `- [${article.title}](${absoluteUrl(article.url)}): ${article.summary}`,
    );
  }
  lines.push("");

  lines.push("## Learning Paths");
  lines.push("");
  for (const path of paths) {
    lines.push(`- [${path.title}](${absoluteUrl(path.url)}): ${path.summary}`);
  }
  lines.push("");

  lines.push("## Industries");
  lines.push("");
  for (const vertical of verticals) {
    lines.push(
      `- [${vertical.title}](${absoluteUrl(vertical.url)}): ${vertical.summary}`,
    );
  }
  lines.push("");

  lines.push("## More");
  lines.push("");
  lines.push(`- [Sitemap](${absoluteUrl("/sitemap.xml")})`);
  lines.push(`- [RSS feed](${absoluteUrl("/feed.xml")})`);
  lines.push("");

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
