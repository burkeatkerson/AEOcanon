import { streamText } from "ai";
import { auditModel } from "@/lib/ai/anthropic";
import { scoreSubmission } from "@/lib/scorecard/scoring";
import { answersSchema } from "@/lib/scorecard/types";
import { buildWriteupPrompt, WRITEUP_SYSTEM } from "@/lib/scorecard/writeup-prompt";

/**
 * POST /api/scorecard/writeup — streams the short, personalized on-screen read
 * (Claude, via the Vercel AI SDK). This is the ONLY place the model is used:
 * the downloadable playbook is a pre-made file, not generated. The stream is
 * decorative — the results screen and download render with or without it.
 */

export const runtime = "nodejs";

export async function POST(req: Request) {
  let answers: number[];
  try {
    const body = await req.json();
    answers = answersSchema.parse(body?.answers);
  } catch {
    return new Response("Invalid answers", { status: 400 });
  }

  const result = scoreSubmission(answers);
  const prompt = buildWriteupPrompt(answers, result);

  const stream = streamText({
    model: auditModel(),
    system: WRITEUP_SYSTEM,
    prompt,
    temperature: 0.6,
    maxOutputTokens: 320,
  });

  return stream.toTextStreamResponse();
}
