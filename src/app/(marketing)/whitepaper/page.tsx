import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Kicker } from "@/components/ui/eyebrow";
import { JsonLd } from "@/components/seo/json-ld";
import { getAuthor } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import {
  breadcrumbNode,
  graph,
  personNode,
  researchArticleNode,
} from "@/lib/structured-data";

const WHITEPAPER_PATH = "/whitepaper";
const WHITEPAPER_HEADLINE =
  "The AEO Canon: eight principles for earning AI citation";
const WHITEPAPER_DESCRIPTION =
  "Eight evidence-grounded principles for Answer Engine Optimization, in three layers — Foundation, Reputation, Momentum — built on controlled experiments and large-scale studies.";
const WHITEPAPER_PUBLISHED = "2026-01-20";
const WHITEPAPER_UPDATED = "2026-07-07";
const WHITEPAPER_KEYWORDS = [
  "answer engine optimization",
  "AEO",
  "AI search",
  "generative engine optimization",
  "AEO framework",
];

export const metadata: Metadata = buildMetadata({
  title: "The AEO Canon — Research Whitepaper",
  description: WHITEPAPER_DESCRIPTION,
  path: WHITEPAPER_PATH,
  eyebrow: "Research Whitepaper",
  type: "article",
  publishedTime: WHITEPAPER_PUBLISHED,
  modifiedTime: WHITEPAPER_UPDATED,
  authors: ["Burke Atkerson"],
});

const SECTIONS = [
  { id: "shift", n: "1", t: "The paradigm shifted" },
  { id: "method", n: "2", t: "Research & methodology" },
  { id: "relationship", n: "3", t: "AEO and SEO" },
  { id: "framework", n: "4", t: "The framework" },
  { id: "foundation", n: "5", t: "Foundation" },
  { id: "reputation", n: "6", t: "Reputation" },
  { id: "momentum", n: "7", t: "Momentum" },
  { id: "debunks", n: "8", t: "What the evidence debunks" },
  { id: "measuring", n: "9", t: "Measuring AEO" },
  { id: "conclusion", n: "10", t: "Conclusion" },
];

