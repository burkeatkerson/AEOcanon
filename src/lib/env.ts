import "server-only";
import { z } from "zod";

/**
 * Server-side environment access for the audit tool. Validation is **lazy and
 * granular**: each getter validates only the vars its concern needs, on first
 * call, at request time. So the static content build (which never calls these)
 * compiles with no secrets set, and using one capability (e.g. PageSpeed)
 * doesn't require unrelated keys (e.g. Anthropic). Importing this module into a
 * client bundle is a build error (`server-only`), keeping secrets off the client.
 */

function need(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `[env] Missing required server environment variable: ${name}. ` +
        `Copy .env.example to .env.local and fill it in.`,
    );
  }
  return value;
}

/** Anthropic (Claude via the Vercel AI SDK). */
export function anthropicApiKey(): string {
  return need("ANTHROPIC_API_KEY");
}

/** Google PageSpeed Insights API key. */
export function pagespeedApiKey(): string {
  return need("PAGESPEED_API_KEY");
}

const supabaseSchema = z.object({
  url: z.string().url(),
  anonKey: z.string().min(1),
  serviceRoleKey: z.string().min(1),
});

export type SupabaseServerConfig = z.infer<typeof supabaseSchema>;

/** Supabase config for server clients (URL + anon + service role). */
export function supabaseServerConfig(): SupabaseServerConfig {
  const parsed = supabaseSchema.safeParse({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  });
  if (!parsed.success) {
    const fields = parsed.error.issues.map((i) => i.path.join(".")).join(", ");
    throw new Error(
      `[env] Invalid or missing Supabase server env (${fields}). See .env.example.`,
    );
  }
  return parsed.data;
}

/** User-agent used when fetching audited sites (has a safe default). */
export function auditUserAgent(): string {
  return process.env.AUDIT_USER_AGENT ?? "AEOCanonAuditBot";
}
