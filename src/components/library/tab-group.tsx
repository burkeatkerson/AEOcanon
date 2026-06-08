"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export interface TabDef {
  id: string;
  label: string;
  count?: number | string;
  content: React.ReactNode;
}

/**
 * Generic underline tab group. Panes are server-rendered and passed in as
 * `content`, so page data stays on the server — this only toggles visibility.
 */
export function TabGroup({
  tabs,
  initial,
  className,
}: {
  tabs: TabDef[];
  initial?: string;
  className?: string;
}) {
  const [active, setActive] = useState(initial ?? tabs[0]?.id);

  return (
    <div className={className}>
      <div
        role="tablist"
        className="border-line flex gap-1 overflow-x-auto border-b"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={active === tab.id}
            onClick={() => setActive(tab.id)}
            className={cn(
              "-mb-px shrink-0 border-b-2 px-4 py-3 font-mono text-[12.5px] tracking-[0.04em] transition-colors",
              active === tab.id
                ? "border-accent text-ink"
                : "text-muted hover:text-ink border-transparent",
            )}
          >
            {tab.label}
            {tab.count !== undefined ? (
              <span className="text-faint ml-1.5">{tab.count}</span>
            ) : null}
          </button>
        ))}
      </div>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          hidden={active !== tab.id}
          className="pt-8"
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}
