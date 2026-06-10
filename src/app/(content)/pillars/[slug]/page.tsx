import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXContent } from "@/components/mdx";
import { FAQBlock } from "@/components/mdx/faq-block";
import { TableOfContents } from "@/components/library/reading/table-of-contents";
import { JsonLd } from "@/components/seo/json-ld";
import { getAllPillars, getPillar, getAuthor } from "@/lib/content";
import { PILLARS, LAYERS } from "@/lib/canon";
import { buildMetadata } from "@/lib/seo";
import {
  breadcrumbNode,
  faqNode,
  graph,
  personNode,
  researchArticleNode,
} from "@/lib/structured-data";

/** Canon metadata (layer, number, principle, color) for a pillar slug. */
function canonFor(slug: string) {
  return PILLARS.find((p) => p.title.toLowerCase() === slug);
}

export function generateStaticParams() {
  return getAllPillars().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pillar = getPillar(slug);
  if (!pillar) return {};
  const author = getAuthor(pillar.author);
  return buildMetadata({
    title: pillar.title,
    description: pillar.summary,
    path: pillar.url,
    type: "article",
    publishedTime: pillar.published,
    modifiedTime: pillar.updated,
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

export default async function PillarPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pillar = getPillar(slug);
  if (!pillar) notFound();

  const author = getAuthor(pillar.author);
  const canon = canonFor(slug);
  const layer = canon ? LAYERS.find((l) => l.name === canon.layer) : undefined;
  const color = canon?.color ?? "var(--accent)";
  const prev = canon ? PILLARS.find((p) => p.n === canon.n - 1) : undefined;
  const next = canon ? PILLARS.find((p) => p.n === canon.n + 1) : undefined;
  const updatedDiffers = pillar.updated !== pillar.published;

  const jsonLd = graph([
    researchArticleNode({
      headline: pillar.title,
      description: pillar.summary,
      path: pillar.url,
      datePublished: pillar.published,
      dateModified: pillar.updated,
      authorUrl: author?.url,
      keywords: ["AEO Canon", "answer engine optimization", pillar.title],
    }),
    ...(pillar.faqs && pillar.faqs.length > 0
      ? [faqNode(pillar.url, pillar.faqs)]
      : []),
    ...(author ? [personNode(author)] : []),
    breadcrumbNode([
      { name: "The AEO Canon", path: "/learn/aeo-canon" },
      { name: pillar.title, path: pillar.url },
    ]),
  ]);

  return (
    <div className="py-12">
      <JsonLd graph={jsonLd} />
      <div className="2xl:grid 2xl:grid-cols-[minmax(0,1fr)_200px] 2xl:gap-12">
        <article className="mx-auto max-w-[720px] min-w-0">
          <nav
            aria-label="Breadcrumb"
            className="text-muted flex flex-wrap gap-2 font-mono text-[11.5px]"
          >
            <Link href="/learn/aeo-canon" className="hover:text-accent">
              The AEO Canon
            </Link>
            <span className="text-faint">/</span>
            <span className="text-ink">{pillar.title}</span>
          </nav>

          <header className="mt-4">
            {canon ? (
              <div
                className="flex items-center gap-2.5 font-mono text-[11px] tracking-[0.1em] uppercase"
                style={{ color }}
              >
                <span className="font-serif text-[13px]">
                  Pillar {String(canon.n).padStart(2, "0")}
                </span>
                · {canon.layer}
                {layer ? (
                  <span className="text-muted tracking-normal normal-case italic">
                    · {layer.question}
                  </span>
                ) : null}
              </div>
            ) : null}
            <h1 className="mt-3 text-[clamp(30px,4.4vw,46px)] leading-[1.06] font-medium tracking-[-0.02em]">
              {pillar.title}
            </h1>
            {/* Canonical statement dek */}
            {canon ? (
              <p
                className="mt-4 border-l-[3px] py-1 pl-5 font-serif text-[22px] leading-snug italic"
                style={{ borderColor: color }}
              >
                {canon.principle}
              </p>
            ) : null}
            <p className="text-ink-2 mt-4 max-w-[58ch] text-[16px] leading-relaxed">
              {pillar.summary}
            </p>
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
              <time dateTime={pillar.published}>
                {formatDate(pillar.published)}
              </time>
              <span>{pillar.metadata.readingTime} min read</span>
            </div>
          </header>

          <div className="prose mt-8">
            <MDXContent code={pillar.body} />
          </div>

          {pillar.faqs && pillar.faqs.length > 0 ? (
            <FAQBlock items={pillar.faqs} />
          ) : null}

          {updatedDiffers ? (
            <p className="text-muted mt-10 font-mono text-[11.5px]">
              Last updated{" "}
              <time dateTime={pillar.updated}>
                {formatDate(pillar.updated)}
              </time>
              .
            </p>
          ) : null}

          {/* pillar prev/next within the Canon */}
          <nav
            aria-label="Pillars"
            className="border-line mt-12 grid gap-3 border-t pt-8 sm:grid-cols-2"
          >
            {prev ? (
              <Link
                href={`/pillars/${prev.title.toLowerCase()}`}
                className="border-line hover:border-accent rounded-xl border p-4 no-underline"
              >
                <span className="text-muted font-mono text-[10.5px] tracking-[0.08em] uppercase">
                  ← Pillar {prev.n}
                </span>
                <span className="text-ink mt-1 block font-medium">
                  {prev.title}
                </span>
              </Link>
            ) : (
              <Link
                href="/learn/aeo-canon"
                className="border-line hover:border-accent rounded-xl border p-4 no-underline"
              >
                <span className="text-muted font-mono text-[10.5px] tracking-[0.08em] uppercase">
                  ← The framework
                </span>
                <span className="text-ink mt-1 block font-medium">
                  The AEO Canon
                </span>
              </Link>
            )}
            {next ? (
              <Link
                href={`/pillars/${next.title.toLowerCase()}`}
                className="border-line hover:border-accent rounded-xl border p-4 text-right no-underline"
              >
                <span className="text-muted font-mono text-[10.5px] tracking-[0.08em] uppercase">
                  Pillar {next.n} →
                </span>
                <span className="text-ink mt-1 block font-medium">
                  {next.title}
                </span>
              </Link>
            ) : (
              <Link
                href="/learn/aeo-canon-diagnostic"
                className="border-accent bg-accent-soft rounded-xl border p-4 text-right no-underline"
              >
                <span className="text-accent-2 font-mono text-[10.5px] tracking-[0.08em] uppercase">
                  Run the diagnostic →
                </span>
                <span className="text-ink mt-1 block font-medium">
                  Find your first broken gate
                </span>
              </Link>
            )}
          </nav>
        </article>

        <aside className="mt-12 hidden 2xl:mt-0 2xl:block">
          <div className="sticky top-24">
            <TableOfContents toc={pillar.toc} />
          </div>
        </aside>
      </div>
    </div>
  );
}
