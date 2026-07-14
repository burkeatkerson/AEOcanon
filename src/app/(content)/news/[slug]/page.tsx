import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXContent } from "@/components/mdx";
import { FAQBlock } from "@/components/mdx/faq-block";
import { TableOfContents } from "@/components/library/reading/table-of-contents";
import { JsonLd } from "@/components/seo/json-ld";
import { getAllNews, getNews, getAuthor, getLatestNews } from "@/lib/content";
import { newsCategoryLabel } from "@/lib/taxonomy";
import { buildMetadata } from "@/lib/seo";
import {
  breadcrumbNode,
  faqNode,
  graph,
  newsArticleNode,
  personNode,
} from "@/lib/structured-data";

export function generateStaticParams() {
  return getAllNews().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getNews(slug);
  if (!post) return {};
  const author = getAuthor(post.author);
  return buildMetadata({
    title: post.title,
    description: post.summary,
    path: post.url,
    eyebrow: post.prediction ? "Prediction" : newsCategoryLabel(post.category),
    type: "article",
    publishedTime: post.published,
    modifiedTime: post.updated,
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

export default async function NewsPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getNews(slug);
  if (!post) notFound();

  const author = getAuthor(post.author);
  const updatedDiffers = post.updated !== post.published;
  const more = getLatestNews(4).filter((n) => n.slug !== post.slug).slice(0, 3);

  const jsonLd = graph([
    newsArticleNode({
      headline: post.title,
      description: post.summary,
      path: post.url,
      datePublished: post.published,
      dateModified: post.updated,
      authorUrl: author?.url,
      keywords: ["AEO", "answer engine optimization", "AI search"],
    }),
    ...(post.faqs && post.faqs.length > 0 ? [faqNode(post.url, post.faqs)] : []),
    ...(author ? [personNode(author)] : []),
    breadcrumbNode([
      { name: "News", path: "/news" },
      { name: post.title, path: post.url },
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
            <Link href="/news" className="hover:text-accent">
              News &amp; updates
            </Link>
            <span className="text-faint">/</span>
            <span className="text-ink">{newsCategoryLabel(post.category)}</span>
          </nav>

          <header className="mt-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-accent font-mono text-[11px] tracking-[0.1em] uppercase">
                {newsCategoryLabel(post.category)}
              </span>
              {post.prediction ? (
                <span className="border-line-2 text-muted rounded-full border px-2.5 py-0.5 font-mono text-[10px] tracking-[0.08em] uppercase">
                  Prediction
                </span>
              ) : null}
            </div>
            <h1 className="mt-3 text-[clamp(28px,4.2vw,44px)] leading-[1.07] font-medium tracking-[-0.02em]">
              {post.title}
            </h1>
            <p className="text-ink-2 mt-4 max-w-[60ch] font-serif text-[19px] leading-normal">
              {post.summary}
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
              <time dateTime={post.published}>{formatDate(post.published)}</time>
              <span>{post.metadata.readingTime} min read</span>
            </div>
          </header>

          <div className="prose mt-8">
            <MDXContent code={post.body} />
          </div>

          {post.faqs && post.faqs.length > 0 ? (
            <FAQBlock items={post.faqs} />
          ) : null}

          {post.sources.length > 0 ? (
            <section className="border-line mt-10 border-t pt-6">
              <h2 className="text-muted mb-3 font-mono text-[11px] tracking-[0.1em] uppercase">
                Sources
              </h2>
              <ul className="flex flex-col gap-2">
                {post.sources.map((source) => (
                  <li key={source.url} className="text-[14px] leading-snug">
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-ink-2 hover:text-accent underline-offset-2 hover:underline"
                    >
                      {source.label}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {updatedDiffers ? (
            <p className="text-muted mt-8 font-mono text-[11.5px]">
              Last updated{" "}
              <time dateTime={post.updated}>{formatDate(post.updated)}</time>.
            </p>
          ) : null}

          <p className="mt-10">
            <Link
              href="/news"
              className="text-muted hover:text-accent font-mono text-[12px]"
            >
              ← All news &amp; updates
            </Link>
          </p>

          {more.length > 0 ? (
            <section className="border-line mt-12 border-t pt-8">
              <h2 className="text-[20px] font-medium tracking-tight">
                More updates
              </h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                {more.map((n) => (
                  <Link
                    key={n.slug}
                    href={n.url}
                    className="border-line hover:border-accent bg-paper text-ink flex flex-col gap-2 rounded-2xl border p-5 no-underline transition-transform hover:-translate-y-[2px]"
                  >
                    <span className="text-accent font-mono text-[10px] tracking-[0.08em] uppercase">
                      {newsCategoryLabel(n.category)}
                    </span>
                    <span className="text-[15px] leading-snug font-medium">
                      {n.title}
                    </span>
                    <time
                      dateTime={n.published}
                      className="text-muted font-mono text-[10.5px]"
                    >
                      {formatDate(n.published)}
                    </time>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </article>

        <aside className="mt-12 hidden 2xl:mt-0 2xl:block">
          <div className="sticky top-24">
            <TableOfContents toc={post.toc} />
          </div>
        </aside>
      </div>
    </div>
  );
}
