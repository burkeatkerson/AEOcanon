import type { Article } from "@/lib/content";

type TocEntry = Article["toc"][number];

function TocList({ entries }: { entries: TocEntry[] }) {
  return (
    <ul className="space-y-2">
      {entries.map((entry) => (
        <li key={entry.url}>
          <a
            href={entry.url}
            className="text-muted-foreground hover:text-foreground block leading-snug transition-colors"
          >
            {entry.title}
          </a>
          {entry.items.length > 0 ? (
            <div className="border-border/60 mt-2 ml-3 border-l pl-3">
              <TocList entries={entry.items} />
            </div>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

/** Sticky in-page navigation built from an article's computed `toc`. */
export function TableOfContents({ toc }: { toc: TocEntry[] }) {
  if (toc.length === 0) return null;
  return (
    <nav aria-label="On this page" className="text-sm">
      <p className="text-foreground mb-3 font-semibold">On this page</p>
      <TocList entries={toc} />
    </nav>
  );
}
