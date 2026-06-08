# Architecture

How the codebase is organized to scale to **hundreds of articles, dozens of
landing pages, and multiple custom tools** without the structure fighting you.

## Three kinds of "page"

1. **Content** = data. Articles/paths/verticals/authors are MDX files validated
   by Velite and rendered through one shared template each. Adding content =
   adding a file. Scales to thousands with zero code.
2. **Landing pages** = compositions. A marketing/landing route is a thin file
   that assembles reusable **section blocks** (`Hero`, `Section`, `CtaBand`, …)
   and **library** components. Dozens are cheap because they share parts.
3. **Tools** = vertical slices. Each tool owns a route under `(tools)/`, its UI
   under `components/tools/<tool>/`, and its logic under `lib/<tool>/`.

## Route groups (`src/app`)

Groups organize by concern and **do not affect URLs**:

```
(marketing)/   home + landing pages          /            /pricing (future)
(content)/     editorial surfaces            /learn /paths /verticals /authors
(tools)/       interactive tools             /audit  (+ future tools)
(styleguide)/  brand + component references  /styleguide/* (noindex)
api/           route handlers                (future: audit, leads)
sitemap.ts robots.ts feed.xml/ llms.txt/ icon.svg layout.tsx globals.css
```

Content routes nest by entity and use `generateStaticParams` — every article,
path, vertical, and author is statically prerendered.

## Components (`src/components`)

Layered from atoms → compositions:

```
brand/      identity: Wordmark, BrandMark (symbol), Logo, ThemeToggle
layout/     Container, SiteHeader, SiteFooter
ui/         primitives: Button, Tag/Badge, Eyebrow/Kicker
library/    editorial content blocks (used in articles & pages):
              cards/      ArticleCard …
              reading/    TableOfContents …
              callouts · data · interactive (add subfolders as they grow)
            article-filter.tsx (topic filtering)
sections/   page compositions: Section, SectionHead, CtaBand, Hero …
mdx/        the MDX component map + wrappers (Callout, Figure, FAQBlock, …)
seo/        JsonLd
motion/     Reveal + transitions (reduced-motion aware)
tools/      tool-specific UI (audit-teaser, …)
```

Rule of thumb: **primitive** (`ui/`) → **block** (`library/` or `sections/`) →
**page** (`app/`). MDX-usable components are registered once in
`components/mdx/index.tsx`, so authors can use them in any `.mdx` file.

## Design system

- **Tokens** live in `src/app/globals.css` (the "Spectrum" scheme) under
  `[data-theme="light"|"dark"]` and are mapped into Tailwind v4 via `@theme inline`
  (utilities like `bg-panel`, `text-ink`, `text-accent`, `border-line`).
- **Theme** is the `data-theme` attribute, set before paint by the inline script
  in `layout.tsx` and toggled by `brand/ThemeToggle`. Persisted to `localStorage`.
- **Fonts**: Newsreader (serif), Spline Sans (sans), JetBrains Mono (mono) via
  `next/font` → `--font-*` → `--serif/--sans/--mono`.
- Visual references live at `/styleguide/brand` and `/styleguide/library`, built
  from the same components the site ships (no drift). The original static design
  lives in `Design/` for reference.

## Library (`src/lib`)

```
content.ts      the ONLY content API (typed, over Velite output)
taxonomy.ts     closed topic/vertical/schema sets (build-time validated)
site.ts navigation.ts  brand constants + IA
seo.ts structured-data.ts   metadata + typed JSON-LD
env.ts          lazy, granular, server-only env access
ai/ db/ audit/  audit-tool backend (clients, SSRF guard, PageSpeed, rate-limit)
```

## Adding things

- **An article** → drop an `.mdx` file in `content/articles/` (nest by cluster
  freely). Validation fails the build on bad refs.
- **A landing page** → add `src/app/(marketing)/<route>/page.tsx`, compose from
  `sections/` + `library/`.
- **A tool** → add `src/app/(tools)/<tool>/`, `components/tools/<tool>/`,
  `lib/<tool>/`.
- **A reusable block** → add to `library/` (content) or `sections/` (page
  layout); if it should work inside MDX, register it in `components/mdx/index.tsx`.
