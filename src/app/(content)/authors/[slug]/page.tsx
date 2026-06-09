import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { MDXContent } from "@/components/mdx";
import { ArticleCard } from "@/components/library/cards/article-card";
import { JsonLd } from "@/components/seo/json-ld";
import { getAllAuthors, getAuthor, getArticlesByAuthor } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbNode, graph, personNode } from "@/lib/structured-data";

export function generateStaticParams() {
  return getAllAuthors().map((author) => ({ slug: author.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const author = getAuthor(slug);
  if (!author) return {};
  return buildMetadata({
    title: author.name,
    description: author.bio,
    path: author.url,
    type: "profile",
  });
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const author = getAuthor(slug);
  if (!author) notFound();

  const articles = getArticlesByAuthor(author.slug);
  const jsonLd = graph([
    personNode(author),
    breadcrumbNode([
      { name: "AEO School", path: "/learn" },
      { name: author.name, path: author.url },
    ]),
  ]);

  return (
    <Container className="py-12">
      <JsonLd graph={jsonLd} />
      <header className="max-w-3xl">
        <div className="flex items-center gap-4">
          <span className="bg-accent-soft border-line-2 text-accent grid size-16 place-items-center rounded-full border font-serif text-2xl italic">
            {author.name.charAt(0)}
          </span>
          <div>
            <h1 className="text-[clamp(28px,4vw,40px)] leading-tight font-medium tracking-[-0.02em]">
              {author.name}
            </h1>
            {author.role ? (
              <p className="text-muted mt-1 font-mono text-[12px]">
                {author.role}
              </p>
            ) : null}
          </div>
        </div>
        <p className="mt-5 font-serif text-[19px] leading-normal">
          {author.bio}
        </p>

        {author.credentials.length > 0 ? (
          <ul className="text-muted mt-4 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11.5px]">
            {author.credentials.map((credential) => (
              <li key={credential} className="flex items-center gap-1.5">
                <span aria-hidden="true" className="text-accent">
                  ✓
                </span>
                {credential}
              </li>
            ))}
          </ul>
        ) : null}

        {author.links.length > 0 ? (
          <div className="mt-5 flex flex-wrap gap-3 text-sm">
            {author.links.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer me"
                className="border-line-2 hover:border-accent hover:text-accent rounded-md border px-3 py-1.5 font-mono text-[12px]"
              >
                {link.label}
              </a>
            ))}
          </div>
        ) : null}
      </header>

      {author.body ? (
        <div className="border-line prose mt-8 max-w-[720px] border-t pt-8">
          <MDXContent code={author.body} />
        </div>
      ) : null}

      <section className="mt-12" aria-labelledby="author-articles">
        <h2
          id="author-articles"
          className="text-[28px] font-medium tracking-tight"
        >
          Articles by {author.name}
        </h2>
        {articles.length > 0 ? (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, i) => (
              <ArticleCard key={article.slug} article={article} index={i} />
            ))}
          </div>
        ) : (
          <p className="text-muted mt-4 text-sm">No articles published yet.</p>
        )}
      </section>

      <p className="mt-12">
        <Link
          href="/learn"
          className="text-muted hover:text-accent font-mono text-[12px]"
        >
          ← Back to the AEO School
        </Link>
      </p>
    </Container>
  );
}
