"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { submitScorecard } from "@/lib/scorecard/actions";
import { PLAYBOOKS, playbookUrl } from "@/lib/scorecard/playbooks";
import {
  OFFSITE_COUNT,
  OFFSITE_QUESTIONS,
  QUESTION_COUNT,
  QUESTIONS,
} from "@/lib/scorecard/questions";
import { scoreSubmission } from "@/lib/scorecard/scoring";
import type {
  Branch,
  ScorecardResult,
  SiteRead,
  WriteupRequest,
} from "@/lib/scorecard/types";
import { BusinessTypeStep } from "@/components/tools/scorecard/business-type-step";
import { ChoiceStep } from "@/components/tools/scorecard/choice-step";
import { ProgressBar } from "@/components/tools/scorecard/progress-bar";
import { ScoreGate } from "@/components/tools/scorecard/score-gate";
import { WebsiteStep } from "@/components/tools/scorecard/website-step";
import {
  FullResult,
  type SaveStatus,
} from "@/components/tools/scorecard/full-result";
import type { LeadFields } from "@/components/tools/scorecard/email-step";

type Phase = "business-type" | "website" | "questions" | "score-gate" | "result";

/**
 * The 8-Pillar AEO Scorecard. Mobile-first, one screen at a time:
 *   business type → website (branches) → branch questions → free score →
 *   email gate → full AI result.
 * The eight scored questions and the scoring are unchanged — they always drive
 * the score. A real URL is read quietly in the background while the visitor
 * answers (enrichment only, never the score). "No site yet" or a social profile
 * takes the shorter off-site branch, framed as a starting point.
 */
