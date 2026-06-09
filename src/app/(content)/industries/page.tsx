import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Kicker } from "@/components/ui/eyebrow";
import { FAMILIES } from "@/lib/industries";
import { getAllVerticals, getArticlesByVertical } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Industries — AEO content libraries by trade",
  description:
    "The Canon, spoken in your trade's language. A self-contained AEO library for each industry — guides, teardowns, query maps, and templates tuned to how your customers actually ask.",
  path: "/industries",
});

const HOW = [
  {
    n: "01",
    t: "Niche guides",
    d: "Step-by-step playbooks for your trade — emergency intent, seasonality, service areas.",
  },
  {
    n: "02",
    t: "Teardowns",
    d: "Real before/after case studies of businesses like yours going from invisible to cited.",
  },
  {
    n: "03",
    t: "Query maps",
    d: "The actual questions your customers ask AI — mapped to the pages that answer them.",
  },
  {
    n: "04",
    t: "Copy & schema templates",
    d: "Answer-shaped page templates and structured-data blocks you can lift and adapt.",
  },
];

export default function IndustriesIndexPage() {
  const liveSlugs = new Set(getAllVerticals().map((v) => v.slug));

  return (
    <Container className="py-12 pb-20">
      {/* hero */}
      <header className="max-w-4xl">
        <Kicker>Industries</Kicker>
        <h1 className="mt-4 text-[clamp(32px,4.8vw,56px)] leading-[1.04] font-medium tracking-[-0.02em]">
          The Canon,{" "}
          <em className="text-accent [font-style:italic]">
            spoken in your trade&rsquo;s language.
          </em>
        </h1>
        <p className="text-ink-2 mt-5 max-w-[64ch] text-[18px] leading-relaxed">
          Every industry library is a self-contained set for one kind of
          business — the guides, real teardowns, query maps, and copy templates
          that actually move AI visibility in <em>your</em> world.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {FAMILIES.map((f) => (
            <a
              key={f.id}
              href={`#${f.id}`}
              className="border-line-2 bg-panel text-ink-2 hover:border-accent hover:text-accent rounded-full border px-3 py-1.5 font-mono text-[11.5px]"
            >
              {f.name.replace(/ Services$| &.*/, "")}
            </a>
          ))}
        </div>
      </header>

      {/* what lives in every industry library */}
      <section className="mt-12">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="text-[26px] font-medium tracking-tight">
            What lives in every industry library
          </h2>
          <span className="text-accent font-mono text-[11px] tracking-[0.1em] uppercase">
            Content first — not a pitch
          </span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {HOW.map((h) => (
            <div
              key={h.n}
              className="border-line bg-panel rounded-2xl border p-6"
            >
              <div className="text-accent font-serif text-[30px] leading-none">
                {h.n}
              </div>
              <h3 className="mt-2.5 text-[16px] font-medium">{h.t}</h3>
              <p className="text-muted mt-1.5 text-[13px] leading-relaxed">
                {h.d}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* families */}
      {FAMILIES.map((family) => {
        const totalLive = family.verticals.filter((v) =>
          liveSlugs.has(v.slug),
        ).length;
        return (
          <section
            key={family.id}
            id={family.id}
            className="border-line mt-10 scroll-mt-24 border-t pt-10"
          >
            <div className="mb-6 flex flex-wrap items-baseline gap-4">
              <span
                className="font-mono text-[12px]"
                style={{ color: family.color }}
              >
                {family.letter}
              </span>
              <h2 className="text-[26px] font-medium tracking-tight">
                {family.name}
              </h2>
              <span className="text-muted ml-auto font-mono text-[11px]">
                <b className="text-ink">{family.verticals.length}</b> verticals
                · <b className="text-ink">{totalLive}</b> live
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {family.verticals.map((v) => {
                const isLive = liveSlugs.has(v.slug);
                const count = isLive ? getArticlesByVertical(v.slug).length : 0;
                const inner = (
                  <>
                    <span className="font-serif text-[17px] leading-tight">
                      {v.name}
                    </span>
                    <span className="text-muted flex gap-2.5 font-mono text-[10.5px]">
                      {isLive ? (
                        <>
                          <span style={{ color: family.color }}>● Live</span>
                          <span>
                            {count} {count === 1 ? "article" : "articles"}
                          </span>
                        </>
                      ) : (
                        <span>Coming soon</span>
                      )}
                    </span>
                  </>
                );
                const base =
                  "flex flex-col gap-1.5 rounded-xl border border-line bg-paper p-4 border-l-[3px]";
                return isLive ? (
                  <Link
                    key={v.slug}
                    href={`/industries/${v.slug}`}
                    className={`${base} text-ink transition-transform hover:-translate-y-[2px]`}
                    style={{ borderLeftColor: family.color }}
                  >
                    {inner}
                  </Link>
                ) : (
                  <div
                    key={v.slug}
                    className={`${base} opacity-60`}
                    style={{ borderLeftColor: family.color }}
                  >
                    {inner}
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}

      <div className="border-line-2 bg-paper mt-12 flex flex-wrap items-center justify-between gap-4 rounded-2xl border px-7 py-6">
        <div>
          <h2 className="text-[20px] font-medium">
            Don&rsquo;t see your trade?
          </h2>
          <p className="text-ink-2 max-w-[60ch] text-[14px]">
            The core Canon applies to any local or small business. Run the
            analyzer and we&rsquo;ll point you to the closest industry library.
          </p>
        </div>
        <Button href="/audit" variant="ghost">
          Run the analyzer →
        </Button>
      </div>
    </Container>
  );
}
