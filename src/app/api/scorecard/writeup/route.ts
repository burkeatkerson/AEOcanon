import { streamText } from "ai";
import { auditModel } from "@/lib/ai/anthropic";
import { writeupSchema } from "@/lib/scorecard/types";
import {
  buildNoWebsitePrompt,
  buildWriteupPrompt,
  NO_WEBSITE_SYSTEM,
  WRITEUP_SYSTEM,
} from "@/lib/scorecard/writeup-prompt";
import type { SiteRead } from "@/lib/scorecard/types";

/**
 * POST /api/scorecard/writeup — streams the short, personalized on-screen read
 * (Claude, via the Vercel AI SDK). This is the ONLY place the model is used:
 * the downloadable playbook is a pre-made file, not generated. The score always
 * comes from the quiz answers; the optional site-read only enriches the read.
 * The stream is decorative — the results screen renders with or without it.
 */

export const runtime = "nodejs";

export async function POST(req: Request) {
  let parsed;
  try {
    parsed = writeupSchema.parse(await req.json());
  } catch {
    return new Response("Invalid request", { status: 400 });
  }

  const { system, prompt } =
    parsed.branch === "no_website"
      ? {
          system: NO_WEBSITE_SYSTEM,
          prompt: buildNoWebsitePrompt(parsed.offsite, parsed.businessType),
        }
      : {
          system: WRITEUP_SYSTEM,
          prompt: buildWriteupPrompt(
            parsed.answers,
            parsed.businessType,
            parsed.siteRead as SiteRead | undefined,
          ),
        };

  const stream = streamText({
    model: auditModel(),
    system,
    prompt,
    temperature: 0.6,
    maxOutputTokens: 320,
  });

  return stream.toTextStreamResponse();
}
