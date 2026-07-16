import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Kicker } from "@/components/ui/eyebrow";
import { BookCallButton } from "@/components/contact/book-call-button";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Tools — Free AI visibility toolkit (Coming soon)",
  description:
    "A free toolkit to diagnose, build, and track your AI search visibility — launching soon. Want a read on where AI puts you now? Book a free call.",
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
  },
  {
    t: "8-Pillar Scorecard",
    d: "Answer eight quick questions; get an instant grade and a playbook matched to your biggest gap.",
    c: "var(--c2)",
  },
  {
    t: "Schema Generator",
    d: "Generate clean LocalBusiness & Service structured data — copy-paste ready.",
    c: "var(--c6)",
  },
  {
    t: "Content Scorer",
    d: "Paste a draft or URL; get a citability score for answer-first structure, stats, and quotes.",
    c: "var(--c3)",
  },
  {
    t: "Competitive Analyzer",
    d: "See who AI recommends instead of you — and the gap you'd need to close.",
    c: "var(--c1)",
  },
  {
    t: "Prompt Simulator",
    d: "See the exact words ChatGPT and Perplexity use about your business.",
    c: "var(--c4)",
  },
  {
    t: "Citation Tracker",
    d: "Monitor your share-of-voice across all five engines over time.",
    c: "var(--c2)",
  },
  {
    t: "Crawler Access Checker",
    d: "Is GPTBot, ClaudeBot, or PerplexityBot blocked from your site?",
    c: "var(--accent)",
  },
  {
    t: "Question Finder",
    d: "Surface the real questions your customers ask AI in your niche.",
    c: "var(--c6)",
  },
];

export default function ToolsPage() {
  return (
    <>
      <header className="py-12">
        <Container>
          <span className="border-line-2 text-muted bg-panel mb-5 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-mono text-[11px] tracking-[0.08em] uppercase">
            <span
              className="size-[7px] rounded-full"
              style={{ background: "var(--warn)" }}
            />
            Coming soon
          </span>
          <Kicker>Free interactive tools</Kicker>
          <h1 className="mt-4 text-[clamp(32px,4.8vw,54px)] leading-[1.02] font-medium tracking-[-0.025em]">
            See what AI says about you —{" "}
            <em className="text-accent [font-style:italic]">then fix it.</em>
          </h1>
          <p className="text-ink-2 mt-4 max-w-[62ch] text-[19px] leading-relaxed">
            We&rsquo;re building a free toolkit to diagnose, build, and track
            your AI search visibility. It&rsquo;s launching soon. Want a read on
            where the engines put you today — before the tools go live? Book a
            free call and we&rsquo;ll walk through it with you.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <BookCallButton />
            <Button href="/contact" variant="ghost">
              Get early access
            </Button>
          </div>
          <p className="text-muted mt-4 text-[13.5px]">
            Meanwhile, see{" "}
            <Link
              href="/learn/ai-tools-for-small-business"
              className="text-accent hover:underline"
            >
              the AI tools small businesses actually use in 2026
            </Link>{" "}
            — and the visibility gap they all share.
          </p>
        </Container>
      </header>

      <Container className="pb-20">
        {/* flagship preview */}
        <div className="border-line bg-panel grid overflow-hidden rounded-[20px] border md:grid-cols-[1.05fr_0.95fr]">
          <div className="flex flex-col justify-center p-9">
            <span className="text-muted mb-3.5 inline-flex items-center gap-2 font-mono text-[10.5px] tracking-[0.12em] uppercase">
              <span
                className="size-[7px] rounded-full"
                style={{ background: "var(--warn)" }}
              />
              Flagship tool · Coming soon
            </span>
            <h2 className="text-[30px] leading-tight font-medium">
              AEO Analyzer
            </h2>
            <p className="text-ink-2 mt-2.5 mb-5 max-w-[46ch] text-[15px] leading-relaxed">
              Enter your site and get a 0–100 AI-visibility score — plus exactly
              how ChatGPT, Perplexity, and Google AI describe and recommend you
              right now, and the gaps quietly handing customers to competitors.
              Launching soon.
            </p>
            <div className="flex flex-wrap gap-3">
              <BookCallButton size="md" label="Get your score on a call →" />
              <Button href="/contact" variant="ghost" size="md">
                Notify me at launch
              </Button>
            </div>
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
            <span className="text-muted font-mono text-[11px] tracking-[0.1em] uppercase">
              All launching soon
            </span>
          </div>
          <div className="grid gap-4.5 sm:grid-cols-2 lg:grid-cols-3">
            {TOOLS.map((tool) => (
              <div
                key={tool.t}
                className="border-line bg-panel flex flex-col gap-2.5 rounded-2xl border p-6 opacity-75"
                style={{ borderTop: `4px solid ${tool.c}` }}
              >
                <h3 className="text-[19px] leading-tight font-medium">
                  {tool.t}
                </h3>
                <p className="text-muted flex-1 text-[13.5px] leading-relaxed">
                  {tool.d}
                </p>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-muted rounded-full bg-[color-mix(in_oklab,var(--muted)_14%,transparent)] px-2.5 py-1 font-mono text-[9.5px] tracking-[0.08em] uppercase">
                    Coming soon
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="border-line-2 bg-accent-soft mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border px-7 py-5">
            <div>
              <span className="text-muted font-mono text-[10.5px] tracking-[0.1em] uppercase">
                Rather not wait — or not DIY?
              </span>
              <h3 className="text-[20px] font-medium">
                We run every one of these for you.
              </h3>
              <p className="text-ink-2 max-w-[60ch] text-[14px]">
                The done-for-you service uses this exact toolkit to rebuild your
                site and keep you cited — month after month.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <BookCallButton size="md" label="Book a call →" />
              <Button href="/pricing" variant="ghost" size="md">
                See plans
              </Button>
            </div>
          </div>
        </section>
      </Container>
    </>
  );
}
