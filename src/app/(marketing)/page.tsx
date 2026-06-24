import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Section, SectionHead } from "@/components/sections/section";
import { CtaBand } from "@/components/sections/cta-band";
import { Button } from "@/components/ui/button";
import { Kicker } from "@/components/ui/eyebrow";
import { ArticleCard } from "@/components/library/cards/article-card";
import { HeroDemo } from "@/components/marketing/hero-demo";
import { Reveal } from "@/components/motion/reveal";
import { getFeaturedArticles, getAllArticles } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  ...buildMetadata({
    title: `${siteConfig.name} — Get found by the AI your customers ask`,
    description: siteConfig.description,
    path: "/",
  }),
  title: { absolute: `${siteConfig.name} — Become the Answer AI Recommends` },
};

const ENGINES = [
  { label: "ChatGPT", color: "var(--c3)" },
  { label: "Claude", color: "var(--accent-2)" },
  { label: "Perplexity", color: "var(--c4)" },
  { label: "Gemini", color: "var(--c2)" },
  { label: "Google AI Overviews", color: "var(--c5)" },
];

const SHIFT = [
  {
    big: "~60%",
    trend: "▼ and climbing",
    color: "var(--bad)",
    body: "of Google searches now end without a single click — the answer appears on the page, and the visit never reaches you.",
  },
  {
    big: "↑ cost",
    trend: "▲ up · ▼ returns",
    color: "var(--warn)",
    body: "paid-search costs keep rising while conversion falls. You pay more per click for clicks that convert less.",
  },
  {
    big: "800M+",
    trend: "▲ fastest-growing",
    color: "var(--accent)",
    body: "weekly users now ask ChatGPT, Claude, and Perplexity for recommendations — a behavior that didn't exist three years ago.",
  },
];

const AUTHORITY = [
  {
    n: "The framework",
    h: "The 8-pillar Canon",
    p: "The model behind every page we build and word we write.",
    href: "/canon",
    color: "var(--c5)",
  },
  {
    n: "The research",
    h: "Evidence, not opinion",
    p: "Large-scale studies and a peer-reviewed experiment, distilled into practice.",
    href: "/whitepaper",
    color: "var(--c3)",
  },
  {
    n: "The school",
    h: "350+ articles & courses",
    p: "The reference small-business owners and marketers learn from.",
    href: "/learn",
    color: "var(--c2)",
  },
  {
    n: "The stance",
    h: "The AEO Manifesto",
    p: "What we believe — and why deserving citation is the only strategy that lasts.",
    href: "/manifesto",
    color: "var(--c6)",
  },
];

