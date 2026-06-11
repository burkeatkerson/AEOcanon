import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Kicker } from "@/components/ui/eyebrow";
import { AuditTeaser } from "@/components/tools/audit-teaser";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Tools — Free AI visibility toolkit",
  description:
    "A free toolkit to diagnose, build, and track your AI search visibility. Start with the AEO Analyzer.",
  path: "/tools",
});

const READOUT = [
  {
    eng: "ChatGPT",
    st: "Partial",
    cls: "text-warn bg-[color-mix(in_oklab,var(--warn)_16%,transparent)]",
  },
  {
    eng: "Perplexity",
    st: "Absent",
    cls: "text-bad bg-[color-mix(in_oklab,var(--bad)_13%,transparent)]",
  },
  {
    eng: "Google AI Overviews",
    st: "Absent",
    cls: "text-bad bg-[color-mix(in_oklab,var(--bad)_13%,transparent)]",
  },
  {
    eng: "Gemini",
    st: "Partial",
    cls: "text-warn bg-[color-mix(in_oklab,var(--warn)_16%,transparent)]",
  },
  {
    eng: "Claude",
    st: "Named",
    cls: "text-ok bg-[color-mix(in_oklab,var(--ok)_14%,transparent)]",
  },
];

const TOOLS = [
  {
    t: "AEO Analyzer",
    d: "Your AI-visibility score and how five engines describe you. The place to start.",
    c: "var(--c5)",
    href: "/audit",
    badge: "Live",
  },
  {
    t: "8-Pillar Scorecard",
    d: "Answer eight quick questions; get an instant grade and a playbook matched to your biggest gap.",
    c: "var(--c2)",
    href: "/scorecard",
    badge: "Live",
  },
  {
    t: "Schema Generator",
    d: "Generate clean LocalBusiness & Service structured data — copy-paste ready.",
    c: "var(--c6)",
    badge: "Soon",
  },
  {
    t: "Content Scorer",
    d: "Paste a draft or URL; get a citability score for answer-first structure, stats, and quotes.",
    c: "var(--c3)",
    badge: "Soon",
  },
  {
    t: "Competitive Analyzer",
    d: "See who AI recommends instead of you — and the gap you'd need to close.",
    c: "var(--c1)",
    badge: "Soon",
  },
  {
    t: "Prompt Simulator",
    d: "See the exact words ChatGPT and Perplexity use about your business.",
    c: "var(--c4)",
    badge: "Beta soon",
  },
  {
    t: "Citation Tracker",
    d: "Monitor your share-of-voice across all five engines over time.",
    c: "var(--c2)",
    badge: "Soon",
  },
  {
    t: "Crawler Access Checker",
    d: "Is GPTBot, ClaudeBot, or PerplexityBot blocked from your site?",
    c: "var(--accent)",
    badge: "Soon",
  },
  {
    t: "Question Finder",
    d: "Surface the real questions your customers ask AI in your niche.",
    c: "var(--c6)",
    badge: "Soon",
  },
];

