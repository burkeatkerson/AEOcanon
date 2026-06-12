import { Lock } from "lucide-react";
import {
  BareScore,
  BareStartingPoint,
} from "@/components/tools/scorecard/bare-score";
import { EmailStep, type LeadFields } from "@/components/tools/scorecard/email-step";
import type { Branch, ScorecardResult } from "@/lib/scorecard/types";

/**
 * Score-before-the-gate. Shows the free score (or no-website starting point)
 * up top, then gates the full breakdown behind the email step right below it —
 * value first, ask second.
 */
export function ScoreGate({
  branch,
  result,
  onSubmit,
  onBack,
}: {
  branch: Branch;
  result: ScorecardResult | null;
  onSubmit: (fields: LeadFields) => void;
  onBack: () => void;
}) {
  return (
    <div>
      {branch === "has_website" && result ? (
        <BareScore result={result} />
      ) : (
        <BareStartingPoint />
      )}

      <div className="border-line my-7 flex items-center gap-3 border-t pt-7">
        <span className="bg-accent-soft text-accent grid size-8 shrink-0 place-items-center rounded-full">
          <Lock className="size-4" aria-hidden />
        </span>
        <p className="text-ink-2 text-[13.5px] leading-snug">
          That&rsquo;s the headline. Your full breakdown, personalized read, and
          matched playbook are one step away.
        </p>
      </div>

      <EmailStep onSubmit={onSubmit} />

      <button
        type="button"
        onClick={onBack}
        className="text-muted hover:text-accent mx-auto mt-4 block cursor-pointer font-mono text-[12px]"
      >
        ← Back to change an answer
      </button>
    </div>
  );
}
