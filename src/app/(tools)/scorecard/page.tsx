import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { Kicker } from "@/components/ui/eyebrow";
import { Button } from "@/components/ui/button";
import { BookCallButton } from "@/components/contact/book-call-button";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "8-Pillar AEO Scorecard — Coming Soon",
  description:
    "Answer eight quick questions and get an instant grade across the eight pillars that decide whether AI recommends you. Launching soon — book a free call to get your read now.",
  path: "/scorecard",
});

const PILLARS = [
  "Access",
  "Alignment",
  "Extractability",
  "Authority",
  "Credibility",
  "Freshness",
  "Originality",
  "Adaptability",
];

export default function ScorecardPage() {
  return (
    <>
      <header className="py-12 sm:py-16">
        <Container className="text-center">
          <span className="border-line-2 text-muted bg-panel mb-5 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-mono text-[11px] tracking-[0.08em] uppercase">
            <span
              className="size-[7px] rounded-full"
              style={{ background: "var(--warn)" }}
            />
            Coming soon
          </span>
          <Kicker>The 8-Pillar AEO Scorecard</Kicker>
          <h1 className="mx-auto mt-4 max-w-[20ch] text-[clamp(32px,5vw,54px)] leading-[1.03] font-medium tracking-[-0.025em]">
            Is AI recommending you —{" "}
            <em className="text-accent [font-style:italic]">or them?</em>
          </h1>
          <p className="text-ink-2 mx-auto mt-5 max-w-[56ch] text-[18px] leading-relaxed">
            We&rsquo;re building an instant scorecard: answer eight quick
            questions and get a grade across the pillars that decide who AI
            names, plus a playbook matched to your biggest gap. It&rsquo;s
            launching soon.
          </p>
          <p className="text-ink-2 mx-auto mt-3 max-w-[56ch] text-[16px] leading-relaxed">
            Can&rsquo;t wait? Book a free call and we&rsquo;ll score you live.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <BookCallButton size="lg" />
            <Button href="/contact" variant="ghost" size="lg">
              Get notified
            </Button>
          </div>
        </Container>
      </header>

      <Container className="pb-24">
        <div className="border-line bg-paper rounded-2xl border p-6 sm:p-9">
          <h2 className="text-muted text-center font-mono text-[11px] tracking-[0.1em] uppercase">
            The eight pillars you&rsquo;ll be graded on
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {PILLARS.map((pillar, i) => (
              <div
                key={pillar}
                className="border-line bg-panel flex items-center gap-2.5 rounded-xl border px-4 py-3"
              >
                <span className="text-accent font-serif text-[18px] leading-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-ink text-[14px] font-medium">
                  {pillar}
                </span>
              </div>
            ))}
          </div>
          <p className="text-faint mt-6 text-center font-mono text-[11px]">
            Learn the framework now in{" "}
            <a href="/canon" className="text-accent hover:underline">
              The Canon
            </a>
            .
          </p>
        </div>
      </Container>
    </>
  );
}
