"use client";

import { useState } from "react";

/**
 * AEO content-brief builder. Fill the fields that make a page citable — the
 * target question, the answer-first summary, question-shaped H2s, required
 * evidence, and internal links — and export a ready-to-hand-off Markdown brief.
 * Pure client-side — no network, no persistence.
 */

interface Brief {
  question: string;
  entity: string;
  audience: string;
  summary: string;
  headings: string;
  evidence: string;
  links: string;
  author: string;
  words: string;
}

const SEED: Brief = {
  question: "",
  entity: "",
  audience: "",
  summary: "",
  headings: "",
  evidence: "",
  links: "",
  author: "",
  words: "",
};

const lines = (s: string) =>
  s
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

function toMarkdown(b: Brief): string {
  const out: string[] = [];
  out.push(`# Content brief: ${b.question || "[target question]"}`);
  out.push("");
  if (b.entity) out.push(`**Primary entity / keyword:** ${b.entity}`);
  if (b.audience) out.push(`**Audience:** ${b.audience}`);
  if (b.words) out.push(`**Word-count target:** ${b.words}`);
  if (b.author) out.push(`**Author / credibility:** ${b.author}`);
  out.push("");
  out.push("## Answer-first summary (lead the page with this)");
  out.push(b.summary || "_40–60 words that directly answer the target question._");
  out.push("");
  out.push("## Section headings (question-shaped H2s)");
  const hs = lines(b.headings);
  out.push(hs.length ? hs.map((h) => `- ${h}`).join("\n") : "- _One real question per heading._");
  out.push("");
  out.push("## Required evidence & sources");
  const ev = lines(b.evidence);
  out.push(ev.length ? ev.map((e) => `- ${e}`).join("\n") : "- _Each claim needs a stat, quote, or named source._");
  out.push("");
  out.push("## Internal links to include");
  const ls = lines(b.links);
  out.push(ls.length ? ls.map((l) => `- ${l}`).join("\n") : "- _Link to the relevant pillar and related pages._");
  out.push("");
  return out.join("\n");
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

const FIELD =
  "border-line-2 bg-paper text-ink focus:border-accent mt-2 w-full rounded-xl border px-4 py-2.5 text-[14px] outline-none";
const LABEL =
  "text-muted mt-4 block font-mono text-[10.5px] tracking-[0.1em] uppercase";

export function ContentBriefBuilder() {
  const [b, setB] = useState<Brief>(SEED);
  const [copied, setCopied] = useState(false);
  const set = (patch: Partial<Brief>) => setB((prev) => ({ ...prev, ...patch }));

  const md = toMarkdown(b);
  const copy = async () => {
    await navigator.clipboard.writeText(md);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <section className="border-line bg-panel not-prose my-9 rounded-2xl border p-6 font-sans">
      <p className="text-accent font-mono text-[10.5px] tracking-[0.1em] uppercase">
        AEO content-brief builder
      </p>
      <p className="text-ink-2 mt-2 text-[14.5px] leading-relaxed">
        Fill in the fields that make a page citable, then export a Markdown brief
        you can hand to a writer. Everything stays in your browser.
      </p>

      <label className={LABEL}>Target question (the H1)</label>
      <input
        value={b.question}
        onChange={(e) => set({ question: e.target.value })}
        placeholder="The exact question this page answers"
        className={FIELD}
      />

      <div className="grid gap-x-4 sm:grid-cols-2">
        <div>
          <label className={LABEL}>Primary entity / keyword</label>
          <input
            value={b.entity}
            onChange={(e) => set({ entity: e.target.value })}
            placeholder="The thing the page is about"
            className={FIELD}
          />
        </div>
        <div>
          <label className={LABEL}>Audience</label>
          <input
            value={b.audience}
            onChange={(e) => set({ audience: e.target.value })}
            placeholder="Who is asking"
            className={FIELD}
          />
        </div>
        <div>
          <label className={LABEL}>Word-count target</label>
          <input
            value={b.words}
            onChange={(e) => set({ words: e.target.value })}
            placeholder="e.g. 1,200–1,500"
            className={FIELD}
          />
        </div>
        <div>
          <label className={LABEL}>Author / credibility</label>
          <input
            value={b.author}
            onChange={(e) => set({ author: e.target.value })}
            placeholder="Named author + why they're credible"
            className={FIELD}
          />
        </div>
      </div>

      <label className={LABEL}>Answer-first summary (40–60 words)</label>
      <textarea
        value={b.summary}
        onChange={(e) => set({ summary: e.target.value })}
        rows={3}
        placeholder="The direct answer the page leads with — quotable on its own."
        className={`${FIELD} resize-y leading-relaxed`}
      />

      <label className={LABEL}>Section headings — one question per line</label>
      <textarea
        value={b.headings}
        onChange={(e) => set({ headings: e.target.value })}
        rows={3}
        placeholder={"How does X work?\nHow much does X cost?\nIs X worth it?"}
        className={`${FIELD} resize-y leading-relaxed`}
      />

      <label className={LABEL}>Required evidence & sources — one per line</label>
      <textarea
        value={b.evidence}
        onChange={(e) => set({ evidence: e.target.value })}
        rows={3}
        placeholder={"Stat: ___ (source)\nQuote from ___\nFirst-hand data: ___"}
        className={`${FIELD} resize-y leading-relaxed`}
      />

      <label className={LABEL}>Internal links to include — one per line</label>
      <textarea
        value={b.links}
        onChange={(e) => set({ links: e.target.value })}
        rows={2}
        placeholder={"/pillars/extractability\n/learn/related-page"}
        className={`${FIELD} resize-y leading-relaxed`}
      />

      <p className="text-muted mt-6 font-mono text-[10.5px] tracking-[0.1em] uppercase">
        Brief preview
      </p>
      <pre className="border-line-2 bg-paper text-ink mt-2 overflow-x-auto rounded-xl border p-4 font-mono text-[12.5px] leading-relaxed whitespace-pre-wrap">
        {md}
      </pre>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() =>
            download("aeo-content-brief.md", md, "text/markdown")
          }
          className="border-accent bg-accent-soft text-accent-2 hover:bg-accent hover:text-white inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-[13.5px] font-medium transition-colors"
        >
          <span aria-hidden>↓</span> Download Markdown
        </button>
        <button
          type="button"
          onClick={copy}
          className="border-line-2 text-ink-2 hover:border-accent hover:text-accent inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-[13.5px] font-medium transition-colors"
        >
          {copied ? "Copied ✓" : "Copy Markdown"}
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="border-line-2 text-ink-2 hover:border-accent hover:text-accent inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-[13.5px] font-medium transition-colors"
        >
          <span aria-hidden>⎙</span> Print
        </button>
      </div>
    </section>
  );
}
