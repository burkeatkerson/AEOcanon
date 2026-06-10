import type {
  Article as ArticleSchema,
  BreadcrumbList,
  Course,
  Dataset,
  DefinedTerm,
  DefinedTermSet,
  FAQPage,
  Graph,
  HowTo,
  LearningResource,
  Organization,
  Person,
  Review,
  SoftwareApplication,
  Thing,
  WebSite,
} from "schema-dts";
import type { Article, Author, Vertical } from "@/lib/content";
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

/** Course node for a structured course (syllabus page). */
export function courseNode(opts: {
  title: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified: string;
  authorUrl?: string;
  lessons: { title: string; path: string }[];
}): Course {
  return {
    "@type": "Course",
    "@id": absoluteUrl(`${opts.path}#course`),
    name: opts.title,
    description: opts.description,
    url: absoluteUrl(opts.path),
    inLanguage: "en",
    datePublished: opts.datePublished,
    dateModified: opts.dateModified,
    provider: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    ...(opts.authorUrl
      ? { author: { "@id": absoluteUrl(`${opts.authorUrl}#person`) } }
      : {}),
    hasPart: opts.lessons.map((l) => ({
      "@type": "LearningResource",
      name: l.title,
      url: absoluteUrl(l.path),
    })),
  };
}

/** LearningResource node for a single lesson page. */
export function lessonResourceNode(opts: {
  title: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified: string;
  authorUrl?: string;
  courseName: string;
  coursePath: string;
}): LearningResource {
  return {
    "@type": "LearningResource",
    "@id": absoluteUrl(`${opts.path}#lesson`),
    name: opts.title,
    description: opts.description,
    url: absoluteUrl(opts.path),
    inLanguage: "en",
    learningResourceType: "Lesson",
    datePublished: opts.datePublished,
    dateModified: opts.dateModified,
    provider: { "@id": ORG_ID },
    ...(opts.authorUrl
      ? { author: { "@id": absoluteUrl(`${opts.authorUrl}#person`) } }
      : {}),
    isPartOf: {
      "@type": "Course",
      name: opts.courseName,
      url: absoluteUrl(opts.coursePath),
    },
  };
}

/** CollectionPage node for a topic landing page (a category of articles). */
export function topicPageNodes(topic: {
  name: string;
  description: string;
  path: string;
}): Thing[] {
  return [
    {
      "@type": "CollectionPage",
      "@id": absoluteUrl(`${topic.path}#collection`),
      name: topic.name,
      description: topic.description,
      url: absoluteUrl(topic.path),
      isPartOf: { "@id": SITE_ID },
    },
  ];
}

/**
 * Dataset node for an original-research study — the schema that makes a page
 * eligible to be treated as a primary data source. Creator/publisher are the
 * site Organization; figures are described via `variableMeasured`.
 */
export function datasetNode(opts: {
  name: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified: string;
  license: string;
  temporalCoverage: string;
  measurementTechnique: string;
  variableMeasured: string[];
  keywords?: string[];
}): Dataset {
  return {
    "@type": "Dataset",
    "@id": absoluteUrl(`${opts.path}#dataset`),
    name: opts.name,
    description: opts.description,
    url: absoluteUrl(opts.path),
    creator: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    datePublished: opts.datePublished,
    dateModified: opts.dateModified,
    license: opts.license,
    isAccessibleForFree: true,
    inLanguage: "en",
    temporalCoverage: opts.temporalCoverage,
    measurementTechnique: opts.measurementTechnique,
    variableMeasured: opts.variableMeasured,
    ...(opts.keywords ? { keywords: opts.keywords } : {}),
    isPartOf: { "@id": SITE_ID },
  };
}

/**
 * Review node for a software/tool review, with the reviewed product as a nested
 * SoftwareApplication. We deliberately omit a numeric reviewRating rather than
 * fabricate a precise score — the verdict is qualitative.
 */
export function reviewNode(opts: {
  toolName: string;
  vendorUrl?: string;
  category?: string;
  path: string;
  datePublished: string;
  dateModified: string;
  authorUrl?: string;
  verdict?: string;
}): Review {
  const itemReviewed: SoftwareApplication = {
    "@type": "SoftwareApplication",
    name: opts.toolName,
    applicationCategory: opts.category ?? "BusinessApplication",
    ...(opts.vendorUrl ? { url: opts.vendorUrl } : {}),
  };
  return {
    "@type": "Review",
    "@id": absoluteUrl(`${opts.path}#review`),
    url: absoluteUrl(opts.path),
    datePublished: opts.datePublished,
    dateModified: opts.dateModified,
    itemReviewed,
    ...(opts.verdict ? { reviewBody: opts.verdict } : {}),
    publisher: { "@id": ORG_ID },
    ...(opts.authorUrl
      ? { author: { "@id": absoluteUrl(`${opts.authorUrl}#person`) } }
      : {}),
  };
}

/** FAQPage node from a plain list of Q&As (for non-content-pool pages). */
export function faqNode(path: string, faqs: { q: string; a: string }[]): FAQPage {
  return {
    "@type": "FAQPage",
    "@id": absoluteUrl(`${path}#faq`),
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };
}

/** Article node for a standalone research report (not a content-pool Article). */
export function researchArticleNode(opts: {
  headline: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified: string;
  authorUrl?: string;
  keywords?: string[];
}): ArticleSchema {
  return {
    "@type": "Article",
    "@id": absoluteUrl(`${opts.path}#article`),
    headline: opts.headline,
    description: opts.description,
    url: absoluteUrl(opts.path),
    datePublished: opts.datePublished,
    dateModified: opts.dateModified,
    inLanguage: "en",
    isPartOf: { "@id": SITE_ID },
    mainEntityOfPage: absoluteUrl(opts.path),
    publisher: { "@id": ORG_ID },
    ...(opts.authorUrl
      ? { author: { "@id": absoluteUrl(`${opts.authorUrl}#person`) } }
      : {}),
    ...(opts.keywords ? { keywords: opts.keywords.join(", ") } : {}),
  };
}

const GLOSSARY_SET_ID = absoluteUrl("/glossary#termset");

/**
 * DefinedTerm node for a single glossary entry. Links back to the glossary's
 * DefinedTermSet so the encyclopedia reads as one structured vocabulary.
 */
export function definedTermNode(opts: {
  term: string;
  definition: string;
  path: string;
}): DefinedTerm {
  return {
    "@type": "DefinedTerm",
    "@id": absoluteUrl(`${opts.path}#term`),
    name: opts.term,
    description: opts.definition,
    url: absoluteUrl(opts.path),
    inDefinedTermSet: GLOSSARY_SET_ID,
  };
}

/** DefinedTermSet node for the glossary index — the vocabulary as a whole. */
export function definedTermSetNode(opts: {
  name: string;
  description: string;
  path: string;
  terms: { term: string; path: string }[];
}): DefinedTermSet {
  return {
    "@type": "DefinedTermSet",
    "@id": GLOSSARY_SET_ID,
    name: opts.name,
    description: opts.description,
    url: absoluteUrl(opts.path),
    isPartOf: { "@id": SITE_ID },
    hasDefinedTerm: opts.terms.map((t) => ({
      "@type": "DefinedTerm",
      "@id": absoluteUrl(`${t.path}#term`),
      name: t.term,
      url: absoluteUrl(t.path),
      inDefinedTermSet: GLOSSARY_SET_ID,
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