export default function WhitepaperPage() {
  const author = getAuthor("burke-atkerson");
  const jsonLd = graph([
    researchArticleNode({
      headline: WHITEPAPER_HEADLINE,
      description: WHITEPAPER_DESCRIPTION,
      path: WHITEPAPER_PATH,
      datePublished: WHITEPAPER_PUBLISHED,
      dateModified: WHITEPAPER_UPDATED,
      authorUrl: author?.url,
      keywords: WHITEPAPER_KEYWORDS,
    }),
    ...(author ? [personNode(author)] : []),
    breadcrumbNode([{ name: "Whitepaper", path: WHITEPAPER_PATH }]),
  ]);

  return (
    <Container className="py-12 pb-20">
      <JsonLd graph={jsonLd} />
      <header className="border-line max-w-[760px] border-b pb-8">
        <Kicker>Research whitepaper · v1.0 · 2026</Kicker>
        <h1 className="mt-4 text-[clamp(30px,4.4vw,48px)] leading-[1.06] font-medium tracking-[-0.02em]">
          {WHITEPAPER_HEADLINE}
        </h1>
        {author ? (
          <p className="text-muted mt-5 font-mono text-[11.5px]">
            By{" "}
            <Link href={author.url} className="text-ink hover:text-accent">
              <b>{author.name}</b>
            </Link>
            {author.role ? `, ${author.role}` : null}
          </p>
        ) : null}
      </header>

      <div className="mt-10 lg:grid lg:grid-cols-[200px_minmax(0,760px)] lg:gap-12">
        {/* TOC */}
        <aside className="mb-8 hidden lg:mb-0 lg:block">
          <div className="sticky top-24">
            <h2 className="text-faint mb-3 font-mono text-[10px] tracking-[0.12em] uppercase">
              Contents
            </h2>
            <ul className="flex flex-col">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="border-line text-muted hover:text-accent hover:border-accent block border-l-2 py-1.5 pl-3 font-mono text-[11.5px]"
                  >
                    <span className="text-faint mr-2">{s.n}</span>
                    {s.t}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <article className="prose">
          <div className="border-line-2 bg-paper not-prose mb-8 rounded-xl border p-6">
            <span className="text-muted font-mono text-[10px] tracking-[0.12em] uppercase">
              Abstract
            </span>
            <p className="text-ink-2 mt-2 text-[15px] leading-relaxed">
              Answer Engine Optimization (AEO) is the discipline of making
              content discoverable, trustworthy, and citable by AI answer
              engines. This paper presents the AEO Canon: eight
              evidence-grounded principles in three layers — Foundation,
              Reputation, Momentum. The central finding: AI citation is governed
              by the same broad forces as search quality plus a distinct
              extraction layer. Tactics widely promoted as essentials — schema
              markup, <code>llms.txt</code>, keyword optimization — show little
              to no causal effect in controlled testing. The durable advantages
              are genuine authority, verifiable credibility, and original
              contribution.
            </p>
          </div>

          <h2 id="shift">1 · The search paradigm has shifted</h2>
          <p>
            For three decades the defining question was{" "}
            <em>can users find you in search results?</em> The answer was a
            click. That question has been superseded by another:{" "}
            <em>does the AI cite you when it answers?</em> The user receives an
            answer, not a menu — the cited source receives the visibility, and
            every uncited source receives nothing.
          </p>
          <p>
            Seer Interactive documented organic click-through falling 61% when
            an AI Overview appears; Ahrefs found cited brands saw 35% more
            organic and 91% more paid clicks. The penalty for absence is real;
            the reward for citation compounds. Only 38% of pages cited in AI
            Overviews still rank in Google&rsquo;s organic top ten — down from
            76% seven months earlier.
          </p>

          <h2 id="method">2 · Research foundation &amp; methodology</h2>
          <p>
            The Canon is built on primary research, weighted by evidence
            quality. Controlled experiments are trusted over correlation:
          </p>
          <ul>
            <li>
              <strong>The Princeton GEO Study (2024)</strong> — the only
              peer-reviewed controlled experiment in the field. Nine content
              strategies across 10,000 queries.
            </li>
            <li>
              <strong>Ahrefs Brand Visibility Studies</strong> — 75,000 brands,
              plus a 1,885-page controlled schema test.
            </li>
            <li>
              <strong>SE Ranking</strong> — 129,000 domains;{" "}
              <strong>Vercel / MERJ</strong> — 500M+ GPTBot requests;{" "}
              <strong>Semrush</strong> — 100M+ citation events.
            </li>
          </ul>

          <h2 id="relationship">3 · AEO and SEO: the relationship</h2>
          <p>
            AEO does not replace SEO — it extends it. Roughly 70–80% of what
            drives citation also drives rankings. The genuine divergence is
            specific: retrieval at the <strong>passage</strong> level,{" "}
            <strong>mentions</strong> over links,{" "}
            <strong>conversational</strong> queries, aggressive{" "}
            <strong>freshness</strong> weighting, and{" "}
            <strong>per-engine</strong> divergence (~11% cross-engine overlap).
          </p>

          <h2 id="framework">4 · The Canon framework</h2>
          <p>
            Eight principles in three layers. The pillars are sequential:
            failures at earlier stages make later efforts irrelevant. Walk down
            it in order; the pillar where you break is the place to work. See{" "}
            <Link href="/canon">the interactive framework</Link>.
          </p>

          <h2 id="foundation">5 · Layer One — Foundation</h2>
          <p>
            <strong>1 Access.</strong> A page is machine-readable or it is
            invisible. Vercel/MERJ&rsquo;s analysis of 500M+ GPTBot requests
            found zero JavaScript execution — crawlers fetch raw HTML only.{" "}
            <strong>2 Alignment.</strong> Search queries were shorthand; AI
            queries are full conversations — use the question itself as the
            heading. <strong>3 Extractability.</strong> RAG systems retrieve
            passages, not pages; 44% of ChatGPT citations come from the first
            third of a page.
          </p>

          <h2 id="reputation">6 · Layer Two — Reputation</h2>
          <p>
            <strong>4 Authority.</strong> Determined off-site — branded mentions
            correlate with AI visibility at 0.664 vs 0.218 for backlinks
            (Ahrefs, 75k brands). Reddit is the most-cited domain across
            engines. <strong>5 Credibility.</strong> The Princeton GEO study
            found adding quotations raised visibility 41% — the largest single
            effect; keyword stuffing performed below baseline.{" "}
            <strong>6 Originality.</strong> Original data exists in exactly one
            place, so the engine cites that place. Your data cannot be scraped.
          </p>

          <h2 id="momentum">7 · Layer Three — Momentum</h2>
          <p>
            <strong>7 Freshness.</strong> Seer found 65% of AI crawler visits
            target content under one year old. <strong>8 Adaptability.</strong>{" "}
            Semrush documented ChatGPT&rsquo;s Reddit citation rate swinging
            from ~60% to ~10% in six weeks. Measure per engine on a fixed prompt
            set; the principles endure, the specifics are written in pencil.
          </p>

          <h2 id="debunks">8 · What the evidence debunks</h2>
          <p>
            <strong>Schema markup as a citation driver:</strong> Ahrefs&rsquo;
            1,885-page test found AI Overview citations <em>dropped</em> 4.6%
            after adding JSON-LD. Valuable for rich results — not a proven
            citation lever. <strong>llms.txt as a citation signal:</strong> only
            84 of 62,100 AI bot requests (0.1%) fetched it; no engine documents
            using it. <strong>Keyword stuffing:</strong> a 10% degradation below
            baseline.
          </p>

          <h2 id="measuring">9 · Measuring AEO performance</h2>
          <p>
            There is no Search Console for AI; citation is probabilistic and
            personalized. The reliable unit is <strong>share of voice</strong>:
            a fixed set of 20–50 representative prompts, measured per engine,
            tracked as a trend, paired with server-log crawl confirmation.
            Ahrefs found AI-referred visitors converted at ~23× the rate of
            organic.
          </p>

          <h2 id="conclusion">10 · Conclusion</h2>
          <p>
            The durable way to earn AI citation is to deserve it. Machines
            designed to find the clearest, most specific, best-evidenced,
            most-trusted source will, over time, find the sources that are
            genuinely those things. The eight pillars are not tactics — they are
            a description of what a genuinely excellent, trustworthy, original
            source looks like in the age of AI.
          </p>
          <p className="text-center font-serif text-[20px] italic">
            The principles endure. The specifics are written in pencil.
          </p>

          <hr />
          <p className="text-muted not-prose font-mono text-[11.5px]">
            aeocanon.com — Version 1.0 · 2026. The AEO Canon is a living
            framework; principles are updated as new evidence emerges. Sources
            include the Princeton GEO study (KDD 2024), Ahrefs (75k brands), SE
            Ranking, Vercel/MERJ, Semrush, Profound, and Seer Interactive.
          </p>
        </article>
      </div>
    </Container>
  );
}
