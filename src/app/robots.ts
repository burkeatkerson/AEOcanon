import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

/**
 * As an AEO vendor, we explicitly welcome the AI answer-engine crawlers and
 * training agents by name — both to make the stance unambiguous and to be a
 * working example of the practice. The wildcard rule already permits them; the
 * named rules are a deliberate signal, not a functional gate.
 */
const AI_AGENTS = [
  "GPTBot", // OpenAI training
  "OAI-SearchBot", // ChatGPT search
  "ChatGPT-User", // ChatGPT browsing on a user's behalf
  "ClaudeBot", // Anthropic
  "Claude-Web",
  "PerplexityBot", // Perplexity
  "Google-Extended", // Gemini / Vertex training & grounding
  "Applebot-Extended", // Apple Intelligence
  "CCBot", // Common Crawl (feeds many models)
  "Bytespider", // ByteDance / Doubao
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: AI_AGENTS, allow: "/" },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
