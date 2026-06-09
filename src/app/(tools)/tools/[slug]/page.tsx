import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { MDXContent } from "@/components/mdx";
import { Callout } from "@/components/mdx/callout";
import { ProsCons } from "@/components/mdx/pros-cons";
import { FAQBlock } from "@/components/mdx/faq-block";
import { TableOfContents } from "@/components/library/reading/table-of-contents";
import { JsonLd } from "@/components/seo/json-ld";
import { getAllTools, getTool, getAuthor } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import {
  breadcrumbNode,
  faqNode,
  graph,
  personNode,
  researchArticleNode,
  reviewNode,
} from "@/lib/structured-data";

export function generateStaticParams() {
  return getAllTools().map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = getTool(slug);
  if (!doc) return {};
  const author = getAuthor(doc.author);
  return buildMetadata({
    title: doc.title,
    description: doc.summary,
    path: doc.url,
    type: "article",
    publishedTime: doc.published,
    modifiedTime: doc.updated,
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

const TYPE_LABEL: Record<string, string> = {
  review: "Review",
  roundup: "Roundup",
  comparison: "Comparison",
  guide: "Guide",
};

export default async function ToolDocPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = getTool(slug);
  if (!doc) notFound();

  const author = getAuthor(doc.author);
  const isReview = doc.type === "review";
  const updatedDiffers = doc.updated !== doc.published;

  const jsonLd = graph([
    researchArticleNode({
      headline: doc.title,
      description: doc.summary,
      path: doc.url,
      datePublished: doc.published,
      dateModified: doc.updated,
      authorUrl: author?.url,
      keywords: ["AEO tools", "AI visibility", doc.toolName ?? "AI search"],
    }),
    ...(isReview && doc.toolName
      ? [
          reviewNode({
            toolName: doc.toolName,
            vendorUrl: doc.vendorUrl,
            category: doc.category,
            path: doc.url,
            datePublished: doc.published,
            dateModified: doc.updated,
            authorUrl: author?.url,
            verdict: doc.verdict,
          }),
        ]
      : []),
    ...(doc.faqs && doc.faqs.length > 0 ? [faqNode(doc.url, doc.faqs)] : []),
    ...(author ? [personNode(author)] : []),
    breadcrumbNode([
      { name: "Tools", path: "/tools" },
      { name: doc.title, path: doc.url },
    ]),
  ]);

  const facts: [string, React.ReactNode][] = [];
  if (doc.category) facts.push(["Category", doc.category]);
  if (doc.pricingFrom) facts.push(["Pricing from", doc.pricingFrom]);
  if (doc.bestFor) facts.push(["Best for", doc.bestFor]);
  if (doc.verified) facts.push(["Verified", doc.verified]);
  if (doc.vendorUrl)
    facts.push([
      "Website",
      <a
        key="w"
        href={doc.vendorUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-accent break-all"
      >
        {doc.vendorUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}
      </a>,
    ]);

  return (
    <Container className="py-12">
      <JsonLd graph={jsonLd} />
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_200px] lg:gap-12">
        <article className="mx-auto max-w-[760px] min-w-0">
          <nav
            aria-label="Breadcrumb"
            className="text-muted flex flex-wrap gap-2 font-mono text-[11.5px]"
          >
            <Link href="/tools" className="hover:text-accent">
              Tools
            </Link>
            <span className="text-faint">/</span>
            <span className="text-ink">{doc.title}</span>
          </nav>

          <header className="mt-4">
            <span className="text-accent font-mono text-[11px] tracking-[0.1em] uppercase">
              {TYPE_LABEL[doc.type] ?? "Tools"}
            </span>
            <h1 className="mt-3 max-w-[24ch] text-[clamp(28px,4.2vw,44px)] leading-[1.06] font-medium tracking-[-0.02em]">
              {doc.title}
            </h1>
            <p className="text-ink-2 mt-4 max-w-[60ch] font-serif text-[20px] leading-normal">
              {doc.summary}
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
              <time dateTime={doc.published}>{formatDate(doc.published)}</time>
              <span>{doc.metadata.readingTime} min read</span>
            </div>
          </header>

          {/* Verdict box (reviews) */}
          {isReview && doc.verdict ? (
            <Callout variant="key" title="Verdict">
              <p>{doc.verdict}</p>
            </Callout>
          ) : null}

          {/* Key facts (reviews) */}
          {isReview && facts.length > 0 ? (
            <dl className="border-line not-prose my-6 grid gap-px overflow-hidden rounded-2xl border sm:grid-cols-2">
              {facts.map(([term, def]) => (
                <div key={term} className="bg-panel p-4 font-sans">
                  <dt className="text-muted font-mono text-[10px] tracking-[0.1em] uppercase">
                    {term}
                  </dt>
                  <dd className="text-ink-2 mt-1 text-[14px] leading-snug">
                    {def}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}

          {/* Pros / cons (reviews) */}
          {isReview && doc.pros && doc.cons ? (
            <ProsCons pros={doc.pros} cons={doc.cons} />
          ) : null}

          <div className="prose mt-8">
            <MDXContent code={doc.body} />
          </div>

          {/* How we review — methodology + independence */}
          <Callout variant="tip" title="How we review">
            <p>
              This {doc.type} is compiled from each vendor&rsquo;s own
              documentation and current independent testing, and was last verified
              in {doc.verified ?? "2026"}; we re-check quarterly. Pricing and
              features in this space change fast — confirm current details on the
              vendor&rsquo;s site before buying. We don&rsquo;t earn affiliate
              commissions on the tools we cover, and we don&rsquo;t accept payment
              for placement.
            </p>
          </Callout>

          {doc.faqs && doc.faqs.length > 0 ? (
            <FAQBlock items={doc.faqs} />
          ) : null}

          {updatedDiffers ? (
            <p className="text-muted mt-10 font-mono text-[11.5px]">
              Last updated{" "}
              <time dateTime={doc.updated}>{formatDate(doc.updated)}</time>.
            </p>
          ) : null}

          <section className="border-line mt-12 border-t pt-8">
            <h2 className="text-muted font-mono text-[11px] tracking-[0.1em] uppercase">
              Keep exploring
            </h2>
            <ul className="mt-3 flex flex-col gap-2 text-[15px]">
              <li>
                <Link href="/tools/best-ai-visibility-tools" className="text-accent">
                  The best AI visibility tools →
                </Link>
              </li>
              <li>
                <Link href="/measure-aeo" className="text-accent">
                  How to measure your AI visibility →
                </Link>
              </li>
            </ul>
          </section>
        </article>

        <aside className="mt-12 hidden lg:mt-0 lg:block">
          <div className="sticky top-24">
            <TableOfContents toc={doc.toc} />
          </div>
        </aside>
      </div>
    </Container>
  );
}
