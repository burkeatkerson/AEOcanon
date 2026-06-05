import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/container";
import { MDXContent } from "@/components/mdx";
import { ArticleCard } from "@/components/article-card";
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
      { name: "Education Center", path: "/learn" },
      { name: author.name, path: author.url },
    ]),
  ]);

  return (
    <Container className="py-12">
      <JsonLd graph={jsonLd} />
      <header className="max-w-3xl">
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          {author.name}
        </h1>
        {author.role ? (
          <p className="text-muted-foreground mt-1 text-lg">{author.role}</p>
        ) : null}
        <p className="mt-4 text-lg leading-relaxed">{author.bio}</p>

        {author.credentials.length > 0 ? (
          <ul className="text-muted-foreground mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm">
            {author.credentials.map((credential) => (
              <li key={credential} className="flex items-center gap-1.5">
                <span aria-hidden="true" className="text-foreground">
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
                className="border-border hover:bg-muted rounded-md border px-3 py-1.5"
              >
                {link.label}
              </a>
            ))}
          </div>
        ) : null}
      </header>

      {author.body ? (
        <div className="border-border/60 mt-8 max-w-3xl border-t pt-8">
          <div className="prose">
            <MDXContent code={author.body} />
          </div>
        </div>
      ) : null}

      <section className="mt-12" aria-labelledby="author-articles">
        <h2
          id="author-articles"
          className="text-2xl font-semibold tracking-tight"
        >
          Articles by {author.name}
        </h2>
        {articles.length > 0 ? (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground mt-4 text-sm">
            No articles published yet.
          </p>
        )}
      </section>

      <p className="mt-12">
        <Link
          href="/learn"
          className="text-muted-foreground hover:text-foreground text-sm"
        >
          &larr; Back to the Education Center
        </Link>
      </p>
    </Container>
  );
}
