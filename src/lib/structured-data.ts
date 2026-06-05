import type {
  Article as ArticleSchema,
  BreadcrumbList,
  Course,
  FAQPage,
  Graph,
  HowTo,
  Organization,
  Person,
  Thing,
  WebSite,
} from "schema-dts";
import type { Article, Author, LearningPath, Vertical } from "@/lib/content";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { topicLabel } from "@/lib/taxonomy";

const ORG_ID = absoluteUrl("/#organization");
const SITE_ID = absoluteUrl("/#website");

/** Wrap nodes into a single schema.org @graph for one page. */
export function graph(nodes: Thing[]): Graph {
  return { "@context": "https://schema.org", "@graph": nodes };
}

export function organizationNode(): Organization {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: siteConfig.organization.name,
    legalName: siteConfig.organization.legalName,
    url: siteConfig.url,
  };
}

export function websiteNode(): WebSite {
  return {
    "@type": "WebSite",
    "@id": SITE_ID,
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    publisher: { "@id": ORG_ID },
  };
}

export function personNode(author: Author): Person {
  return {
    "@type": "Person",
    "@id": absoluteUrl(`${author.url}#person`),
    name: author.name,
    url: absoluteUrl(author.url),
    ...(author.role ? { jobTitle: author.role } : {}),
    description: author.bio,
    ...(author.links.length > 0
      ? { sameAs: author.links.map((l) => l.url) }
      : {}),
  };
}

export function breadcrumbNode(
  items: { name: string; path: string }[],
): BreadcrumbList {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

function faqPageNode(article: Article): FAQPage {
  return {
    "@type": "FAQPage",
    "@id": absoluteUrl(`${article.url}#faq`),
    mainEntity: (article.faqs ?? []).map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };
}

function baseArticleProps(article: Article, author?: Author) {
  return {
    "@id": absoluteUrl(`${article.url}#article`),
    headline: article.title,
    description: article.summary,
    url: article.canonicalUrl,
    datePublished: article.published,
    dateModified: article.updated,
    inLanguage: "en",
    isPartOf: { "@id": SITE_ID },
    mainEntityOfPage: article.canonicalUrl,
    publisher: { "@id": ORG_ID },
    keywords: article.topics.map(topicLabel).join(", "),
    ...(author
      ? { author: { "@id": absoluteUrl(`${author.url}#person`) } }
      : {}),
  };
}

/**
 * Primary content node for an article, selected by its `schemaType`. HowTo maps
 * top-level sections (from the computed toc) to steps; FAQPage uses the faqs.
 */
export function articleContentNodes(
  article: Article,
  author?: Author,
): Thing[] {
  const nodes: Thing[] = [];

  if (article.schemaType === "HowTo") {
    const howTo: HowTo = {
      "@type": "HowTo",
      ...baseArticleProps(article, author),
      step: article.toc.map((entry) => ({
        "@type": "HowToStep",
        name: entry.title,
        url: `${article.canonicalUrl}${entry.url}`,
      })),
    };
    nodes.push(howTo);
  } else if (article.schemaType === "FAQPage") {
    nodes.push(faqPageNode(article));
  } else {
    const articleNode: ArticleSchema = {
      "@type": "Article",
      ...baseArticleProps(article, author),
    };
    nodes.push(articleNode);
  }

  // Always surface Q&A as structured data when present (unless it's already the
  // primary FAQPage node).
  if (
    article.schemaType !== "FAQPage" &&
    article.faqs &&
    article.faqs.length > 0
  ) {
    nodes.push(faqPageNode(article));
  }

  return nodes;
}

export function courseNode(path: LearningPath, articles: Article[]): Course {
  return {
    "@type": "Course",
    "@id": absoluteUrl(`${path.url}#course`),
    name: path.title,
    description: path.summary,
    url: path.canonicalUrl,
    inLanguage: "en",
    provider: { "@id": ORG_ID },
    hasPart: articles.map((a) => ({
      "@type": "Course",
      name: a.title,
      url: a.canonicalUrl,
    })),
  };
}

export function collectionPageNodes(vertical: Vertical): Thing[] {
  return [
    {
      "@type": "CollectionPage",
      "@id": absoluteUrl(`${vertical.url}#collection`),
      name: vertical.title,
      description: vertical.summary,
      url: vertical.canonicalUrl,
      isPartOf: { "@id": SITE_ID },
    },
  ];
}
