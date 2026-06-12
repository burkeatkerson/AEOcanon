import { streamObject } from "ai";
import { auditModel } from "@/lib/ai/anthropic";
import { INTERPRETATION_FRAMEWORK } from "@/lib/scorecard/interpretation-framework";
import { resultSchema } from "@/lib/scorecard/result-schema";
import { buildLeadContext } from "@/lib/scorecard/writeup-prompt";
import { writeupSchema } from "@/lib/scorecard/types";

/**
 * POST /api/scorecard/writeup — streams the personalized result as a structured
 * object (framework §6's fixed 7-part shape), so the UI can render each section
 * in its own block as it arrives. This is the ONLY place the model is used; the
 * downloadable playbook is a pre-made file, not generated.
 *
 * The interpretation framework is the system prompt and is sent as a cached
 * (ephemeral) block — it's large and identical on every call, so caching it
 * keeps each request cheap and fast. The per-lead data is the user message; for
 * the no-website branch its addendum rides in the user message so the cached
 * framework block stays byte-identical across both branches.
 */

export const runtime = "nodejs";

export async function POST(req: Request) {
  let parsed;
  try {
    parsed = writeupSchema.parse(await req.json());
  } catch {
    return new Response("Invalid request", { status: 400 });
  }

  const result = streamObject({
    model: auditModel(),
    schema: resultSchema,
    schemaName: "ScorecardResult",
    schemaDescription:
      "The personalized AEO Scorecard result in the framework's fixed 7-part shape.",
    messages: [
      {
        role: "system",
        content: INTERPRETATION_FRAMEWORK,
        providerOptions: { anthropic: { cacheControl: { type: "ephemeral" } } },
      },
      { role: "user", content: buildLeadContext(parsed) },
    ],
    temperature: 0.5,
    maxOutputTokens: 1800,
  });

  return result.toTextStreamResponse();
}
