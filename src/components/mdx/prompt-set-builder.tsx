"use client";

import { useState } from "react";

/**
 * AEO prompt-set builder. Add the real questions you want to track, tag each by
 * intent tier / topic / engine, and export the set as CSV (pre-structured with
 * the logging columns) or JSON. Pure client-side — no network, no persistence —
 * so the host page stays statically rendered.
 */

const INTENTS = ["Decision", "Consideration", "Awareness"] as const;
const ENGINES = [
  "ChatGPT",
  "Perplexity",
  "Google AI Overviews",
  "Google AI Mode",
  "Gemini",
  "Copilot",
  "Claude",
] as const;

interface Row {
  id: number;
  prompt: string;
  intent: (typeof INTENTS)[number];
  topic: string;
  engine: (typeof ENGINES)[number];
}

const SEED: Row[] = [
  { id: 1, prompt: "Best [category] for [use case]?", intent: "Decision", topic: "", engine: "ChatGPT" },
  { id: 2, prompt: "[Your brand] vs [competitor] — which is better?", intent: "Decision", topic: "", engine: "Perplexity" },
  { id: 3, prompt: "How do I choose a [category] tool?", intent: "Consideration", topic: "", engine: "ChatGPT" },
];

const CSV_COLUMNS = [
  "Prompt",
  "Intent tier",
  "Topic / product",
  "Engine",
  "Date checked",
  "Brand mentioned (Y/N)",
  "Site cited (Y/N)",
  "Competitors cited",
  "Notes",
];

function csvCell(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

function download(filename: string, text: string, mime: string) {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function PromptSetBuilder() {
  const [rows, setRows] = useState<Row[]>(SEED);
  const [nextId, setNextId] = useState(SEED.length + 1);
  const [copied, setCopied] = useState(false);

  const update = (id: number, patch: Partial<Row>) =>
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const remove = (id: number) => setRows((rs) => rs.filter((r) => r.id !== id));
  const add = () => {
    setRows((rs) => [
      ...rs,
      { id: nextId, prompt: "", intent: "Decision", topic: "", engine: "ChatGPT" },
    ]);
    setNextId((n) => n + 1);
  };

  const toCsv = () =>
    [
      CSV_COLUMNS.join(","),
      ...rows.map((r) =>
        [r.prompt, r.intent, r.topic, r.engine, "", "", "", "", ""]
          .map(csvCell)
          .join(","),
      ),
    ].join("\n");

  const toJson = () =>
    JSON.stringify(
      rows.map((r) => ({
        prompt: r.prompt,
        intentTier: r.intent,
        topic: r.topic,
        engine: r.engine,
      })),
      null,
      2,
    );

  const copyCsv = async () => {
    await navigator.clipboard.writeText(toCsv());
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  const filled = rows.filter((r) => r.prompt.trim().length > 0).length;

  return (
    <section className="border-line bg-panel not-prose my-9 rounded-2xl border p-6 font-sans">
      <div className="flex items-center justify-between gap-4">
        <p className="text-accent font-mono text-[10.5px] tracking-[0.1em] uppercase">
          Prompt-set builder
        </p>
        <p className="text-muted font-mono text-[12px]">{filled} prompts</p>
      </div>
      <p className="text-ink-2 mt-2 text-[14.5px] leading-relaxed">
        Add the real questions your customers ask AI, tag each one, then export
        the set as CSV (pre-structured with logging columns) or JSON. Everything
        stays in your browser.
      </p>

      <div className="mt-5 flex flex-col gap-3">
        {rows.map((r, i) => (
          <div
            key={r.id}
            className="border-line-2 bg-paper rounded-xl border p-3"
          >
            <div className="flex items-start gap-2">
              <span className="text-muted mt-2.5 w-5 shrink-0 font-mono text-[11px]">
                {i + 1}
              </span>
              <input
                value={r.prompt}
                onChange={(e) => update(r.id, { prompt: e.target.value })}
                placeholder="A real question a customer would ask an AI…"
                className="border-line-2 bg-panel text-ink focus:border-accent w-full rounded-lg border px-3 py-2 text-[14px] outline-none"
              />
              <button
                type="button"
                onClick={() => remove(r.id)}
                aria-label="Remove prompt"
                className="text-muted hover:text-bad mt-1.5 shrink-0 px-1 text-[18px] leading-none"
              >
                ×
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2 pl-7">
              <select
                value={r.intent}
                onChange={(e) =>
                  update(r.id, { intent: e.target.value as Row["intent"] })
                }
                className="border-line-2 bg-panel text-ink-2 focus:border-accent rounded-lg border px-2 py-1.5 text-[13px] outline-none"
              >
                {INTENTS.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
              <input
                value={r.topic}
                onChange={(e) => update(r.id, { topic: e.target.value })}
                placeholder="Topic / product"
                className="border-line-2 bg-panel text-ink-2 focus:border-accent w-36 rounded-lg border px-2 py-1.5 text-[13px] outline-none"
              />
              <select
                value={r.engine}
                onChange={(e) =>
                  update(r.id, { engine: e.target.value as Row["engine"] })
                }
                className="border-line-2 bg-panel text-ink-2 focus:border-accent rounded-lg border px-2 py-1.5 text-[13px] outline-none"
              >
                {ENGINES.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={add}
        className="border-line-2 text-ink-2 hover:border-accent hover:text-accent mt-3 w-full rounded-xl border border-dashed px-4 py-2.5 text-[14px] font-medium transition-colors"
      >
        + Add prompt
      </button>

      <div className="border-line mt-5 flex flex-wrap gap-3 border-t pt-4">
        <button
          type="button"
          onClick={() => download("aeo-prompt-set.csv", toCsv(), "text/csv")}
          className="border-accent bg-accent-soft text-accent-2 hover:bg-accent hover:text-white inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-[13.5px] font-medium transition-colors"
        >
          <span aria-hidden>↓</span> Export CSV
        </button>
        <button
          type="button"
          onClick={() =>
            download("aeo-prompt-set.json", toJson(), "application/json")
          }
          className="border-accent bg-accent-soft text-accent-2 hover:bg-accent hover:text-white inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-[13.5px] font-medium transition-colors"
        >
          <span aria-hidden>↓</span> Export JSON
        </button>
        <button
          type="button"
          onClick={copyCsv}
          className="border-line-2 text-ink-2 hover:border-accent hover:text-accent inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-[13.5px] font-medium transition-colors"
        >
          {copied ? "Copied ✓" : "Copy CSV"}
        </button>
      </div>
    </section>
  );
}
