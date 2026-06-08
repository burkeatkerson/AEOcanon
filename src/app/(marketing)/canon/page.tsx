import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Kicker } from "@/components/ui/eyebrow";
import { PillarExplorer } from "@/components/canon/pillar-explorer";
import { LAYERS, PILLARS } from "@/lib/canon";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "The Canon — The framework for Answer Engine Optimization",
  description:
    "Eight pillars in three layers — Foundation, Reputation, Momentum — that make your content the source AI engines read, trust, and quote.",
  path: "/canon",
});

const GLANCE = [
  { layer: "Foundation", q: "Can the machine use you?" },
  { layer: "Reputation", q: "Does the web vouch for you?" },
  { layer: "Momentum", q: "Do you stay chosen as things move?" },
] as const;

export default function CanonPage() {
  return (
    <Container className="py-12 pb-20">
      {/* hero */}
      <header className="max-w-4xl">
        <Kicker>The Canon · v1.0 · the framework</Kicker>
        <h1 className="mt-4 max-w-[15ch] text-[clamp(34px,5.2vw,64px)] leading-none font-medium tracking-[-0.03em]">
          SEO got you clicked. AEO gets you{" "}
          <em className="text-accent [font-style:italic]">cited.</em>
        </h1>
        <p className="text-ink-2 mt-5 max-w-[56ch] text-[18px] leading-relaxed">
          Eight pillars, in three layers, that make your content the source AI
          engines read, trust, and quote. Not tricks — the conditions under
          which any well-built engine recognizes you as the best answer.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href="/whitepaper" size="lg">
            Read the research whitepaper
          </Button>
          <Button href="/manifesto" variant="ghost" size="lg">
            The AEO Manifesto
          </Button>
          <Button href="/audit" variant="ghost" size="lg">
            Run the visibility audit
          </Button>
        </div>

        {/* SEO = AEO bar */}
        <div className="border-line bg-panel mt-8 overflow-hidden rounded-xl border">
          <div className="flex h-[54px]">
            <div className="text-ink-2 flex flex-[0_0_76%] items-center bg-[color-mix(in_oklab,var(--ink)_7%,transparent)] px-5 font-mono text-[11.5px]">
              ≈ 75% carries over from strong SEO — crawlable, authoritative,
              high-quality
            </div>
            <div className="bg-accent flex flex-1 items-center px-4 font-mono text-[11px] text-white">
              + the new layer
            </div>
          </div>
          <div className="border-line text-ink-2 flex flex-wrap justify-between gap-4 border-t px-5 py-3 text-[13px]">
            <span>
              <b className="text-ink">AEO is SEO extended, not replaced.</b>
            </span>
            <span>
              New: passage-level extraction · conversational queries ·
              per-engine measurement
            </span>
          </div>
        </div>

        {/* glance */}
        <div className="mt-9 grid gap-3.5 md:grid-cols-3">
          {GLANCE.map((g, i) => {
            const color = LAYERS[i]!.color;
            return (
              <div
                key={g.layer}
                className="border-line bg-paper rounded-xl border p-5"
                style={{ borderTop: `4px solid ${color}` }}
              >
                <h2
                  className="font-mono text-[11px] tracking-[0.12em] uppercase"
                  style={{ color }}
                >
                  {g.layer}
                </h2>
                <div className="text-ink-2 mb-3 font-serif text-[14px] italic">
                  {g.q}
                </div>
                <ol className="flex flex-col gap-1.5">
                  {PILLARS.filter((p) => p.layer === g.layer).map((p) => (
                    <li
                      key={p.n}
                      className="text-ink-2 flex items-baseline gap-2.5 text-[13.5px]"
                    >
                      <span className="font-mono text-[11px]" style={{ color }}>
                        {p.n}
                      </span>
                      {p.title}
                    </li>
                  ))}
                </ol>
              </div>
            );
          })}
        </div>
      </header>

      {/* explorer */}
      <section className="mt-12">
        <div className="mb-6 flex flex-wrap items-baseline justify-between gap-4">
          <h2 className="text-[28px] font-medium tracking-tight">
            The pillars are a cascade, not a checklist
          </h2>
          <span className="text-accent font-mono text-[11px] tracking-[0.1em] uppercase">
            Tap a pillar to explore
          </span>
        </div>
        <PillarExplorer />

        <div className="border-line-2 bg-accent-soft mt-7 grid items-center gap-5 rounded-2xl border px-7 py-5 sm:grid-cols-[auto_1fr_auto]">
          <span className="text-accent font-serif text-[30px]">⌖</span>
          <div>
            <h3 className="text-[20px] font-medium">Use it as a diagnostic</h3>
            <p className="text-ink-2 max-w-[60ch] text-[14px]">
              Walk down the pillars in order. Earlier failures make later
              efforts irrelevant — a brilliant page behind a blocked crawler is
              wasted. The first pillar where you break is the place to work.
            </p>
          </div>
          <Button href="/audit">Find where you break →</Button>
        </div>
      </section>

      <div className="text-ink mt-16 text-center font-serif text-[clamp(22px,3vw,30px)] tracking-[-0.01em] italic">
        “The principles endure. The specifics are written in pencil.”
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Button
            href="/whitepaper"
            variant="ghost"
            size="lg"
            className="not-italic"
          >
            Read the full research whitepaper →
          </Button>
          <Button
            href="/manifesto"
            variant="ghost"
            size="lg"
            className="not-italic"
          >
            Read the AEO Manifesto →
          </Button>
        </div>
      </div>
    </Container>
  );
}
