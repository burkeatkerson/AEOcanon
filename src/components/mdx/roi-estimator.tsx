"use client";

import { useState } from "react";

/**
 * AEO ROI estimator. Inputs → projected cited-traffic value, computed entirely in
 * the browser (no network, no persistence) so the host article stays statically
 * prerendered. It's a deliberately transparent, directional model — the copy says
 * so — meant to frame the size of the opportunity, not promise a number.
 */

interface Field {
  key: string;
  label: string;
  suffix?: string;
  prefix?: string;
  min: number;
  max: number;
  step: number;
  hint: string;
}

const FIELDS: Field[] = [
  { key: "queries", label: "Monthly AI-answer queries in your space", min: 0, max: 10_000_000, step: 100, hint: "Roughly how many relevant questions get asked across AI engines each month." },
  { key: "sov", label: "Target citation share of voice", suffix: "%", min: 0, max: 100, step: 1, hint: "The share of those answers where you're cited — see the share-of-voice guide." },
  { key: "ctr", label: "Click-through from a cited answer", suffix: "%", min: 0, max: 100, step: 0.5, hint: "AI answers are largely zero-click; cited sources get the clicks that remain." },
  { key: "cvr", label: "Visitor → customer conversion", suffix: "%", min: 0, max: 100, step: 0.5, hint: "Your site's conversion rate for this kind of visitor." },
  { key: "value", label: "Average value per customer", prefix: "$", min: 0, max: 10_000_000, step: 50, hint: "Average revenue or lifetime value of one converted customer." },
];

const DEFAULTS: Record<string, number> = {
  queries: 10_000,
  sov: 15,
  ctr: 5,
  cvr: 3,
  value: 500,
};

const fmtInt = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const fmtMoney = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function RoiEstimator({
  title = "AEO ROI estimator",
}: {
  title?: string;
}) {
  const [v, setV] = useState<Record<string, number>>(DEFAULTS);

  const queries = v.queries ?? 0;
  const sov = v.sov ?? 0;
  const ctr = v.ctr ?? 0;
  const cvr = v.cvr ?? 0;
  const value = v.value ?? 0;

  const appearances = queries * (sov / 100);
  const clicks = appearances * (ctr / 100);
  const customers = clicks * (cvr / 100);
  const monthly = customers * value;
  const annual = monthly * 12;

  return (
    <section className="border-line bg-panel not-prose my-9 rounded-2xl border p-6 font-sans">
      <p className="text-accent font-mono text-[10.5px] tracking-[0.1em] uppercase">
        {title}
      </p>
      <p className="text-ink-2 mt-2 text-[14.5px] leading-relaxed">
        Estimate the annual value of being cited in AI answers. Everything is
        computed in your browser — nothing is sent anywhere. Calibrate the inputs to
        your own data.
      </p>

      <div className="mt-5 flex flex-col gap-4">
        {FIELDS.map((f) => (
          <div key={f.key}>
            <label
              htmlFor={`roi-${f.key}`}
              className="text-ink flex items-center justify-between gap-4 text-[14px] font-medium"
            >
              <span>{f.label}</span>
              <span className="text-muted font-mono text-[12px]">
                {f.prefix}
                {fmtInt.format(v[f.key] ?? 0)}
                {f.suffix}
              </span>
            </label>
            <input
              id={`roi-${f.key}`}
              type="range"
              min={f.min}
              max={f.max}
              step={f.step}
              value={v[f.key] ?? 0}
              onChange={(e) =>
                setV((prev) => ({ ...prev, [f.key]: Number(e.target.value) }))
              }
              className="accent-accent mt-2 w-full"
            />
            <p className="text-muted mt-1 text-[12px] leading-snug">{f.hint}</p>
          </div>
        ))}
      </div>

      <div className="border-accent bg-accent-soft mt-6 grid gap-4 rounded-xl border p-5 sm:grid-cols-3">
        <Metric label="Cited appearances / mo" value={fmtInt.format(appearances)} />
        <Metric label="Cited-source clicks / mo" value={fmtInt.format(clicks)} />
        <Metric label="New customers / mo" value={fmtInt.format(customers)} />
      </div>
      <div className="mt-4 flex flex-wrap items-baseline gap-x-8 gap-y-2">
        <span className="flex items-baseline gap-2">
          <span className="text-accent font-serif text-[34px] leading-none">
            {fmtMoney.format(monthly)}
          </span>
          <span className="text-muted text-[13px]">projected / month</span>
        </span>
        <span className="flex items-baseline gap-2">
          <span className="text-ink font-serif text-[28px] leading-none">
            {fmtMoney.format(annual)}
          </span>
          <span className="text-muted text-[13px]">projected / year</span>
        </span>
      </div>

      <p className="border-line text-ink-2 mt-5 border-t pt-4 text-[13.5px] leading-relaxed">
        This is a directional model, not a forecast. AI answers are largely
        zero-click, so much of the real return is brand exposure — the{" "}
        <strong>cited-appearances</strong> figure — beyond the measured clicks
        below it. Treat the dollar figures as a way to size the opportunity, then
        validate against your own analytics.
      </p>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-ink text-[22px] font-medium">{value}</p>
      <p className="text-muted mt-0.5 text-[12px] leading-snug">{label}</p>
    </div>
  );
}
