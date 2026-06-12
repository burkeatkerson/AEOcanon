import Link from "next/link";
import { ArrowRight, Download, Hammer } from "lucide-react";
import {
  BareScore,
  BareStartingPoint,
} from "@/components/tools/scorecard/bare-score";
import { PillarBreakdown } from "@/components/tools/scorecard/pillar-breakdown";
import { Writeup } from "@/components/tools/scorecard/writeup";
import { NO_WEBSITE } from "@/lib/scorecard/copy";
import type { Playbook } from "@/lib/scorecard/playbooks";
import type {
  Branch,
  ScorecardResult,
  WriteupRequest,
} from "@/lib/scorecard/types";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

/**
 * The full, gated result revealed after the email step. Branch-aware:
 * - has_website → grade + pillar breakdown + AI read + the matched playbook
 *   (primary) + a secondary nudge to the free site audit.
 * - no_website → starting-point read + AI read + the build/done-for-you offer
 *   (primary) + the Foundations playbook (secondary).
 * Renders from client-computed data; only the AI read depends on the network.
 */
export function FullResult({
  branch,
  result,
  writeupPayload,
  playbook,
  playbookHref,
  saveStatus,
}: {
  branch: Branch;
  result: ScorecardResult | null;
  writeupPayload: WriteupRequest;
  playbook: Playbook;
  playbookHref: string;
  saveStatus: SaveStatus;
}) {
  const emailedNote =
    saveStatus === "saved" || saveStatus === "saving"
      ? "We've also emailed you a copy."
      : saveStatus === "error"
        ? "Your results are ready here — the emailed copy may be delayed."
        : "";

  const fallback =
    branch === "no_website"
      ? "You've already built real off-site presence — reviews, referrals, and word of mouth. The missing piece is a simple site AI can read, so all of that finally points somewhere engines can quote. That's the first move, and it's very doable."
      : "Your two biggest gaps are the lowest bars below. Start with the one at the top of the breakdown — it's the highest-leverage fix — then work down. The matched playbook walks you through the first moves step by step.";

  return (
    <div className="flex flex-col gap-6">
      {branch === "has_website" && result ? (
        <BareScore result={result} />
      ) : (
        <BareStartingPoint />
      )}

      <Writeup payload={writeupPayload} fallback={fallback} />

      {branch === "has_website" && result ? (
        <PillarBreakdown
          scores={result.pillarScores}
          weakest={result.weakestPillar}
        />
      ) : null}

      {/* Primary action differs by branch. */}
      {branch === "no_website" ? (
        <BuildOffer />
      ) : (
        <PlaybookCard
          playbook={playbook}
          playbookHref={playbookHref}
          emailedNote={emailedNote}
          primary
        />
      )}

      {/* Secondary action. */}
      {branch === "no_website" ? (
        <PlaybookCard
          playbook={playbook}
          playbookHref={playbookHref}
          emailedNote={emailedNote}
        />
      ) : (
        <AuditNudge />
      )}
    </div>
  );
}

function PlaybookCard({
  playbook,
  playbookHref,
  emailedNote,
  primary = false,
}: {
  playbook: Playbook;
  playbookHref: string;
  emailedNote: string;
  primary?: boolean;
}) {
  return (
    <div
      className={
        primary
          ? "border-accent bg-panel overflow-hidden rounded-2xl border shadow-[0_24px_60px_-44px_color-mix(in_oklab,var(--accent)_70%,transparent)]"
          : "border-line bg-panel overflow-hidden rounded-2xl border"
      }
    >
      <div className="p-6 sm:p-7">
        <span className="text-accent inline-flex items-center gap-2 font-mono text-[10.5px] tracking-[0.12em] uppercase">
          <span
            className="size-[7px] rounded-full"
            style={{ background: "var(--ok)" }}
          />
          {primary ? "Your matched playbook · ready now" : "Free playbook · ready now"}
        </span>
        <h3 className="mt-3 text-[21px] leading-tight font-medium">
          {playbook.title}
        </h3>
        <p className="text-ink-2 mt-2 max-w-[52ch] text-[15px] leading-relaxed">
          {playbook.blurb}
        </p>
        <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:items-center">
          <a
            href={playbookHref}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="bg-accent inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 text-[15px] font-medium text-white transition-opacity hover:opacity-90"
          >
            <Download className="size-4" aria-hidden /> Download your playbook
          </a>
          {emailedNote ? (
            <span className="text-muted text-[13px]" aria-live="polite">
              {emailedNote}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function BuildOffer() {
  return (
    <div className="border-accent bg-panel overflow-hidden rounded-2xl border shadow-[0_24px_60px_-44px_color-mix(in_oklab,var(--accent)_70%,transparent)]">
      <div className="p-6 sm:p-7">
        <span className="text-accent inline-flex items-center gap-2 font-mono text-[10.5px] tracking-[0.12em] uppercase">
          <Hammer className="size-3.5" aria-hidden /> Your first move
        </span>
        <h3 className="mt-3 text-[21px] leading-tight font-medium">
          {NO_WEBSITE.ctaTitle}
        </h3>
        <p className="text-ink-2 mt-2 max-w-[52ch] text-[15px] leading-relaxed">
          {NO_WEBSITE.ctaBody}
        </p>
        <Link
          href="/pricing"
          className="bg-accent mt-5 inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 text-[15px] font-medium text-white transition-opacity hover:opacity-90"
        >
          {NO_WEBSITE.ctaButton} <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
    </div>
  );
}

function AuditNudge() {
  return (
    <div className="border-line-2 bg-accent-soft flex flex-wrap items-center justify-between gap-4 rounded-2xl border px-6 py-5">
      <div>
        <h3 className="text-[17px] font-medium">
          Want the same read on your actual pages?
        </h3>
        <p className="text-ink-2 max-w-[52ch] text-[14px] leading-relaxed">
          Run our free AI Visibility Analyzer to see exactly what each engine
          does with your live site.
        </p>
      </div>
      <Link
        href="/audit"
        className="border-accent text-accent hover:bg-accent inline-flex shrink-0 items-center gap-2 rounded-md border px-5 py-2.5 text-[14px] font-medium transition-colors hover:text-white"
      >
        Try the free audit <ArrowRight className="size-4" aria-hidden />
      </Link>
    </div>
  );
}
