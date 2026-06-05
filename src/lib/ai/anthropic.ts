import "server-only";
import { createAnthropic } from "@ai-sdk/anthropic";
import { anthropicApiKey } from "@/lib/env";

/**
 * Server-only Anthropic (Claude) provider for the Vercel AI SDK. The audit
 * summary streams from here later via `streamText({ model: auditModel(), ... })`.
 * Lazily constructed so the API key is only required when AI is actually used.
 */
let provider: ReturnType<typeof createAnthropic> | null = null;

function anthropic() {
  if (!provider) {
    provider = createAnthropic({ apiKey: anthropicApiKey() });
  }
  return provider;
}

/** Default model for audit narratives — balances quality and cost. */
export const AUDIT_MODEL_ID = "claude-sonnet-4-6";

/** The configured language model passed to the AI SDK's `streamText`/`generateText`. */
export function auditModel() {
  return anthropic()(AUDIT_MODEL_ID);
}
