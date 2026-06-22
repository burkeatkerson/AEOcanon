import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { Section, SectionHead } from "@/components/sections/section";
import { CtaBand } from "@/components/sections/cta-band";
import { Button } from "@/components/ui/button";
import { Kicker } from "@/components/ui/eyebrow";
import { JsonLd } from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/seo";
import {
  breadcrumbNode,
  faqNode,
  graph,
  serviceOfferNode,
} from "@/lib/structured-data";

const PRICING_DESCRIPTION =
  "Done-for-you Answer Engine Optimization. Every plan includes a complete custom website rebuild ($12,000 value) free, then the AEO content that gets you cited every month.";

export const metadata: Metadata = buildMetadata({
  title: "Pricing — Done-for-you AEO",
  description: PRICING_DESCRIPTION,
  path: "/pricing",
  eyebrow: "Pricing",
});

const TIERS = [
  {
    name: "Foundation",
    price: "$1,000",
    featured: true,
    flag: "Most chosen",
    hl: "Your new website is built free — then we publish the AEO content that gets you cited, every month.",
    features: [
      "Full custom website rebuild ($12k value), live in ~3 weeks",
      "8 AEO-optimized articles / month, written for your trade",
      "Schema + Google Business Profile rebuild",
      "Monthly visibility tracking across 5 AI engines",
      "Quarterly strategy review",
      "AEO school access for your whole team",
    ],
  },
  {
    name: "Growth",
    price: "$2,000",
    featured: false,
    hl: "Everything in Foundation, at double the publishing pace — for owners who want to dominate their category faster.",
    features: [
      "Everything in Foundation",
      "16 AEO-optimized articles / month + seasonal campaigns",
      "Citation-consistency program across the web",
      "Competitive gap analysis, refreshed monthly",
      "Dedicated AEO strategist",
      "Priority publishing & support",
    ],
  },
];

const PROOF = [
  { n: "120+", l: "small-business sites rebuilt & optimized" },
  { n: "3.2×", l: "average lift in AI citations within 90 days" },
  { n: "94%", l: "of clients renew past the 6-month minimum" },
  { n: "4.9/5", l: "average client rating across 80+ reviews" },
];

const WORK = [
  {
    biz: "Lone Star Comfort",
    cat: "HVAC · Home services",
    res: "cited in 4/5 engines · +340% leads",
    c: "var(--c5)",
  },
  {
    biz: "RapidFlow Plumbing",
    cat: "Plumbing",
    res: "#1 in Perplexity · 2.1× calls",
    c: "var(--c4)",
  },
  {
    biz: "Summit Auto Works",
    cat: "Auto repair",
    res: "cited in 5/5 · +58% bookings",
    c: "var(--c1)",
  },
  {
    biz: "Harvest Table",
    cat: "Restaurant",
    res: "top AI pick · +220% reservations",
    c: "var(--c2)",
  },
  {
    biz: "Meridian Books",
    cat: "Bookkeeping",
    res: "cited in 4/5 · 3.4× inquiries",
    c: "var(--accent)",
  },
  {
    biz: "Ascend Pilates",
    cat: "Wellness",
    res: "top AI pick · +180% sign-ups",
    c: "var(--c6)",
  },
];

const TESTIMONIALS = [
  {
    q: "Within two months ChatGPT was recommending us by name for AC repair. We went from invisible to booked solid through the summer.",
    who: "Marcus T.",
    biz: "Lone Star Comfort HVAC · Austin, TX",
  },
  {
    q: "The website alone would've cost me twelve grand. Getting it free with the content service was a no-brainer — and the writing sounds like us.",
    who: "Dana R.",
    biz: "Harvest Table · Portland, OR",
  },
  {
    q: "I don't understand the technical side and I don't need to. They handle everything; I just watch the calls come in.",
    who: "Jorge M.",
    biz: "Summit Auto Works · Denver, CO",
  },
];

const PROCESS = [
  {
    t: "Free audit",
    d: "See exactly how AI describes your business today. No commitment, no email required to view your score.",
  },
  {
    t: "Strategy call",
    d: "We walk your results together and map the highest-leverage fixes for your trade and market.",
  },
  {
    t: "Build & launch",
    d: "Your new AEO-structured site goes live in ~3 weeks — schema, architecture, and answer-first copy included.",
  },
  {
    t: "Publish & grow",
    d: "We publish your monthly content and track visibility across all five engines, refining as they change.",
  },
];

