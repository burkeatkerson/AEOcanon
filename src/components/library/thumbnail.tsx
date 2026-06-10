import { TopicMark, topicColor } from "./topic-mark";
import { cn } from "@/lib/utils";

/**
 * Procedural card thumbnails — generated, never authored. Each is a deterministic
 * SVG derived from the post's slug + topic: the topic sets a consistent colour and
 * glyph (so a topic reads as one family), while a slug-seeded generative pattern
 * varies the composition (so every card is distinct while scrolling). No image
 * files, fully server-rendered and theme-aware → scales to hundreds of posts.
 */

// --- deterministic seed + tiny PRNG ----------------------------------------

function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  }
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

const W = 120;
const H = 68;

// --- six generative patterns (all drawn in the topic colour) ----------------

type Rand = () => number;

function pRings(r: Rand): React.ReactNode {
  const cx = r() < 0.5 ? 18 + r() * 14 : W - 18 - r() * 14;
  const cy = r() < 0.5 ? 16 : H - 16;
  const base = 8 + r() * 6;
  return Array.from({ length: 5 }).map((_, i) => (
    <circle
      key={i}
      cx={cx}
      cy={cy}
      r={base + i * (7 + r() * 4)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      opacity={0.32 - i * 0.05}
    />
  ));
}

function pScatter(r: Rand): React.ReactNode {
  return Array.from({ length: 16 }).map((_, i) => (
    <circle
      key={i}
      cx={6 + r() * (W - 12)}
      cy={6 + r() * (H - 12)}
      r={1 + r() * 3.6}
      fill="currentColor"
      opacity={0.12 + r() * 0.3}
    />
  ));
}

function pBars(r: Rand): React.ReactNode {
  const n = 9;
  const gap = W / n;
  return Array.from({ length: n }).map((_, i) => {
    const h = 8 + r() * (H - 16);
    return (
      <rect
        key={i}
        x={i * gap + gap * 0.22}
        y={H - h}
        width={gap * 0.56}
        height={h}
        rx="1.2"
        fill="currentColor"
        opacity={0.14 + (i / n) * 0.26}
      />
    );
  });
}

function pMesh(r: Rand): React.ReactNode {
  const nodes = Array.from({ length: 6 }).map(() => ({
    x: 12 + r() * (W - 24),
    y: 10 + r() * (H - 20),
  }));
  const lines: React.ReactNode[] = [];
  nodes.forEach((a, i) =>
    nodes.slice(i + 1).forEach((b, j) => {
      if (Math.hypot(a.x - b.x, a.y - b.y) < 46) {
        lines.push(
          <line
            key={`l${i}-${j}`}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke="currentColor"
            strokeWidth="0.7"
            opacity="0.22"
          />,
        );
      }
    }),
  );
  return (
    <>
      {lines}
      {nodes.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={2 + r() * 1.6} fill="currentColor" opacity="0.45" />
      ))}
    </>
  );
}

function pWaves(r: Rand): React.ReactNode {
  return Array.from({ length: 3 }).map((_, k) => {
    const yBase = 18 + k * 16 + r() * 6;
    const amp = 4 + r() * 6;
    const phase = r() * Math.PI * 2;
    const pts = Array.from({ length: 13 }).map((__, i) => {
      const x = (i / 12) * W;
      const y = yBase + Math.sin(phase + (i / 12) * Math.PI * 3) * amp;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    return (
      <polyline
        key={k}
        points={pts.join(" ")}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
        opacity={0.3 - k * 0.06}
      />
    );
  });
}

function pGrid(r: Rand): React.ReactNode {
  const cols = 12;
  const rows = 6;
  const dots: React.ReactNode[] = [];
  const ox = r() * 4;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      dots.push(
        <circle
          key={`${x}-${y}`}
          cx={ox + 6 + x * ((W - 12) / (cols - 1))}
          cy={8 + y * ((H - 16) / (rows - 1))}
          r={0.7 + (x / cols) * 1.8}
          fill="currentColor"
          opacity={0.1 + (x / cols) * 0.28}
        />,
      );
    }
  }
  return dots;
}

const PATTERNS = [pRings, pScatter, pBars, pMesh, pWaves, pGrid];

// --- the thumbnail ----------------------------------------------------------

export function Thumbnail({
  slug,
  topic,
  className,
}: {
  slug: string;
  topic?: string;
  className?: string;
}) {
  const color = topicColor(topic);
  const seed = hashStr(slug);
  const rand = mulberry32(seed);
  const pattern = PATTERNS[seed % PATTERNS.length] ?? pScatter;

  return (
    <div
      className={cn("relative aspect-[16/9] w-full overflow-hidden", className)}
      style={{
        background: `linear-gradient(135deg, color-mix(in oklab, ${color} 16%, var(--panel)), color-mix(in oklab, ${color} 4%, var(--panel)))`,
      }}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        style={{ color }}
        aria-hidden
      >
        {pattern(rand)}
      </svg>
      {/* topic glyph badge — the consistent anchor */}
      <span
        className="absolute bottom-2.5 left-2.5 grid size-8 place-items-center rounded-lg text-white shadow-sm"
        style={{ background: color }}
      >
        <TopicMark topic={topic} size={17} inherit style={{ color: "#fff" }} />
      </span>
    </div>
  );
}

// --- course thumbnail: a lesson "path" motif, coloured by level -------------

const LEVEL_COLOR: Record<string, string> = {
  beginner: "var(--c3)",
  intermediate: "var(--c4)",
  advanced: "var(--c5)",
  applied: "var(--c6)",
  practitioner: "var(--c5)",
};

export function CourseThumbnail({
  slug,
  level,
  lessons = 6,
  className,
}: {
  slug: string;
  level?: string;
  lessons?: number;
  className?: string;
}) {
  const color = LEVEL_COLOR[(level ?? "").toLowerCase()] ?? "var(--accent)";
  const rand = mulberry32(hashStr(slug));
  const n = Math.max(3, Math.min(7, lessons));
  // a gently rising path of lesson nodes
  const nodes = Array.from({ length: n }).map((_, i) => ({
    x: 12 + (i / (n - 1)) * (W - 24),
    y: H - 14 - (i / (n - 1)) * (H - 34) + (rand() - 0.5) * 10,
  }));
  const path = nodes
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");

  return (
    <div
      className={cn("relative aspect-[16/9] w-full overflow-hidden", className)}
      style={{
        background: `linear-gradient(135deg, color-mix(in oklab, ${color} 18%, var(--panel)), color-mix(in oklab, ${color} 4%, var(--panel)))`,
      }}
    >
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" style={{ color }} aria-hidden>
        <path d={path} fill="none" stroke="currentColor" strokeWidth="1.4" opacity="0.4" />
        {nodes.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={i === n - 1 ? 4 : 3} fill="var(--panel)" stroke="currentColor" strokeWidth="1.4" />
            {i === n - 1 ? (
              <text x={p.x} y={p.y + 1.4} textAnchor="middle" fontSize="4.5" fill="currentColor">
                ★
              </text>
            ) : (
              <circle cx={p.x} cy={p.y} r="1.1" fill="currentColor" />
            )}
          </g>
        ))}
      </svg>
      <span
        className="absolute bottom-2.5 left-2.5 grid size-8 place-items-center rounded-lg font-serif text-[16px] text-white shadow-sm"
        style={{ background: color }}
      >
        ✦
      </span>
    </div>
  );
}
