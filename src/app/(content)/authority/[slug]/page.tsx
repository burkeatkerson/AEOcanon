import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { MDXContent } from "@/components/mdx";
import { FAQBlock } from "@/components/mdx/faq-block";
import { TableOfContents } from "@/components/library/reading/table-of-contents";
import { JsonLd } from "@/components/seo/json-ld";
import { getAllPlaybooks, getPlaybook, getAuthor } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import {
  breadcrumbNode,
  faqNode,
  graph,
  personNode,
  researchArticleNode,
} from "@/lib/structured-data";

export function generateStaticParams() {
  return getAllPlaybooks().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const playbook = getPlaybook(slug);
  if (!playbook) return {};
  const author = getAuthor(playbook.author);
  return buildMetadata({
    title: playbook.title,
    description: playbook.summary,
    path: playbook.url,
    type: "article",
    publishedTime: playbook.published,
    modifiedTime: playbook.updated,
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

export default async function PlaybookPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const playbook = getPlaybook(slug);
  if (!playbook) notFound();

  const author = getAuthor(playbook.author);
  const updatedDiffers = playbook.updated !== playbook.published;

  const jsonLd = graph([
    researchArticleNode({
      headline: playbook.title,
      description: playbook.summary,
      path: playbook.url,
      datePublished: playbook.published,
      dateModified: playbook.updated,
      authorUrl: author?.url,
      keywords: [
        "answer engine optimization",
        "off-site authority",
        ...(playbook.platform ? [playbook.platform] : []),
      ],
    }),
    ...(playbook.faqs && playbook.faqs.length > 0
      ? [faqNode(playbook.url, playbook.faqs)]
      : []),
    ...(author ? [personNode(author)] : []),
    breadcrumbNode([
      { name: "Authority Playbooks", path: "/authority" },
      { name: playbook.title, path: playbook.url },
    ]),
  ]);

  return (
    <Container className="py-12">
      <JsonLd graph={jsonLd} />
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_200px] lg:gap-12">
        <article className="mx-auto max-w-[720px] min-w-0">
          <nav
            aria-label="Breadcrumb"
            className="text-muted flex flex-wrap gap-2 font-mono text-[11.5px]"
          >
            <Link href="/authority" className="hover:text-accent">
              Authority Playbooks
            </Link>
            <span className="text-faint">/</span>
            <span className="text-ink">{playbook.title}</span>
          </nav>

          <header className="mt-4">
            {playbook.platform ? (
              <span className="text-accent font-mono text-[11px] tracking-[0.1em] uppercase">
                {playbook.platform}
              </span>
            ) : null}
            <h1 className="mt-3 max-w-[24ch] text-[clamp(30px,4.4vw,46px)] leading-[1.06] font-medium tracking-[-0.02em]">
              {playbook.title}
            </h1>
            <p className="text-ink-2 mt-4 max-w-[58ch] font-serif text-[20px] leading-normal">
              {playbook.summary}
            </p>
            <div className="border-line text-muted mt-6 flex flex-wrap items-center gap-4 border-t pt-5 font-mono text-[11.5px]">
              {author ? (
                <span className="flex items-center gap-2.5">
                  <span className="bg-accent-soft border-line-2 text-accent grid size-10 place-items-center rounded-full border font-serif italic">
                    {author.name.charAt(0)}
                  </span>
                  <Link href={author.url} className="hover:text-accent">
                    <b className="text-ink">{author.name}</b>
                  </Link>
                </span>
              ) : null}
              <time dateTime={playbook.published}>
                {formatDate(playbook.published)}
              </time>
              <span>{playbook.metadata.readingTime} min read</span>
            </div>
          </header>

          <div className="prose mt-8">
            <MDXContent code={playbook.body} />
          </div>

          {playbook.faqs && playbook.faqs.length > 0 ? (
            <FAQBlock items={playbook.faqs} />
          ) : null}

          {updatedDiffers ? (
            <p className="text-muted mt-10 font-mono text-[11.5px]">
              Last updated{" "}
              <time dateTime={playbook.updated}>
                {formatDate(playbook.updated)}
              </time>
              .
            </p>
          ) : null}

          <section className="border-line mt-12 border-t pt-8">
            <h2 className="text-muted font-mono text-[11px] tracking-[0.1em] uppercase">
              Part of
            </h2>
            <p className="text-ink-2 mt-3 text-[15px]">
              The{" "}
              <Link href="/authority" className="text-accent">
                Off-Site &amp; Authority Playbooks
              </Link>
              , built on the{" "}
              <Link href="/learn/aeo-pillar-authority" className="text-accent">
                Authority pillar
              </Link>{" "}
              of <Link href="/learn/aeo-canon" className="text-accent">The AEO Canon</Link>.
            </p>
          </section>
        </article>

        <aside className="mt-12 hidden lg:mt-0 lg:block">
          <div className="sticky top-24">
            <TableOfContents toc={playbook.toc} />
          </div>
        </aside>
      </div>
    </Container>
  );
}
