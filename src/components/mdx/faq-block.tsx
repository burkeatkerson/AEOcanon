/**
 * Q&A pairs as semantic, answer-first content. Drives the on-page FAQ (from
 * article frontmatter `faqs`) and is available in MDX. The matching FAQPage
 * JSON-LD is emitted from the same data by the SEO layer, so they never drift.
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
    <section aria-labelledby="faq-heading" className="my-12 font-sans">
      <h2
        id="faq-heading"
        className="text-ink text-2xl font-medium tracking-tight"
      >
        {heading}
      </h2>
      <dl className="divide-line mt-5 divide-y">
        {items.map((item) => (
          <div key={item.q} className="py-4">
            <dt className="text-ink font-medium">{item.q}</dt>
            <dd className="text-ink-2 mt-1.5 leading-relaxed">{item.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