export default function HomePage() {
  const featured = getFeaturedArticles(3);
  const start = featured.length > 0 ? featured : getAllArticles().slice(0, 3);

  return (
    <>
      {/* HERO */}
      <header className="py-14 sm:py-16">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr]">
            <div>
              <Kicker>Done-for-you AI search optimization</Kicker>
              <h1 className="mt-4 text-[clamp(34px,5.4vw,62px)] leading-none font-medium tracking-[-0.03em]">
                Your customers stopped Googling.{" "}
                <em className="text-accent [font-style:italic] not-italic">
                  They&rsquo;re asking AI.
                </em>
              </h1>
              <p className="text-ink-2 mt-6 max-w-[48ch] text-[19px] leading-relaxed">
                Search clicks are vanishing into AI answers — and when someone
                asks, the assistant names just one or two businesses. Be the
                name it gives, and the customer is yours. The AEO Canon is the
                framework built to get you there.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button href="/audit" size="lg">
                  See your free AI score →
                </Button>
                <Button href="#how" variant="ghost" size="lg">
                  How it works
                </Button>
              </div>
              <p className="text-muted mt-4 flex items-center gap-2 font-mono text-[11.5px]">
                <span
                  className="inline-block size-[7px] rounded-full"
                  style={{ background: "var(--ok)" }}
                />
                No signup to see your score · results in ~60 seconds
              </p>
            </div>

            {/* live answer-engine demo (interactive) */}
            <HeroDemo />
          </div>
        </Container>
      </header>

      {/* engine row */}
      <Container>
        <div className="border-line flex flex-wrap items-center justify-center gap-2.5 border-y py-5">
          <span className="text-muted mr-1.5 font-mono text-[11px] tracking-[0.1em] uppercase">
            Where they ask now
          </span>
          {ENGINES.map((e) => (
            <span
              key={e.label}
              className="border-line-2 bg-panel text-ink inline-flex items-center gap-2 rounded-full border px-[15px] py-2 font-mono text-[12.5px]"
            >
              <i
                className="size-[7px] rounded-full"
                style={{ background: e.color }}
              />
              {e.label}
            </span>
          ))}
        </div>
      </Container>

      {/* THE SHIFT */}
      <Section>
        <Reveal>
          <div className="mb-8 grid items-center gap-11 md:grid-cols-2">
            <div>
              <Kicker>The shift</Kicker>
              <h2 className="mt-3 text-[clamp(28px,4vw,42px)] leading-tight font-medium tracking-[-0.02em]">
                The tide already turned. Most marketing budgets haven&rsquo;t.
              </h2>
            </div>
            <p className="text-ink-2 text-[16.5px] leading-relaxed">
              Owners keep pouring money into paid ads and chasing Google
              rankings — while their customers quietly moved to asking an
              assistant and trusting the first answer.{" "}
              <b className="text-ink">
                The channel that wins the customer changed. The spending
                didn&rsquo;t.
              </b>
            </p>
          </div>
          <div className="grid gap-[18px] sm:grid-cols-3">
            {SHIFT.map((s) => (
              <div
                key={s.big}
                className="border-line bg-paper rounded-2xl border p-6"
                style={{ borderTop: `4px solid ${s.color}` }}
              >
                <div
                  className="font-serif text-[46px] leading-none tracking-[-0.02em]"
                  style={{ color: s.color }}
                >
                  {s.big}
                </div>
                <div
                  className="mt-2 mb-2.5 font-mono text-[11px]"
                  style={{ color: s.color }}
                >
                  {s.trend}
                </div>
                <p className="text-ink-2 text-[14px] leading-normal">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </Section>

      {/* THE REALITY */}
      <Section>
        <Reveal>
          <div className="border-line grid overflow-hidden rounded-[20px] border md:grid-cols-2">
            <div className="flex flex-col justify-center p-9">
              <Kicker>What&rsquo;s actually happening</Kicker>
              <h2 className="mt-3 text-[30px] leading-tight font-medium">
                AI doesn&rsquo;t give a list. It gives{" "}
                <em className="text-accent [font-style:italic]">one answer.</em>
              </h2>
              <p className="text-ink-2 mt-4 leading-relaxed">
                When someone asks for a recommendation, the assistant names a
                business or two — and the customer acts on it. There&rsquo;s no
                page two.
              </p>
              <p className="text-ink-2 mt-3 leading-relaxed">
                You&rsquo;re either{" "}
                <b className="text-ink">
                  in that answer, or you&rsquo;re invisible
                </b>{" "}
                — and most businesses are invisible without ever knowing it.
                That&rsquo;s the problem AEO exists to fix.
              </p>
            </div>
            <div className="bg-bg-2 border-line flex flex-col justify-center gap-3.5 border-t p-9 md:border-t-0 md:border-l">
              <div className="border-line bg-panel rounded-2xl border p-5">
                <div className="text-muted mb-3 font-mono text-[12px]">
                  &ldquo;best plumber near me, open now&rdquo;
                </div>
                <div className="text-ink text-[15px] leading-normal">
                  For your area, a reliable option is{" "}
                  <span className="text-bad line-through">[a competitor]</span>{" "}
                  — or, with AEO done right,{" "}
                  <span className="text-accent font-semibold">
                    your business, by name.
                  </span>
                </div>
              </div>
              <div className="text-muted text-center font-mono text-[11px]">
                One answer decides the lead. AEO makes it yours.
              </div>
            </div>
          </div>
        </Reveal>
      </Section>

      {/* HOW IT WORKS */}
      <Section id="how">
        <SectionHead
          title="How you become the answer"
          eyebrow="The model, end to end"
        />
        <div className="grid gap-5 md:grid-cols-2">
          <div
            className="border-line bg-panel rounded-[18px] border p-7"
            style={{ borderTop: "4px solid var(--accent)" }}
          >
            <h3 className="text-[23px] font-medium">
              A site built to be cited
            </h3>
            <p className="text-ink-2 mt-2 text-[14.5px] leading-relaxed">
              Pages engines can actually read, trust, and quote. It&rsquo;s the
              part almost every small-business site gets wrong — and the quiet
              reason great companies stay invisible.
            </p>
            <ul className="mt-4 flex flex-col gap-2.5">
              {[
                "Clean, fast, mobile-first foundations",
                "Schema & structured data done right",
                "Answer-first pages engines lift verbatim",
                "Canonical, sitemap, llms.txt, and feeds",
              ].map((li) => (
                <li key={li} className="text-ink-2 flex gap-2.5 text-[14px]">
                  <span className="text-accent font-bold">✓</span>
                  {li}
                </li>
              ))}
            </ul>
          </div>
          <div
            className="border-line bg-panel rounded-[18px] border p-7"
            style={{ borderTop: "4px solid var(--c3)" }}
          >
            <h3 className="text-[23px] font-medium">
              Content that earns the recommendation
            </h3>
            <p className="text-ink-2 mt-2 text-[14.5px] leading-relaxed">
              The question-first content your customers actually ask AI — the
              kind that gets you named, then keeps you named as the engines
              evolve. Every article is one more door a customer walks through.
            </p>
            <ul className="mt-4 flex flex-col gap-2.5">
              {[
                "AEO-optimized articles mapped to real questions",
                "Topic clusters that reinforce authority",
                "Structured Q&A that becomes the cited answer",
                "Refined as the answer engines change",
              ].map((li) => (
                <li key={li} className="text-ink-2 flex gap-2.5 text-[14px]">
                  <span style={{ color: "var(--c3)" }} className="font-bold">
                    ✓
                  </span>
                  {li}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* AUTHORITY */}
      <Section>
        <div className="grid items-center gap-11 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <Kicker>Why the Canon</Kicker>
            <h2 className="mt-3 text-[clamp(28px,3.4vw,34px)] leading-tight font-medium tracking-[-0.02em]">
              We don&rsquo;t guess at this.{" "}
              <em className="text-accent [font-style:italic]">
                We wrote the reference.
              </em>
            </h2>
            <p className="text-ink-2 mt-4 max-w-[46ch] leading-relaxed">
              AEO Canon is the working framework for answer-engine optimization
              — the research, the model, and the library practitioners learn
              from. Understand how engines actually choose, and being chosen
              stops being luck.
            </p>
            <Button href="/learn" variant="ghost" size="lg" className="mt-5">
              Explore the framework →
            </Button>
          </div>
          <div className="grid gap-3.5 sm:grid-cols-2">
            {AUTHORITY.map((a) => (
              <Link
                key={a.h}
                href={a.href}
                className="border-line bg-paper text-ink hover:border-accent rounded-2xl border p-[22px] no-underline transition-transform hover:-translate-y-[3px]"
              >
                <div
                  className="font-mono text-[11px]"
                  style={{ color: a.color }}
                >
                  {a.n}
                </div>
                <h3 className="mt-2 mb-1.5 text-[18px] font-medium">{a.h}</h3>
                <p className="text-muted text-[13px]">{a.p}</p>
              </Link>
            ))}
          </div>
        </div>
      </Section>

      {/* START HERE — real content */}
      <Section aria-labelledby="start-heading">
        <SectionHead
          id="start-heading"
          title="Start here"
          action={
            <Link
              href="/learn"
              className="text-accent ml-auto font-mono text-[12px]"
            >
              View all →
            </Link>
          }
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {start.map((article, i) => (
            <ArticleCard key={article.slug} article={article} index={i} />
          ))}
        </div>
      </Section>

      {/* FINAL CTA */}
      <Section bordered={false}>
        <CtaBand
          title={
            <>
              See where AI puts you today —{" "}
              <em className="text-accent [font-style:italic]">free.</em>
            </>
          }
          description="No signup to see your score. Just your website and about a minute."
          primary={{ href: "/audit", label: "Run my free audit →" }}
          secondary={{ href: "/learn", label: "Explore the AEO School" }}
        />
      </Section>
    </>
  );
}
