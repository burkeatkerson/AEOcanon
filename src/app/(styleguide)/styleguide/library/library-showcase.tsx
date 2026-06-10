"use client";

import { useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

/**
 * The visual library — the full component kit behind AEO Canon's educational
 * content, rebuilt natively in React + Tailwind on the site's Spectrum tokens.
 * Sixteen categories of heroes, dividers, callouts, data-viz, interactives,
 * quotes, cards, lists, metaphors, layouts, console/status, reading aids,
 * comparisons, embedded tools, sidebars, and CTAs. Everything is driven by the
 * live design tokens, so anything lifted here drops into a page and matches.
 */

/** Subscribe to the <html data-theme> attribute the site already drives. */
function useIsDark() {
  return useSyncExternalStore(
    (cb) => {
      const obs = new MutationObserver(cb);
      obs.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme"],
      });
      return () => obs.disconnect();
    },
    () => document.documentElement.getAttribute("data-theme") === "dark",
    () => false,
  );
}

// ---- shared primitives -----------------------------------------------------

function Frame({
  children,
  className,
  pad,
}: {
  children: React.ReactNode;
  className?: string;
  pad?: boolean;
}) {
  return (
    <div
      className={cn(
        "border-line bg-panel overflow-hidden rounded-[14px] border",
        pad && "p-7",
        className,
      )}
    >
      {children}
    </div>
  );
}

function SpecLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "text-muted mb-3 flex items-center gap-2 font-mono text-[10.5px] tracking-[0.1em] uppercase",
        className,
      )}
    >
      <span className="bg-accent size-1.5 shrink-0 rounded-full" />
      {children}
    </div>
  );
}

function Spec({
  label,
  children,
  className,
}: {
  label: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <SpecLabel>{label}</SpecLabel>
      {children}
    </div>
  );
}

function Section({
  id,
  num,
  title,
  blurb,
  children,
}: {
  id: string;
  num: string;
  title: string;
  blurb: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="border-line scroll-mt-20 border-b py-16"
    >
      <div className="mb-9 flex flex-wrap items-baseline gap-4">
        <span className="text-accent font-mono text-[13px]">{num}</span>
        <h2 className="font-serif text-[32px] font-medium tracking-[-0.01em]">
          {title}
        </h2>
        <p className="text-muted max-w-[70ch] basis-full text-[15px]">{blurb}</p>
      </div>
      {children}
    </section>
  );
}

function Tag({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      className={cn(
        "text-accent font-mono text-[10.5px] tracking-[0.08em] uppercase",
        className,
      )}
      style={style}
    >
      {children}
    </span>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-accent font-mono text-[11px] tracking-[0.14em] uppercase">
      {children}
    </span>
  );
}

function Btn({
  children,
  variant = "solid",
  size,
  className,
  ...rest
}: {
  children: React.ReactNode;
  variant?: "solid" | "ghost" | "accent";
  size?: "sm";
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        "inline-block cursor-pointer rounded-[9px] border font-sans font-medium transition-colors",
        size === "sm" ? "px-[13px] py-2 text-[12.5px]" : "px-[18px] py-[11px] text-[14px]",
        variant === "solid" &&
          "border-ink bg-ink text-bg hover:border-accent hover:bg-accent hover:text-white",
        variant === "accent" && "border-accent bg-accent text-white",
        variant === "ghost" &&
          "border-line-2 text-ink hover:border-accent hover:text-accent bg-transparent",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

function Ring({
  v,
  size = 104,
  inner = 82,
  fontSize = 26,
  children,
}: {
  v: number;
  size?: number;
  inner?: number;
  fontSize?: number;
  children?: React.ReactNode;
}) {
  return (
    <div
      className="grid place-items-center rounded-full"
      style={{
        width: size,
        height: size,
        background: `conic-gradient(var(--accent) ${v}%, var(--line) 0)`,
      }}
    >
      <div
        className="bg-panel grid place-items-center rounded-full font-serif not-italic"
        style={{ width: inner, height: inner, fontSize }}
      >
        {children ?? v}
      </div>
    </div>
  );
}

function Byline({ items }: { items: React.ReactNode[] }) {
  return (
    <div className="text-muted mt-3.5 flex flex-wrap items-center gap-4 font-mono text-[11.5px]">
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-2">
          {it}
        </span>
      ))}
    </div>
  );
}

function Avatar({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-accent-soft border-line-2 text-accent grid size-[30px] place-items-center rounded-full border font-serif text-[14px] italic">
      {children}
    </span>
  );
}

const GLYPHS = [
  ["◈", "Access"], ["◆", "Authority"], ["◇", "Answer"], ["▣", "Cite"],
  ["◎", "Audit"], ["⧉", "Schema"], ["⌖", "Target"], ["✦", "Certified"],
  ["↗", "Growth"], ["⟳", "Fresh"], ["≋", "Signal"], ["∴", "Proof"],
];

const JUMP = [
  ["s1", "1 · Hero treatments"], ["s2", "2 · Dividers"], ["s3", "3 · Callouts"],
  ["s4", "4 · Data viz"], ["s5", "5 · Interactive"], ["s6", "6 · Quotes"],
  ["s7", "7 · Cards"], ["s8", "8 · Lists & steps"], ["s9", "9 · Metaphors"],
  ["s10", "10 · Full layouts"], ["s11", "11 · Console & status"],
  ["s12", "12 · Annotation & reading"], ["s13", "13 · Comparison & tables"],
  ["s14", "14 · Embedded tools"], ["s15", "15 · Sidebars & nav"],
  ["s16", "16 · Engagement & CTAs"],
];

// deterministic 42–90 "score" from a string (mirrors the design's demo logic)
const fakeScore = (s: string) =>
  42 + ([...(s || "your site")].reduce((a, c) => a + c.charCodeAt(0), 0) % 48);
const band = (s: number) =>
  s >= 70 ? "Established" : s >= 50 ? "Emerging" : "At risk";

// ===========================================================================

