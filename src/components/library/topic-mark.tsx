import { cn } from "@/lib/utils";

/**
 * Topic identity — a fixed colour + icon per topic, so every card in a topic
 * reads as one family (the Spectrum "colour as category" system). New topics
 * fall back gracefully. Pure inline SVG, theme-aware via currentColor.
 */

/** Topic → Spectrum colour token. Reused hues are always paired with a distinct icon. */
export const TOPIC_COLOR: Record<string, string> = {
  "aeo-fundamentals": "var(--accent)",
  "answer-engines": "var(--c6)",
  "ai-fundamentals": "var(--c4)",
  "structured-data": "var(--c2)",
  "content-strategy": "var(--c3)",
  "technical-seo": "var(--c1)",
  "on-page-seo": "var(--c5)",
  "keyword-research": "var(--accent-2)",
  "link-building": "var(--c6)",
  "local-seo": "var(--c2)",
  "analytics-measurement": "var(--c4)",
};

export function topicColor(slug?: string): string {
  return (slug && TOPIC_COLOR[slug]) || "var(--accent)";
}

const ICONS: Record<string, React.ReactNode> = {
  // target — the core framework
  "aeo-fundamentals": (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="0.8" fill="currentColor" stroke="none" />
    </>
  ),
  // answer bubble + spark
  "answer-engines": (
    <>
      <path d="M4.5 6.5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H10l-4 3.2V15.5H6.5a2 2 0 0 1-2-2Z" />
      <path d="M12 8v3.4M10.3 9.7h3.4" />
    </>
  ),
  // chip / node — AI internals
  "ai-fundamentals": (
    <>
      <rect x="7" y="7" width="10" height="10" rx="1.5" />
      <circle cx="12" cy="12" r="2" />
      <path d="M12 4v3M12 17v3M4 12h3M17 12h3" />
    </>
  ),
  // braces — structured data
  "structured-data": (
    <>
      <path d="M9.5 4.5C7.5 4.5 8 8 6 8c2 0 1.5 3.5 3.5 3.5" />
      <path d="M9.5 19.5C7.5 19.5 8 16 6 16c2 0 1.5-3.5 3.5-3.5" />
      <path d="M14.5 4.5C16.5 4.5 16 8 18 8c-2 0-1.5 3.5-3.5 3.5" />
      <path d="M14.5 19.5C16.5 19.5 16 16 18 16c-2 0-1.5-3.5-3.5-3.5" />
    </>
  ),
  // pencil — content strategy
  "content-strategy": (
    <>
      <path d="M5 19l1-4 9.5-9.5a1.8 1.8 0 0 1 2.5 0l1 1a1.8 1.8 0 0 1 0 2.5L9.5 18.5Z" />
      <path d="M14 7l3 3" />
    </>
  ),
  // gear — technical SEO
  "technical-seo": (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3.5v3M12 17.5v3M3.5 12h3M17.5 12h3M5.8 5.8l2.1 2.1M16.1 16.1l2.1 2.1M18.2 5.8l-2.1 2.1M7.9 16.1l-2.1 2.1" />
    </>
  ),
  // page layout — on-page SEO
  "on-page-seo": (
    <>
      <rect x="5.5" y="4.5" width="13" height="15" rx="1.6" />
      <path d="M5.5 9h13M8.5 12.5h7M8.5 15.5h5" />
    </>
  ),
  // magnifier — keyword research
  "keyword-research": (
    <>
      <circle cx="11" cy="11" r="6" />
      <path d="M15.5 15.5 19.5 19.5" />
    </>
  ),
  // chain — link building
  "link-building": (
    <>
      <path d="M9.5 14.5a3.5 3.5 0 0 1 0-5l2-2a3.5 3.5 0 0 1 5 5l-1 1" />
      <path d="M14.5 9.5a3.5 3.5 0 0 1 0 5l-2 2a3.5 3.5 0 0 1-5-5l1-1" />
    </>
  ),
  // map pin — local SEO
  "local-seo": (
    <>
      <path d="M12 20s6-5.3 6-10a6 6 0 1 0-12 0c0 4.7 6 10 6 10Z" />
      <circle cx="12" cy="10" r="2.2" />
    </>
  ),
  // bars — analytics & measurement
  "analytics-measurement": (
    <>
      <path d="M5 19h14" />
      <path d="M8 19v-5M12 19v-9M16 19v-7" />
    </>
  ),
};

const DEFAULT_ICON = (
  <>
    <circle cx="12" cy="12" r="8" />
    <path d="M12 8v8M8 12h8" />
  </>
);

/** The topic glyph, coloured by its topic (or currentColor if `inherit`). */
export function TopicMark({
  topic,
  size = 20,
  inherit = false,
  className,
  style,
}: {
  topic?: string;
  size?: number;
  inherit?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  const icon = (topic && ICONS[topic]) || DEFAULT_ICON;
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      role="presentation"
      aria-hidden
      className={cn("shrink-0", className)}
      style={{ color: inherit ? undefined : topicColor(topic), ...style }}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {icon}
    </svg>
  );
}