export default function ToolsPage() {
  return (
    <>
      <header className="py-12">
        <Container>
          <Kicker>Free interactive tools</Kicker>
          <h1 className="mt-4 text-[clamp(32px,4.8vw,54px)] leading-[1.02] font-medium tracking-[-0.025em]">
            See what AI says about you —{" "}
            <em className="text-accent [font-style:italic]">then fix it.</em>
          </h1>
          <p className="text-ink-2 mt-4 max-w-[62ch] text-[19px] leading-relaxed">
            A free toolkit to diagnose, build, and track your AI search
            visibility. Start with the AEO Analyzer; pick up the rest as they
            arrive. No signup to run any of them.
          </p>
        </Container>
      </header>

      <Container className="pb-20">
        {/* flagship */}
        <div className="border-accent bg-panel grid overflow-hidden rounded-[20px] border shadow-[0_30px_70px_-44px_color-mix(in_oklab,var(--accent)_60%,transparent)] md:grid-cols-[1.05fr_0.95fr]">
          <div className="flex flex-col justify-center p-9">
            <span className="text-accent mb-3.5 inline-flex items-center gap-2 font-mono text-[10.5px] tracking-[0.12em] uppercase">
              <span
                className="size-[7px] rounded-full"
                style={{
                  background: "var(--ok)",
                  boxShadow:
                    "0 0 0 3px color-mix(in oklab, var(--ok) 25%, transparent)",
                }}
              />
              Flagship tool · Live
            </span>
            <h2 className="text-[30px] leading-tight font-medium">
              AEO Analyzer
            </h2>
            <p className="text-ink-2 mt-2.5 mb-5 max-w-[46ch] text-[15px] leading-relaxed">
              Enter your site and get a 0–100 AI-visibility score — plus exactly
              how ChatGPT, Perplexity, and Google AI describe and recommend you
              right now.
            </p>
            <AuditTeaser />
          </div>
          <div className="bg-bg-2 border-line flex items-center justify-center border-t p-8 md:border-t-0 md:border-l">
            <div className="border-line bg-panel w-full max-w-[300px] overflow-hidden rounded-xl border">
              <div className="border-line text-muted flex items-center gap-2 border-b px-3.5 py-2.5 font-mono text-[10.5px]">
                <span
                  className="size-[7px] rounded-full"
                  style={{ background: "var(--accent)" }}
                />
                live readout · sample
              </div>
              {READOUT.map((r) => (
                <div
                  key={r.eng}
                  className="border-line flex items-center justify-between gap-2.5 border-b px-3.5 py-2.5 text-[13px] last:border-b-0"
                >
                  <span className="text-ink-2">{r.eng}</span>
                  <span
                    className={`rounded-[5px] px-2 py-0.5 font-mono text-[10.5px] ${r.cls}`}
                  >
                    {r.st}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* toolkit grid */}
        <section className="mt-14">
          <div className="mb-6 flex items-baseline justify-between">
            <h2 className="text-[28px] font-medium tracking-tight">
              The toolkit
            </h2>
            <span className="text-accent font-mono text-[11px] tracking-[0.1em] uppercase">
              Pick what you need
            </span>
          </div>
          <div className="grid gap-4.5 sm:grid-cols-2 lg:grid-cols-3">
            {TOOLS.map((tool) => {
              const isLive = tool.badge === "Live" && tool.href;
              const inner = (
                <>
                  <h3 className="text-[19px] leading-tight font-medium">
                    {tool.t}
                  </h3>
                  <p className="text-muted flex-1 text-[13.5px] leading-relaxed">
                    {tool.d}
                  </p>
                  <div className="flex items-center justify-between pt-1">
                    <span
                      className="rounded-full px-2.5 py-1 font-mono text-[9.5px] tracking-[0.08em] uppercase"
                      style={{
                        color: isLive ? "var(--ok)" : "var(--muted)",
                        background: `color-mix(in oklab, ${isLive ? "var(--ok)" : "var(--muted)"} 14%, transparent)`,
                      }}
                    >
                      {tool.badge}
                    </span>
                    <span
                      className="font-mono text-[11.5px]"
                      style={{ color: tool.c }}
                    >
                      {isLive ? "Launch →" : "Soon"}
                    </span>
                  </div>
                </>
              );
              const cls =
                "border-line bg-panel flex flex-col gap-2.5 rounded-2xl border p-6 transition-transform";
              return isLive ? (
                <Link
                  key={tool.t}
                  href={tool.href!}
                  className={`${cls} hover:-translate-y-[3px]`}
                  style={{ borderTop: `4px solid ${tool.c}` }}
                >
                  {inner}
                </Link>
              ) : (
                <div
                  key={tool.t}
                  className={`${cls} opacity-70`}
                  style={{ borderTop: `4px solid ${tool.c}` }}
                >
                  {inner}
                </div>
              );
            })}
          </div>

          <div className="border-line-2 bg-accent-soft mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border px-7 py-5">
            <div>
              <span className="text-muted font-mono text-[10.5px] tracking-[0.1em] uppercase">
                Rather not DIY?
              </span>
              <h3 className="text-[20px] font-medium">
                We run every one of these for you.
              </h3>
              <p className="text-ink-2 max-w-[60ch] text-[14px]">
                The done-for-you service uses this exact toolkit to rebuild your
                site and keep you cited — month after month.
              </p>
            </div>
            <Button href="/pricing">See plans →</Button>
          </div>
        </section>
      </Container>
    </>
  );
}
