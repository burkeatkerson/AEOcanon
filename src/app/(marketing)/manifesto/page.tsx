import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Kicker } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/motion/reveal";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "The AEO Manifesto",
  description:
    "What we believe about Answer Engine Optimization — and why deserving the citation is the only strategy that lasts.",
  path: "/manifesto",
});

const TENETS: { n: number; h: string; p: string; proof?: string }[] = [
  {
    n: 1,
    h: "Access is the price of admission.",
    p: "If a machine cannot read your page, it cannot quote you. Open your doors to the crawlers, render in plain HTML, load fast. Fix this first — before everything else.",
  },
  {
    n: 2,
    h: "Alignment before optimization.",
    p: "You can be the best answer to a question nobody is asking AI. People don’t ask “best CRM small business” — they ask “we’ve outgrown spreadsheets, what should we use and why?” Meet them at their real question.",
  },
  {
    n: 3,
    h: "The sentence matters more than the page.",
    p: "Engines retrieve passages, not pages — they photocopy a paragraph, they don’t read the book. Write the answer you want quoted and put it first.",
    proof: "44% of citations come from the first third of a page",
  },
  {
    n: 4,
    h: "Authority lives off your own site.",
    p: "You are what the web says you are. The machine is listening to the room — Reddit, YouTube, Wikipedia, the publications that say your name unprompted. Give the room something true to say.",
    proof: "mentions 0.664 vs backlinks 0.218",
  },
  {
    n: 5,
    h: "Show your work.",
    p: "Numbers, not adjectives. Quotations, not assertions. Named sources and a real author with real credentials. Machines recognize the difference.",
    proof: "statistics +30% · quotations +41%",
  },
  {
    n: 6,
    h: "Say what only you can say.",
    p: "Generic content has always been weak; now it is also infinite. The scarcity moved to what was always valuable — the specifically true, genuinely known, impossible to replicate. Be the primary source.",
  },
  {
    n: 7,
    h: "Recency is a form of honesty.",
    p: "An undated page is a claim without a timestamp. Updating content is not maintenance — it is integrity. Match your cadence to your topic’s clock-speed.",
  },
  {
    n: 8,
    h: "Build systems that bend.",
    p: "The engines will change; the signals will shift. Build the measurement habits and adaptive doctrine to move with the river. The principles endure. The specifics are written in pencil.",
  },
];

export default function ManifestoPage() {
  return (
    <Container className="max-w-[760px] py-16">
      <header className="text-center">
        <Kicker>The AEO Manifesto</Kicker>
        <h1 className="mt-5 text-[clamp(34px,5.4vw,60px)] leading-[1.05] font-medium tracking-[-0.025em]">
          The world changed. The game changed{" "}
          <em className="text-accent [font-style:italic]">with it.</em>
        </h1>
        <p className="text-muted mx-auto mt-5 max-w-[52ch] font-serif text-[19px] italic">
          For thirty years the web asked one question: can people find you? A
          new one has arrived.
        </p>
      </header>

      <Reveal as="section" className="mt-16">
        <p className="text-muted font-serif text-[21px] leading-relaxed">
          For thirty years, the web had a single question:{" "}
          <em>can people find you?</em> The answer was a list. Ten blue links.
          The machine was a directory, and the goal was to be filed correctly.
        </p>
        <h2 className="mt-6 font-serif text-[28px] leading-snug font-medium">
          A new question has arrived:{" "}
          <em className="text-accent">
            when the machine speaks, does it say your name?
          </em>
        </h2>
      </Reveal>

      <Reveal
        as="section"
        className="border-line mt-14 border-t pt-14 text-center"
      >
        <p className="text-muted font-mono text-[12px] tracking-[0.13em] uppercase">
          02 — The conviction
        </p>
        <p className="text-ink mx-auto mt-6 max-w-[24ch] font-serif text-[clamp(26px,4vw,38px)] leading-tight italic">
          “Becoming the best available source is the entire discipline.”
        </p>
        <p className="text-muted mx-auto mt-7 max-w-[48ch] leading-relaxed">
          AEO is not a set of tricks for manipulating machine behavior. It is
          the practice of being genuinely excellent at communicating — and
          building the conditions under which any well-designed engine
          recognizes that excellence. That is not a loophole. It is the design.
        </p>
      </Reveal>

      {/* the creed */}
      <section className="border-line mt-14 border-t pt-14">
        <Kicker>The eight beliefs</Kicker>
        <h2 className="mt-3 font-serif text-[28px] leading-snug font-medium">
          Every principle is also just honest, useful communication. That is the
          point.
        </h2>
        <div className="mt-10 flex flex-col gap-9">
          {TENETS.map((t) => (
            <div key={t.n} className="grid grid-cols-[auto_1fr] gap-5 sm:gap-7">
              <span className="text-accent font-serif text-[56px] leading-none">
                {t.n}
              </span>
              <div>
                <h3 className="font-serif text-[22px] leading-snug font-medium">
                  {t.h}
                </h3>
                <p className="text-ink-2 mt-2 leading-relaxed">{t.p}</p>
                {t.proof ? (
                  <span className="text-muted mt-3 inline-block font-mono text-[11px] tracking-[0.04em]">
                    {t.proof}
                  </span>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* closer */}
      <section className="border-line mt-14 border-t pt-14 text-center">
        <Kicker>What we stand for</Kicker>
        <p className="mt-6 font-serif text-[22px] leading-relaxed">
          We stand for content that deserves to be cited. That answers the real
          question, backs every claim with evidence, says something nobody else
          has said — and is structured to be lifted and quoted in the first
          sentence.
        </p>
        <p className="text-ink-2 mt-5 font-serif text-[20px] leading-relaxed">
          We stand against hollow optimization. Against gaming a signal rather
          than earning a reputation.
        </p>
        <p className="mt-8 font-serif text-[26px] leading-tight italic">
          Not because it is clever.
          <br />
          <span className="text-accent">Because it is right.</span>
        </p>
        <div className="text-muted mt-6 font-mono text-[11.5px]">
          The AEO Canon · aeocanon.com
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href="/canon" size="lg">
            Explore the framework →
          </Button>
          <Button href="/whitepaper" variant="ghost" size="lg">
            Read the research
          </Button>
        </div>
      </section>
    </Container>
  );
}
