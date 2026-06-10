/**
 * The AEO School sidebar navigation — the single source for the left-rail IA that
 * appears across the `(content)` route group. Pure data: `icon` is a string key
 * the client nav maps to a Lucide component, so this module stays serializable
 * and free of React/icon imports. The dynamic Topics sublist (with live article
 * counts) is supplied separately at render time from `getUsedTopics()`.
 */

export type SchoolIcon =
  | "compass"
  | "graduation"
  | "layers"
  | "library"
  | "hash"
  | "book"
  | "scroll"
  | "building"
  | "wrench";

export interface SchoolNavLink {
  href: string;
  label: string;
  icon: SchoolIcon;
  /** Marks the Topics row, which expands into the live topic list. */
  expandable?: boolean;
}

export interface SchoolNavSection {
  title?: string;
  links: SchoolNavLink[];
}

export const SCHOOL_NAV: SchoolNavSection[] = [
  {
    links: [{ href: "/learn", label: "Start here", icon: "compass" }],
  },
  {
    title: "Learn",
    links: [
      { href: "/courses", label: "Courses", icon: "graduation" },
      { href: "/topics", label: "Topics", icon: "layers", expandable: true },
      { href: "/articles", label: "All articles", icon: "library" },
      { href: "/glossary", label: "Glossary", icon: "hash" },
    ],
  },
  {
    title: "The Canon",
    links: [
      { href: "/pillars", label: "The 8 Pillars", icon: "book" },
      { href: "/authority", label: "Authority Playbooks", icon: "scroll" },
    ],
  },
  {
    title: "Apply",
    links: [
      { href: "/industries", label: "Industries", icon: "building" },
      { href: "/tools", label: "Tools", icon: "wrench" },
    ],
  },
];
