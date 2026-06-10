"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  Compass,
  GraduationCap,
  Layers,
  Library,
  Hash,
  BookOpen,
  ScrollText,
  Building2,
  Wrench,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { SCHOOL_NAV, type SchoolIcon } from "@/lib/school-nav";
import { topicLabel } from "@/lib/taxonomy";
import type { TopicWithCount } from "@/lib/content";
import { cn } from "@/lib/utils";

const ICONS: Record<SchoolIcon, LucideIcon> = {
  compass: Compass,
  graduation: GraduationCap,
  layers: Layers,
  library: Library,
  hash: Hash,
  book: BookOpen,
  scroll: ScrollText,
  building: Building2,
  wrench: Wrench,
};

function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * The school's left-rail navigation. Renders the static IA from `school-nav.ts`
 * with active-route highlighting, plus an expandable Topics group that lists
 * every used topic with its live article count. Shared by the desktop sidebar
 * and the mobile drawer — `onNavigate` lets the drawer close on selection.
 */
export function SchoolNav({
  topics,
  onSearchClick,
  onNavigate,
}: {
  topics: TopicWithCount[];
  onSearchClick: () => void;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const onTopics = pathname === "/topics" || pathname.startsWith("/topics/");
  const [topicsOpen, setTopicsOpen] = useState(onTopics);

  return (
    <nav aria-label="AEO School" className="flex flex-col gap-6">
      <div>
        <p className="text-faint mb-3 px-2 font-mono text-[10px] tracking-[0.16em] uppercase">
          AEO School
        </p>
        <button
          type="button"
          onClick={onSearchClick}
          className="border-line bg-paper text-muted hover:border-accent hover:text-ink flex w-full items-center gap-2.5 rounded-lg border px-3 py-2 transition-colors"
        >
          <Search className="size-4 shrink-0" />
          <span className="text-[13px]">Search…</span>
          <kbd className="border-line-2 text-faint ml-auto rounded border px-1.5 py-0.5 font-mono text-[9.5px]">
            ⌘K
          </kbd>
        </button>
      </div>

      {SCHOOL_NAV.map((section, si) => (
        <div key={section.title ?? `s${si}`}>
          {section.title ? (
            <p className="text-faint mb-1.5 px-2 font-mono text-[10px] tracking-[0.16em] uppercase">
              {section.title}
            </p>
          ) : null}
          <ul className="flex flex-col gap-0.5">
            {section.links.map((link) => {
              const Icon = ICONS[link.icon];
              const active = isActive(pathname, link.href);
              const rowClass = cn(
                "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13.5px] transition-colors",
                active
                  ? "bg-accent-soft text-ink font-medium"
                  : "text-ink-2 hover:bg-paper hover:text-ink",
              );

              if (link.expandable) {
                return (
                  <li key={link.href}>
                    <div className="flex items-stretch">
                      <Link
                        href={link.href}
                        onClick={onNavigate}
                        className={cn(rowClass, "flex-1")}
                      >
                        <Icon className="size-4 shrink-0" />
                        {link.label}
                      </Link>
                      <button
                        type="button"
                        aria-label={
                          topicsOpen ? "Collapse topics" : "Expand topics"
                        }
                        aria-expanded={topicsOpen}
                        onClick={() => setTopicsOpen((v) => !v)}
                        className="text-muted hover:text-ink grid w-7 shrink-0 place-items-center rounded-lg"
                      >
                        <ChevronRight
                          className={cn(
                            "size-3.5 transition-transform motion-reduce:transition-none",
                            topicsOpen && "rotate-90",
                          )}
                        />
                      </button>
                    </div>
                    {topicsOpen ? (
                      <ul className="border-line mt-0.5 mb-1 ml-[18px] flex flex-col gap-0.5 border-l pl-2.5">
                        {topics.map((topic) => {
                          const href = `/topics/${topic.slug}`;
                          const tActive = pathname === href;
                          return (
                            <li key={topic.slug}>
                              <Link
                                href={href}
                                onClick={onNavigate}
                                className={cn(
                                  "flex items-center justify-between gap-2 rounded-md px-2.5 py-1.5 text-[12.5px] transition-colors",
                                  tActive
                                    ? "text-accent font-medium"
                                    : "text-muted hover:text-ink",
                                )}
                              >
                                <span className="truncate">
                                  {topicLabel(topic.slug)}
                                </span>
                                <span className="text-faint shrink-0 font-mono text-[10px]">
                                  {topic.count}
                                </span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    ) : null}
                  </li>
                );
              }

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={onNavigate}
                    className={rowClass}
                  >
                    <Icon className="size-4 shrink-0" />
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
