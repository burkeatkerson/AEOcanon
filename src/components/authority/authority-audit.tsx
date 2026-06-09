"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Off-Site Authority Audit — an interactive self-check over the off-site signals
 * answer engines use to decide whom to trust. Each item links to the playbook
 * that fixes it. Ephemeral state only (no persistence), so the page stays static.
 */
const SIGNALS: { label: string; hint: string; href: string }[] = [
  {
    label: "We genuinely participate in the subreddits where our topic is discussed.",
    hint: "Reddit is the most-cited domain in AI answers.",
    href: "/authority/reddit-aeo-playbook",
  },
  {
    label: "We publish or are mentioned in relevant YouTube videos.",
    hint: "YouTube mentions are the single strongest correlate of AI visibility.",
    href: "/authority/youtube-aeo-playbook",
  },
  {
    label: "We have an accurate, well-sourced Wikipedia presence (where notable).",
    hint: "Wikipedia is a top citation source and a key entity signal.",
    href: "/authority/wikipedia-strategy",
  },
  {
    label: "We earn mentions in reputable publications and press.",
    hint: "Editorial mentions tell engines the wider web vouches for you.",
    href: "/authority/get-mentioned-in-publications",
  },
  {
    label: "We run digital PR — original data or stories worth covering.",
    hint: "Newsworthy assets earn the mentions that drive authority.",
    href: "/authority/digital-pr-for-ai",
  },
  {
    label: "We have strong, authentic profiles on relevant review platforms.",
    hint: "Reviews are a trust and corroboration signal engines read.",
    href: "/authority/review-platform-playbook",
  },
  {
    label: "Our experts appear on podcasts in our field.",
    hint: "Podcasts build entity recognition and quotable mentions.",
    href: "/authority/podcast-aeo-strategy",
  },
  {
    label: "We have a credible, active LinkedIn presence.",
    hint: "LinkedIn is a top-cited professional source and entity signal.",
    href: "/authority/linkedin-for-aeo",
  },
  {
    label: "We participate genuinely in relevant forums and communities.",
    hint: "Niche communities are increasingly surfaced in AI answers.",
    href: "/authority/forum-community-strategy",
  },
  {
    label: "We answer real questions on Quora and similar Q&A sites.",
    hint: "Q&A content maps directly to how people query AI.",
    href: "/authority/quora-aeo",
  },
  {
    label: "Our brand is mentioned consistently across the web — linked or not.",
    hint: "Brand mentions correlate with AI visibility far more than backlinks.",
    href: "/authority/build-branded-mentions",
  },
];

const VERDICTS: { min: number; label: string; note: string }[] = [
  {
    min: 9,
    label: "Strong off-site authority",
    note: "The web vouches for you across the surfaces engines read. Keep it current and widen your lead.",
  },
  {
    min: 5,
    label: "Building authority",
    note: "A real footprint with clear gaps. Each unchecked box below is a surface where competitors are getting vouched for and you aren't.",
  },
  {
    min: 1,
    label: "Thin off-site presence",
    note: "Engines see little corroboration of you beyond your own site. Start with the highest-leverage gaps — Reddit, YouTube, and brand mentions.",
  },
  {
    min: 0,
    label: "Invisible off your own site",
    note: "Right now the wider web says almost nothing about you, so engines have little reason to trust you. Every fix below is achievable.",
  },
];

export function AuthorityAudit() {
  const [answers, setAnswers] = useState<(boolean | null)[]>(() =>
    SIGNALS.map(() => null),
  );
  const answered = answers.filter((a) => a !== null).length;
  const score = answers.filter((a) => a === true).length;
  const complete = answered === SIGNALS.length;
  const verdict = VERDICTS.find((v) => score >= v.min);

  return (
    <section className="border-line bg-panel not-prose my-9 rounded-2xl border p-6 font-sans">
      <div className="flex items-center justify-between gap-4">
        <p className="text-accent font-mono text-[10.5px] tracking-[0.1em] uppercase">
          Off-Site Authority Audit
        </p>
        <p className="text-muted font-mono text-[12px]">
          {answered} / {SIGNALS.length}
        </p>
      </div>
      <p className="text-ink-2 mt-2 text-[14.5px] leading-relaxed">
        Mark each off-site signal you genuinely have today. Your score estimates
        how much the wider web vouches for you — and each gap links to the
        playbook that closes it.
      </p>

      <ol className="mt-5 flex flex-col gap-4">
        {SIGNALS.map((s, i) => (
          <li key={s.href} className="border-line border-t pt-4 first:border-t-0">
            <p className="text-ink text-[15px] leading-snug font-medium">
              {i + 1}. {s.label}
            </p>
            <p className="text-muted mt-1 text-[13px] leading-relaxed">
              {s.hint}{" "}
              <Link href={s.href} className="text-accent">
                Playbook →
              </Link>
            </p>
            <div className="mt-3 flex gap-2">
              {[
                { label: "Yes", value: true },
                { label: "No", value: false },
              ].map((opt) => {
                const active = answers[i] === opt.value;
                return (
                  <button
                    key={opt.label}
                    type="button"
                    aria-pressed={active}
                    onClick={() =>
                      setAnswers((prev) =>
                        prev.map((v, j) => (j === i ? opt.value : v)),
                      )
                    }
                    className={cn(
                      "min-w-[72px] rounded-full border px-4 py-1.5 text-[13.5px] transition-colors",
                      active && opt.value
                        ? "border-ok bg-[color-mix(in_oklab,var(--ok)_14%,var(--panel))] text-ink"
                        : active && !opt.value
                          ? "border-bad bg-[color-mix(in_oklab,var(--bad)_14%,var(--panel))] text-ink"
                          : "border-line-2 text-ink-2 hover:border-accent",
                    )}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </li>
        ))}
      </ol>

      {complete && verdict ? (
        <div className="border-accent bg-accent-soft mt-6 rounded-xl border p-5">
          <div className="flex items-baseline gap-3">
            <span className="text-accent font-serif text-[34px] leading-none">
              {score}/{SIGNALS.length}
            </span>
            <span className="text-ink text-[16px] font-medium">
              {verdict.label}
            </span>
          </div>
          <p className="text-ink-2 mt-2 text-[14px] leading-relaxed">
            {verdict.note}
          </p>
        </div>
      ) : (
        <p className="text-muted mt-5 text-[13px]">
          Answer all {SIGNALS.length} to get your authority verdict.
        </p>
      )}
    </section>
  );
}
