import Link from "next/link";

/**
 * "Related questions" for the Q&A Library — an expandable list (native <details>,
 * zero JS) where each item shows a short answer and links to the full answer
 * page. Content lives in the DOM even when collapsed, so it's accessible and
 * extractable by answer engines. The connective tissue that grows the library.
 */
export function RelatedQuestions({
  items,
  heading = "Related questions",
}: {
  items: { q: string; a: string; href: string }[];
  heading?: string;
}) {
  if (items.length === 0) return null;
  return (
    <section aria-labelledby="related-q-heading" className="not-prose my-10 font-sans">
      <h2
        id="related-q-heading"
        className="text-ink text-2xl font-medium tracking-tight"
      >
        {heading}
      </h2>
      <div className="mt-4">
        {items.map((item) => (
          <details key={item.href} className="border-line border-b">
            <summary className="text-ink hover:text-accent marker:text-accent cursor-pointer py-4 font-serif text-[17px] leading-snug">
              {item.q}
            </summary>
            <div className="pb-4">
              <p className="text-ink-2 text-[14.5px] leading-relaxed">
                {item.a}
              </p>
              <Link
                href={item.href}
                className="text-accent mt-2 inline-block font-mono text-[11.5px]"
              >
                Read the full answer →
              </Link>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
