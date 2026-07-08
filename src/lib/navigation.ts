/**
 * Central navigation config. Single source for header + footer links, matching
 * the design's information architecture. Add routes here as they ship.
 */

export interface NavItem {
  href: string;
  label: string;
}

/** Primary header nav — the design IA. */
export const mainNav: NavItem[] = [
  { href: "/", label: "Overview" },
  { href: "/canon", label: "The Canon" },
  { href: "/learn", label: "AEO school" },
  { href: "/tools", label: "Tools" },
  { href: "/industries", label: "Industries" },
  { href: "/pricing", label: "Pricing" },
];

/** Header right-side CTAs. */
export const navCtas = {
  ghost: { href: "/pricing", label: "Done-for-you" },
  primary: { href: "/contact", label: "Book a call" },
} as const;

export interface FooterColumn {
  title: string;
  links: NavItem[];
}

export const footerNav: FooterColumn[] = [
  {
    title: "Services",
    links: [
      { href: "/contact", label: "Book a call" },
      { href: "/pricing", label: "Pricing" },
      { href: "/pricing#gallery", label: "Portfolio" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "The Canon",
    links: [
      { href: "/canon", label: "The framework" },
      { href: "/pillars", label: "The 8 pillars" },
      { href: "/manifesto", label: "The Manifesto" },
      { href: "/whitepaper", label: "Research whitepaper" },
      { href: "/state-of-aeo-2026", label: "State of AEO 2026" },
    ],
  },
  {
    title: "Learn",
    links: [
      { href: "/learn", label: "AEO school" },
      { href: "/articles", label: "Article archive" },
      { href: "/glossary", label: "Glossary" },
      { href: "/topics", label: "Topics" },
      { href: "/courses", label: "Courses" },
      { href: "/authority", label: "Authority Playbooks" },
      { href: "/industries", label: "Industries" },
      { href: "/tools", label: "Tools" },
    ],
  },
];
