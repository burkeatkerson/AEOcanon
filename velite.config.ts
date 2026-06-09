import { defineConfig, defineCollection, s } from "velite";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode, {
  type Options as PrettyCodeOptions,
} from "rehype-pretty-code";
import type { PluggableList } from "unified";

import {
  TOPIC_SLUGS,
  VERTICAL_SLUGS,
  ARTICLE_SCHEMA_TYPES,
  PATH_LEVELS,
} from "./src/lib/taxonomy";

// Velite runs in its own Node process and does not load Next's .env, so this
// falls back to the production domain. The runtime SEO layer (src/lib/seo.ts)
// recomputes absolute URLs from NEXT_PUBLIC_SITE_URL, so a different deploy
// host still gets correct canonicals; this baked value is the safe default.
const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://aeocanon.com"
).replace(/\/$/, "");

const prettyCodeOptions: PrettyCodeOptions = {
  theme: "github-dark-dimmed",
  keepBackground: false,
};

// rehypeSlug must precede autolink so headings have ids to link to.
const rehypePlugins: PluggableList = [
  rehypeSlug,
  [rehypePrettyCode, prettyCodeOptions],
  [
    rehypeAutolinkHeadings,
    {
      behavior: "append",
      properties: {
        className: ["heading-anchor"],
        ariaLabel: "Permalink to this section",
      },
    },
  ],
];

const articles = defineCollection({
  name: "Article",
  pattern: "articles/**/*.mdx",
  schema: s
    .object({
      title: s.string().max(120),
      slug: s.slug("articles"),
      summary: s.string().min(20).max(320),
      body: s.mdx(),
      topics: s.array(s.enum(TOPIC_SLUGS)).min(1),
      verticals: s.array(s.enum(VERTICAL_SLUGS)).default([]),
      author: s.string(), // author slug; existence enforced in prepare()
      published: s.isodate(),
      updated: s.isodate(),
      schemaType: s.enum(ARTICLE_SCHEMA_TYPES).default("Article"),
      faqs: s.array(s.object({ q: s.string(), a: s.string() })).optional(),
      featured: s.boolean().default(false),
      cover: s.image().optional(),
      coverAlt: s.string().optional(),
      // Computed from the body:
      metadata: s.metadata(), // { readingTime, wordCount }
      toc: s.toc(),
    })
    .transform((data) => ({
      ...data,
      url: `/learn/${data.slug}`,
      canonicalUrl: `${SITE_URL}/learn/${data.slug}`,
    })),
});

const authors = defineCollection({
  name: "Author",
  pattern: "authors/**/*.mdx",
  schema: s
    .object({
      name: s.string(),
      slug: s.slug("authors"),
      role: s.string().optional(),
      bio: s.string(),
      avatar: s.image().optional(),
      avatarAlt: s.string().optional(),
      credentials: s.array(s.string()).default([]),
      links: s
        .array(s.object({ label: s.string(), url: s.string().url() }))
        .default([]),
      body: s.mdx().optional(),
    })
    .transform((data) => ({ ...data, url: `/authors/${data.slug}` })),
});

const paths = defineCollection({
  name: "LearningPath",
  pattern: "paths/**/*.mdx",
  schema: s
    .object({
      title: s.string().max(120),
      slug: s.slug("paths"),
      summary: s.string().min(20).max(320),
      body: s.mdx(),
      level: s.enum(PATH_LEVELS).default("beginner"),
      estimatedHours: s.number().min(0).optional(),
      // Ordered list of article slugs; each is verified in prepare().
      items: s.array(s.string()).min(1),
      schemaType: s.literal("Course").default("Course"),
      published: s.isodate().optional(),
      updated: s.isodate().optional(),
      metadata: s.metadata(),
      toc: s.toc(),
    })
    .transform((data) => ({
      ...data,
      // Public surface is "Courses"; the data model stays a learning path.
      url: `/courses/${data.slug}`,
      canonicalUrl: `${SITE_URL}/courses/${data.slug}`,
    })),
});

const verticals = defineCollection({
  name: "Vertical",
  pattern: "verticals/**/*.mdx",
  schema: s
    .object({
      title: s.string().max(120),
      slug: s.slug("verticals"),
      summary: s.string().min(20).max(320),
      body: s.mdx(),
      industryTag: s.enum(VERTICAL_SLUGS),
      published: s.isodate().optional(),
      updated: s.isodate().optional(),
      metadata: s.metadata(),
      toc: s.toc(),
    })
    .transform((data) => ({
      ...data,
      url: `/industries/${data.slug}`,
      canonicalUrl: `${SITE_URL}/industries/${data.slug}`,
    })),
});

const playbooks = defineCollection({
  name: "Playbook",
  pattern: "playbooks/**/*.mdx",
  schema: s
    .object({
      title: s.string().max(120),
      slug: s.slug("playbooks"),
      summary: s.string().min(20).max(320),
      body: s.mdx(),
      // The platform/surface this playbook covers (e.g. "Reddit"). Optional so
      // synthesis playbooks (branded mentions, the audit) can omit it.
      platform: s.string().optional(),
      author: s.string(), // author slug; existence enforced in prepare()
      published: s.isodate(),
      updated: s.isodate(),
      schemaType: s.literal("Article").default("Article"),
      faqs: s.array(s.object({ q: s.string(), a: s.string() })).optional(),
      metadata: s.metadata(),
      toc: s.toc(),
    })
    .transform((data) => ({
      ...data,
      url: `/authority/${data.slug}`,
      canonicalUrl: `${SITE_URL}/authority/${data.slug}`,
    })),
});

export default defineConfig({
  root: "content",
  collections: { articles, authors, paths, verticals, playbooks },
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins,
  },
  // Cross-collection referential integrity. Throwing here aborts `velite build`,
  // which (via the `build` npm script) aborts `next build` — bad references fail
  // the build instead of 404-ing in production.
  prepare: ({ articles, authors, paths, playbooks }) => {
    const articleSlugs = new Set(articles.map((a) => a.slug));
    const authorSlugs = new Set(authors.map((a) => a.slug));
    const errors: string[] = [];

    for (const article of articles) {
      if (!authorSlugs.has(article.author)) {
        errors.push(
          `Article "${article.slug}" references unknown author "${article.author}".`,
        );
      }
    }

    for (const playbook of playbooks) {
      if (!authorSlugs.has(playbook.author)) {
        errors.push(
          `Playbook "${playbook.slug}" references unknown author "${playbook.author}".`,
        );
      }
    }

    for (const path of paths) {
      for (const itemSlug of path.items) {
        if (!articleSlugs.has(itemSlug)) {
          errors.push(
            `Learning path "${path.slug}" references missing article slug "${itemSlug}".`,
          );
        }
      }
      const seen = new Set<string>();
      for (const itemSlug of path.items) {
        if (seen.has(itemSlug)) {
          errors.push(
            `Learning path "${path.slug}" lists duplicate article slug "${itemSlug}".`,
          );
        }
        seen.add(itemSlug);
      }
    }

    if (errors.length > 0) {
      throw new Error(
        `\n✗ Content validation failed (${errors.length}):\n  - ${errors.join(
          "\n  - ",
        )}\n`,
      );
    }
  },
});
