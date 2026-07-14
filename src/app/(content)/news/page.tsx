import type { Metadata } from "next";
import Link from "next/link";
import { Kicker } from "@/components/ui/eyebrow";
import { JsonLd } from "@/components/seo/json-ld";
import { getAllNews } from "@/lib/content";
import { newsCategoryLabel } from "@/lib/taxonomy";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbNode, graph } from "@/lib/structured-data";

export const metadata: Metadata = buildMetadata({
  title: "AEO News & Updates — AI Search, Answer Engines & GEO",
  description:
    "Timely updates on Answer Engine Optimization and AI search — platform changes at Google, ChatGPT, and Perplexity, new research and data, industry moves, policy, and predictions. Written by Burke Atkerson.",
  path: "/news",
  eyebrow: "News & Updates",
});

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function NewsIndexPage() {
  const posts = getAllNews();
  const [lead, ...rest] = posts;

  const jsonLd = graph([breadcrumbNode([{ name: "News", path: "/news" }])]);

  return (
    <div className="py-12 pb-20">
      <JsonLd graph={jsonLd} />
      <header className="max-w-3xl">
        <Kicker>News &amp; updates</Kicker>
        <h1 className="mt-4 text-[clamp(32px,4.8vw,52px)] leading-[1.04] font-medium tracking-[-0.02em]">
          What&rsquo;s changing in{" "}
          <em className="text-accent [font-style:italic]">AI search.</em>
        </h1>
        <p className="text-ink-2 mt-5 max-w-[64ch] text-[18px] leading-relaxed">
          Answer engines are moving fast — new platforms, new research, new rules.
          This is the running log of what changed and what it means for getting
          your business cited, plus a few honest predictions about where it&rsquo;s
          headed. For the timeless fundamentals, start with the{" "}
          <Link href="/learn/aeo-canon" className="text-accent">
            AEO Canon
          </Link>
          .
        </p>
      </header>

      {lead ? (
        <Link
          href={lead.url}
          className="border-line hover:border-accent bg-panel mt-10 grid gap-5 rounded-2xl border p-7 no-underline transition-transform hover:-translate-y-[2px] sm:grid-cols-[1fr_auto] sm:items-center"
        >
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-accent font-mono text-[10.5px] tracking-[0.1em] uppercase">
                {newsCategoryLabel(lead.category)}
              </span>
              {lead.prediction ? (
                <span className="border-line-2 text-muted rounded-full border px-2.5 py-0.5 font-mono text-[9.5px] tracking-[0.08em] uppercase">
                  Prediction
                </span>
              ) : null}
              <span className="text-muted font-mono text-[10.5px]">
                Latest · {formatDate(lead.published)}
              </span>
            </div>
            <h2 className="text-ink mt-2.5 font-serif text-[clamp(21px,2.6vw,27px)] leading-snug">
              {lead.title}
            </h2>
            <p className="text-ink-2 mt-2 max-w-[70ch] text-[14.5px] leading-relaxed">
              {lead.summary}
            </p>
          </div>
          <span className="text-accent font-mono text-[12px] whitespace-nowrap">
            Read →
          </span>
        </Link>
      ) : null}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((post) => (
          <Link
            key={post.slug}
            href={post.url}
            className="border-line hover:border-accent bg-paper text-ink flex flex-col gap-2.5 rounded-2xl border p-6 no-underline transition-transform hover:-translate-y-[2px]"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-accent font-mono text-[10px] tracking-[0.08em] uppercase">
                {newsCategoryLabel(post.category)}
              </span>
              {post.prediction ? (
                <span className="border-line-2 text-muted rounded-full border px-2 py-0.5 font-mono text-[9px] tracking-[0.08em] uppercase">
                  Prediction
                </span>
              ) : null}
            </div>
            <h3 className="text-[17px] leading-snug font-medium">{post.title}</h3>
            <p className="text-ink-2 flex-1 text-[13.5px] leading-relaxed">
              {post.summary}
            </p>
            <time
              dateTime={post.published}
              className="text-muted font-mono text-[10.5px]"
            >
              {formatDate(post.published)}
            </time>
          </Link>
        ))}
      </div>

      {posts.length === 0 ? (
        <p className="text-muted mt-10 text-sm">
          The first updates are being written.
        </p>
      ) : null}
    </div>
  );
}
