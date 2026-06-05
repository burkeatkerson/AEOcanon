/**
 * Renders a list of Q&A pairs as semantic, answer-first content. Drives the
 * on-page FAQ section (from article frontmatter `faqs`) and is also available
 * directly inside MDX. The matching FAQPage JSON-LD is emitted separately by
 * the SEO layer from the same data, so markup and structured data never drift.
 */
export function FAQBlock({
  items,
  heading = "Frequently asked questions",
}: {
  items: { q: string; a: string }[];
  heading?: string;
}) {
  if (items.length === 0) return null;
  return (
    <section aria-labelledby="faq-heading" className="my-10">
      <h2 id="faq-heading" className="text-2xl font-semibold tracking-tight">
        {heading}
      </h2>
      <dl className="divide-border/60 mt-4 divide-y">
        {items.map((item) => (
          <div key={item.q} className="py-4">
            <dt className="font-medium">{item.q}</dt>
            <dd className="text-muted-foreground mt-1 leading-relaxed">
              {item.a}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
