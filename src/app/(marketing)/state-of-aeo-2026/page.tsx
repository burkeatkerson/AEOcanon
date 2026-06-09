import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Kicker } from "@/components/ui/eyebrow";
import { JsonLd } from "@/components/seo/json-ld";
import { ResearchChart } from "@/components/research/research-chart";
import { CiteThis } from "@/components/research/cite-this";
import { getAuthor } from "@/lib/content";
import { stateOfAeo2026 as study, isPlaceholder } from "@/lib/research/state-of-aeo";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import {
  breadcrumbNode,
  datasetNode,
  graph,
  personNode,
  researchArticleNode,
} from "@/lib/structured-data";

export const metadata: Metadata = buildMetadata({
  title: "The State of AEO 2026 — Original Research Report",
  description: study.subtitle,
  path: study.canonicalPath,
  type: "article",
  publishedTime: study.published,
  modifiedTime: study.updated,
});

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const KEYWORDS = [
  "answer engine optimization",
  "AEO",
  "AI search",
  "generative engine optimization",
  "marketing survey",
];

export default function StateOfAeoPage() {
  const author = getAuthor(study.authorSlug);
  const canonical = absoluteUrl(study.canonicalPath);
  const placeholder = isPlaceholder();
  const { methodology } = study;

  const citation = `${siteConfig.name}. (${study.edition}). ${study.title}. ${canonical}`;

  const jsonLd = graph([
    researchArticleNode({
      headline: study.title,
      description: study.subtitle,
      path: study.canonicalPath,
      datePublished: study.published,
      dateModified: study.updated,
      authorUrl: author?.url,
      keywords: KEYWORDS,
    }),
    datasetNode({
      name: study.title,
      description: study.subtitle,
      path: study.canonicalPath,
      datePublished: study.published,
      dateModified: study.updated,
      license: study.license,
      temporalCoverage: `${methodology.fieldStart}/${methodology.fieldEnd}`,
      measurementTechnique: methodology.method,
      variableMeasured: study.findings.map((f) => f.question),
      keywords: KEYWORDS,
    }),
    ...(author ? [personNode(author)] : []),
    breadcrumbNode([
      { name: "AEO Canon", path: "/" },
      { name: study.title, path: study.canonicalPath },
    ]),
  ]);

  const toc = [
    { id: "executive-summary", label: "Executive summary" },
    ...study.findings.map((f) => ({ id: f.id, label: f.question })),
    { id: "methodology", label: "Methodology" },
    { id: "cite", label: "Cite this study" },
  ];

  return (
    <Container className="py-12 pb-20">
      <JsonLd graph={jsonLd} />

      {/* header */}
      <header className="border-line max-w-[760px] border-b pb-8">
        <nav
          aria-label="Breadcrumb"
          className="text-muted mb-4 flex flex-wrap gap-2 font-mono text-[11.5px]"
        >
          <Link href="/" className="hover:text-accent">
            AEO Canon
          </Link>
          <span className="text-faint">/</span>
          <span className="text-ink">{study.title}</span>
        </nav>

        <Kicker>Original research · {study.edition} edition</Kicker>
        <h1 className="mt-4 text-[clamp(32px,5vw,52px)] leading-[1.04] font-medium tracking-[-0.02em]">
          {study.title}
        </h1>
        <p className="text-ink-2 mt-4 max-w-[60ch] font-serif text-[20px] leading-normal">
          {study.subtitle}
        </p>

        <div className="border-line text-muted mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t pt-5 font-mono text-[11.5px]">
          {author ? (
            <span>
              Research by{" "}
              <Link href={author.url} className="text-ink hover:text-accent">
                <b>{author.name}</b>
              </Link>
              {author.role ? `, ${author.role}` : null}
            </span>
          ) : null}
          <span>{study.methodologyCredit}</span>
        </div>
        <div className="text-muted mt-2 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[11.5px]">
          <time dateTime={study.published}>
            Published {formatDate(study.published)}
          </time>
          {study.updated !== study.published ? (
            <time dateTime={study.updated}>
              Updated {formatDate(study.updated)}
            </time>
          ) : null}
          <span>n = {methodology.sampleSize.toLocaleString()}</span>
          <span>
            Fielded {formatDate(methodology.fieldStart)}–
            {formatDate(methodology.fieldEnd)}
          </span>
        </div>
      </header>

      <div className="mt-10 lg:grid lg:grid-cols-[200px_minmax(0,760px)] lg:gap-12">
        {/* TOC */}
        <aside className="mb-8 hidden lg:mb-0 lg:block">
          <div className="sticky top-24">
            <h2 className="text-faint mb-3 font-mono text-[10px] tracking-[0.12em] uppercase">
              Contents
            </h2>
            <ul className="flex flex-col">
              {toc.map((t) => (
                <li key={t.id}>
                  <a
                    href={`#${t.id}`}
                    className="border-line text-muted hover:text-accent hover:border-accent block border-l-2 py-1.5 pl-3 font-mono text-[11.5px] leading-snug"
                  >
                    {t.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="min-w-0">
          {/* placeholder banner */}
          {placeholder ? (
            <div
              role="note"
              className="border-warn my-6 rounded-xl border-l-[3px] bg-[color-mix(in_oklab,var(--warn)_10%,var(--panel))] px-6 py-5 font-sans"
            >
              <p className="text-warn mb-2 font-mono text-[10.5px] tracking-[0.1em] uppercase">
                Preliminary · placeholder figures
              </p>
              <p className="text-ink-2 text-[14.5px] leading-relaxed">
                {study.placeholderNote}
              </p>
            </div>
          ) : null}

          {/* executive summary */}
          <section
            id="executive-summary"
            aria-labelledby="executive-summary-h"
            className="scroll-mt-24"
          >
            <h2
              id="executive-summary-h"
              className="text-[28px] font-medium tracking-tight"
            >
              Executive summary: the top findings
            </h2>
            <p className="text-ink-2 mt-3 max-w-[62ch] text-[15px] leading-relaxed">
              The five headline findings from {study.title}, each written to stand
              on its own — and each linking to its full data below.
            </p>
            <ol className="mt-6 flex flex-col gap-4 font-sans">
              {study.executiveSummary.map((item, i) => (
                <li
                  key={item.findingId}
                  className="border-line bg-panel grid grid-cols-[40px_1fr] gap-4 rounded-2xl border p-5"
                >
                  <span className="text-accent font-serif text-[30px] leading-none">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="text-ink text-[16px] leading-snug font-medium">
                      {item.sentence}
                    </p>
                    <a
                      href={`#${item.findingId}`}
                      className="text-accent mt-2 inline-block font-mono text-[11.5px]"
                    >
                      See the data →
                    </a>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* cite (prominent, near top) */}
          <div id="cite" className="scroll-mt-24">
            <CiteThis citation={citation} url={canonical} />
          </div>

          {/* findings */}
          <div className="mt-4">
            <h2 className="text-[28px] font-medium tracking-tight">
              The findings
            </h2>
            {study.findings.map((f) => (
              <section
                key={f.id}
                id={f.id}
                aria-labelledby={`${f.id}-h`}
                className="border-line scroll-mt-24 border-t pt-8 first:border-t-0 [&:not(:first-of-type)]:mt-10"
              >
                <h3
                  id={`${f.id}-h`}
                  className="text-ink text-[22px] leading-snug font-medium"
                >
                  {f.question}
                </h3>
                <p className="text-ink mt-3 max-w-[64ch] font-serif text-[19px] leading-normal font-medium">
                  {f.stat}
                </p>
                <ResearchChart
                  data={f.chart.data}
                  unit={f.chart.unit}
                  max={f.chart.max}
                  caption={f.source ? `Source: ${study.title}, ${f.source}.` : undefined}
                  tableCaption={`${f.question} — survey results (${study.title})`}
                />
                <p className="text-ink-2 max-w-[64ch] text-[15px] leading-relaxed">
                  {f.detail}
                </p>
                <a
                  href={`#${f.id}`}
                  className="text-faint hover:text-accent mt-3 inline-block font-mono text-[11px]"
                >
                  # link to this finding
                </a>
              </section>
            ))}
          </div>

          {/* methodology */}
          <section
            id="methodology"
            aria-labelledby="methodology-h"
            className="border-line mt-12 scroll-mt-24 border-t pt-8"
          >
            <h2
              id="methodology-h"
              className="text-[28px] font-medium tracking-tight"
            >
              Methodology
            </h2>
            <p className="text-ink-2 mt-3 max-w-[64ch] text-[15px] leading-relaxed">
              {study.title} surveyed{" "}
              {methodology.sampleSize.toLocaleString()} respondents via an{" "}
              {methodology.method.toLowerCase()}. Respondents were{" "}
              {methodology.population.charAt(0).toLowerCase() +
                methodology.population.slice(1)}
            </p>
            <dl className="border-line mt-6 grid gap-px overflow-hidden rounded-2xl border sm:grid-cols-2">
              {[
                ["Sample size", `${methodology.sampleSize.toLocaleString()} respondents`],
                [
                  "Field dates",
                  `${formatDate(methodology.fieldStart)} – ${formatDate(methodology.fieldEnd)}`,
                ],
                ["Method", methodology.method],
                ["Margin of error", methodology.margin ?? "—"],
                ["Population", methodology.population],
                ["License", study.licenseLabel],
              ].map(([term, def]) => (
                <div key={term} className="bg-panel p-5">
                  <dt className="text-muted font-mono text-[10px] tracking-[0.1em] uppercase">
                    {term}
                  </dt>
                  <dd className="text-ink-2 mt-1.5 text-[14px] leading-snug">
                    {def}
                  </dd>
                </div>
              ))}
            </dl>
            {methodology.notes ? (
              <p className="text-muted mt-4 text-[13px] leading-relaxed">
                {methodology.notes}
              </p>
            ) : null}
          </section>

          {/* related */}
          <section className="border-line mt-12 border-t pt-8">
            <h2 className="text-muted font-mono text-[11px] tracking-[0.1em] uppercase">
              Keep reading
            </h2>
            <ul className="mt-4 flex flex-col gap-2 text-[15px]">
              <li>
                <Link href="/learn/what-is-aeo" className="text-accent">
                  What is Answer Engine Optimization (AEO)? →
                </Link>
              </li>
              <li>
                <Link href="/learn/aeo-canon" className="text-accent">
                  The AEO Canon: the eight pillars →
                </Link>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </Container>
  );
}
