import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { MDXContent } from "@/components/mdx";
import { ArticleCard } from "@/components/library/cards/article-card";
import { TabGroup, type TabDef } from "@/components/library/tab-group";
import { JsonLd } from "@/components/seo/json-ld";
import {
  getAllVerticals,
  getVertical,
  getArticlesByVertical,
} from "@/lib/content";
import { findVertical } from "@/lib/industries";
import { buildMetadata } from "@/lib/seo";
import {
  breadcrumbNode,
  collectionPageNodes,
  graph,
} from "@/lib/structured-data";

export function generateStaticParams() {
  return getAllVerticals().map((vertical) => ({ slug: vertical.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const vertical = getVertical(slug);
  if (!vertical) return {};
  return buildMetadata({
    title: vertical.title,
    description: vertical.summary,
    path: vertical.url,
  });
}

const RESOURCE_BLURB: Record<string, string> = {
  teardowns:
    "Real before/after case studies of businesses in this trade going from invisible to cited — anonymized and fully instrumented.",
  qmap: "The actual questions your customers ask AI in this category, mapped to the page that should own each answer.",
  templates:
    "Answer-shaped page templates and copy-paste structured-data blocks tuned for this trade.",
};

function ComingSoon({ what }: { what: string }) {
  return (
    <div className="border-line bg-paper rounded-2xl border border-dashed p-8 text-center">
      <p className="text-ink-2 mx-auto max-w-[52ch] text-[15px] leading-relaxed">
        {what}
      </p>
      <p className="text-muted mt-3 font-mono text-[11px] tracking-[0.08em] uppercase">
        In production — more landing soon
      </p>
    </div>
  );
}

export default async function IndustryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const vertical = getVertical(slug);
  if (!vertical) notFound();

  const entry = findVertical(slug);
  const family = entry?.family;
  const articles = getArticlesByVertical(slug);
  const color = family?.color ?? "var(--accent)";

  const jsonLd = graph([
    ...collectionPageNodes(vertical),
    breadcrumbNode([
      { name: "Industries", path: "/industries" },
      { name: vertical.title, path: vertical.url },
    ]),
  ]);

  const guidesPane = (
    <div>
      <Link
        href="/pricing"
        className="mb-7 flex flex-wrap items-center justify-between gap-5 rounded-2xl border px-6 py-4 no-underline transition-transform hover:-translate-y-[1px]"
        style={{
          borderColor: color,
          background: `color-mix(in oklab, ${color} 7%, var(--panel))`,
        }}
      >
        <span className="text-ink-2 max-w-[64ch] text-[14.5px] leading-snug">
          <b className="text-ink">
            Right now, AI hands many of these searches to a competitor.
          </b>{" "}
          We rebuild your site and run the content that fixes it — done for you.
        </span>
        <span
          className="font-mono text-[12px] font-medium whitespace-nowrap"
          style={{ color }}
        >
          See how we fix it →
        </span>
      </Link>

      <div className="prose mb-10 max-w-[720px]">
        <MDXContent code={vertical.body} />
      </div>

      <h2 className="text-[24px] font-medium tracking-tight">Start here</h2>
      {articles.length > 0 ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, i) => (
            <ArticleCard key={article.slug} article={article} index={i} />
          ))}
        </div>
      ) : (
        <p className="text-muted mt-4 text-sm">
          Guides for this industry are being written.
        </p>
      )}
    </div>
  );

  const tabs: TabDef[] = [
    {
      id: "guides",
      label: "Guides",
      count: articles.length,
      content: guidesPane,
    },
    {
      id: "teardowns",
      label: "Teardowns",
      content: <ComingSoon what={RESOURCE_BLURB.teardowns!} />,
    },
    {
      id: "qmap",
      label: "Query Map",
      content: <ComingSoon what={RESOURCE_BLURB.qmap!} />,
    },
    {
      id: "templates",
      label: "Templates",
      content: <ComingSoon what={RESOURCE_BLURB.templates!} />,
    },
  ];

  return (
    <Container className="py-12 pb-20">
      <JsonLd graph={jsonLd} />
      <nav
        aria-label="Breadcrumb"
        className="text-muted flex flex-wrap gap-2 font-mono text-[11.5px]"
      >
        <Link href="/industries" className="hover:text-accent">
          Industries
        </Link>
        {family ? (
          <>
            <span className="text-faint">/</span>
            <Link
              href={`/industries#${family.id}`}
              className="hover:text-accent"
            >
              {family.name}
            </Link>
          </>
        ) : null}
        <span className="text-faint">/</span>
        <span className="text-ink">{vertical.title}</span>
      </nav>

      <header className="mt-4 flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-3xl">
          {family ? (
            <span
              className="font-mono text-[11px] tracking-[0.1em] uppercase"
              style={{ color }}
            >
              {family.name}
            </span>
          ) : null}
          <h1 className="mt-2 text-[clamp(30px,4.4vw,46px)] leading-[1.06] font-medium tracking-[-0.02em]">
            {vertical.title}
          </h1>
          <p className="text-ink-2 mt-4 font-serif text-[20px] leading-normal">
            {vertical.summary}
          </p>
        </div>
        <div className="border-line flex gap-6 rounded-2xl border px-6 py-4">
          <div>
            <div
              className="font-serif text-[34px] leading-none"
              style={{ color }}
            >
              {articles.length}
            </div>
            <div className="text-muted mt-1 font-mono text-[10px] tracking-[0.06em] uppercase">
              Guides
            </div>
          </div>
        </div>
      </header>

      <div className="mt-8">
        <TabGroup tabs={tabs} />
      </div>
    </Container>
  );
}
