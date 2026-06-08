/**
 * Central navigation config. Single source for header + footer links so the IA
 * scales without editing layout components. Add routes here as they ship.
 */

export interface NavItem {
  href: string;
  label: string;
}

/** Primary header nav — only functional routes. */
export const mainNav: NavItem[] = [
  { href: "/", label: "Overview" },
  { href: "/learn", label: "Education" },
  { href: "/paths", label: "Paths" },
  { href: "/verticals", label: "Industries" },
  { href: "/audit", label: "Analyzer" },
];

export interface FooterColumn {
  title: string;
  links: NavItem[];
}

export const footerNav: FooterColumn[] = [
  {
    title: "Learn",
    links: [
      { href: "/learn", label: "Education Center" },
      { href: "/paths", label: "Learning Paths" },
      { href: "/verticals", label: "Industries" },
    ],
  },
  {
    title: "Tools",
    links: [{ href: "/audit", label: "AI Analyzer" }],
  },
  {
    title: "More",
    links: [
      { href: "/llms.txt", label: "llms.txt" },
      { href: "/feed.xml", label: "RSS" },
      { href: "/sitemap.xml", label: "Sitemap" },
    ],
  },
];
