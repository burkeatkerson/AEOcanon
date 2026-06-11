"use client";

import { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { submitScorecard } from "@/lib/scorecard/actions";
import { PLAYBOOKS, playbookUrl } from "@/lib/scorecard/playbooks";
import { QUESTION_COUNT, QUESTIONS } from "@/lib/scorecard/questions";
import { scoreSubmission } from "@/lib/scorecard/scoring";
import type { ScorecardResult } from "@/lib/scorecard/types";
import { IntroStep } from "@/components/tools/scorecard/intro-step";
import { ProgressBar } from "@/components/tools/scorecard/progress-bar";
import { QuestionStep } from "@/components/tools/scorecard/question-step";
import { EmailStep, type LeadFields } from "@/components/tools/scorecard/email-step";
import { Results, type SaveStatus } from "@/components/tools/scorecard/results";

type Phase = "intro" | "question" | "email" | "results";

/**
 * The 8-Pillar AEO Scorecard — a guided, one-question-at-a-time quiz that scores
 * the visitor, gates results behind an email, and serves the matched pre-made
 * playbook instantly. Scoring is fully client-side and deterministic, so the
 * results + download appear the moment the email is submitted; persistence and
 * the personalized write-up happen in the background and never gate the result.
 */
export function Scorecard() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | undefined)[]>(
    () => Array(QUESTION_COUNT).fill(undefined),
  );
  const [result, setResult] = useState<ScorecardResult | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const reduceMotion = useReducedMotion();

  const selectOption = useCallback(
    (optionIndex: number) => {
      setAnswers((prev) => {
        const next = [...prev];
        next[index] = optionIndex;
        return next;
      });
      // Advance one screen at a time; the email gate follows the last question.
      window.setTimeout(() => {
        if (index < QUESTION_COUNT - 1) {
          setIndex((i) => i + 1);
        } else {
          setPhase("email");
        }
      }, 180);
    },
    [index],
  );

  const goBack = useCallback(() => {
    if (phase === "email") {
      setPhase("question");
      setIndex(QUESTION_COUNT - 1);
      return;
    }
    if (index > 0) setIndex((i) => i - 1);
    else setPhase("intro");
  }, [phase, index]);

  const handleEmailSubmit = useCallback(
    (fields: LeadFields) => {
      const complete = answers.map((a) => a ?? 0);
      const computed = scoreSubmission(complete);

      // 1) Show results immediately — zero dependence on any network call.
      setResult(computed);
      setPhase("results");
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });

      // 2) Persist + fire the lead webhook in the background (best-effort).
      setSaveStatus("saving");
      submitScorecard({
        email: fields.email,
        businessName: fields.businessName,
        website: fields.website,
        answers: complete,
        company: fields.company,
      })
        .then((res) => setSaveStatus(res.ok ? "saved" : "error"))
        .catch(() => setSaveStatus("error"));
    },
    [answers, reduceMotion],
  );

  const stepKey = phase === "question" ? `q-${index}` : phase;

  const variants = reduceMotion
    ? undefined
    : {
        enter: { opacity: 0, x: 24 },
        center: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -24 },
      };

  const completedAnswers = useMemo(() => answers.map((a) => a ?? 0), [answers]);

  return (
    <div className="border-line bg-bg-2/40 mx-auto w-full max-w-[680px] rounded-3xl border p-6 sm:p-9">
      {phase === "question" ? (
        <ProgressBar current={index + 1} total={QUESTION_COUNT} />
      ) : null}

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={stepKey}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          {phase === "intro" ? (
            <IntroStep onStart={() => setPhase("question")} />
          ) : null}

          {phase === "question" ? (
            <QuestionStep
              question={QUESTIONS[index]!}
              selected={answers[index]}
              onSelect={selectOption}
              onBack={goBack}
              canGoBack={index > 0}
            />
          ) : null}

          {phase === "email" ? (
            <EmailStep onSubmit={handleEmailSubmit} back={goBack} />
          ) : null}

          {phase === "results" && result ? (
            <Results
              result={result}
              answers={completedAnswers}
              playbook={PLAYBOOKS[result.segment]}
              playbookHref={playbookUrl(result.segment)}
              saveStatus={saveStatus}
            />
          ) : null}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
