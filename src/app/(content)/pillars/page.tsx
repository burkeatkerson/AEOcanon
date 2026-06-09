import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Kicker } from "@/components/ui/eyebrow";
import { CanonMap } from "@/components/mdx/canon-map";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "The 8 Pillars of AEO — Deep Dives",
  description:
    "Deep-dive guides to the eight pillars of the AEO Canon, in three layers — Foundation, Reputation, Momentum. Each pillar, the evidence behind it, and how to apply it.",
  path: "/pillars",
});

export default function PillarsIndexPage() {
  return (
    <Container className="py-14">
      <header className="max-w-3xl">
        <Kicker>The AEO Canon · 8 pillars</Kicker>
        <h1 className="mt-4 text-[clamp(32px,4.8vw,52px)] leading-[1.04] font-medium tracking-[-0.02em]">
          The eight pillars of AEO
        </h1>
        <p className="text-ink-2 mt-5 max-w-[64ch] text-[18px] leading-relaxed">
          The <Link href="/learn/aeo-canon" className="text-accent">AEO Canon</Link> is
          eight pillars in three layers — Foundation, Reputation, Momentum. Each
          pillar below is a deep dive: its canonical principle, the evidence
          behind it, how to apply it, and the mistakes to avoid. Read them top to
          bottom; each layer assumes the one above it is in place.
        </p>
      </header>

      <div className="mt-10">
        <CanonMap />
      </div>

      <p className="text-muted mt-8 text-[14px]">
        New to the framework? Start with{" "}
        <Link href="/learn/aeo-canon" className="text-accent">
          the AEO Canon overview
        </Link>
        , or run the{" "}
        <Link href="/learn/aeo-canon-diagnostic" className="text-accent">
          Canon diagnostic
        </Link>{" "}
        to find your first broken gate.
      </p>
    </Container>
  );
}
