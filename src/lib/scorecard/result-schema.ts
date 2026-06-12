import { z } from "zod";

/**
 * The shape of the personalized result (framework §6). The model interprets the
 * lead's ratings through the framework and fills these fields; the UI renders
 * each as its own scannable block, streamed progressively via streamObject /
 * experimental_useObject. Shared by the route (output schema) and the client
 * (partial-object typing) so they can't drift.
 *
 * The shape is deliberately analytical and benefit-led: a `distance` read so the
 * owner sees how far they are from being the business AI recommends, and a
 * `gapAnalysis` that walks each weak pillar from where they are → what strong
 * looks like → what they gain by closing it. Field descriptions are passed to
 * the model to keep each section grounded and on-message.
 */
export const resultSchema = z.object({
  headline: z
    .string()
    .describe(
      "§6.1 The headline read: their tier stated plainly, framed for their specific industry and location, leading with what's at stake or the upside of getting this right. 1–2 sentences, benefit-forward.",
    ),
  distance: z
    .string()
    .describe(
      "How far they are from being the business AI consistently recommends — analytical and specific. For a scored business, contrast where they are now with where 'The Answer' businesses sit and what actually closing that distance would mean for them. For a no-website business, how far they are from having a home base engines can read. 1–2 sentences.",
    ),
  gapAnalysis: z
    .array(
      z.object({
        pillar: z
          .string()
          .describe(
            "The pillar name exactly as the framework names it (e.g. 'Extractability'), or for a no-website business the missing piece (e.g. 'A site engines can read').",
          ),
        current: z
          .string()
          .describe(
            "Where they are now on this pillar, in plain terms tied to the actual answer they gave — so they recognize themselves.",
          ),
        strong: z
          .string()
          .describe(
            "What 'strong' looks like on this pillar for THIS specific business — concrete and tailored, not generic. This is the target they're climbing toward.",
          ),
        benefit: z
          .string()
          .describe(
            "The concrete payoff of closing this gap — what they actually win (more of the right calls, getting named first, etc.). Benefit-driven.",
          ),
      }),
    )
    .min(2)
    .max(3)
    .describe(
      "The 2–3 weakest pillars (priority order on ties) — the climb from where they are to where they need to be. Order weakest-first.",
    ),
  costing: z
    .string()
    .describe(
      "§6.3 What the gap is costing them right now — analytical and concrete, scaled honestly to their stakes tier. High stakes: be direct about lost jobs/revenue. Lower stakes: be measured and specific about the narrow slice that matters.",
    ),
  fixes: z
    .array(z.string())
    .min(2)
    .max(3)
    .describe(
      "§6.4 Two to three concrete first moves they can start now, drawn from the weakest pillars' fix libraries and personalized to their business. Make them feel doable.",
    ),
  strength: z
    .string()
    .describe(
      "§6.5 What they're already doing right: one genuine strength from their highest-scoring pillar (or strongest off-site signal), and why it's working for them.",
    ),
  bottomLine: z
    .string()
    .describe(
      "§6.6 The bottom line: an honest, benefit-led read on how much this matters for them specifically and the prize for closing the distance — calibrated to their stakes tier and maturity.",
    ),
  close: z
    .string()
    .describe(
      "§6.7 The done-for-you close: a brief, confident pitch, intensity matched to their stakes.",
    ),
});

export type ScorecardWriteupResult = z.infer<typeof resultSchema>;
