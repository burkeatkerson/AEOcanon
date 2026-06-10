"use client";

import { useCallback, useEffect, useState } from "react";
import { Search, PanelLeft, X } from "lucide-react";
import { SchoolNav } from "@/components/school/school-nav";
import { SchoolSearch } from "@/components/school/school-search";
import type { SchoolSearchItem } from "@/lib/school";
import type { TopicWithCount } from "@/lib/content";

/**
 * The AEO School layout shell. Wraps every `(content)` page with a persistent
 * left-rail navigation aligned to the site's centered gutter, plus a mobile
 * "school bar" that opens the nav as a drawer. Owns the ⌘K command-palette state
 * so the global shortcut and the sidebar's Search button share one dialog.
 */
export function SchoolShell({
  items,
  topics,
  children,
}: {
  items: SchoolSearchItem[];
  topics: TopicWithCount[];
  children: React.ReactNode;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const openSearch = useCallback(() => {
    setDrawerOpen(false);
    setSearchOpen(true);
  }, []);

  // Global ⌘K / Ctrl-K opens the palette anywhere in the school.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {/* Mobile school bar — sits directly under the sticky site header. */}
      <div className="border-line bg-bg/85 sticky top-16 z-40 border-b backdrop-blur-md lg:hidden">
        <div className="mx-auto flex w-full max-w-[1200px] items-center gap-2 px-5 py-2.5 sm:px-8">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="border-line-2 text-ink-2 hover:text-ink flex items-center gap-2 rounded-md border px-3 py-1.5 font-mono text-[12px]"
          >
            <PanelLeft className="size-4" />
            Browse
          </button>
          <button
            type="button"
            onClick={openSearch}
            className="border-line-2 text-muted hover:text-ink ml-auto flex items-center gap-2 rounded-md border px-3 py-1.5 font-mono text-[12px]"
          >
            <Search className="size-4" />
            Search
          </button>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8 lg:px-10">
        <div className="lg:grid lg:grid-cols-[248px_minmax(0,1fr)] lg:gap-10">
          {/* Desktop sticky sidebar. */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto py-10 pr-2">
              <SchoolNav topics={topics} onSearchClick={openSearch} />
            </div>
          </aside>

          <div className="min-w-0">{children}</div>
        </div>
      </div>

      {/* Mobile nav drawer. */}
      {drawerOpen ? (
        <div className="fixed inset-0 z-[90] lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setDrawerOpen(false)}
            className="bg-ink/40 absolute inset-0 backdrop-blur-sm"
          />
          <div className="bg-panel border-line absolute inset-y-0 left-0 flex w-[290px] max-w-[85vw] flex-col overflow-y-auto border-r p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-faint font-mono text-[10px] tracking-[0.16em] uppercase">
                Navigate
              </span>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close"
                className="border-line-2 text-muted hover:text-ink grid size-8 place-items-center rounded-md border"
              >
                <X className="size-4" />
              </button>
            </div>
            <SchoolNav
              topics={topics}
              onSearchClick={openSearch}
              onNavigate={() => setDrawerOpen(false)}
            />
          </div>
        </div>
      ) : null}

      {searchOpen ? (
        <SchoolSearch items={items} onClose={() => setSearchOpen(false)} />
      ) : null}
    </>
  );
}
