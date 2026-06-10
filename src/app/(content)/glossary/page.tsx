import type { Metadata } from "next";
import Link from "next/link";
import { Kicker } from "@/components/ui/eyebrow";
import { JsonLd } from "@/components/seo/json-ld";
import {
  GlossaryIndex,
  type GlossaryItem,
} from "@/components/glossary/glossary-index";
import { getAllGlossary } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import {
  breadcrumbNode,
  definedTermSetNode,
  graph,
} from "@/lib/structured-data";

const TITLE = "The AEO Glossary";
const DESCRIPTION =
  "A plain-language encyclopedia of answer-engine optimization — every term that matters for getting cited by AI, defined answer-first and cross-linked to the AEO Canon. Searchable, A–Z.";

export const metadata: Metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/glossary",
});

export default function GlossaryIndexPage() {
  const terms = getAllGlossary();

  const items: GlossaryItem[] = terms.map((t) => ({
    term: t.term,
    slug: t.slug,
    definition: t.definition,
    aka: t.aka,
  }));

  const jsonLd = graph([
    definedTermSetNode({
      name: TITLE,
      description: DESCRIPTION,
      path: "/glossary",
      terms: terms.map((t) => ({ term: t.term, path: t.url })),
    }),
    breadcrumbNode([{ name: "Glossary", path: "/glossary" }]),
  ]);

  return (
    <div className="py-14">
      <JsonLd graph={jsonLd} />
      <header className="max-w-3xl">
        <Kicker>Reference · {terms.length} terms</Kicker>
        <h1 className="mt-4 text-[clamp(32px,4.8vw,52px)] leading-[1.04] font-medium tracking-[-0.02em]">
          The AEO Glossary
        </h1>
        <p className="text-ink-2 mt-5 max-w-[64ch] text-[18px] leading-relaxed">
          A plain-language encyclopedia of answer-engine optimization. Every
          term is defined answer-first — the one sentence you could quote — then
          expanded with an example and linked to the relevant{" "}
          <Link href="/pillars" className="text-accent">
            Canon pillar
          </Link>
          . Search or jump by letter.
        </p>
      </header>

      <div className="mt-10">
        <GlossaryIndex items={items} />
      </div>

      <p className="text-muted mt-12 text-[14px]">
        New to the framework? Start with{" "}
        <Link href="/learn/aeo-canon" className="text-accent">
          the AEO Canon
        </Link>{" "}
        or the{" "}
        <Link href="/learn/what-is-aeo" className="text-accent">
          what is AEO
        </Link>{" "}
        overview.
      </p>
    </div>
  );
}
