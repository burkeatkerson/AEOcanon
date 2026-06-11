import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { Kicker } from "@/components/ui/eyebrow";
import { Scorecard } from "@/components/tools/scorecard/scorecard";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "8-Pillar AEO Scorecard",
  description:
    "Answer eight quick questions and get an instant grade across the eight pillars that decide whether AI recommends you — plus a playbook matched to your biggest gap.",
  path: "/scorecard",
});

export default function ScorecardPage() {
  return (
    <>
      <header className="py-12 sm:py-16">
        <Container className="text-center">
          <Kicker>The 8-Pillar AEO Scorecard</Kicker>
          <h1 className="mx-auto mt-4 max-w-[20ch] text-[clamp(32px,5vw,54px)] leading-[1.03] font-medium tracking-[-0.025em]">
            Is AI recommending you —{" "}
            <em className="text-accent [font-style:italic]">or them?</em>
          </h1>
          <p className="text-ink-2 mx-auto mt-5 max-w-[54ch] text-[18px] leading-relaxed">
            Eight quick questions score how findable, trustworthy, and citable
            you are across the pillars that decide who AI names. Get your grade,
            a per-pillar breakdown, and a playbook matched to your biggest gap —
            instantly.
          </p>
        </Container>
      </header>

      <Container className="pb-24">
        <Scorecard />
      </Container>
    </>
  );
}
