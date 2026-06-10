"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, CornerDownLeft, X } from "lucide-react";
import { SEARCH_TYPE_LABELS, type SchoolSearchItem } from "@/lib/school";
import { cn } from "@/lib/utils";

/**
 * The school's command palette (⌘K). A self-contained accessible modal that
 * ranks the prebuilt search index by query and lets you jump to any article,
 * term, course, topic, pillar, playbook, or tool with the keyboard. Open state
 * is owned by the shell so the same dialog serves both the sidebar trigger and
 * the global ⌘K shortcut.
 */
const MAX_RESULTS = 40;

interface Ranked {
  item: SchoolSearchItem;
  score: number;
}

function rank(items: SchoolSearchItem[], query: string): SchoolSearchItem[] {
  const q = query.trim().toLowerCase();
  if (!q) {
    // Empty query: a useful default — courses and topics first, then a sample.
    return items
      .filter((i) => i.type === "course" || i.type === "topic")
      .slice(0, 12);
  }

  const scored: Ranked[] = [];
  for (const item of items) {
    const title = item.title.toLowerCase();
    let score = 0;
    if (title === q) score = 100;
    else if (title.startsWith(q)) score = 80;
    else if (title.includes(q)) score = 60;
    else if (item.keywords?.toLowerCase().includes(q)) score = 35;
    else if (item.subtitle?.toLowerCase().includes(q)) score = 20;
    if (score > 0) scored.push({ item, score });
  }

  return scored
    .sort(
      (a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title),
    )
    .slice(0, MAX_RESULTS)
    .map((r) => r.item);
}

/**
 * Mounted by the shell only while open, so every invocation starts from a clean
 * state — no reset-on-open effect needed.
 */
export function SchoolSearch({
  items,
  onClose,
}: {
  items: SchoolSearchItem[];
  onClose: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => rank(items, query), [items, query]);
  // `active` is reset to 0 on every query change, so it always indexes `results`.
  const activeIndex = Math.min(active, Math.max(0, results.length - 1));

  // Focus the input once the dialog mounts.
  useEffect(() => {
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, []);

  // Keep the keyboard-selected row in view.
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(
      '[data-row="' + activeIndex + '"]',
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  // Lock body scroll while mounted.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const go = (item: SchoolSearchItem | undefined) => {
    if (!item) return;
    onClose();
    router.push(item.href);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive(Math.min(activeIndex + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive(Math.max(activeIndex - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(results[activeIndex]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-[12vh] motion-reduce:transition-none"
      role="dialog"
      aria-modal="true"
      aria-label="Search the AEO School"
    >
      {/* backdrop */}
      <button
        type="button"
        aria-label="Close search"
        onClick={onClose}
        className="bg-ink/40 absolute inset-0 cursor-default backdrop-blur-sm"
      />

      {/* panel */}
      <div className="border-line bg-panel relative z-10 flex max-h-[70vh] w-full max-w-[600px] flex-col overflow-hidden rounded-2xl border shadow-2xl">
        <div className="border-line flex items-center gap-3 border-b px-4">
          <Search className="text-muted size-4.5 shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            placeholder="Search courses, articles, glossary…"
            className="text-ink placeholder:text-faint h-14 w-full bg-transparent text-[15px] outline-none"
            aria-label="Search query"
            autoComplete="off"
            spellCheck={false}
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="border-line-2 text-muted hover:text-ink grid size-7 shrink-0 place-items-center rounded-md border"
          >
            <X className="size-3.5" />
          </button>
        </div>

        <div ref={listRef} className="min-h-0 flex-1 overflow-y-auto p-2">
          {results.length === 0 ? (
            <p className="text-muted px-3 py-10 text-center text-sm">
              No matches for{" "}
              <span className="text-ink font-medium">“{query}”</span>.
            </p>
          ) : (
            <ul>
              {results.map((item, i) => (
                <li key={`${item.type}:${item.href}`}>
                  <button
                    type="button"
                    data-row={i}
                    onClick={() => go(item)}
                    onMouseMove={() => setActive(i)}
                    aria-current={i === activeIndex}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                      i === activeIndex ? "bg-accent-soft" : "hover:bg-paper",
                    )}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="text-ink block truncate text-[14px] font-medium">
                        {item.title}
                      </span>
                      {item.subtitle ? (
                        <span className="text-muted block truncate text-[12px]">
                          {item.subtitle}
                        </span>
                      ) : null}
                    </span>
                    <span
                      className={cn(
                        "shrink-0 font-mono text-[9.5px] tracking-[0.08em] uppercase",
                        i === activeIndex ? "text-accent" : "text-faint",
                      )}
                    >
                      {SEARCH_TYPE_LABELS[item.type]}
                    </span>
                    {i === activeIndex ? (
                      <CornerDownLeft className="text-accent size-3.5 shrink-0" />
                    ) : null}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-line text-faint flex items-center gap-4 border-t px-4 py-2.5 font-mono text-[10.5px]">
          <span>
            <kbd className="text-muted">↑↓</kbd> navigate
          </span>
          <span>
            <kbd className="text-muted">↵</kbd> open
          </span>
          <span>
            <kbd className="text-muted">esc</kbd> close
          </span>
          <span className="ml-auto">{results.length} results</span>
        </div>
      </div>
    </div>
  );
}