const FAQ = [
  {
    q: "Is the website really included for free?",
    a: "Yes. On both the $1,000 and $2,000 plans, your complete website rebuild — a $12,000+ project on its own — is included at no extra cost. There's no setup fee, and you own the site. The one-time $12,000 build only applies if you want the website without any ongoing content service.",
  },
  {
    q: "What's the 6-month minimum about?",
    a: "A new website plus consistent content takes a season to compound into durable AI citations. The 6-month minimum ensures we can deliver real results, not a half-finished launch. After six months you can continue month-to-month or cancel anytime — 94% of clients choose to stay.",
  },
  {
    q: "Do I need to understand AEO or anything technical?",
    a: "Not at all. You tell us about your business; we handle the site, schema, structured data, and writing. You stay focused on the work while we keep you the cited answer.",
  },
  {
    q: "What's the difference between $1,000 and $2,000?",
    a: "Both include the free website rebuild and the full done-for-you service. Foundation publishes 8 AEO articles a month; Growth doubles that to 16 plus seasonal campaigns, citation-consistency work, and a dedicated strategist — for owners who want to win their category faster.",
  },
  {
    q: "How soon will I see results?",
    a: "The foundational fixes (site, schema, profile) land in the first few weeks. Being consistently recommended by AI builds over the first quarter as your content and citations accumulate.",
  },
];

