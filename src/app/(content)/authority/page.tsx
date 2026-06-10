import type { Metadata } from "next";
import Link from "next/link";
import { Kicker } from "@/components/ui/eyebrow";
import { Button } from "@/components/ui/button";
import { getAllPlaybooks } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Off-Site & Authority Playbooks for AEO",
  description:
    "Genuine, non-manipulative playbooks for building the off-site authority answer engines trust — Reddit, YouTube, Wikipedia, reviews, podcasts, PR, and more.",
  path: "/authority",
});

export default function AuthorityIndexPage() {
  const playbooks = getAllPlaybooks();
  const audit = playbooks.find((p) => p.slug === "off-site-authority-audit");
  const rest = playbooks.filter((p) => p.slug !== "off-site-authority-audit");

  return (
    <div className="py-12 pb-20">
      <header className="max-w-3xl">
        <Kicker>Off-site &amp; authority</Kicker>
        <h1 className="mt-4 text-[clamp(32px,4.8vw,52px)] leading-[1.04] font-medium tracking-[-0.02em]">
          Build the authority{" "}
          <em className="text-accent [font-style:italic]">
            AI already trusts.
          </em>
        </h1>
        <p className="text-ink-2 mt-5 max-w-[64ch] text-[18px] leading-relaxed">
          Answer engines trust what the wider web vouches for — and they weigh
          brand mentions far more than backlinks. These playbooks show how to
          earn genuine presence on the surfaces engines read most, the honest
          way. No gaming, no manipulation; the{" "}
          <Link href="/pillars/authority" className="text-accent">
            Authority pillar
          </Link>{" "}
          rejects it because engines do.
        </p>
        {audit ? (
          <div className="mt-6 flex flex-wrap gap-3">
            <Button href={audit.url} size="lg">
              Run the Off-Site Authority Audit →
            </Button>
          </div>
        ) : null}
      </header>

      <section className="mt-12">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="text-[26px] font-medium tracking-tight">
            The playbooks
          </h2>
          <span className="text-accent font-mono text-[11px] tracking-[0.1em] uppercase">
            {playbooks.length} guides
          </span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((p) => (
            <Link
              key={p.slug}
              href={p.url}
              className="border-line hover:border-accent bg-paper text-ink flex flex-col gap-2 rounded-2xl border p-6 no-underline transition-transform hover:-translate-y-[2px]"
            >
              {p.platform ? (
                <span className="text-accent font-mono text-[10.5px] tracking-[0.1em] uppercase">
                  {p.platform}
                </span>
              ) : null}
              <h3 className="text-[18px] leading-snug font-medium">
                {p.title}
              </h3>
              <p className="text-ink-2 text-[13.5px] leading-relaxed">
                {p.summary}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <div className="border-line-2 bg-paper mt-12 flex flex-wrap items-center justify-between gap-4 rounded-2xl border px-7 py-6">
        <div>
          <h2 className="text-[20px] font-medium">Not sure where to start?</h2>
          <p className="text-ink-2 max-w-[60ch] text-[14px]">
            The Off-Site Authority Audit scores your footprint across every
            surface and points you to the gap worth fixing first.
          </p>
        </div>
        {audit ? (
          <Button href={audit.url} variant="ghost">
            Run the audit →
          </Button>
        ) : null}
      </div>
    </div>
  );
}