export function LibraryShowcase() {
  const dark = useIsDark();
  const toggleTheme = () => {
    const next = dark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("aeo-theme", next);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="font-sans">
      {/* toolbar */}
      <div className="border-line bg-bg/90 border-b backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1180px] items-center gap-5 px-8">
          <span className="font-serif text-[20px] font-semibold tracking-[-0.01em]">
            AEO <span className="text-accent">Canon</span>
          </span>
          <span className="text-muted font-mono text-[11px] tracking-[0.04em]">
            VISUAL LIBRARY · v2
          </span>
          <div className="ml-auto flex items-center gap-2.5">
            <select
              aria-label="Jump to section"
              defaultValue=""
              onChange={(e) => {
                const v = e.target.value;
                if (v) document.getElementById(v)?.scrollIntoView();
                e.currentTarget.value = "";
              }}
              className="border-line-2 bg-panel text-ink-2 rounded-lg border px-2.5 py-2 font-mono text-[11px] outline-none"
            >
              <option value="">Jump to…</option>
              {JUMP.map(([v, label]) => (
                <option key={v} value={v}>
                  {label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={toggleTheme}
              className="border-line-2 bg-panel text-ink hover:border-accent hover:text-accent cursor-pointer rounded-lg border px-3.5 py-2 font-mono text-[11px]"
            >
              ◐ {dark ? "Light" : "Dark"}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1180px] px-8">
        {/* page header */}
        <header className="border-line border-b py-[60px]">
          <div className="text-accent mb-5 font-mono text-[12px] tracking-[0.16em] uppercase">
            How this page works · a kit for AI-built content
          </div>
          <h1 className="max-w-[18ch] font-serif text-[clamp(38px,6vw,64px)] leading-[1.02] font-medium tracking-[-0.02em]">
            Copy any block from here into an article, course, or module — it&apos;s
            already on-brand.
          </h1>
          <p className="text-ink-2 mt-5 max-w-[60ch] text-[19px]">
            The component kit behind AEO Canon&apos;s educational content. Every
            hero, divider, callout, chart, interactive, card, and layout below is
            built from the live site&apos;s tokens (Newsreader · Spline Sans · the
            Spectrum palette), so anything you lift drops straight into a page and
            matches automatically — in light and dark.
          </p>
          <div className="text-muted mt-6 flex flex-wrap gap-6 font-mono text-[12px]">
            <span>
              <b className="text-ink">16</b> categories to pull from
            </span>
            <span>
              Built on the <b className="text-ink">live site&apos;s</b> tokens
            </span>
            <span>
              Works in <b className="text-ink">light + dark</b>
            </span>
            <span>Toggle the mode, top-right →</span>
          </div>
        </header>

        <Heroes />
        <Dividers />
        <Callouts />
        <DataViz />
        <Interactive />
        <Quotes />
        <Cards />
        <ListsSteps />
        <Metaphors />
        <Layouts />
        <ConsoleStatus />
        <Annotation />
        <Comparison />
        <EmbeddedTools />
        <Sidebars />
        <Engagement />

        <p className="text-muted py-14 text-center font-mono text-[12px]">
          AEO Canon Visual Library · v2 · pull freely, stay cohesive · toggle
          light/dark, top-right
        </p>
      </div>
    </div>
  );
}

// ---- 1. HERO TREATMENTS ----------------------------------------------------

function Heroes() {
  return (
    <Section
      id="s1"
      num="01"
      title="Article hero treatments"
      blurb="How a long-form piece opens. Five ways to set the tone before the first paragraph."
    >
      <Spec label="A · Bold typographic — pure type scale, no image" className="mb-6">
        <Frame pad>
          <Eyebrow>Fundamentals · 14 min read</Eyebrow>
          <h2 className="my-3.5 font-serif text-[clamp(28px,3.4vw,44px)] leading-[1.04] font-medium tracking-[-0.02em]">
            The Citation Economy: why being mentioned now matters more than ranking
          </h2>
          <Byline
            items={[
              <>
                <Avatar>D</Avatar>
                <span>
                  By <b className="text-ink">Dana Reyes</b>
                </span>
              </>,
              <span key="u">Updated May 28, 2026</span>,
              <span key="c">Cited 1,240×</span>,
            ]}
          />
        </Frame>
      </Spec>

      <div className="grid gap-5 sm:grid-cols-2">
        <Spec label="B · Split — text + visual">
          <Frame className="grid sm:grid-cols-[1.2fr_1fr]">
            <div className="p-[30px]">
              <Eyebrow>Technical</Eyebrow>
              <h2 className="my-3 font-serif text-[26px] font-medium">
                Schema markup, end to end
              </h2>
              <p className="text-muted text-[14px]">
                The structured-data stack that lets a model describe you without
                guessing.
              </p>
              <Byline items={[<span key="m">11 min</span>]} />
            </div>
            <Placeholder label="[ DIAGRAM ] schema layers" />
          </Frame>
        </Spec>
        <Spec label="C · Image hero with overlay">
          <div className="relative flex min-h-[240px] items-end overflow-hidden rounded-[12px]">
            <Placeholder className="absolute inset-0 rounded-none border-none" label="[ FULL-BLEED IMAGE ]" />
            <div className="relative w-full bg-gradient-to-t from-black/70 to-transparent p-[26px] text-white">
              <Tag className="text-accent">Case study</Tag>
              <h2 className="font-serif text-[26px] font-medium text-white">
                From invisible to default in 90 days
              </h2>
            </div>
          </div>
        </Spec>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <Spec label="D · Data-forward — lead with the stat">
          <Frame pad>
            <div className="text-accent font-serif text-[74px] leading-[0.9] tracking-[-0.03em]">
              94%
            </div>
            <h2 className="mt-3 font-serif text-[24px] font-medium">
              of local businesses are invisible to AI search. Here&apos;s the gap —
              and how to close it.
            </h2>
            <Byline
              items={[<span key="r">Research report</span>, <span key="m">18 min</span>]}
            />
          </Frame>
        </Spec>
        <Spec label="E · Narrative opener — scene before headline">
          <Frame pad>
            <p className="text-ink-2 mb-4 font-serif text-[21px] leading-[1.45] italic">
              &ldquo;It&apos;s 6pm in July. A homeowner&apos;s AC just died. They
              don&apos;t open ten tabs — they ask an assistant who to call.&rdquo;
            </p>
            <h2 className="font-serif text-[26px] font-medium">
              AEO for HVAC contractors: the complete playbook
            </h2>
            <Byline items={[<span key="n">Niche guide · 22 min</span>]} />
          </Frame>
        </Spec>
      </div>
    </Section>
  );
}

function Placeholder({ label, className }: { label: string; className?: string }) {
  return (
    <div
      className={cn(
        "border-line bg-bg-2 text-faint grid place-items-center rounded-[10px] border p-[18px] text-center font-mono text-[11px]",
        className,
      )}
      style={{
        backgroundImage:
          "repeating-linear-gradient(45deg,var(--line) 0 1px,transparent 1px 10px)",
      }}
    >
      {label}
    </div>
  );
}

// ---- 2. DIVIDERS -----------------------------------------------------------

function Dividers() {
  return (
    <Section
      id="s2"
      num="02"
      title="Section breaks & dividers"
      blurb="Seven ways to segment a 5,000-word read so it breathes."
    >
      <Frame pad>
        <p className="text-muted text-[14px]">
          …the model decides which names are safe to put its reputation behind.
        </p>
        <div className="border-line my-[18px] border-t" />
        <SpecLabel className="mb-1.5">Hairline rule ↑ · Numbered header ↓</SpecLabel>
        <div className="my-[18px] flex items-center gap-4">
          <span className="text-accent font-mono text-[13px]">02</span>
          <span className="font-serif text-[22px]">How an answer gets built</span>
          <span className="bg-line h-px flex-1" />
        </div>
        <div className="bg-accent-soft text-accent-2 my-[18px] rounded-[10px] px-[22px] py-4 font-mono text-[12px] tracking-[0.1em] uppercase">
          Part Two — Reputation · does the web vouch for you?
        </div>
        <SpecLabel className="mt-[18px] mb-1.5">
          Accent band ↑ · Symbol divider ↓
        </SpecLabel>
        <div className="text-accent py-[18px] text-center text-[18px] tracking-[14px]">
          ◈ ◆ ◇ ▣
        </div>
        <div className="text-ink mx-auto max-w-[30ch] py-[18px] text-center font-serif text-[24px] leading-[1.3] italic">
          &ldquo;Ranking was a contest of position. Citation is a contest of
          trust.&rdquo;
        </div>
        <SpecLabel className="my-1.5">Pull-quote break ↑ · Chapter break ↓</SpecLabel>
        <div className="py-[18px] text-center">
          <div className="text-muted font-mono text-[11px] tracking-[0.16em] uppercase">
            Part One
          </div>
          <div className="mt-1.5 font-serif text-[28px]">Foundation</div>
        </div>
      </Frame>
    </Section>
  );
}

// ---- 3. CALLOUTS -----------------------------------------------------------

function CalloutHead({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-2.5 flex items-center gap-2 font-mono text-[10.5px] tracking-[0.1em] uppercase",
        className,
      )}
    >
      {children}
    </div>
  );
}

function Callouts() {
  return (
    <Section
      id="s3"
      num="03"
      title="Callout & highlight boxes"
      blurb="Nine inline blocks that interrupt the read with emphasis — distinct treatments, one system."
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="border-accent bg-accent-soft rounded-[12px] border-l-[3px] px-[22px] py-5 text-[15px]">
          <CalloutHead className="text-accent-2">◈ Here&apos;s what most people miss</CalloutHead>
          <p className="text-ink-2">
            A model recommends you because many independent sources describe you
            the same way — not because one page argued well.
          </p>
        </div>
        <div
          className="border-warn rounded-[12px] border-l-[3px] px-[22px] py-5 text-[15px]"
          style={{ background: "color-mix(in oklab, var(--warn) 10%, var(--panel))" }}
        >
          <CalloutHead className="text-warn">⚠ Common mistake</CalloutHead>
          <p className="text-ink-2">
            Updating the date without updating the substance. Engines compare you
            to other recent sources; cosmetic freshness still reads as stale.
          </p>
        </div>
        <div className="border-line-2 bg-panel rounded-[12px] border px-[22px] py-5 text-[15px]">
          <CalloutHead className="text-accent">Definition</CalloutHead>
          <p className="text-ink-2">
            <b className="font-serif text-[17px]">Schema markup</b> — structured
            data in your HTML that states services, area, and hours as
            machine-readable facts rather than prose.
          </p>
        </div>
        <div className="border-line-2 bg-bg-2 rounded-[12px] border border-dashed px-[22px] py-5 text-[15px]">
          <CalloutHead className="text-ok">◆ Expert note</CalloutHead>
          <p className="text-ink-2">
            Lead every passage with the answer. 44% of ChatGPT citations come
            from the first third of a page.
          </p>
        </div>
        <div className="bg-ink rounded-[12px] px-[22px] py-5 text-[15px]">
          <CalloutHead className="text-accent">Key takeaway</CalloutHead>
          <p style={{ color: "color-mix(in oklab, var(--bg) 80%, var(--ink))" }}>
            Mentions outperform links. Build genuine presence on Reddit, YouTube,
            and Wikipedia — not just backlinks.
          </p>
        </div>
        <div className="border-line bg-panel flex items-center gap-[18px] rounded-[12px] border px-[22px] py-5">
          <div className="text-accent font-serif text-[46px] leading-none">0.664</div>
          <div>
            <Tag>Mentions correlation</Tag>
            <p className="text-[13.5px]">vs 0.218 for backlinks (Ahrefs, 75k brands)</p>
          </div>
        </div>
        <div className="border-accent bg-panel rounded-[12px] border-t-2 px-[22px] py-5">
          <div className="text-ink font-serif text-[19px] leading-[1.4] italic">
            &ldquo;Adding named quotations raised AI visibility by 41% — the single
            largest effect we measured.&rdquo;
          </div>
          <div className="text-muted mt-3 font-mono text-[11px]">
            — Princeton GEO study, KDD 2024
          </div>
        </div>
        <div className="border-line bg-bg-2 flex items-center justify-between gap-3.5 rounded-[12px] border px-[22px] py-5">
          <div>
            <Tag>Related</Tag>
            <p className="text-ink-2 text-[14px]">
              See our deep-dive on citation consistency
            </p>
          </div>
          <a href="#" className="text-accent font-medium whitespace-nowrap">
            Read →
          </a>
        </div>
      </div>
      <Spec label="“Try it yourself” interactive prompt" className="mt-5">
        <div className="border-accent bg-accent-soft flex flex-wrap items-center justify-between gap-4 rounded-[12px] border-l-[3px] px-[22px] py-5">
          <div>
            <CalloutHead className="text-accent-2">▣ Try it yourself</CalloutHead>
            <p className="text-ink-2 text-[15px]">
              Ask ChatGPT to recommend a business like yours. Read what it says.
            </p>
          </div>
          <Btn size="sm">Open the audit tool</Btn>
        </div>
      </Spec>
    </Section>
  );
}

// ---- 4. DATA VIZ -----------------------------------------------------------

function Bar({
  label,
  value,
  display,
  color = "var(--accent)",
}: {
  label: string;
  value: number;
  display?: string;
  color?: string;
}) {
  return (
    <div className="grid grid-cols-[90px_1fr_44px] items-center gap-3 font-mono text-[11.5px]">
      <span>{label}</span>
      <span className="bg-bg-2 h-[18px] overflow-hidden rounded">
        <span
          className="block h-full rounded"
          style={{ width: `${value}%`, background: color }}
        />
      </span>
      <span className="text-right">{display ?? value}</span>
    </div>
  );
}

function SovRow({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="grid grid-cols-[96px_1fr_38px] items-center gap-2.5 font-mono text-[11.5px]">
      <span>{label}</span>
      <span className="bg-bg-2 h-4 overflow-hidden rounded">
        <span className="block h-full rounded" style={{ width: `${value}%`, background: color }} />
      </span>
      <span>{value}</span>
    </div>
  );
}

function DataViz() {
  return (
    <Section
      id="s4"
      num="04"
      title="Data visualization styles"
      blurb="Editorial, not dashboard-y. Brand palette throughout."
    >
      <div className="grid gap-5 sm:grid-cols-3">
        <Frame pad>
          <div className="text-accent font-serif text-[64px] leading-none tracking-[-0.03em]">
            71%
          </div>
          <div className="text-muted mt-2 max-w-[24ch] text-[14px]">
            of local queries now return an AI answer before any link
          </div>
        </Frame>
        <Frame pad className="grid place-items-center">
          <Ring v={72} />
        </Frame>
        <Frame pad>
          <SpecLabel>Score gauge · 0–100</SpecLabel>
          <div
            className="relative h-3.5 rounded-full"
            style={{ background: "linear-gradient(90deg,var(--bad),var(--warn),var(--ok))" }}
          >
            <div className="bg-ink absolute top-[-6px] h-[26px] w-1 -translate-x-1/2 rounded-sm" style={{ left: "64%" }} />
          </div>
          <div className="text-muted mt-2 flex justify-between font-mono text-[11px]">
            <span>At risk</span>
            <span>64 · Emerging</span>
            <span>Established</span>
          </div>
        </Frame>
      </div>

      <Spec label="Stat row" className="mt-5">
        <div className="border-line flex overflow-hidden rounded-[12px] border">
          {[
            ["3.2×", "more likely to be hired"],
            ["352", "articles in the canon"],
            ["5", "engines tracked"],
            ["$0", "to check your score"],
          ].map(([n, l], i) => (
            <div key={i} className="border-line flex-1 border-r p-5 last:border-r-0">
              <div className="text-ink font-serif text-[30px]">{n}</div>
              <div className="text-muted mt-1.5 font-mono text-[10px] tracking-[0.05em] uppercase">
                {l}
              </div>
            </div>
          ))}
        </div>
      </Spec>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <Frame pad>
          <SpecLabel>Comparison bars · you vs competitors</SpecLabel>
          <div className="flex flex-col gap-2.5">
            <Bar label="You" value={34} />
            <Bar label="Competitor A" value={71} color="var(--accent-2)" />
            <Bar label="Competitor B" value={58} color="var(--accent-2)" />
          </div>
        </Frame>
        <Frame pad>
          <SpecLabel>Trend · quarterly</SpecLabel>
          <div className="flex h-[120px] items-end gap-1.5">
            {[30, 50, 74, 92].map((h, i) => (
              <div
                key={i}
                className="bg-accent-soft border-accent flex-1 rounded-t border-t-2"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <div className="text-muted mt-2 flex justify-between font-mono text-[10px]">
            <span>&rsquo;23</span><span>&rsquo;24</span><span>&rsquo;25</span><span>&rsquo;26</span>
          </div>
        </Frame>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <Frame pad>
          <SpecLabel>Pillar heatmap</SpecLabel>
          <div className="grid grid-cols-[auto_repeat(4,1fr)] gap-1 font-mono text-[10.5px]">
            <div />
            {["Acc", "Auth", "Ans", "Cite"].map((h) => (
              <div key={h} className="text-muted p-1.5 text-center">{h}</div>
            ))}
            <div className="text-ink-2 flex items-center p-2">You</div>
            {[
              ["82", "var(--ok)"], ["48", "var(--warn)"], ["22", "var(--bad)"], ["51", "var(--warn)"],
            ].map(([n, c], i) => (
              <div
                key={i}
                className="grid h-[34px] place-items-center rounded-[5px] font-semibold text-white"
                style={{ background: c }}
              >
                {n}
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-3 font-mono text-[12px]">
            <span className="size-[11px] rounded-full" style={{ background: "var(--ok)" }} /> Strong
            <span className="ml-3 size-[11px] rounded-full" style={{ background: "var(--warn)" }} /> Needs work
            <span className="ml-3 size-[11px] rounded-full" style={{ background: "var(--bad)" }} /> Critical
          </div>
        </Frame>
        <Frame pad>
          <SpecLabel>Minimal table</SpecLabel>
          <table className="w-full border-collapse text-[13.5px]">
            <thead>
              <tr>
                {["Engine", "Names you", "Specialty"].map((h) => (
                  <th key={h} className="border-ink text-muted border-b-2 px-3 py-2.5 text-left font-mono text-[10px] tracking-[0.06em] uppercase">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["ChatGPT", ["Partial", "var(--warn)"], ["No", "var(--bad)"]],
                ["Perplexity", ["Yes", "var(--ok)"], ["Partial", "var(--warn)"]],
                ["AI Overviews", ["No", "var(--bad)"], ["No", "var(--bad)"]],
              ].map((row, i) => (
                <tr key={i}>
                  <td className="border-line border-b px-3 py-2.5">{row[0] as string}</td>
                  {(row.slice(1) as [string, string][]).map(([t, c], j) => (
                    <td key={j} className="border-line border-b px-3 py-2.5" style={{ color: c }}>{t}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Frame>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-3">
        <Frame pad className="grid place-items-center gap-3">
          <SpecLabel className="mr-auto">Citation mix · donut</SpecLabel>
          <div
            className="grid size-[120px] place-items-center rounded-full"
            style={{
              background:
                "conic-gradient(var(--c5) 0 28%,var(--c3) 28% 50%,var(--c4) 50% 72%,var(--c2) 72% 88%,var(--c1) 88% 100%)",
            }}
          >
            <div className="bg-panel grid size-[78px] place-items-center rounded-full text-center font-serif text-[15px] leading-[1.1]">
              5 engines<br />tracked
            </div>
          </div>
        </Frame>
        <Frame pad>
          <SpecLabel>Sparkline row</SpecLabel>
          <div className="flex flex-col gap-3.5">
            {[
              ["Visibility", [30, 45, 40, 62, 78, 90]],
              ["Citations", [20, 30, 55, 48, 70, 84]],
            ].map(([label, bars]) => (
              <div key={label as string} className="flex items-center justify-between">
                <span className="font-mono text-[12px]">{label as string}</span>
                <div className="flex h-[34px] items-end gap-[3px]">
                  {(bars as number[]).map((h, i) => (
                    <span key={i} className="bg-accent w-1.5 rounded-t-sm opacity-85" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Frame>
        <Frame pad>
          <SpecLabel>Share of voice · per engine</SpecLabel>
          <div className="flex flex-col gap-2.5">
            <SovRow label="ChatGPT" value={62} color="var(--c5)" />
            <SovRow label="Perplexity" value={48} color="var(--c3)" />
            <SovRow label="AI Overviews" value={31} color="var(--c4)" />
            <SovRow label="Gemini" value={22} color="var(--c2)" />
          </div>
        </Frame>
      </div>
    </Section>
  );
}

// ---- 5. INTERACTIVE --------------------------------------------------------

function Interactive() {
  const [audit, setAudit] = useState("");
  const [auditOut, setAuditOut] = useState("");
  const [ba, setBa] = useState<"before" | "after">("before");
  const [checks, setChecks] = useState<boolean[]>([false, false, false, false]);
  const [range, setRange] = useState(12);
  const [accOpen, setAccOpen] = useState(0);
  const [tab, setTab] = useState(0);
  const [copied, setCopied] = useState(false);

  const checkItems = [
    "Allow AI crawlers in robots.txt",
    "Serve server-side HTML",
    "Add LocalBusiness schema",
    "Publish 4 question-first articles",
  ];
  const checked = checks.filter(Boolean).length;
  const baText = {
    before: "Described as generic “HVAC,” absent from 4 of 5 engines.",
    after: "Named for mini-split installation in Travis County across 4 of 5 engines.",
  };
  const accItems = [
    ["Do I need to be technical?", "No — you describe your business; we handle schema, structure, and writing."],
    ["How fast are results?", "Foundational fixes land in month one; recommendation builds over a season."],
    ["Which engines do you track?", "ChatGPT, Perplexity, AI Overviews, Gemini, and Copilot — measured separately."],
  ];
  const panes = [
    "Names two competitors before you. Specialty lost.",
    "Names you — service area correct, specialty partial.",
    "58% of the answer pulled from third-party directories.",
  ];

  return (
    <Section
      id="s5"
      num="05"
      title="Interactive elements & tools"
      blurb="Embeddable in articles and modules. These actually work — try them."
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Frame pad>
          <SpecLabel>URL audit field</SpecLabel>
          <div className="flex gap-2.5">
            <input
              value={audit}
              onChange={(e) => setAudit(e.target.value)}
              placeholder="yourbusiness.com"
              className="border-line-2 bg-bg text-ink focus:border-accent flex-1 rounded-[9px] border px-3.5 py-3 font-mono text-[13px] outline-none"
            />
            <Btn
              onClick={() => {
                const s = fakeScore(audit);
                setAuditOut(`▸ ${audit || "your site"} scores ${s}/100 — ${band(s)}`);
              }}
            >
              Run
            </Btn>
          </div>
          {auditOut ? (
            <div className="text-accent mt-3 font-mono text-[12px]">{auditOut}</div>
          ) : null}
        </Frame>
        <Frame pad>
          <SpecLabel>Before / after toggle</SpecLabel>
          <div className="border-line-2 inline-flex overflow-hidden rounded-full border font-mono text-[12px]">
            {(["before", "after"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setBa(m)}
                className={cn(
                  "cursor-pointer px-[18px] py-2.5",
                  ba === m ? "bg-accent text-white" : "text-muted",
                )}
              >
                {m === "before" ? "Before AEO" : "After AEO"}
              </button>
            ))}
          </div>
          <p className="text-ink-2 mt-3.5 text-[14px]">{baText[ba]}</p>
        </Frame>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <Frame pad>
          <SpecLabel>Interactive checklist</SpecLabel>
          <div className="flex flex-col gap-0.5">
            {checkItems.map((item, i) => (
              <button
                key={i}
                type="button"
                onClick={() =>
                  setChecks((c) => c.map((v, j) => (j === i ? !v : v)))
                }
                className="hover:bg-bg-2 flex items-center gap-3 rounded-[9px] px-3 py-2.5 text-left"
              >
                <span
                  className={cn(
                    "grid size-5 place-items-center rounded-[6px] border-[1.5px] text-[12px]",
                    checks[i]
                      ? "border-accent bg-accent text-white"
                      : "border-line-2 text-transparent",
                  )}
                >
                  ✓
                </span>
                <span className={cn("text-[14.5px]", checks[i] && "text-muted line-through")}>
                  {item}
                </span>
              </button>
            ))}
          </div>
          <div className="bg-bg-2 mt-3 h-1.5 overflow-hidden rounded-full">
            <div className="bg-accent h-full transition-[width] duration-300" style={{ width: `${(checked / 4) * 100}%` }} />
          </div>
          <div className="text-muted mt-2 font-mono text-[11px]">{checked} of 4 complete</div>
        </Frame>
        <Frame pad>
          <SpecLabel>Range input</SpecLabel>
          <label className="text-ink-2 text-[14px]">
            How many service pages does your site have?
          </label>
          <input
            type="range"
            min={0}
            max={50}
            value={range}
            onChange={(e) => setRange(+e.target.value)}
            className="accent-accent my-3.5 w-full"
          />
          <div className="text-accent font-serif text-[28px]">{range} pages</div>
        </Frame>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <Frame pad>
          <SpecLabel>FAQ accordion</SpecLabel>
          <div>
            {accItems.map(([q, a], i) => (
              <div key={i} className="border-line border-b">
                <button
                  type="button"
                  onClick={() => setAccOpen(accOpen === i ? -1 : i)}
                  className="text-ink flex w-full justify-between gap-3 py-[15px] text-left font-serif text-[17px]"
                >
                  {q}
                  <span className="text-accent">{accOpen === i ? "–" : "+"}</span>
                </button>
                {accOpen === i ? (
                  <div className="text-ink-2 pb-[15px] text-[14.5px] leading-relaxed">{a}</div>
                ) : null}
              </div>
            ))}
          </div>
        </Frame>
        <Frame pad>
          <SpecLabel>Tab panel</SpecLabel>
          <div className="border-line flex gap-0.5 border-b">
            {["ChatGPT", "Perplexity", "AI Overviews"].map((t, i) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(i)}
                className={cn(
                  "-mb-px cursor-pointer border-b-2 px-4 py-2.5 font-mono text-[12px]",
                  tab === i ? "border-accent text-ink" : "border-transparent text-muted",
                )}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="text-ink-2 pt-[18px] text-[14.5px]">{panes[tab]}</div>
        </Frame>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <Frame pad>
          <SpecLabel>Inline tooltip</SpecLabel>
          <p className="text-ink-2 text-[15px]">
            Engines retrieve at the{" "}
            <span
              className="border-accent decoration-accent cursor-help border-b-2 border-dotted"
              title="Passage-level retrieval: AI quotes a paragraph, not your whole page."
            >
              passage level
            </span>
            , so each section must stand on its own.
          </p>
          <SpecLabel className="mt-5">Live preview generator</SpecLabel>
          <div className="border-line grid grid-cols-2 overflow-hidden rounded-[12px] border">
            <div className="border-line border-r p-[18px]">
              <Tag>Input</Tag>
              <p className="text-ink-2 mt-2 text-[13px]">
                Business: Lone Star HVAC<br />Area: Travis County
              </p>
            </div>
            <div className="p-[18px]">
              <Tag>Output</Tag>
              <Code className="mt-2 text-[11px]">
                <span className="text-[#7d8a7d]">{"// schema"}</span>
                <br />&quot;<span className="text-accent">@type</span>&quot;:
                <span style={{ color: "oklch(0.8 0.1 150)" }}>&quot;HVACBusiness&quot;</span>
              </Code>
            </div>
          </div>
        </Frame>
        <Frame pad>
          <SpecLabel>Code block · schema example</SpecLabel>
          <Code>
            <span className="text-[#7d8a7d]">{"<script type=\"application/ld+json\">"}</span>
            <br />{"{"}
            <br />&nbsp;&nbsp;&quot;<span className="text-accent">@type</span>&quot;:{" "}
            <span style={{ color: "oklch(0.8 0.1 150)" }}>&quot;LocalBusiness&quot;</span>,
            <br />&nbsp;&nbsp;&quot;<span className="text-accent">name</span>&quot;:{" "}
            <span style={{ color: "oklch(0.8 0.1 150)" }}>&quot;Lone Star Comfort&quot;</span>,
            <br />&nbsp;&nbsp;&quot;<span className="text-accent">areaServed</span>&quot;:{" "}
            <span style={{ color: "oklch(0.8 0.1 150)" }}>&quot;Travis County, TX&quot;</span>
            <br />{"}"}
          </Code>
          <SpecLabel className="mt-5">Interactive timeline</SpecLabel>
          <div className="flex gap-0 overflow-x-auto pb-2">
            {[
              ["2023", "AI answers on 22% of local queries"],
              ["2024", "38% — citations decouple from rank"],
              ["2026", "71% answer-first"],
            ].map(([yr, tx], i) => (
              <div key={i} className="relative flex-[0_0_180px] pr-5">
                <div className="bg-line absolute top-[7px] right-0 left-0 h-0.5" />
                <div className="bg-accent relative z-[1] mb-3 size-3.5 rounded-full" />
                <div className="text-accent font-mono text-[11px]">{yr}</div>
                <div className="text-ink-2 mt-1 text-[13px]">{tx}</div>
              </div>
            ))}
          </div>
          <SpecLabel className="mt-5">Copy-to-clipboard chip</SpecLabel>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText("aeocanon.com/audit").catch(() => {});
              setCopied(true);
              window.setTimeout(() => setCopied(false), 1200);
            }}
            className="border-line-2 bg-bg-2 hover:border-accent inline-flex cursor-pointer items-center gap-2.5 rounded-[9px] border px-3 py-2.5 font-mono text-[12px]"
          >
            <span className="text-accent">⧉</span>
            {copied ? "Copied ✓" : "aeocanon.com/audit"}
          </button>
        </Frame>
      </div>
    </Section>
  );
}

function Code({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border-line-2 overflow-auto rounded-[10px] border px-5 py-[18px] font-mono text-[12.5px] leading-[1.7]",
        className,
      )}
      style={{ background: "#13141b", color: "#e6e1d3" }}
    >
      {children}
    </div>
  );
}

// ---- 6. QUOTES -------------------------------------------------------------

function Quotes() {
  return (
    <Section
      id="s6"
      num="06"
      title="Quote & testimonial treatments"
      blurb="Six ways to give a voice room."
    >
      <Frame pad>
        <div className="text-ink mx-auto max-w-[24ch] text-center font-serif text-[30px] leading-[1.3] italic">
          &ldquo;You don&apos;t rank your way into an AI answer. You earn the
          quote.&rdquo;
        </div>
        <div className="text-muted mt-[18px] text-center font-mono text-[11.5px]">
          — The AEO Canon, Pillar 3
        </div>
      </Frame>
      <div className="mt-5 grid gap-5 sm:grid-cols-3">
        <Frame pad>
          <div className="border-accent text-ink-2 border-l-[3px] pl-5 font-serif text-[19px] italic">
            Engines extract answers, not adjectives. Superlatives are invisible.
          </div>
        </Frame>
        <Frame pad>
          <div className="flex items-start gap-4">
            <span className="bg-accent-soft border-line-2 text-accent grid size-[52px] shrink-0 place-items-center rounded-full border font-serif text-[20px] italic">
              M
            </span>
            <div>
              <div className="text-ink font-serif text-[17px] leading-[1.4]">
                &ldquo;By the next month, Perplexity was naming us.&rdquo;
              </div>
              <div className="text-muted mt-2 font-mono text-[11px]">
                Marcus T. · Lone Star Comfort HVAC
              </div>
            </div>
          </div>
        </Frame>
        <Frame pad>
          <div className="flex items-center gap-5">
            <div className="text-accent shrink-0 font-serif text-[42px] leading-none">4.2×</div>
            <div>
              <div className="text-ink-2 font-serif text-[16px] italic">
                higher engagement after restructuring for extractability
              </div>
              <div className="text-muted mt-2 font-mono text-[11px]">
                — Content Scorer cohort
              </div>
            </div>
          </div>
        </Frame>
      </div>
      <Spec label="Before / after quote pair" className="mt-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div
            className="border-warn rounded-[12px] border-l-[3px] px-[22px] py-5"
            style={{ background: "color-mix(in oklab, var(--warn) 10%, var(--panel))" }}
          >
            <CalloutHead className="text-warn">Before</CalloutHead>
            <p className="text-ink-2 text-[15px]">
              &ldquo;We just hoped people would find us.&rdquo;
            </p>
          </div>
          <div className="border-accent bg-accent-soft rounded-[12px] border-l-[3px] px-[22px] py-5">
            <CalloutHead className="text-accent-2">After</CalloutHead>
            <p className="text-ink-2 text-[15px]">
              &ldquo;Now the AI recommends us by name for mini-splits.&rdquo;
            </p>
          </div>
        </div>
      </Spec>
    </Section>
  );
}

// ---- 7. CARDS --------------------------------------------------------------

function Card({
  children,
  className,
  as = "a",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "a" | "div";
}) {
  const Cmp = as;
  return (
    <Cmp
      {...(as === "a" ? { href: "#" } : {})}
      className={cn(
        "border-line bg-panel text-ink hover:border-accent flex flex-col gap-2.5 rounded-[14px] border p-[22px] no-underline transition-[transform,border-color] hover:-translate-y-[3px]",
        className,
      )}
    >
      {children}
    </Cmp>
  );
}

function CardIcon({ children, soft }: { children: React.ReactNode; soft?: boolean }) {
  return (
    <div
      className="text-accent grid size-[42px] place-items-center rounded-[10px] text-[18px]"
      style={{ background: soft ? "color-mix(in oklab, var(--accent) 16%, transparent)" : "var(--accent-soft)" }}
    >
      {children}
    </div>
  );
}

function Cards() {
  return (
    <Section
      id="s7"
      num="07"
      title="Card patterns"
      blurb="The fundamental unit. Nine densities and purposes."
    >
      <div className="grid gap-5 sm:grid-cols-3">
        <Card>
          <Tag>Fundamentals</Tag>
          <h4 className="font-serif text-[19px] font-medium">The Citation Economy</h4>
          <p className="text-muted text-[13.5px]">Why being mentioned beats ranking.</p>
          <div className="text-faint mt-auto flex gap-3 font-mono text-[10.5px]">
            <span>14 MIN</span><span>1,240×</span>
          </div>
        </Card>
        <Card>
          <span className="text-accent border-line-2 self-start rounded-[6px] border px-2 py-[3px] font-mono text-[11px]">
            Module 05
          </span>
          <h4 className="font-serif text-[19px] font-medium">Auditing your AI visibility</h4>
          <div className="flex gap-1.5">
            <span className="text-accent-2 rounded-[5px] border border-current px-2 py-[3px] font-mono text-[9.5px] tracking-[0.06em] uppercase">
              Interactive
            </span>
            <span className="text-muted rounded-[5px] border border-current px-2 py-[3px] font-mono text-[9.5px] tracking-[0.06em] uppercase">
              22 min
            </span>
          </div>
          <div className="text-faint mt-auto font-mono text-[10.5px]">● In progress · 46%</div>
        </Card>
        <Card className="!border-line-2 bg-accent-soft">
          <CardIcon>◎</CardIcon>
          <h4 className="font-serif text-[19px] font-medium">See how you show up</h4>
          <p className="text-muted text-[13.5px]">Eight questions, an honest score.</p>
          <Btn size="sm" className="mt-auto self-start">Start →</Btn>
        </Card>
        <Card>
          <CardIcon>⌗</CardIcon>
          <h4 className="font-serif text-[19px] font-medium">Schema Generator</h4>
          <p className="text-muted text-[13.5px]">Copy-paste structured data.</p>
          <Tag className="mt-auto">Launch tool →</Tag>
        </Card>
        <Card>
          <div className="text-accent font-serif text-[38px] leading-none">+340%</div>
          <p className="text-ink-2 text-[14px]">AI citations in 90 days · med spa, 1 location</p>
          <Tag className="mt-auto">Read case study →</Tag>
        </Card>
        <Card>
          <CardIcon>🜨</CardIcon>
          <h4 className="font-serif text-[19px] font-medium">HVAC &amp; Home Services</h4>
          <p className="text-muted text-[13.5px]">22 articles · 1 niche path</p>
          <Tag className="mt-auto">Open hub →</Tag>
        </Card>
      </div>
      <div className="mt-[18px] grid gap-5 sm:grid-cols-3">
        <Card className="gap-1.5 p-[15px_18px]">
          <Tag>Technical</Tag>
          <h4 className="text-[15px] font-semibold">Citation consistency in 6 steps</h4>
        </Card>
        <Card as="div">
          <div className="flex items-start gap-4">
            <Avatar>D</Avatar>
            <div>
              <h4 className="text-[16px] font-medium">Dana Reyes</h4>
              <div className="text-faint mt-1 font-mono text-[10.5px]">Editor · AEO Canon</div>
            </div>
          </div>
          <p className="text-muted text-[13.5px]">
            Covers the citation economy and content architecture.
          </p>
        </Card>
        <Card>
          <CardIcon soft>✦</CardIcon>
          <h4 className="font-serif text-[19px] font-medium">AEO Fundamentals Certified</h4>
          <p className="text-muted text-[13.5px]">Beginner credential · 12 modules</p>
          <Tag className="text-ok mt-auto">In progress</Tag>
        </Card>
      </div>
    </Section>
  );
}

// ---- 8. LISTS / STEPS ------------------------------------------------------

function ListsSteps() {
  return (
    <Section
      id="s8"
      num="08"
      title="List & step treatments"
      blurb="Process, ranking, and comparison patterns."
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Frame pad>
          <SpecLabel>Numbered steps</SpecLabel>
          <div className="flex flex-col gap-[18px]">
            {[
              ["01", "Read your AI answer", "Ask three engines to recommend a business like yours."],
              ["02", "Fix what they get wrong", "Schema and copy for description; citations for trust."],
              ["03", "Publish the questions", "Answer what customers actually ask."],
            ].map(([n, h, p]) => (
              <div key={n} className="grid grid-cols-[54px_1fr] items-start gap-4">
                <span className="text-accent font-serif text-[38px] leading-[0.9]">{n}</span>
                <div>
                  <h4 className="text-[17px] font-medium">{h}</h4>
                  <p className="text-muted text-[13.5px]">{p}</p>
                </div>
              </div>
            ))}
          </div>
        </Frame>
        <Frame pad>
          <SpecLabel>Vertical timeline</SpecLabel>
          <div className="border-line flex flex-col border-l-2 pl-[22px]">
            {[
              ["Week 1", "Audit & schema rebuild"],
              ["Month 1", "First question-first articles live"],
              ["Quarter 1", "Named in 3 of 5 engines"],
            ].map(([yr, tx]) => (
              <div key={yr} className="relative py-1.5 pb-5">
                <span className="bg-accent border-bg absolute top-2 left-[-29px] size-3 rounded-full border-[3px]" />
                <div className="text-accent font-mono text-[11px]">{yr}</div>
                <div className="text-ink-2 text-[14px]">{tx}</div>
              </div>
            ))}
          </div>
        </Frame>
      </div>
      <Spec label="Horizontal step flow" className="mt-5">
        <Frame pad>
          <div className="flex items-center gap-2 overflow-x-auto">
            {["Discovery", "Understanding", "Realization", "Conversion"].map((n, i, arr) => (
              <span key={n} className="flex items-center gap-2">
                <span className="border-line-2 bg-panel rounded-[10px] border px-4 py-3 text-center text-[13px]">
                  <span className="text-accent block font-mono text-[10px]">
                    0{i + 1}
                  </span>
                  {n}
                </span>
                {i < arr.length - 1 ? <span className="text-faint">→</span> : null}
              </span>
            ))}
          </div>
        </Frame>
      </Spec>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <Frame pad>
          <SpecLabel>Ranked list with score bars</SpecLabel>
          <div className="flex flex-col gap-3">
            {[
              ["Mentions", 90, ".66"],
              ["Brand anchors", 71, ".53"],
              ["Backlinks", 30, ".22"],
            ].map(([l, w, s]) => (
              <div key={l as string} className="grid grid-cols-[130px_1fr_34px] items-center gap-3 text-[13px]">
                <span>{l}</span>
                <span className="bg-bg-2 h-2.5 overflow-hidden rounded-full">
                  <span className="bg-accent block h-full rounded-full" style={{ width: `${w}%` }} />
                </span>
                <span className="font-mono">{s}</span>
              </div>
            ))}
          </div>
        </Frame>
        <Frame pad>
          <SpecLabel>Pros / cons split</SpecLabel>
          <div className="grid grid-cols-2 gap-4">
            <ul className="flex flex-col gap-2.5 text-[14px]">
              {["Owned, durable", "Compounds over time", "Uncopyable data"].map((t) => (
                <li key={t} className="flex gap-2.5">
                  <span className="text-ok font-mono">+</span>
                  {t}
                </li>
              ))}
            </ul>
            <ul className="flex flex-col gap-2.5 text-[14px]">
              {["Slower to start", "Needs real input", "No shortcuts"].map((t) => (
                <li key={t} className="flex gap-2.5">
                  <span className="text-bad font-mono">−</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </Frame>
      </div>
      <Spec label="Icon-labeled list & at-a-glance" className="mt-5">
        <Frame pad>
          <ul className="flex flex-col gap-3">
            {[
              ["◈", "Access", "if a machine can’t read you, it can’t quote you."],
              ["◆", "Authority", "AI trusts what the web already trusts."],
              ["◇", "Answerability", "write the sentence you want quoted."],
              ["▣", "Citability", "be the source nobody else can be."],
            ].map(([sym, b, t]) => (
              <li key={b} className="text-ink-2 flex gap-3 text-[14.5px]">
                <span className="text-accent shrink-0 text-[16px]">{sym}</span>
                <span>
                  <b>{b}</b> — {t}
                </span>
              </li>
            ))}
          </ul>
        </Frame>
      </Spec>
    </Section>
  );
}

// ---- 9. METAPHORS ----------------------------------------------------------

function Metaphors() {
  const pillars = [
    ["◈", "Discoverability", "Can the machine reach you?", "var(--c5)"],
    ["◆", "Authority", "Does the web vouch?", "var(--c4)"],
    ["◇", "Answerability", "Can it lift your answer?", "var(--c6)"],
    ["▣", "Citability", "Are you the best source?", "var(--c3)"],
  ];
  const gates = [
    ["Access", "Crawlable, fast, server-rendered", "pass", "var(--c3)"],
    ["Alignment", "Aimed at real questions", "pass", "var(--c4)"],
    ["Extractability", "Answer-first passages", "break", "var(--c5)"],
    ["Authority", "Locked until prior gate passes", "wait", "var(--faint)"],
  ];
  return (
    <Section
      id="s9"
      num="09"
      title="Visual metaphors & symbols"
      blurb="The brand’s recurring imagery, rendered as reusable elements."
    >
      <Spec label="The four pillars">
        <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
          {pillars.map(([sym, h, p, c]) => (
            <div
              key={h}
              className="border-line rounded-[14px] border border-t-4 p-[22px_18px] text-center"
              style={{ borderTopColor: c }}
            >
              <div className="text-[30px]" style={{ color: c }}>{sym}</div>
              <h4 className="mt-2.5 mb-1.5 text-[17px] font-medium">{h}</h4>
              <p className="text-muted text-[12px]">{p}</p>
            </div>
          ))}
        </div>
      </Spec>
      <div className="mt-5 grid gap-5 sm:grid-cols-3">
        <Frame pad>
          <SpecLabel>AEO funnel</SpecLabel>
          <div className="flex flex-col items-center gap-1.5">
            {[
              ["Discovery", 100, false],
              ["Understanding", 80, false],
              ["Realization", 60, false],
              ["Conversion", 40, true],
            ].map(([l, w, on]) => (
              <div
                key={l as string}
                className={cn(
                  "rounded-lg p-3 text-center font-mono text-[12px]",
                  on ? "bg-accent text-white" : "bg-accent-soft text-accent-2",
                )}
                style={{ width: `${w}%` }}
              >
                {l}
              </div>
            ))}
          </div>
        </Frame>
        <Frame pad>
          <SpecLabel>You vs competitors</SpecLabel>
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <div className="border-line rounded-[12px] border p-5 text-center">
              <div className="text-muted mb-2 font-mono text-[10.5px] tracking-[0.08em] uppercase">You</div>
              <div className="mx-auto"><Ring v={34} size={70} inner={54} fontSize={18} /></div>
            </div>
            <span className="text-faint font-mono">vs</span>
            <div className="border-line rounded-[12px] border p-5 text-center">
              <div className="text-muted mb-2 font-mono text-[10.5px] tracking-[0.08em] uppercase">Top rival</div>
              <div className="mx-auto"><Ring v={71} size={70} inner={54} fontSize={18} /></div>
            </div>
          </div>
        </Frame>
        <Frame pad>
          <SpecLabel>Dual nature</SpecLabel>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="border-line border-accent rounded-[12px] border border-t-[3px] p-5 text-center">
              <div className="text-muted mb-2 font-mono text-[10.5px] tracking-[0.08em] uppercase">Written by</div>
              <div className="font-serif text-[18px]">Humans</div>
            </div>
            <div className="border-line rounded-[12px] border border-t-[3px] p-5 text-center" style={{ borderTopColor: "var(--c4)" }}>
              <div className="text-muted mb-2 font-mono text-[10.5px] tracking-[0.08em] uppercase">Structured for</div>
              <div className="font-serif text-[18px]">Machines</div>
            </div>
          </div>
        </Frame>
      </div>
      <Spec label="Learning-path progression map" className="mt-5">
        <Frame pad>
          <div className="flex items-center overflow-x-auto">
            {[
              ["done", "✓"], ["done", "✓"], ["now", "5"], ["", "6"], ["", "7"], ["star", "★"],
            ].map(([state, label], i, arr) => (
              <span key={i} className="flex items-center">
                <span
                  className={cn(
                    "grid size-[38px] place-items-center rounded-full border-2 font-mono text-[12px]",
                    state === "done" && "border-accent bg-accent text-white",
                    state === "now" && "border-accent text-accent",
                    (state === "" || state === "star") && "border-line-2 text-muted",
                  )}
                >
                  {label}
                </span>
                {i < arr.length - 1 ? (
                  <span className={cn("h-0.5 w-[34px]", state === "done" ? "bg-accent" : "bg-line")} />
                ) : null}
              </span>
            ))}
          </div>
          <div className="text-muted mt-3 font-mono text-[11px]">
            Module 5 of 12 · next: Content architecture · ★ certification
          </div>
        </Frame>
      </Spec>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <Spec label="Brand glyph set">
          <div className="grid grid-cols-4 gap-2.5 sm:grid-cols-6">
            {GLYPHS.map(([g, l]) => (
              <div
                key={l}
                className="border-line bg-panel text-accent flex aspect-square flex-col items-center justify-center gap-2 rounded-[12px] border"
              >
                <span className="text-[26px]">{g}</span>
                <span className="text-muted font-mono text-[9px] tracking-[0.04em]">{l}</span>
              </div>
            ))}
          </div>
        </Spec>
        <Spec label="The pillar cascade · diagnostic gates">
          <Frame pad>
            <div className="flex flex-col">
              {gates.map(([h, s, st, c], i, arr) => (
                <div
                  key={h}
                  className={cn(
                    "grid grid-cols-[34px_1fr_auto] items-center gap-3.5 py-3.5",
                    i < arr.length - 1 && "border-line border-b",
                  )}
                >
                  <div
                    className={cn(
                      "grid size-[34px] place-items-center rounded-lg border-[1.5px] font-mono text-[12px]",
                      st === "pass" && "text-white",
                    )}
                    style={{
                      borderColor: c,
                      color: st === "pass" ? "#fff" : c,
                      background: st === "pass" ? c : "transparent",
                      opacity: st === "wait" ? 0.5 : 1,
                    }}
                  >
                    {st === "pass" ? "✓" : i + 1}
                  </div>
                  <div style={{ opacity: st === "wait" ? 0.5 : 1 }}>
                    <h4 className="text-[16px] font-medium">{h}</h4>
                    <div className="text-muted text-[12px]">{s}</div>
                  </div>
                  <span
                    className="rounded-[5px] border border-current px-2 py-[3px] font-mono text-[10.5px]"
                    style={{
                      color:
                        st === "pass" ? "var(--ok)" : st === "break" ? "var(--c4)" : "var(--muted)",
                    }}
                  >
                    {st === "pass" ? "Pass" : st === "break" ? "You break here" : "Waiting"}
                  </span>
                </div>
              ))}
            </div>
          </Frame>
        </Spec>
      </div>
    </Section>
  );
}

// ---- 10. LAYOUTS -----------------------------------------------------------

function LayoutShell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-line-2 bg-panel overflow-hidden rounded-[16px] border">
      <div className="border-line text-muted flex items-center gap-2 border-b px-4 py-2.5 font-mono text-[11px]">
        <span className="bg-accent size-2 rounded-full" /> {label}
      </div>
      <div className="max-h-[560px] overflow-auto p-[34px_38px]">{children}</div>
    </div>
  );
}

function Layouts() {
  return (
    <Section
      id="s10"
      num="10"
      title="Full article layout compositions"
      blurb="The elements assembled three ways — same system, genuinely different reading experiences."
    >
      <Spec label="Layout A · research-heavy — data-forward, formal">
        <LayoutShell label="Research report">
          <div>
            <div className="text-accent font-serif text-[56px] leading-none">94%</div>
            <h2 className="my-2.5 font-serif text-[26px] font-medium">
              The Citation Gap: why most local businesses are invisible to AI search
            </h2>
          </div>
          <Byline items={[<span key="r">Research · 18 min</span>, <span key="c">Cited 612×</span>]} />
          <div className="border-line my-5 flex overflow-hidden rounded-[12px] border">
            {[["38%", "overlap with rank"], ["0.66", "mentions corr."], ["~11%", "cross-engine"]].map(([n, l], i) => (
              <div key={i} className="border-line flex-1 border-r p-5 last:border-r-0">
                <div className="font-serif text-[30px]">{n}</div>
                <div className="text-muted mt-1.5 font-mono text-[10px] tracking-[0.05em] uppercase">{l}</div>
              </div>
            ))}
          </div>
          <p className="text-ink-2 font-serif text-[16px] leading-[1.7]">
            When an engine answers, it synthesizes — it does not list. The cited
            source receives the visibility; every uncited source receives nothing…
          </p>
          <div className="border-line bg-panel my-2 flex items-center gap-[18px] rounded-[12px] border px-[22px] py-5">
            <div className="text-accent font-serif text-[46px] leading-none">61%</div>
            <div>
              <Tag>CTR drop</Tag>
              <p className="text-[13px]">when an AI Overview appears</p>
            </div>
          </div>
        </LayoutShell>
      </Spec>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <Spec label="Layout B · practical guide — hands-on">
          <LayoutShell label="Niche guide">
            <Eyebrow>HVAC · 22 min</Eyebrow>
            <h2 className="my-2.5 font-serif text-[24px] font-medium">AEO for HVAC Contractors</h2>
            <div className="border-line-2 bg-bg-2 mb-4 rounded-[12px] border border-dashed px-[22px] py-4">
              <CalloutHead className="text-ok">◆ Quick win</CalloutHead>
              <p className="text-ink-2 text-[15px]">Add same-day availability to your schema today.</p>
            </div>
            <div className="flex flex-col gap-4">
              {[["01", "Capture emergencies", "Structured availability + service area."], ["02", "Answer the 6pm question", "“Why is my AC blowing warm?”"]].map(([n, h, p]) => (
                <div key={n} className="grid grid-cols-[44px_1fr] items-start gap-3">
                  <span className="text-accent font-serif text-[28px] leading-[0.9]">{n}</span>
                  <div>
                    <h4 className="text-[15px] font-medium">{h}</h4>
                    <p className="text-muted text-[13.5px]">{p}</p>
                  </div>
                </div>
              ))}
            </div>
          </LayoutShell>
        </Spec>
        <Spec label="Layout C · thought-leadership — essay, typographic">
          <LayoutShell label="Opinion">
            <div className="text-center">
              <Eyebrow>Essay · 9 min</Eyebrow>
            </div>
            <h2 className="my-3.5 text-left font-serif text-[30px] font-medium">
              AI content can&apos;t win AI search — here&apos;s the paradox
            </h2>
            <p className="text-ink-2 text-left font-serif text-[16px] leading-[1.7]">
              The supply of competent, generic writing is now infinite. Which means
              it is worth nothing to an engine built to find the best source…
            </p>
            <div className="text-ink mx-auto my-[18px] max-w-[30ch] text-center font-serif text-[24px] leading-[1.3] italic">
              &ldquo;The scarce thing is what was always valuable: the specifically
              true.&rdquo;
            </div>
            <p className="text-ink-2 text-left font-serif text-[16px] leading-[1.7]">
              Originality stopped being a virtue and became a moat…
            </p>
          </LayoutShell>
        </Spec>
      </div>
    </Section>
  );
}

// ---- 11. CONSOLE & STATUS --------------------------------------------------

function ConsoleStatus() {
  const board = [
    ["§ 1 · Foundation", "Access & alignment", "38 ENTRIES", "var(--c5)"],
    ["§ 2 · Trust", "Authority signals", "41 ENTRIES", "var(--c3)"],
    ["§ 3 · Extractability", "Answer-shaped copy", "52 ENTRIES", "var(--c4)"],
    ["§ 4 · Freshness", "Cadence & signals", "27 ENTRIES", "var(--c2)"],
    ["§ 5 · Industries", "Niche playbooks", "68 ENTRIES", "var(--c1)"],
  ];
  return (
    <Section
      id="s11"
      num="11"
      title="Console & status patterns"
      blurb="The site’s spectrum identity — colour as category, not decoration. Boards, pills, and status systems for organizing the canon at scale."
    >
      <Spec label="Category board · the canon at a glance">
        <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-5">
          {board.map(([bn, h, c, color]) => (
            <a
              key={bn}
              href="#"
              className="border-line bg-panel text-ink flex flex-col gap-2 rounded-[12px] border border-t-4 p-[16px_14px] no-underline transition-transform hover:-translate-y-[3px]"
              style={{ borderTopColor: color }}
            >
              <span className="flex items-center gap-1.5 font-mono text-[10.5px]" style={{ color }}>
                <span className="size-2 rounded-full" style={{ background: color }} />
                {bn}
              </span>
              <h4 className="font-serif text-[15px]">{h}</h4>
              <span className="text-faint font-mono text-[10px]">{c}</span>
            </a>
          ))}
        </div>
      </Spec>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <Frame pad>
          <SpecLabel>Status pills</SpecLabel>
          <div className="flex flex-wrap gap-2">
            {[
              ["Live", "var(--ok)"], ["In progress", "var(--c4)"], ["New", "var(--accent)"],
              ["Coming soon", "var(--c2)"], ["Locked", "var(--muted)"],
            ].map(([l, c]) => (
              <span
                key={l}
                className="inline-flex items-center gap-1.5 rounded-full border px-[11px] py-[5px] font-mono text-[10.5px] tracking-[0.04em]"
                style={{ color: c, borderColor: "currentColor" }}
              >
                <span className="size-1.5 rounded-full" style={{ background: c }} />
                {l}
              </span>
            ))}
          </div>
          <SpecLabel className="mt-5">Format segmented bar</SpecLabel>
          <div className="border-line flex h-[26px] overflow-hidden rounded-[7px] border">
            {[["Article", 40, "var(--c3)"], ["Interactive", 22, "var(--c4)"], ["Video", 18, "var(--c2)"], ["Workshop", 20, "var(--c6)"]].map(([l, w, c]) => (
              <span key={l as string} className="grid place-items-center font-mono text-[10px] text-white" style={{ width: `${w}%`, background: c }}>
                {l}
              </span>
            ))}
          </div>
        </Frame>
        <Frame pad>
          <SpecLabel>Kanban · content pipeline</SpecLabel>
          <div className="grid grid-cols-3 gap-3">
            {[
              ["Drafting", "3", [["Schema for dentists", "Technical", "var(--c5)"], ["Review velocity", "Med spa", "var(--c3)"]]],
              ["Review", "2", [["AI Overviews Q2", "Trend", "var(--c4)"]]],
              ["Published", "352", [["Citation Economy", "1,240×", "var(--c2)"]]],
            ].map(([h, n, cards]) => (
              <div key={h as string} className="border-line bg-bg-2 flex flex-col gap-2 rounded-[12px] border p-3">
                <div className="text-muted flex justify-between font-mono text-[10.5px] tracking-[0.06em] uppercase">
                  <span>{h}</span><span>{n}</span>
                </div>
                {(cards as [string, string, string][]).map(([t, k, c]) => (
                  <div key={t} className="bg-panel border-line rounded-[9px] border border-l-[3px] px-3 py-2.5 text-[13px]" style={{ borderLeftColor: c }}>
                    {t}
                    <div className="text-muted mt-1.5 font-mono text-[9.5px]">{k}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </Frame>
      </div>
      <div className="mt-5 grid gap-5 sm:grid-cols-3">
        <Frame pad>
          <SpecLabel>Mastery rollup</SpecLabel>
          <div className="flex flex-col gap-3">
            <SovRow label="Understanding" value={72} color="var(--c5)" />
            <SovRow label="Trust" value={45} color="var(--c3)" />
            <SovRow label="Extract." value={30} color="var(--c4)" />
            <SovRow label="Freshness" value={18} color="var(--c2)" />
          </div>
        </Frame>
        <Frame pad>
          <SpecLabel>Notification toast</SpecLabel>
          <div className="bg-ink flex items-center gap-3 rounded-[12px] px-[18px] py-4">
            <span className="text-accent text-[20px]">✦</span>
            <div>
              <div className="text-bg font-serif text-[16px]">Badge earned</div>
              <p className="mt-0.5 text-[12.5px]" style={{ color: "color-mix(in oklab, var(--bg) 78%, var(--ink))" }}>
                First Module Complete · keep the streak going
              </p>
            </div>
          </div>
          <SpecLabel className="mt-[18px]">Streak counter</SpecLabel>
          <div className="text-muted flex items-center gap-1.5 font-mono text-[12px]">
            <span className="text-accent font-serif text-[24px]">7</span> day streak
            <span className="ml-auto tracking-[2px]">●●●●●●●</span>
          </div>
        </Frame>
        <Frame pad>
          <SpecLabel>Spectrum chips</SpecLabel>
          <div className="flex flex-wrap gap-2">
            {[["c1", "Industries"], ["c2", "Freshness"], ["c3", "Authority"], ["c4", "Access"], ["c5", "Extract"], ["c6", "Measure"]].map(([c, l]) => (
              <span
                key={c}
                className="inline-flex items-center gap-1.5 rounded-full px-[11px] py-[5px] font-mono text-[10.5px]"
                style={{ color: `var(--${c})`, background: `color-mix(in oklab, var(--${c}) 14%, transparent)` }}
              >
                <span className="size-1.5 rounded-full" style={{ background: `var(--${c})` }} />
                {l}
              </span>
            ))}
          </div>
        </Frame>
      </div>
    </Section>
  );
}

// ---- 12. ANNOTATION & READING ----------------------------------------------

function Annotation() {
  return (
    <Section
      id="s12"
      num="12"
      title="Annotation & reading aids"
      blurb="Treatments for the 5,000-word read — margin notes, highlights, key terms, and skimmable summaries."
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Frame pad>
          <SpecLabel>Highlight + reference marks</SpecLabel>
          <p className="text-ink font-serif text-[18px] leading-[1.8]">
            Engines retrieve at the{" "}
            <mark className="text-ink bg-accent-soft rounded-[3px] px-[3px] py-px">passage level</mark>, then a
            reranker scores each passage for relevance, authority, and freshness
            <span className="text-accent align-super font-mono text-[10px]">[15]</span>. The
            implication: every section must{" "}
            <mark className="text-ink bg-accent-soft rounded-[3px] px-[3px] py-px">stand on its own</mark>.
          </p>
        </Frame>
        <Frame pad>
          <SpecLabel>Margin note</SpecLabel>
          <div className="grid grid-cols-[1fr_180px] items-start gap-6">
            <p className="text-ink font-serif text-[16px] leading-[1.7]">
              A model recommends you because many independent sources describe you
              the same way — not because one page argued well.
            </p>
            <div className="border-accent text-muted border-l-2 pl-3 font-mono text-[11.5px] leading-[1.5]">
              This is the single most counterintuitive idea in the canon — most
              owners optimize one page.
            </div>
          </div>
        </Frame>
      </div>
      <div className="mt-5 grid gap-5 sm:grid-cols-3">
        <Frame pad>
          <SpecLabel>TL;DR summary</SpecLabel>
          <div className="border-accent bg-accent-soft rounded-[12px] border border-dashed px-5 py-[18px]">
            <div className="text-accent-2 mb-2.5 font-mono text-[10.5px] tracking-[0.1em] uppercase">TL;DR</div>
            <ul className="flex flex-col gap-[7px]">
              {["Citation beats ranking", "Mentions beat backlinks", "Lead with the answer"].map((t) => (
                <li key={t} className="text-ink-2 flex gap-2.5 text-[14px]">
                  <span className="text-accent">▸</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </Frame>
        <Frame pad>
          <SpecLabel>Key terms</SpecLabel>
          <div className="flex flex-wrap gap-2">
            {["AEO", "RAG", "Schema", "Extractability", "PAWC"].map((t) => (
              <span key={t} className="border-line-2 bg-panel inline-flex items-center gap-1.5 rounded-[7px] border px-[9px] py-[3px] font-mono text-[11.5px]">
                <span className="bg-accent size-1.5 rounded-full" />
                {t}
              </span>
            ))}
          </div>
          <SpecLabel className="mt-[18px]">Footnote</SpecLabel>
          <div className="border-line text-muted flex gap-2 border-t py-2 text-[12.5px]">
            <span className="text-accent shrink-0 font-mono">15</span>
            <span>Passage Segmentation for Extractive QA, arXiv 2025.</span>
          </div>
        </Frame>
        <Frame pad>
          <SpecLabel>Reading meta bar</SpecLabel>
          <div className="border-line bg-bg-2 text-muted flex flex-wrap gap-[18px] rounded-[10px] border px-4 py-3 font-mono text-[11px]">
            <span><b className="text-ink">14</b> min</span>
            <span><b className="text-ink">3,180</b> words</span>
            <span>Cited <b className="text-ink">1,240×</b></span>
          </div>
          <div className="border-line bg-bg-2 text-muted mt-2.5 flex items-center gap-[18px] rounded-[10px] border px-4 py-3 font-mono text-[11px]">
            <span>Progress</span>
            <span className="bg-bg-2 h-[5px] flex-1 overflow-hidden rounded-full">
              <span className="bg-accent block h-full" style={{ width: "64%" }} />
            </span>
            <span><b className="text-ink">64%</b></span>
          </div>
        </Frame>
      </div>
      <Spec label="Side pull-quote" className="mt-5">
        <Frame pad>
          <div className="border-accent text-ink border-y-2 py-4 font-serif text-[22px] leading-[1.3] italic">
            The businesses winning AEO aren&apos;t the loudest — they&apos;re the
            most legible.
          </div>
        </Frame>
      </Spec>
    </Section>
  );
}

// ---- 13. COMPARISON & TABLES -----------------------------------------------

function Comparison() {
  return (
    <Section
      id="s13"
      num="13"
      title="Comparison & table layouts"
      blurb="For SEO-vs-AEO explainers, feature matrices, and scorecards."
    >
      <Spec label="Versus split">
        <div className="border-line grid grid-cols-1 overflow-hidden rounded-[14px] border sm:grid-cols-[1fr_auto_1fr]">
          <div className="border-line border-b p-[22px] sm:border-r sm:border-b-0">
            <div className="text-muted mb-3.5 font-mono text-[10.5px] tracking-[0.08em] uppercase">Traditional SEO</div>
            {["Optimizes for rank position", "Wins the click", "Keyword-led", "Page-level"].map((t) => (
              <div key={t} className="text-ink-2 flex gap-2.5 py-[7px] text-[14px]">◇ {t}</div>
            ))}
          </div>
          <div className="bg-bg-2 text-muted grid place-items-center px-4 font-serif italic">vs</div>
          <div className="p-[22px]">
            <div className="text-accent mb-3.5 font-mono text-[10.5px] tracking-[0.08em] uppercase">Answer Engine Optimization</div>
            {["Optimizes for citation", "Wins the recommendation", "Question-led", "Passage-level"].map((t) => (
              <div key={t} className="text-ink-2 flex gap-2.5 py-[7px] text-[14px]">◆ {t}</div>
            ))}
          </div>
        </div>
      </Spec>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <Frame pad>
          <SpecLabel>Feature matrix</SpecLabel>
          <table className="w-full border-collapse text-[13.5px]">
            <thead>
              <tr>
                {["Capability", "Foundations", "Authority"].map((h, i) => (
                  <th key={h} className={cn("border-ink text-muted border-b-2 p-2.5 font-mono text-[10px] tracking-[0.05em] uppercase", i === 0 ? "text-left" : "text-center")}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Website build", ["✓", "ok"], ["✓", "ok"], false],
                ["Articles / mo", ["4", ""], ["10", ""], false],
                ["Engine monitoring", ["Quarterly", "warn"], ["Monthly", "ok"], false],
                ["Dedicated strategist", ["—", "bad"], ["✓", "ok"], true],
              ].map((row, i) => (
                <tr key={i} className={row[3] ? "bg-accent-soft" : ""}>
                  <td className="border-line border-b p-2.5 text-left font-medium">{row[0] as string}</td>
                  {([row[1], row[2]] as [string, string][]).map(([t, tone], j) => (
                    <td
                      key={j}
                      className="border-line border-b p-2.5 text-center"
                      style={{ color: tone === "ok" ? "var(--ok)" : tone === "warn" ? "var(--warn)" : tone === "bad" ? "var(--bad)" : undefined }}
                    >
                      {t}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Frame>
        <Frame pad>
          <SpecLabel>Decision matrix</SpecLabel>
          <div className="border-line grid grid-cols-[auto_1fr_1fr] gap-px overflow-hidden rounded-[10px] border" style={{ background: "var(--line)" }}>
            {["", "Article", "Course"].map((h) => (
              <div key={h || "x"} className="bg-panel text-muted p-3.5 text-center font-mono text-[10.5px] uppercase">{h}</div>
            ))}
            {[
              ["Need one answer", true, false],
              ["Build competence", false, true],
              ["From a Google search", true, false],
            ].map(([q, a, b]) => (
              <span key={q as string} className="contents">
                <div className="bg-panel flex items-center p-3.5 text-[13px]">{q}</div>
                <div className="bg-panel p-3.5 text-center" style={{ color: a ? "var(--ok)" : "var(--faint)" }}>{a ? "●" : "○"}</div>
                <div className="bg-panel p-3.5 text-center" style={{ color: b ? "var(--ok)" : "var(--faint)" }}>{b ? "●" : "○"}</div>
              </span>
            ))}
          </div>
        </Frame>
      </div>
      <Spec label="Scorecard bands" className="mt-5">
        <Frame pad>
          {[
            ["Access", 82, "var(--ok)"],
            ["Authority", 48, "var(--warn)"],
            ["Extractability", 22, "var(--bad)"],
          ].map(([n, w, c], i, arr) => (
            <div key={n as string} className={cn("flex items-center gap-3.5 py-3.5", i < arr.length - 1 && "border-line border-b")}>
              <span className="w-[120px] text-[14px]">{n}</span>
              <span className="bg-bg-2 h-2 flex-1 overflow-hidden rounded-full">
                <span className="block h-full rounded-full" style={{ width: `${w}%`, background: c }} />
              </span>
              <span className="w-[34px] text-right font-mono text-[13px]">{w}</span>
            </div>
          ))}
        </Frame>
      </Spec>
    </Section>
  );
}

// ---- 14. EMBEDDED TOOLS ----------------------------------------------------

function Tool({ name, badge, children }: { name: string; badge: string; children: React.ReactNode }) {
  return (
    <div className="border-line-2 bg-panel overflow-hidden rounded-[14px] border">
      <div className="border-line bg-bg-2 text-muted flex items-center gap-2 border-b px-4 py-2.5 font-mono text-[11px]">
        <span className="bg-accent size-2 rounded-full" /> {name}
        <span className="text-ink ml-auto">{badge}</span>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function ToolBtn({ children, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className="bg-accent cursor-pointer rounded-lg border-none px-4 py-2.5 font-sans text-[13px] font-medium text-white"
      {...rest}
    >
      {children}
    </button>
  );
}

function EmbeddedTools() {
  const [t14url, setT14url] = useState("");
  const [t14score, setT14score] = useState<number | null>(null);
  const [genName, setGenName] = useState("");
  const [genArea, setGenArea] = useState("");
  const [genOut, setGenOut] = useState(false);
  const scorerSignals = [
    ["Statistics", 20], ["Quotations", 25], ["Cited sources", 18],
    ["Clear headings", 12], ["Author bio", 15], ["Recent date", 10],
  ] as [string, number][];
  const [scorerOn, setScorerOn] = useState<boolean[]>(scorerSignals.map(() => false));
  const scorerTotal = Math.min(
    scorerOn.reduce((a, on, i) => a + (on ? (scorerSignals[i]?.[1] ?? 0) : 0), 0),
    100,
  );
  const [quiz, setQuiz] = useState<number | null>(null);
  const [leads, setLeads] = useState(12);
  const [step, setStep] = useState(2); // 0-indexed "now" step (Write)

  return (
    <Section
      id="s14"
      num="14"
      title="Embedded interactive tools"
      blurb="The Scrimba move — learners do the thing inside the lesson. All functional; try them."
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Tool name="AI Visibility Audit" badge="TOOL">
          <div className="mb-4 flex gap-2.5">
            <input
              value={t14url}
              onChange={(e) => setT14url(e.target.value)}
              placeholder="yourbusiness.com"
              className="border-line-2 bg-bg text-ink focus:border-accent flex-1 rounded-[9px] border px-3.5 py-3 font-mono text-[13px] outline-none"
            />
            <ToolBtn onClick={() => setT14score(fakeScore(t14url))}>Audit</ToolBtn>
          </div>
          <div
            className="mx-auto grid size-[130px] place-items-center rounded-full"
            style={{
              background: `conic-gradient(var(--accent) ${(t14score ?? 0) * 3.6}deg, var(--bg-2) 0)`,
            }}
          >
            <div className="bg-panel grid size-[100px] flex-col place-items-center rounded-full font-serif text-[34px]">
              {t14score ?? "—"}
              <small className="text-muted font-mono text-[10px]">/ 100</small>
            </div>
          </div>
          <div className="text-muted mt-3 text-center font-mono text-[11px]">
            {t14score == null ? "enter a URL to score" : band(t14score)}
          </div>
        </Tool>
        <Tool name="Schema Generator" badge="TOOL">
          <input
            value={genName}
            onChange={(e) => setGenName(e.target.value)}
            placeholder="Business name"
            className="border-line-2 bg-bg text-ink focus:border-accent mb-2 w-full rounded-[9px] border px-3.5 py-3 font-sans text-[13px] outline-none"
          />
          <div className="mb-3 flex gap-2.5">
            <input
              value={genArea}
              onChange={(e) => setGenArea(e.target.value)}
              placeholder="Service area"
              className="border-line-2 bg-bg text-ink focus:border-accent flex-1 rounded-[9px] border px-3.5 py-3 font-sans text-[13px] outline-none"
            />
            <ToolBtn onClick={() => setGenOut(true)}>Generate</ToolBtn>
          </div>
          <Code className="text-[11px]">
            {genOut ? (
              <>
                <span className="text-[#7d8a7d]">{"// LocalBusiness"}</span>
                <br />{"{"}
                <br />&nbsp;&nbsp;&quot;<span className="text-accent">@type</span>&quot;:{" "}
                <span style={{ color: "oklch(0.8 0.1 150)" }}>&quot;LocalBusiness&quot;</span>,
                <br />&nbsp;&nbsp;&quot;<span className="text-accent">name</span>&quot;:{" "}
                <span style={{ color: "oklch(0.8 0.1 150)" }}>&quot;{genName || "Your Business"}&quot;</span>,
                <br />&nbsp;&nbsp;&quot;<span className="text-accent">areaServed</span>&quot;:{" "}
                <span style={{ color: "oklch(0.8 0.1 150)" }}>&quot;{genArea || "Your County, ST"}&quot;</span>
                <br />{"}"}
              </>
            ) : (
              "// fill the fields and generate"
            )}
          </Code>
        </Tool>
      </div>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <Tool name="Content Scorer" badge="TOOL">
          <p className="text-muted mb-3 text-[13px]">Toggle the signals present in your draft:</p>
          <div className="flex flex-wrap gap-[7px]">
            {scorerSignals.map(([label], i) => (
              <button
                key={label}
                type="button"
                onClick={() => setScorerOn((s) => s.map((v, j) => (j === i ? !v : v)))}
                className={cn(
                  "cursor-pointer rounded-full border px-[11px] py-[5px] font-mono text-[11.5px]",
                  scorerOn[i] ? "border-accent bg-accent text-white" : "border-line bg-bg-2 text-ink-2",
                )}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="mt-4 font-serif">
            <span className="text-accent text-[34px]">{scorerTotal}</span>
            <span className="text-muted font-mono text-[14px]"> / 100 citability</span>
          </div>
        </Tool>
        <Tool name="Module Quiz" badge="QUIZ">
          <p className="mb-3.5 font-serif text-[16px]">What does an answer engine cite?</p>
          <div className="flex flex-col gap-2">
            {[["A", "The whole page", false], ["B", "A specific passage", true], ["C", "The meta description", false]].map(([k, t, correct], i) => {
              const chosen = quiz === i;
              return (
                <button
                  key={k as string}
                  type="button"
                  onClick={() => setQuiz(i)}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-[10px] border px-3.5 py-3 text-left text-[14.5px]",
                    chosen && correct && "border-ok",
                    chosen && !correct && "border-bad",
                    !chosen && "border-line-2 hover:border-accent",
                  )}
                  style={
                    chosen
                      ? { background: `color-mix(in oklab, var(--${correct ? "ok" : "bad"}) 12%, var(--panel))` }
                      : undefined
                  }
                >
                  <span className="border-line-2 grid size-6 place-items-center rounded-full border-[1.5px] font-mono text-[11px]">{k}</span>
                  {t}
                </button>
              );
            })}
          </div>
          {quiz != null ? (
            <div
              className="mt-2.5 font-mono text-[12px]"
              style={{ color: quiz === 1 ? "var(--ok)" : "var(--bad)" }}
            >
              {quiz === 1
                ? "✓ Right — engines cite passages, not pages."
                : "Not quite — engines retrieve at the passage level."}
            </div>
          ) : null}
        </Tool>
      </div>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <Tool name="ROI Calculator" badge="TOOL">
          <div className="border-line flex items-center justify-between border-b py-2.5 text-[14px]">
            <span>Monthly leads from AI</span>
            <span className="font-mono">{leads}</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={leads}
            onChange={(e) => setLeads(+e.target.value)}
            className="accent-accent my-3 w-full"
          />
          <div className="flex items-center justify-between py-2.5 text-[14px]">
            <span className="text-muted">Est. annual value @ $400/lead</span>
          </div>
          <div className="text-accent mt-3 font-serif text-[34px]">
            ${(leads * 400 * 12).toLocaleString()}
          </div>
        </Tool>
        <Tool name="Workshop Stepper" badge="WORKSHOP">
          <div className="mb-4 flex items-center">
            {["Audit", "Schema", "Write", "Publish"].map((s, i) => {
              const state = i < step ? "done" : i === step ? "now" : "";
              return (
                <div key={s} className="text-muted relative flex-1 text-center font-mono text-[10.5px]">
                  {i > 0 ? (
                    <span className={cn("absolute top-[11px] right-1/2 left-[-50%] h-0.5", i <= step ? "bg-accent" : "bg-line")} />
                  ) : null}
                  <div
                    className={cn(
                      "bg-panel relative z-[1] mx-auto mb-1.5 grid size-6 place-items-center rounded-full border-2 text-[10px]",
                      state === "done" && "border-accent bg-accent text-white",
                      state === "now" && "border-accent text-accent",
                      state === "" && "border-line-2",
                    )}
                  >
                    {i < step ? "✓" : i + 1}
                  </div>
                  {s}
                </div>
              );
            })}
          </div>
          <p className="text-ink-2 text-[14px]">
            Step {step + 1} — Draft one answer-first passage for your top question.
            Lead with the claim in the first sentence.
          </p>
          <ToolBtn className="mt-3.5" onClick={() => setStep((s) => Math.min(s + 1, 3))}>
            {step >= 3 ? "Workshop complete ✓" : "Mark step complete →"}
          </ToolBtn>
        </Tool>
      </div>
    </Section>
  );
}

// ---- 15. SIDEBARS & NAV ----------------------------------------------------

function Sidebars() {
  return (
    <Section
      id="s15"
      num="15"
      title="Sidebars & navigation"
      blurb="Wayfinding for long reads and multi-module courses."
    >
      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <SpecLabel>Sticky TOC rail</SpecLabel>
          <div className="border-line bg-bg-2 rounded-[12px] border p-[18px]">
            <h6 className="text-muted mb-3 font-mono text-[10px] tracking-[0.12em] uppercase">On this page</h6>
            {[["The list is dead", true], ["How answers get built", false], ["Consensus as currency", false], ["Monday morning", false]].map(([t, on]) => (
              <a key={t as string} href="#" className={cn("border-line block border-l-2 py-1.5 pl-3 text-[13.5px] no-underline", on ? "border-accent text-accent" : "text-ink-2")}>
                {t}
              </a>
            ))}
          </div>
        </div>
        <div>
          <SpecLabel>Module navigator</SpecLabel>
          <Frame className="p-3.5">
            <div className="flex flex-col gap-0.5">
              {[
                ["✓", "What AEO is", "8m", "done"],
                ["5", "Auditing visibility", "now", "on"],
                ["6", "Content architecture", "12m", ""],
              ].map(([k, t, meta, state]) => (
                <a
                  key={t}
                  href="#"
                  className={cn(
                    "text-ink-2 grid grid-cols-[26px_1fr_auto] items-center gap-2.5 rounded-[9px] p-2.5 text-[13.5px] no-underline",
                    state === "on" ? "bg-accent-soft text-ink" : "hover:bg-bg-2",
                  )}
                >
                  <span className={cn("grid size-[22px] place-items-center rounded-full border-[1.5px] font-mono text-[10px]", state === "done" ? "border-accent bg-accent text-white" : "border-line-2")}>
                    {k}
                  </span>
                  {t}
                  <span className="font-mono text-[10px]" style={{ color: meta === "now" ? "var(--accent)" : "var(--faint)" }}>{meta}</span>
                </a>
              ))}
            </div>
          </Frame>
        </div>
        <div>
          <SpecLabel>Jump-link rail</SpecLabel>
          <Frame pad>
            <div className="border-line flex flex-col border-l-2">
              {[["01 Foundation", true], ["02 Reputation", false], ["03 Momentum", false], ["04 Measurement", false]].map(([t, on]) => (
                <a key={t as string} href="#" className={cn("relative py-1.5 pl-3.5 text-[13px] no-underline", on ? "text-accent" : "text-muted")}>
                  {on ? <span className="bg-accent absolute top-0 bottom-0 left-[-2px] w-0.5" /> : null}
                  {t}
                </a>
              ))}
            </div>
          </Frame>
        </div>
      </div>
      <div className="mt-5 grid gap-5 sm:grid-cols-3">
        <Frame pad>
          <SpecLabel>Breadcrumbs</SpecLabel>
          <div className="text-muted flex flex-wrap items-center gap-2 font-mono text-[11.5px]">
            <b className="text-ink">Canon</b>
            <span className="text-faint">/</span>Fundamentals
            <span className="text-faint">/</span>
            <b className="text-ink">The Citation Economy</b>
          </div>
        </Frame>
        <Frame pad className="flex items-center gap-3.5">
          <Ring v={46} size={44} inner={32} fontSize={10}>
            <span className="font-mono">46%</span>
          </Ring>
          <div>
            <div className="text-[14px] font-medium">Auditing &amp; Measurement</div>
            <div className="text-muted font-mono text-[11px]">Module 5 of 10</div>
          </div>
        </Frame>
        <Frame pad className="flex items-center justify-center">
          <span className="bg-ink text-bg inline-flex items-center gap-2.5 rounded-full px-[18px] py-2.5 font-mono text-[12px]">
            <span className="bg-accent size-[7px] rounded-full" /> Resume learning
          </span>
        </Frame>
      </div>
    </Section>
  );
}

// ---- 16. ENGAGEMENT & CTAs -------------------------------------------------

function Engagement() {
  const [subbed, setSubbed] = useState(false);
  const [helpful, setHelpful] = useState<"y" | "n" | null>(null);
  const [rating, setRating] = useState(0);
  return (
    <Section
      id="s16"
      num="16"
      title="Engagement & conversion"
      blurb="The warm, educational nudges — placed at natural moments, never as pressure."
    >
      <div className="bg-ink flex flex-wrap items-center justify-between gap-5 rounded-[16px] px-[34px] py-[30px]">
        <div>
          <h3 className="text-bg font-serif text-[24px]">Most businesses score below 30/100.</h3>
          <p className="mt-1 text-[14px]" style={{ color: "color-mix(in oklab, var(--bg) 78%, var(--ink))" }}>
            Want to see what an AEO-optimized version of your site would look like?
          </p>
        </div>
        <Btn variant="accent">See your score →</Btn>
      </div>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div className="border-line grid grid-cols-2 overflow-hidden rounded-[14px] border">
          <div className="p-6">
            <Tag>Self-serve</Tag>
            <h3 className="my-2 font-serif text-[20px]">Learn it yourself</h3>
            <p className="text-muted text-[13.5px]">Free in the AEO school.</p>
          </div>
          <div className="bg-accent-soft p-6">
            <Tag>Done for you</Tag>
            <h3 className="my-2 font-serif text-[20px]">We run it</h3>
            <p className="text-ink-2 text-[13.5px]">Site + content retainer.</p>
          </div>
        </div>
        <div className="border-line-2 bg-accent-soft rounded-[14px] border p-6 text-center">
          <h3 className="mb-2 font-serif text-[22px]">You have the plan. We can execute it.</h3>
          <p className="text-ink-2 mx-auto mb-4 max-w-[42ch] text-[14px]">
            You finished the action-plan module. Talk to a strategist about putting
            it to work.
          </p>
          <Btn>Book a call</Btn>
        </div>
      </div>
      <div className="mt-5 grid gap-5 sm:grid-cols-3">
        <Frame pad>
          <SpecLabel>Newsletter inline</SpecLabel>
          <p className="mb-3 text-[14px]">Get the State of AEO, monthly.</p>
          <div className="flex max-w-[380px] gap-2">
            <input
              placeholder="you@business.com"
              className="border-line-2 bg-panel text-ink focus:border-accent flex-1 rounded-lg border px-3.5 py-3 font-sans text-[14px] outline-none"
            />
            <Btn size="sm" onClick={() => setSubbed(true)}>Join</Btn>
          </div>
          {subbed ? (
            <div className="text-accent mt-2 font-mono text-[11px]">✓ Subscribed — see you monthly.</div>
          ) : null}
        </Frame>
        <Frame pad>
          <SpecLabel>“Was this helpful?”</SpecLabel>
          <div className="text-muted mb-[18px] flex items-center gap-2.5 font-mono text-[12px]">
            <span>Was this helpful?</span>
            {(["y", "n"] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setHelpful(v)}
                className={cn(
                  "cursor-pointer rounded-lg border px-3 py-[7px] font-mono text-[12px]",
                  helpful === v ? "border-accent bg-accent text-white" : "border-line-2 text-ink-2 hover:border-accent hover:text-accent",
                )}
              >
                {v === "y" ? "Yes" : "No"}
              </button>
            ))}
          </div>
          <SpecLabel>Star rating</SpecLabel>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                className={cn("cursor-pointer text-[22px]", n <= rating ? "text-accent" : "text-line-2")}
              >
                ★
              </button>
            ))}
          </div>
        </Frame>
        <Frame pad>
          <SpecLabel>Share + gate</SpecLabel>
          <div className="mb-[18px] flex gap-2">
            {["↗", "in", "𝕏", "⧉"].map((s) => (
              <button key={s} type="button" className="border-line-2 bg-panel text-ink-2 hover:border-accent hover:text-accent grid size-[38px] cursor-pointer place-items-center rounded-[9px] border font-mono text-[13px]">
                {s}
              </button>
            ))}
          </div>
          <div className="border-line-2 bg-bg-2 rounded-[14px] border p-6 text-center">
            <div className="text-accent mb-2 text-[24px]">◆</div>
            <h3 className="mb-1.5 font-serif text-[20px]">Continue free</h3>
            <p className="text-muted mb-4 text-[13.5px]">Create an account to save progress past Module 1.</p>
            <Btn size="sm">Create account</Btn>
          </div>
        </Frame>
      </div>
      <Spec label="Progress-aware CTA" className="mt-5">
        <div className="border-accent bg-panel flex items-center gap-[18px] rounded-[14px] border px-6 py-5">
          <Ring v={100} size={44} inner={32} fontSize={12}>✓</Ring>
          <div className="flex-1">
            <div className="font-serif text-[18px]">You understand AEO.</div>
            <div className="text-muted text-[13.5px]">Ready for an AEO-optimized website?</div>
          </div>
          <Btn>See packages →</Btn>
        </div>
      </Spec>
    </Section>
  );
}
