import Link from "next/link";
import { PILLARS } from "@/lib/canon";
import { cn } from "@/lib/utils";

/**
 * The pillar icon language — one fixed, metaphor-derived glyph per Canon pillar,
 * in its layer colour. A recurring visual mnemonic: after a few encounters the
 * lock *is* Access, the compass *is* Alignment. Pure inline SVG (no fonts, no
 * images), so it renders crisply at any size and is theme-aware via currentColor.
 *
 * Icons map to each pillar's canonical metaphor (see src/lib/canon.ts):
 *   Access — the locked door · Alignment — the compass · Extractability — the
 *   lifted passage · Authority — word of mouth (corroborating nodes) ·
 *   Credibility — receipts, the working shown · Originality — the lighthouse ·
 *   Freshness — the expiration clock · Adaptability — the river / cycle.
 */

type PillarKey =
  | "access"
  | "alignment"
  | "extractability"
  | "authority"
  | "credibility"
  | "originality"
  | "freshness"
  | "adaptability";

const ICONS: Record<PillarKey, React.ReactNode> = {
  // locked door / gate — pass or fail, no partial credit
  access: (
    <>
      <path d="M7 11V8a5 5 0 0 1 10 0v3" />
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <circle cx="12" cy="15" r="1.25" fill="currentColor" stroke="none" />
    </>
  ),
  // compass — aim at the real question before you build
  alignment: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.4 13.5 12 12 16.6 10.5 12Z" />
      <circle cx="12" cy="12" r="0.7" fill="currentColor" stroke="none" />
    </>
  ),
  // the lifted passage — a page with one line pulled out and quoted
  extractability: (
    <>
      <rect x="4.5" y="4" width="9" height="16" rx="1.5" />
      <path d="M7 8h4M7 16.2h3.5" />
      <rect x="6.4" y="10.8" width="6.2" height="2.4" rx="1.2" fill="currentColor" stroke="none" />
      <path d="M15 12h4.2M17.4 9.8 19.6 12l-2.2 2.2" />
    </>
  ),
  // word of mouth — many independent sources corroborate one entity
  authority: (
    <>
      <circle cx="12" cy="12" r="2.6" />
      <circle cx="5.6" cy="6.4" r="1.5" />
      <circle cx="18.4" cy="6.4" r="1.5" />
      <circle cx="6" cy="18" r="1.5" />
      <circle cx="18" cy="18" r="1.5" />
      <path d="M10.1 10.3 7 7.6M13.9 10.3 17 7.6M10.4 13.8 7.4 16.5M13.6 13.8 16.6 16.5" />
    </>
  ),
  // receipts — show the working: a check and the evidence beneath
  credibility: (
    <>
      <rect x="5" y="4.5" width="14" height="15" rx="2" />
      <path d="M8.4 12 10.7 14.4 15.6 9.2" />
      <path d="M8.5 17h7" opacity="0.5" />
    </>
  ),
  // the lighthouse — the source everyone else cites
  originality: (
    <>
      <path d="M9.2 20h5.6" />
      <path d="M10.3 20 11 10h2l0.7 10" />
      <path d="M10.4 10h3.2" />
      <circle cx="12" cy="7.4" r="1.5" fill="currentColor" stroke="none" />
      <path d="M14.8 5.6 17.2 4M14.8 9.2 17.2 10.8" opacity="0.55" />
    </>
  ),
  // the expiration clock — undated reads as expired
  freshness: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.3V12l3.2 2.1" />
    </>
  ),
  // the river / cycle — measure, adapt, repeat; never the same twice
  adaptability: (
    <>
      <path d="M5.5 12a6.5 6.5 0 0 1 11-4.7" />
      <path d="M18.5 12a6.5 6.5 0 0 1-11 4.7" />
      <path d="M16.6 4.3v3.4h-3.4" />
      <path d="M7.4 19.7v-3.4h3.4" />
    </>
  ),
};

const META = new Map(
  PILLARS.map((p) => [
    p.title.toLowerCase(),
    { color: p.color, n: p.n, title: p.title, sub: p.sub },
  ]),
);

/** The bare metaphor glyph for one pillar, coloured by its layer. */
export function PillarMark({
  pillar,
  size = 20,
  className,
  style,
}: {
  pillar: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const key = pillar.toLowerCase() as PillarKey;
  const icon = ICONS[key];
  const meta = META.get(key);
  if (!icon) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      role="img"
      aria-label={`${meta?.title ?? pillar} pillar`}
      className={cn("shrink-0", className)}
      style={{ color: meta?.color ?? "var(--accent)", ...style }}
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

/** Inline pillar chip — icon + name, links to the pillar deep-dive. */
export function PillarChip({
  pillar,
  className,
}: {
  pillar: string;
  className?: string;
}) {
  const key = pillar.toLowerCase();
  const meta = META.get(key);
  if (!meta) return null;
  return (
    <Link
      href={`/pillars/${key}`}
      className={cn(
        "not-prose border-line-2 hover:border-accent bg-panel inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 align-middle font-sans text-[13px] leading-none no-underline",
        className,
      )}
    >
      <PillarMark pillar={pillar} size={15} />
      <span className="text-ink-2">{meta.title}</span>
    </Link>
  );
}
