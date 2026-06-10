import Link from "next/link";
import { TopicMark, topicColor } from "./topic-mark";
import { topicLabel } from "@/lib/taxonomy";

/**
 * Typographic card covers — the headline *is* the art. Each cover sets the post's
 * title in the brand serif on a subtle topic-tinted ground, with a faint topic
 * glyph watermark (position/rotation seeded by slug, so cards vary) and a small
 * topic chip. Generated, never authored; fully server-rendered and theme-aware →
 * scales to hundreds of posts. Consistency comes from topic colour + glyph;
 * variation comes from the unique headline and the seeded watermark.
 */

function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}
function mulberry32(a: number): () => number {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function tintBg(color: string, r: () => number): string {
  const angle = Math.round(120 + r() * 60);
  return `linear-gradient(${angle}deg, color-mix(in oklab, ${color} 13%, var(--panel)), color-mix(in oklab, ${color} 4%, var(--panel)))`;
}

/** The faint glyph watermark bleeding off a seeded corner. */
function Watermark({
  children,
  r,
  color,
}: {
  children: React.ReactNode;
  r: () => number;
  color?: string;
}) {
  const size = 116 + Math.floor(r() * 46);
  const rot = Math.round(r() * 34 - 17);
  const fromRight = r() < 0.6;
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute"
      style={{
        bottom: -Math.round(size * 0.22),
        [fromRight ? "right" : "left"]: -Math.round(size * 0.12),
        transform: `rotate(${rot}deg)`,
        opacity: 0.07,
        color,
        lineHeight: 0,
      }}
    >
      {typeof children === "string" ? (
        <span style={{ fontSize: size, fontFamily: "var(--serif)" }}>{children}</span>
      ) : (
        children
      )}
    </span>
  );
}

// --- article cover (the title is a link; card itself is not) ----------------

export function ArticleCover({
  slug,
  topic,
  title,
  href,
}: {
  slug: string;
  topic?: string;
  title: string;
  href: string;
}) {
  const color = topicColor(topic);
  const r = mulberry32(hashStr(slug));
  return (
    <div
      className="border-line relative overflow-hidden border-b px-5 pt-4 pb-5"
      style={{ background: tintBg(color, r) }}
    >
      <Watermark r={r} color={color}>
        <TopicMark topic={topic} size={130} inherit />
      </Watermark>
      <div className="relative flex items-center gap-1.5">
        <TopicMark topic={topic} size={14} />
        <span
          className="font-mono text-[10px] tracking-[0.1em] uppercase"
          style={{ color }}
        >
          {topic ? topicLabel(topic) : "Article"}
        </span>
      </div>
      <h3 className="relative mt-2.5 font-serif text-[19px] leading-[1.16] font-medium tracking-[-0.01em] text-balance">
        <Link
          href={href}
          className="hover:text-accent after:absolute after:inset-0 transition-colors"
        >
          {title}
        </Link>
      </h3>
    </div>
  );
}

// --- course cover (parent card is the link; title is plain) -----------------

const LEVEL_COLOR: Record<string, string> = {
  beginner: "var(--c3)",
  intermediate: "var(--c4)",
  advanced: "var(--c5)",
  applied: "var(--c6)",
  practitioner: "var(--c5)",
};

export function CourseCover({
  slug,
  level,
  title,
}: {
  slug: string;
  level?: string;
  title: string;
}) {
  const color = LEVEL_COLOR[(level ?? "").toLowerCase()] ?? "var(--accent)";
  const r = mulberry32(hashStr(slug));
  return (
    <div
      className="border-line relative overflow-hidden border-b px-6 pt-5 pb-6"
      style={{ background: tintBg(color, r) }}
    >
      <Watermark r={r} color={color}>
        ✦
      </Watermark>
      <span
        className="relative font-mono text-[10px] tracking-[0.12em] uppercase"
        style={{ color }}
      >
        ✦ {level} · Course
      </span>
      <h3 className="relative mt-2 font-serif text-[24px] leading-[1.12] font-medium tracking-[-0.015em] text-balance">
        {title}
      </h3>
    </div>
  );
}
