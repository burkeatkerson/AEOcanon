import type { Article } from "@/lib/content";

type TocEntry = Article["toc"][number];

function TocList({ entries }: { entries: TocEntry[] }) {
  return (
    <ul className="flex flex-col">
      {entries.map((entry) => (
        <li key={entry.url}>
          <a
            href={entry.url}
            className="border-line text-muted hover:text-accent hover:border-accent block border-l-2 py-1.5 pl-3 leading-snug transition-colors"
          >
            {entry.title}
          </a>
          {entry.items.length > 0 ? (
            <div className="ml-3">
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
    <nav aria-label="On this page" className="font-mono text-[11.5px]">
      <h2 className="text-faint mb-3 text-[10px] tracking-[0.12em] uppercase">
        On this page
      </h2>
      <TocList entries={toc} />
    </nav>
  );
}
