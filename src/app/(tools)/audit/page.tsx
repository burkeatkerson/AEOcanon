import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { Kicker } from "@/components/ui/eyebrow";
import { AuditTeaser } from "@/components/tools/audit-teaser";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Free AI Visibility Analyzer",
  description:
    "See how visible your site is to AI answer engines and search — on-page SEO, AI-readiness, structured data, and Core Web Vitals. Launching soon.",
  path: "/audit",
});

const CHECKS = [
  {
    c: "var(--c5)",
    t: "On-page SEO",
    d: "Title, meta, headings, canonical, robots, sitemap.",
  },
  {
    c: "var(--c3)",
    t: "AI-readiness",
    d: "Structured data, llms.txt, whether AI crawlers are allowed.",
  },
  {
    c: "var(--c4)",
    t: "Render & content",
    d: "Whether key content needs JavaScript; platform detected.",
  },
  {
    c: "var(--c2)",
    t: "Performance",
    d: "Core Web Vitals via Google PageSpeed Insights.",
  },
];

export default function AuditPage() {
  return (
    <>
      <header className="py-16 sm:py-20">
        <Container className="text-center">
          <Kicker>Free AI visibility analyzer</Kicker>
          <h1 className="mx-auto mt-4 max-w-[18ch] text-[clamp(34px,5.4vw,58px)] leading-[1.02] font-medium tracking-[-0.025em]">
            See where AI puts you{" "}
            <em className="text-accent [font-style:italic]">today.</em>
          </h1>
          <p className="text-ink-2 mx-auto mt-5 max-w-[52ch] text-[18px] leading-relaxed">
            Enter your site and we&rsquo;ll score how findable, readable, and
            citable it is for ChatGPT, Claude, Perplexity, Gemini, and Google AI
            Overviews — and exactly what to fix first.
          </p>
          <div className="mt-8">
            <AuditTeaser />
          </div>
        </Container>
      </header>

      <Container className="pb-20">
        <div className="border-line bg-paper rounded-2xl border p-6 sm:p-9">
          <h2 className="text-muted text-center font-mono text-[11px] tracking-[0.1em] uppercase">
            What the analyzer checks
          </h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {CHECKS.map((check) => (
              <div
                key={check.t}
                className="border-line bg-panel rounded-xl border p-5"
                style={{ borderTop: `3px solid ${check.c}` }}
              >
                <h3 className="text-[16px] font-medium">{check.t}</h3>
                <p className="text-muted mt-1.5 text-[13px] leading-relaxed">
                  {check.d}
                </p>
              </div>
            ))}
          </div>
          <p className="text-faint mt-6 text-center font-mono text-[11px]">
            Every finding is tagged a quick fix or a deeper structural issue,
            then prioritized for you.
          </p>
        </div>
      </Container>
    </>
  );
}
