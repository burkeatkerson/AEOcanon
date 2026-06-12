import { z } from "zod";

/**
 * The fixed 7-part shape of the personalized result (framework §6). The model
 * fills these fields; the UI renders each as its own scannable block, streamed
 * progressively via streamObject / experimental_useObject. Shared by the route
 * (output schema) and the client (partial-object typing), so they can't drift.
 * Field descriptions are passed to the model to keep each section on-message.
 */
export const resultSchema = z.object({
  headline: z
    .string()
    .describe(
      "§6.1 The headline read: their tier stated plainly, framed for their industry. 1–2 sentences.",
    ),
  gapTitle: z
    .string()
    .describe(
      "A short label (2–4 words) for the biggest gap — the weakest pillar's name (e.g. 'Access'), or for a no-website business the core missing piece (e.g. 'No site to read').",
    ),
  gap: z
    .string()
    .describe(
      "§6.2 Your biggest gap: describe the symptom in the owner's words so they recognize themselves. Industry-calibrated.",
    ),
  costing: z
    .string()
    .describe(
      "§6.3 What it's costing you: tie the gap to real consequences, scaled honestly to their stakes tier.",
    ),
  fixes: z
    .array(z.string())
    .min(2)
    .max(3)
    .describe(
      "§6.4 Two to three concrete, doable fixes drawn from the weakest pillar's fix library, personalized to their business.",
    ),
  strength: z
    .string()
    .describe(
      "§6.5 What you're already doing right: one genuine strength from their highest-scoring pillar (or strongest off-site signal).",
    ),
  bottomLine: z
    .string()
    .describe(
      "§6.6 The bottom line: an honest read on how much AEO matters for them specifically, calibrated to stakes and maturity.",
    ),
  close: z
    .string()
    .describe(
      "§6.7 The done-for-you close: a brief, confident pitch, intensity matched to their stakes.",
    ),
});

export type ScorecardWriteupResult = z.infer<typeof resultSchema>;
