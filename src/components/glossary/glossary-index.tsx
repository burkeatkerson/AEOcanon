"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Searchable, A–Z glossary index. Filters a server-prerendered term list in the
 * browser by name, definition, or synonym — no network, no persistence — so the
 * page stays statically generated and the full list is in the HTML for crawlers.
 */

export interface GlossaryItem {
  term: string;
  slug: string;
  definition: string;
  aka: string[];
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

/** Bucket letter for a term — first A–Z character, else "#". */
function letterOf(term: string): string {
  const c = term.trim().charAt(0).toUpperCase();
  return c >= "A" && c <= "Z" ? c : "#";
}

export function GlossaryIndex({ items }: { items: GlossaryItem[] }) {
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!q) return items;
    return items.filter(
      (it) =>
        it.term.toLowerCase().includes(q) ||
        it.definition.toLowerCase().includes(q) ||
        it.aka.some((a) => a.toLowerCase().includes(q)),
    );
  }, [items, q]);

  const groups = useMemo(() => {
    const map = new Map<string, GlossaryItem[]>();
    for (const it of filtered) {
      const l = letterOf(it.term);
      const bucket = map.get(l);
      if (bucket) bucket.push(it);
      else map.set(l, [it]);
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  const present = new Set(groups.map(([l]) => l));

  return (
    <div>
      <div className="border-line bg-panel sticky top-16 z-10 -mx-2 rounded-2xl border px-2 py-3 backdrop-blur-md sm:top-20">
        <label htmlFor="glossary-search" className="sr-only">
          Search the glossary
        </label>
        <input
          id="glossary-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search terms — e.g. RAG, robots.txt, share of voice…"
          className="border-line-2 bg-paper text-ink focus:border-accent w-full rounded-xl border px-4 py-2.5 text-[15px] outline-none"
        />
        <div className="mt-3 flex flex-wrap gap-x-1.5 gap-y-1 px-1">
          {ALPHABET.map((l) => {
            const has = present.has(l);
            return has ? (
              <a
                key={l}
                href={`#letter-${l}`}
                className="text-accent hover:text-accent-2 font-mono text-[12.5px] font-medium"
              >
                {l}
              </a>
            ) : (
              <span
                key={l}
                className="text-faint font-mono text-[12.5px]"
                aria-hidden
              >
                {l}
              </span>
            );
          })}
        </div>
      </div>

      <p className="text-muted mt-4 font-mono text-[11.5px]">
        {filtered.length} {filtered.length === 1 ? "term" : "terms"}
        {q ? ` matching “${query.trim()}”` : ""}
      </p>

      {groups.length === 0 ? (
        <p className="text-ink-2 mt-10 text-[15px]">
          No terms match “{query.trim()}”. Try a shorter or different search.
        </p>
      ) : (
        <div className="mt-6 flex flex-col gap-10">
          {groups.map(([letter, terms]) => (
            <section
              key={letter}
              id={`letter-${letter}`}
              className="scroll-mt-36"
            >
              <h2 className="text-accent border-line border-b pb-2 font-mono text-[13px] tracking-[0.1em]">
                {letter}
              </h2>
              <dl className="mt-4 grid gap-px">
                {terms.map((it) => (
                  <div
                    key={it.slug}
                    className={cn(
                      "hover:bg-paper -mx-2 rounded-lg px-2 py-3 sm:grid sm:grid-cols-[minmax(0,200px)_1fr] sm:gap-5",
                    )}
                  >
                    <dt className="min-w-0">
                      <Link
                        href={`/glossary/${it.slug}`}
                        className="text-ink hover:text-accent text-[15.5px] font-medium"
                      >
                        {it.term}
                      </Link>
                    </dt>
                    <dd className="text-ink-2 mt-1 text-[14.5px] leading-relaxed sm:mt-0">
                      {it.definition}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
