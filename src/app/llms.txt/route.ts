import { absoluteUrl, siteConfig } from "@/lib/site";
import {
  getAllArticles,
  getAllPaths,
  getAllVerticals,
  getAllPlaybooks,
  getUsedTopics,
} from "@/lib/content";
import { topicLabel, topicDescription } from "@/lib/taxonomy";

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
  const topics = getUsedTopics();
  const playbooks = getAllPlaybooks();

  const lines: string[] = [];
  lines.push(`# ${siteConfig.name}`);
  lines.push("");
  lines.push(`> ${siteConfig.description}`);
  lines.push("");
  lines.push(
    "All content is answer-first and structured for extraction. Articles are the single source of truth; courses (learning paths) and industry libraries are curated views over them.",
  );
  lines.push("");

  lines.push("## AEO School (articles)");
  lines.push("");
  for (const article of articles) {
    lines.push(
      `- [${article.title}](${absoluteUrl(article.url)}): ${article.summary}`,
    );
  }
  lines.push("");

  lines.push("## Topics");
  lines.push("");
  for (const topic of topics) {
    lines.push(
      `- [${topicLabel(topic.slug)}](${absoluteUrl(`/topics/${topic.slug}`)}): ${topicDescription(topic.slug)}`,
    );
  }
  lines.push("");

  lines.push("## Courses (learning paths)");
  lines.push("");
  for (const path of paths) {
    lines.push(`- [${path.title}](${absoluteUrl(path.url)}): ${path.summary}`);
  }
  lines.push("");

  lines.push("## Off-site & authority playbooks");
  lines.push("");
  for (const playbook of playbooks) {
    lines.push(
      `- [${playbook.title}](${absoluteUrl(playbook.url)}): ${playbook.summary}`,
    );
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

  lines.push("## Original research");
  lines.push("");
  lines.push(
    `- [The State of AEO 2026](${absoluteUrl("/state-of-aeo-2026")}): Original survey of how marketing teams measure, budget for, and win visibility in AI answer engines. Free to cite (CC BY 4.0).`,
  );
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
