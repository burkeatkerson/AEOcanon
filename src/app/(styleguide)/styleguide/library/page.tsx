import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { Eyebrow, Kicker } from "@/components/ui/eyebrow";
import { Button } from "@/components/ui/button";
import { Tag, Badge, TagLink } from "@/components/ui/tag";
import { Callout } from "@/components/mdx/callout";
import { ComparisonTable } from "@/components/mdx/comparison-table";

export const metadata: Metadata = {
  title: "Library — Styleguide",
  robots: { index: false, follow: false },
};

function Block({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-line border-t py-12">
      <div className="text-muted mb-6 font-mono text-[10.5px] tracking-[0.1em] uppercase">
        {title}
      </div>
      {children}
    </section>
  );
}

export default function LibraryStyleguidePage() {
  return (
    <Container className="py-14">
      <header className="border-line border-b pb-10">
        <Kicker>Visual library</Kicker>
        <h1 className="mt-4 max-w-[20ch] font-serif text-[clamp(32px,5vw,52px)] leading-[1.02] font-medium">
          Components, already on-brand.
        </h1>
        <p className="text-ink-2 mt-5 max-w-[60ch] text-[18px]">
          The reusable building blocks behind the site. Everything is built on
          the Spectrum tokens, so anything you compose matches automatically —
          in light and dark.
        </p>
      </header>

      <Block title="Buttons">
        <div className="flex flex-wrap items-center gap-3">
          <Button>Primary</Button>
          <Button variant="accent">Accent</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
        </div>
      </Block>

      <Block title="Labels & tags">
        <div className="flex flex-wrap items-center gap-4">
          <Eyebrow>Eyebrow label</Eyebrow>
          <Kicker>Kicker label</Kicker>
          <Tag>Category</Tag>
          <Badge>Beginner</Badge>
          <TagLink href="#">Topic chip</TagLink>
        </div>
      </Block>

      <Block title="Callouts">
        <div className="grid gap-4 sm:grid-cols-2">
          <Callout variant="insight" title="Insight">
            <p>
              The first paragraph under a heading should stand alone as a
              quotable answer.
            </p>
          </Callout>
          <Callout variant="definition" title="AEO">
            <p>
              Structuring content so AI answer engines can extract and cite it.
            </p>
          </Callout>
          <Callout variant="tip">
            <p>
              Use one primary schema type per page; stacking conflicting types
              confuses parsers.
            </p>
          </Callout>
          <Callout variant="key">
            <p>
              Deserving the citation is the only strategy that survives model
              changes.
            </p>
          </Callout>
        </div>
      </Block>

      <Block title="Comparison table">
        <ComparisonTable
          columns={["Format", "AEO", "Classic SEO"]}
          rows={[
            ["Target", "The synthesized answer", "A ranked list position"],
            [
              "Rewards",
              "Extractable, structured passages",
              "Keywords + backlinks",
            ],
            ["Surface", "ChatGPT, Perplexity, AI Overviews", "Blue links"],
          ]}
        />
      </Block>

      <Block title="Cards">
        <div className="grid gap-5 sm:grid-cols-3">
          {["var(--c5)", "var(--c3)", "var(--c1)"].map((c, i) => (
            <article
              key={i}
              className="border-line bg-paper rounded-none border p-6"
              style={{ boxShadow: `inset 0 3px 0 ${c}` }}
            >
              <span
                className="font-mono text-[10.5px] tracking-[0.08em] uppercase"
                style={{ color: c }}
              >
                Category
              </span>
              <h3 className="mt-2.5 text-[19px] font-medium">
                Article title goes here
              </h3>
              <p className="text-muted mt-2 text-[13.5px]">
                A short, answer-first summary of the piece.
              </p>
              <p className="text-faint mt-4 font-mono text-[10.5px]">
                4 min read
              </p>
            </article>
          ))}
        </div>
      </Block>
    </Container>
  );
}
