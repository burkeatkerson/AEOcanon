import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXContent } from "@/components/mdx";
import { FAQBlock } from "@/components/mdx/faq-block";
import { JsonLd } from "@/components/seo/json-ld";
import {
  getAllGlossary,
  getGlossaryTerm,
  getRelatedGlossary,
  getAuthor,
} from "@/lib/content";
import { PILLARS } from "@/lib/canon";
import { buildMetadata } from "@/lib/seo";
import {
  breadcrumbNode,
  definedTermNode,
  faqNode,
  graph,
  personNode,
  researchArticleNode,
} from "@/lib/structured-data";

const PILLAR_TITLES = new Map(
  PILLARS.map((p) => [p.title.toLowerCase(), p.title]),
);

export function generateStaticParams() {
  return getAllGlossary().map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const term = getGlossaryTerm(slug);
  if (!term) return {};
  const author = getAuthor(term.author);
  return buildMetadata({
    title: `${term.term} — AEO Glossary`,
    description: term.definition,
    path: term.url,
    type: "article",
    publishedTime: term.published,
    modifiedTime: term.updated,
    authors: author ? [author.name] : undefined,
  });
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function GlossaryTermPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const term = getGlossaryTerm(slug);
  if (!term) notFound();

  const author = getAuthor(term.author);
  const related = getRelatedGlossary(term);
  const pillars = term.pillars
    .map((p) => {
      const title = PILLAR_TITLES.get(p);
      return title ? { slug: p, title } : null;
    })
    .filter((x): x is { slug: string; title: string } => Boolean(x));
  const updatedDiffers = term.updated !== term.published;

  const jsonLd = graph([
    researchArticleNode({
      headline: `${term.term} — AEO Glossary`,
      description: term.definition,
      path: term.url,
      datePublished: term.published,
      dateModified: term.updated,
      authorUrl: author?.url,
      keywords: ["AEO glossary", "answer engine optimization", term.term],
    }),
    definedTermNode({
      term: term.term,
      definition: term.definition,
      path: term.url,
    }),
    ...(term.faqs && term.faqs.length > 0
      ? [faqNode(term.url, term.faqs)]
      : []),
    ...(author ? [personNode(author)] : []),
    breadcrumbNode([
      { name: "Glossary", path: "/glossary" },
      { name: term.term, path: term.url },
    ]),
  ]);

  return (
    <div className="py-12">
      <JsonLd graph={jsonLd} />
      <article className="mx-auto max-w-[720px]">
        <nav
          aria-label="Breadcrumb"
          className="text-muted flex flex-wrap gap-2 font-mono text-[11.5px]"
        >
          <Link href="/glossary" className="hover:text-accent">
            Glossary
          </Link>
          <span className="text-faint">/</span>
          <span className="text-ink">{term.term}</span>
        </nav>

        <header className="mt-4">
          <span className="text-accent font-mono text-[11px] tracking-[0.1em] uppercase">
            AEO Glossary
          </span>
          <h1 className="mt-3 text-[clamp(28px,4.2vw,44px)] leading-[1.08] font-medium tracking-[-0.02em]">
            {term.term}
          </h1>
          {/* The answer-first definition — the quotable unit. */}
          <p className="border-accent mt-4 border-l-[3px] py-1 pl-5 font-serif text-[21px] leading-snug">
            {term.definition}
          </p>
          {term.aka.length > 0 ? (
            <p className="text-muted mt-3 text-[14px]">
              Also known as: {term.aka.join(", ")}
            </p>
          ) : null}
          <div className="border-line text-muted mt-6 flex flex-wrap items-center gap-4 border-t pt-5 font-mono text-[11.5px]">
            {author ? (
              <span className="flex items-center gap-2.5">
                <span className="bg-accent-soft border-line-2 text-accent grid size-9 place-items-center rounded-full border font-serif italic">
                  {author.name.charAt(0)}
                </span>
                <Link href={author.url} className="hover:text-accent">
                  <b className="text-ink">{author.name}</b>
                </Link>
              </span>
            ) : null}
            <time dateTime={term.published}>{formatDate(term.published)}</time>
          </div>
        </header>

        <div className="prose mt-8">
          <MDXContent code={term.body} />
        </div>

        {term.faqs && term.faqs.length > 0 ? (
          <FAQBlock items={term.faqs} />
        ) : null}

        {pillars.length > 0 ? (
          <section className="border-line mt-10 border-t pt-6">
            <h2 className="text-muted font-mono text-[11px] tracking-[0.1em] uppercase">
              Relevant pillar{pillars.length > 1 ? "s" : ""}
            </h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {pillars.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/pillars/${p.slug}`}
                    className="border-line hover:border-accent text-ink-2 hover:text-accent inline-flex rounded-full border px-3.5 py-1.5 text-[13.5px] no-underline"
                  >
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {related.length > 0 ? (
          <section className="border-line mt-8 border-t pt-6">
            <h2 className="text-muted font-mono text-[11px] tracking-[0.1em] uppercase">
              Related terms
            </h2>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={r.url}
                    className="border-line hover:border-accent block rounded-xl border p-3 no-underline"
                  >
                    <span className="text-ink block font-medium">{r.term}</span>
                    <span className="text-muted mt-0.5 block text-[13px] leading-snug">
                      {r.definition}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {updatedDiffers ? (
          <p className="text-muted mt-10 font-mono text-[11.5px]">
            Last updated{" "}
            <time dateTime={term.updated}>{formatDate(term.updated)}</time>.
          </p>
        ) : null}

        <nav className="border-line mt-10 border-t pt-6">
          <Link href="/glossary" className="text-accent text-[15px]">
            ← All glossary terms
          </Link>
        </nav>
      </article>
    </div>
  );
}