export function Scorecard() {
  const [phase, setPhase] = useState<Phase>("business-type");
  const [branch, setBranch] = useState<Branch>("has_website");
  const [businessType, setBusinessType] = useState("");
  const [website, setWebsite] = useState("");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | undefined)[]>(() =>
    Array(QUESTION_COUNT).fill(undefined),
  );
  const [offsite, setOffsite] = useState<(number | undefined)[]>(() =>
    Array(OFFSITE_COUNT).fill(undefined),
  );
  const [siteRead, setSiteRead] = useState<SiteRead | null>(null);
  const [result, setResult] = useState<ScorecardResult | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const reduceMotion = useReducedMotion();
  const readStarted = useRef<string | null>(null);

  const questionCount = branch === "no_website" ? OFFSITE_COUNT : QUESTION_COUNT;
  const totalSteps = 2 + questionCount; // business type + website + questions

  /** Quietly read the site in the background; result enriches the write-up. */
  const startSiteRead = useCallback((url: string) => {
    if (readStarted.current === url) return;
    readStarted.current = url;
    setSiteRead(null);
    fetch("/api/scorecard/site-read", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ url }),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: SiteRead | null) => setSiteRead(data?.ok ? data : null))
      .catch(() => setSiteRead(null));
  }, []);

  const handleBusinessType = useCallback((value: string) => {
    setBusinessType(value);
    setPhase("website");
  }, []);

  const handleWebsite = useCallback(
    ({
      raw,
      readUrl,
      noSite,
    }: {
      raw: string;
      readUrl: string | null;
      noSite: boolean;
    }) => {
      setWebsite(raw);
      setBranch(noSite ? "no_website" : "has_website");
      if (!noSite && readUrl) startSiteRead(readUrl);
      setIndex(0);
      setPhase("questions");
    },
    [startSiteRead],
  );

  const selectOption = useCallback(
    (optionIndex: number) => {
      if (branch === "no_website") {
        setOffsite((prev) => {
          const next = [...prev];
          next[index] = optionIndex;
          return next;
        });
      } else {
        setAnswers((prev) => {
          const next = [...prev];
          next[index] = optionIndex;
          return next;
        });
      }
      // Advance one screen at a time; the free score follows the last question.
      window.setTimeout(() => {
        if (index < questionCount - 1) {
          setIndex((i) => i + 1);
        } else {
          if (branch === "has_website") {
            const complete = answers.map((a, i) =>
              i === index ? optionIndex : (a ?? 0),
            );
            setResult(scoreSubmission(complete));
          }
          setPhase("score-gate");
        }
      }, 160);
    },
    [branch, index, questionCount, answers],
  );

  const goBack = useCallback(() => {
    if (phase === "website") {
      setPhase("business-type");
      return;
    }
    if (phase === "questions") {
      if (index > 0) setIndex((i) => i - 1);
      else setPhase("website");
      return;
    }
    if (phase === "score-gate") {
      setPhase("questions");
      setIndex(questionCount - 1);
    }
  }, [phase, index, questionCount]);

  const handleEmailSubmit = useCallback(
    (fields: LeadFields) => {
      const completedAnswers = answers.map((a) => a ?? 0);
      const completedOffsite = offsite.map((a) => a ?? 0);

      // Reveal the full (gated) result immediately; persistence runs after.
      setPhase("result");
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });

      setSaveStatus("saving");
      const base = {
        email: fields.email,
        businessType,
        businessName: fields.businessName,
        location: fields.location,
        website,
        company: fields.company,
      };
      const submission =
        branch === "no_website"
          ? ({ ...base, branch, offsite: completedOffsite } as const)
          : ({
              ...base,
              branch,
              answers: completedAnswers,
              siteRead: siteRead ?? undefined,
            } as const);

      submitScorecard(submission)
        .then((res) => setSaveStatus(res.ok ? "saved" : "error"))
        .catch(() => setSaveStatus("error"));
    },
    [answers, offsite, branch, businessType, website, siteRead, reduceMotion],
  );

  const writeupPayload: WriteupRequest = useMemo(
    () =>
      branch === "no_website"
        ? { branch, offsite: offsite.map((a) => a ?? 0), businessType }
        : {
            branch,
            answers: answers.map((a) => a ?? 0),
            businessType,
            siteRead: siteRead ?? undefined,
          },
    [branch, offsite, answers, businessType, siteRead],
  );

  const segment = branch === "no_website" ? "foundations" : result?.segment;

  const showProgress =
    phase === "business-type" || phase === "website" || phase === "questions";
  const currentStep =
    phase === "business-type" ? 1 : phase === "website" ? 2 : index + 3;

  const stepKey =
    phase === "questions" ? `q-${branch}-${index}` : phase;

  const variants = reduceMotion
    ? undefined
    : {
        enter: { opacity: 0, x: 24 },
        center: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -24 },
      };

  return (
    <div className="border-line bg-bg-2/40 mx-auto w-full max-w-[680px] rounded-3xl border p-5 sm:p-9">
      {showProgress ? (
        <ProgressBar current={currentStep} total={totalSteps} />
      ) : null}

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={stepKey}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
        >
          {phase === "business-type" ? (
            <BusinessTypeStep value={businessType} onSubmit={handleBusinessType} />
          ) : null}

          {phase === "website" ? (
            <WebsiteStep value={website} onSubmit={handleWebsite} onBack={goBack} />
          ) : null}

          {phase === "questions" && branch === "has_website" ? (
            <ChoiceStep
              eyebrow={`${QUESTIONS[index]!.title} · ${QUESTIONS[index]!.layer}`}
              color={QUESTIONS[index]!.color}
              prompt={QUESTIONS[index]!.prompt}
              options={QUESTIONS[index]!.options.map((o) => o.label)}
              selected={answers[index]}
              onSelect={selectOption}
              onBack={goBack}
              canGoBack
            />
          ) : null}

          {phase === "questions" && branch === "no_website" ? (
            <ChoiceStep
              eyebrow={OFFSITE_QUESTIONS[index]!.title}
              color={OFFSITE_QUESTIONS[index]!.color}
              prompt={OFFSITE_QUESTIONS[index]!.prompt}
              options={OFFSITE_QUESTIONS[index]!.options}
              selected={offsite[index]}
              onSelect={selectOption}
              onBack={goBack}
              canGoBack
            />
          ) : null}

          {phase === "score-gate" ? (
            <ScoreGate
              branch={branch}
              result={result}
              onSubmit={handleEmailSubmit}
              onBack={goBack}
            />
          ) : null}

          {phase === "result" && segment ? (
            <FullResult
              branch={branch}
              result={result}
              writeupPayload={writeupPayload}
              playbook={PLAYBOOKS[segment]}
              playbookHref={playbookUrl(segment)}
              saveStatus={saveStatus}
            />
          ) : null}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
