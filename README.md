# AEO Canon

A content-driven education site for an **Answer Engine Optimization (AEO) + SEO**
services business. The core asset is a large, reusable library of MDX articles,
optimized for AI answer engines, traditional search, and speed.

## Architecture principle

**One article = one MDX file = one canonical URL.** Learning paths and industry
verticals are _views_ over the shared article pool, never copies:

- **Articles** (`content/articles/`) are the single source of truth. Canonical
  home: `/learn/[slug]`.
- **Learning paths** (`content/paths/`) are metadata + an _ordered list of
  article slugs_ → rendered at `/paths/[slug]`.
- **Verticals** (`content/verticals/`) are hubs that _query_ the pool by tag →
  `/verticals/[slug]`.
- **Authors** (`content/authors/`) provide E-E-A-T → `/authors/[slug]`.

Cross-references (a path slug that doesn't resolve, an unknown taxonomy tag,
missing frontmatter) **fail the build** via Velite schema + `prepare()`
validation — they never 404 in production.

## Stack

- **Next.js 16** (App Router, Turbopack, **React Compiler** enabled), **React 19.2**
- **TypeScript** strict (`noUncheckedIndexedAccess`, no `any`)
- **Tailwind CSS v4** (CSS-first) + **shadcn/ui** + lucide-react
- **Velite** — typed MDX → data, Zod-validated (the "content backend")
- MDX pipeline: `remark-gfm`, `rehype-slug`, `rehype-autolink-headings`,
  `rehype-pretty-code` (+ shiki)
- **Motion** (`motion/react`) — page transitions + scroll reveal, reduced-motion aware
- **schema-dts** — type-safe JSON-LD

## Getting started

```bash
npm install
cp .env.example .env.local   # set NEXT_PUBLIC_SITE_URL
npm run dev                  # Velite (watch) + Next dev, concurrently
```

Open http://localhost:3000.

### Scripts

| Script                            | Purpose                                      |
| --------------------------------- | -------------------------------------------- |
| `npm run dev`                     | Velite watch + Next dev (Turbopack) together |
| `npm run build`                   | `velite build --strict` then `next build`    |
| `npm run build:content`           | Rebuild the content layer only               |
| `npm run typecheck`               | `tsc --noEmit`                               |
| `npm run lint` / `npm run format` | ESLint / Prettier                            |

> Velite runs via npm scripts (not a Next plugin) because Turbopack — the Next 16
> default bundler — does not run webpack plugins.

## Authoring content

All authoring is in MDX under `content/` — **no CMS, no admin UI**. Add a file,
fill the frontmatter (validated by `velite.config.ts`), and it's live on build.
Reusable MDX components (`Callout`, `Figure`, `FAQBlock`, `ComparisonTable`) are
registered in `src/components/mdx/` and usable in any article.

Taxonomy (valid topics, verticals, schema types) is defined in
`src/lib/taxonomy.ts`. All content is read through the typed query layer in
`src/lib/content.ts` — nothing imports the generated `.velite` output directly.

## SEO / AEO

- Central metadata helper: `src/lib/seo.ts` (canonical always set).
- Typed JSON-LD by `schemaType`: `src/lib/structured-data.ts` (Article, HowTo,
  FAQPage, Course, Person, BreadcrumbList; Organization + WebSite site-wide).
- `app/sitemap.ts`, `app/robots.ts`, `app/llms.txt`, `app/feed.xml` (RSS).

A sample article scores **100/100/100/100** on Lighthouse (desktop) with
LCP ~0.6s, CLS 0, TBT 0ms.

## Deferred (seams in place, not built)

Forms (server actions + Zod + honeypot), in-article calculators/widgets, the
website auditor, and **Supabase** for application data. Content (MDX/git) and app
data (DB) are kept separate — see `src/lib/db/`.
