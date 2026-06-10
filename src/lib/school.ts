/**
 * The AEO School search index — a flat, lightweight list of everything the
 * command palette (⌘K) can jump to. Built over the typed content API in
 * `content.ts` (titles/labels only, no bodies) so the payload shipped to the
 * client stays small. One entry per article, glossary term, course, topic,
 * pillar, playbook, and tool.
 */
import {
  getAllArticles,
  getAllGlossary,
  getAllCourses,
  getAllPillars,
  getAllPlaybooks,
  getAllTools,
  getUsedTopics,
} from "@/lib/content";
import { topicLabel } from "@/lib/taxonomy";

export type SchoolSearchType =
  | "article"
  | "glossary"
  | "course"
  | "topic"
  | "pillar"
  | "playbook"
  | "tool";

export interface SchoolSearchItem {
  type: SchoolSearchType;
  title: string;
  /** Short context line (primary topic, "Glossary", article count, …). */
  subtitle?: string;
  href: string;
  /** Extra searchable text (topic labels, synonyms) not shown in the title. */
  keywords?: string;
}

/** The full searchable index for the school, in a stable, ranked-friendly order. */
export function getSchoolSearchIndex(): SchoolSearchItem[] {
  const items: SchoolSearchItem[] = [];

  for (const course of getAllCourses()) {
    items.push({
      type: "course",
      title: course.title,
      subtitle: `${course.level} course`,
      href: `/courses/${course.slug}`,
    });
  }

  for (const topic of getUsedTopics()) {
    items.push({
      type: "topic",
      title: topicLabel(topic.slug),
      subtitle: `${topic.count} ${topic.count === 1 ? "article" : "articles"}`,
      href: `/topics/${topic.slug}`,
    });
  }

  for (const pillar of getAllPillars()) {
    items.push({
      type: "pillar",
      title: pillar.title,
      subtitle: "Pillar",
      href: pillar.url,
    });
  }

  for (const article of getAllArticles()) {
    const labels = article.topics.map(topicLabel);
    items.push({
      type: "article",
      title: article.title,
      subtitle: labels[0],
      href: article.url,
      keywords: labels.join(" "),
    });
  }

  for (const term of getAllGlossary()) {
    items.push({
      type: "glossary",
      title: term.term,
      subtitle: "Glossary",
      href: term.url,
      keywords: term.aka.join(" "),
    });
  }

  for (const playbook of getAllPlaybooks()) {
    items.push({
      type: "playbook",
      title: playbook.title,
      subtitle: playbook.platform ?? "Playbook",
      href: playbook.url,
    });
  }

  for (const tool of getAllTools()) {
    items.push({
      type: "tool",
      title: tool.title,
      subtitle: "Tool",
      href: tool.url,
    });
  }

  return items;
}

/** Human label for a result type — used as the row chip in the palette. */
export const SEARCH_TYPE_LABELS: Record<SchoolSearchType, string> = {
  article: "Article",
  glossary: "Glossary",
  course: "Course",
  topic: "Topic",
  pillar: "Pillar",
  playbook: "Playbook",
  tool: "Tool",
};
