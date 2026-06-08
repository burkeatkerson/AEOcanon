import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { Wordmark } from "@/components/brand/wordmark";
import { BrandMark } from "@/components/brand/brand-mark";
import { Logo } from "@/components/brand/logo";
import { Eyebrow } from "@/components/ui/eyebrow";

export const metadata: Metadata = {
  title: "Brand — Styleguide",
  robots: { index: false, follow: false },
};

const COLORS = [
  { name: "Indigo · primary", var: "--accent" },
  { name: "Coral · secondary", var: "--accent-2" },
  { name: "Green · guides", var: "--c3" },
  { name: "Amber · teardowns", var: "--c2" },
  { name: "Teal · query", var: "--c4" },
  { name: "Violet · templates", var: "--c6" },
];

const NEUTRALS = ["--bg", "--panel", "--line", "--muted", "--ink-2", "--ink"];

function Panel({
  children,
  caption,
}: {
  children: React.ReactNode;
  caption: string;
}) {
  return (
    <div className="border-line bg-panel overflow-hidden rounded-2xl border">
      <div className="grid min-h-[150px] place-items-center p-9">
        {children}
      </div>
      <div className="border-line text-muted border-t px-4 py-3 font-mono text-[10.5px]">
        {caption}
      </div>
    </div>
  );
}

export default function BrandStyleguidePage() {
  return (
    <Container className="py-14">
      <header className="border-line border-b pb-10">
        <Eyebrow>Brand system · v1.0</Eyebrow>
        <h1 className="mt-4 font-serif text-[clamp(34px,5vw,56px)] leading-none font-medium">
          AEO Canon <em className="text-accent">brand kit</em>
        </h1>
        <p className="text-ink-2 mt-5 max-w-[60ch] text-[18px]">
          The single source of truth for the identity — pulled live from the
          same tokens and components the site renders with.
        </p>
      </header>

      {/* Logo */}
      <section className="border-line border-t py-12">
        <h2 className="mb-6 font-serif text-[26px]">Logo &amp; symbol</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Panel caption="Primary lockup">
            <Logo />
          </Panel>
          <Panel caption="Wordmark">
            <Wordmark className="text-[28px]" />
          </Panel>
          <div className="bg-ink overflow-hidden rounded-2xl">
            <div className="grid min-h-[150px] place-items-center p-9">
              <Wordmark className="text-[28px]" tone="reversed" />
            </div>
            <div className="border-t border-white/10 px-4 py-3 font-mono text-[10.5px] text-white/60">
              Reversed · on ink
            </div>
          </div>
          <Panel caption="Symbol · first-result mark">
            <BrandMark size={56} />
          </Panel>
        </div>
      </section>

      {/* Color */}
      <section className="border-line border-t py-12">
        <h2 className="mb-6 font-serif text-[26px]">Color</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {COLORS.map((c) => (
            <div
              key={c.var}
              className="border-line overflow-hidden rounded-xl border"
            >
              <div
                className="h-[74px]"
                style={{ background: `var(${c.var})` }}
              />
              <div className="text-muted p-3 font-mono text-[10px]">
                <b className="text-ink block font-sans text-[11px] font-semibold">
                  {c.name}
                </b>
                {c.var}
              </div>
            </div>
          ))}
        </div>
        <div className="border-line mt-3.5 flex overflow-hidden rounded-xl border">
          {NEUTRALS.map((n) => (
            <i
              key={n}
              className="flex h-12 flex-1 items-end p-1.5 font-mono text-[8px] text-[#888]"
              style={{ background: `var(${n})` }}
            >
              {n}
            </i>
          ))}
        </div>
      </section>

      {/* Type */}
      <section className="border-line border-t py-12">
        <h2 className="mb-6 font-serif text-[26px]">Typography</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="border-line rounded-xl border p-6">
            <div className="text-muted font-mono text-[10px] tracking-[0.1em] uppercase">
              Newsreader · serif
            </div>
            <div className="mt-2 font-serif text-[40px] font-medium">Aa</div>
            <p className="text-ink-2 mt-1 font-serif text-[15px]">
              Headlines, wordmark, pull quotes.
            </p>
          </div>
          <div className="border-line rounded-xl border p-6">
            <div className="text-muted font-mono text-[10px] tracking-[0.1em] uppercase">
              Spline Sans · sans
            </div>
            <div className="mt-2 text-[40px] font-semibold">Aa</div>
            <p className="text-ink-2 mt-1 text-[15px]">
              Body copy, UI, buttons, navigation.
            </p>
          </div>
          <div className="border-line rounded-xl border p-6">
            <div className="text-muted font-mono text-[10px] tracking-[0.1em] uppercase">
              JetBrains Mono
            </div>
            <div className="mt-2 font-mono text-[38px]">Aa</div>
            <p className="text-ink-2 mt-1 font-mono text-[13px]">
              Eyebrows, metadata, code, labels.
            </p>
          </div>
        </div>
      </section>
    </Container>
  );
}