export default function PricingPage() {
  const jsonLd = graph([
    serviceOfferNode({
      name: "Done-for-you AEO",
      description: PRICING_DESCRIPTION,
      path: "/pricing",
      serviceType: "Answer Engine Optimization",
      tiers: TIERS.map((t) => ({
        name: t.name,
        price: t.price,
        description: t.hl,
      })),
    }),
    faqNode(
      "/pricing",
      FAQ.map((f) => ({ q: f.q, a: f.a })),
    ),
    breadcrumbNode([{ name: "Pricing", path: "/pricing" }]),
  ]);

  return (
    <>
      <JsonLd graph={jsonLd} />
      <header className="py-14">
        <Container className="max-w-3xl">
          <Kicker>Done-for-you AEO</Kicker>
          <h1 className="mt-4 text-[clamp(34px,5vw,56px)] leading-[1.02] font-medium tracking-[-0.025em]">
            We make you the answer.{" "}
            <em className="text-accent [font-style:italic]">
              The website&rsquo;s on us.
            </em>
          </h1>
          <p className="text-ink-2 mt-5 text-[19px] leading-relaxed">
            Every plan includes a complete, custom AEO-structured website
            rebuild — a $12,000+ project on its own — then the monthly content
            that keeps you the answer AI gives. You run your business; we keep
            you the name it recommends.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button href="/audit" size="lg">
              See your free AI score →
            </Button>
            <Button href="#pricing" variant="ghost" size="lg">
              View plans &amp; pricing
            </Button>
          </div>
        </Container>
      </header>

      {/* offer anchor */}
      <Section>
        <div className="border-line-2 bg-accent-soft grid items-center gap-5 rounded-2xl border px-7 py-6 sm:grid-cols-[auto_1fr_auto]">
          <span className="text-accent font-serif text-[30px]">✦</span>
          <div>
            <h2 className="text-[21px] font-medium">
              Your $12,000 website rebuild — included free.
            </h2>
            <p className="text-ink-2 mt-1 max-w-[62ch] text-[14.5px]">
              Every subscription includes a complete, custom AEO-structured
              website build. No setup fee, no separate invoice. You own the site
              outright.
            </p>
          </div>
          <div className="text-accent text-right font-serif text-[40px] leading-none">
            $0
            <span className="text-muted block font-sans text-[11px]">
              website build on any plan
            </span>
          </div>
        </div>
      </Section>

      {/* tiers */}
      <Section bordered={false} id="pricing">
        <SectionHead
          title="Done-for-you, monthly"
          eyebrow="6-month minimum · cancel anytime after"
        />
        <div className="grid gap-5 lg:grid-cols-2">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`relative flex flex-col rounded-2xl border p-8 ${
                tier.featured
                  ? "border-accent bg-panel shadow-[0_30px_70px_-50px_color-mix(in_oklab,var(--accent)_60%,transparent)]"
                  : "border-line bg-paper"
              }`}
            >
              {tier.flag ? (
                <span className="bg-accent absolute -top-3 left-8 rounded-full px-3 py-1 font-mono text-[10px] tracking-[0.08em] text-white uppercase">
                  {tier.flag}
                </span>
              ) : null}
              <span className="text-muted font-mono text-[11px] tracking-[0.1em] uppercase">
                {tier.name}
              </span>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="font-serif text-[46px] leading-none tracking-[-0.02em]">
                  {tier.price}
                </span>
                <span className="text-muted font-mono text-[13px]">
                  / month
                </span>
              </div>
              <div className="text-muted mt-1 font-mono text-[11px]">
                6-month minimum · website build included
              </div>
              <p className="text-ink-2 mt-4 text-[14.5px] leading-relaxed">
                {tier.hl}
              </p>
              <ul className="mt-5 flex flex-1 flex-col gap-2.5">
                {tier.features.map((f) => (
                  <li key={f} className="text-ink-2 flex gap-2.5 text-[14px]">
                    <span className="text-accent font-bold">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                href="/audit"
                variant={tier.featured ? "primary" : "ghost"}
                size="lg"
                className="mt-7"
              >
                Start with a free audit →
              </Button>
            </div>
          ))}
        </div>
      </Section>

      {/* proof band */}
      <Section>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {PROOF.map((p) => (
            <div key={p.l}>
              <div className="text-accent font-serif text-[44px] leading-none tracking-[-0.02em]">
                {p.n}
              </div>
              <div className="text-muted mt-2.5 font-mono text-[11px] leading-snug">
                {p.l}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* selected work */}
      <Section id="gallery">
        <SectionHead
          title="Sites we've built"
          eyebrow="Across 9 industries & counting"
        />
        <div className="grid gap-px overflow-hidden sm:grid-cols-2 lg:grid-cols-3">
          {WORK.map((w) => (
            <div
              key={w.biz}
              className="border-line bg-paper border p-6"
              style={{ boxShadow: `inset 0 3px 0 ${w.c}` }}
            >
              <div
                className="font-mono text-[10.5px] tracking-[0.08em] uppercase"
                style={{ color: w.c }}
              >
                {w.cat}
              </div>
              <h3 className="mt-2 font-serif text-[20px]">{w.biz}</h3>
              <p className="text-muted mt-3 font-mono text-[11.5px]">{w.res}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* testimonials */}
      <Section>
        <SectionHead
          title="What owners say"
          eyebrow="Real results, real businesses"
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.who}
              className="border-line bg-panel flex flex-col rounded-2xl border p-6"
            >
              <div className="text-accent text-[14px]">★★★★★</div>
              <blockquote className="mt-3 flex-1 font-serif text-[16px] leading-snug italic">
                “{t.q}”
              </blockquote>
              <figcaption className="mt-4 flex items-center gap-3">
                <span className="bg-accent-soft border-line-2 text-accent grid size-9 place-items-center rounded-full border font-serif italic">
                  {t.who.charAt(0)}
                </span>
                <span>
                  <span className="block text-[14px] font-medium">{t.who}</span>
                  <span className="text-muted block font-mono text-[10.5px]">
                    {t.biz}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      {/* one-time build */}
      <Section>
        <div className="border-line bg-paper flex flex-wrap items-center justify-between gap-6 rounded-2xl border p-7">
          <div className="max-w-[60ch]">
            <span className="text-muted font-mono text-[10.5px] tracking-[0.1em] uppercase">
              Website rebuild · one-time
            </span>
            <h2 className="mt-1.5 text-[21px] font-medium">
              Just want the website?
            </h2>
            <p className="text-ink-2 mt-1.5 text-[14px] leading-relaxed">
              Prefer to handle content yourself? We&rsquo;ll design and build
              your complete AEO-structured site as a one-time project. (Most
              owners choose a subscription instead, since the build comes free.)
            </p>
          </div>
          <div className="text-right">
            <div className="font-serif text-[40px] leading-none">
              $12,000<span className="text-muted text-[20px]">+</span>
            </div>
            <Button href="/audit" variant="ghost" size="sm" className="mt-3">
              Request a quote →
            </Button>
          </div>
        </div>
      </Section>

      {/* process */}
      <Section>
        <SectionHead title="How it works" eyebrow="Four steps, no pressure" />
        <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS.map((step, i) => (
            <li
              key={step.t}
              className="border-line bg-panel rounded-2xl border p-6"
            >
              <div className="text-accent font-serif text-[30px] leading-none">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="mt-2.5 text-[16px] font-medium">{step.t}</h3>
              <p className="text-muted mt-1.5 text-[13px] leading-relaxed">
                {step.d}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      {/* faq */}
      <Section>
        <SectionHead title="Questions, answered" />
        <div className="mx-auto max-w-[760px]">
          {FAQ.map((item, i) => (
            <details
              key={item.q}
              className="border-line border-b"
              open={i === 0}
            >
              <summary className="text-ink hover:text-accent cursor-pointer list-none py-4 font-serif text-[17px] [&::-webkit-details-marker]:hidden">
                {item.q}
              </summary>
              <p className="text-ink-2 pb-4 text-[14.5px] leading-relaxed">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </Section>

      <Section bordered={false}>
        <CtaBand
          title={
            <>
              Start with a look at where you stand —{" "}
              <em className="text-accent [font-style:italic]">free.</em>
            </>
          }
          description="See your AI-visibility score first. If it makes sense, we'll make you the answer."
          primary={{ href: "/audit", label: "Run my free audit →" }}
          secondary={{ href: "/canon", label: "Explore the framework" }}
        />
      </Section>
    </>
  );
}
