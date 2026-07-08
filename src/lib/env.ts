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

/**
 * Resend API key for transactional email (the contact form). Returns null when
 * unset so the contact action can degrade gracefully — the page still steers
 * prospects to booking — rather than throwing at request time.
 */
export function resendApiKey(): string | null {
  const value = process.env.RESEND_API_KEY;
  return value && value.length > 0 ? value : null;
}

/**
 * From-address for contact emails. Must be a Resend-verified sender in
 * production; defaults to Resend's shared onboarding sender so the form works
 * out of the box in development. Override via CONTACT_FROM_EMAIL.
 */
export function contactFromEmail(): string {
  return (
    process.env.CONTACT_FROM_EMAIL ??
    process.env.AUDIT_FROM_EMAIL ??
    "AEO Canon <onboarding@resend.dev>"
  );
}

/**
 * Destination for contact-form submissions. Server-only — the address is never
 * exposed to the client or rendered anywhere. Override via CONTACT_TO_EMAIL.
 */
export function contactToEmail(): string {
  return process.env.CONTACT_TO_EMAIL ?? "burkelatkerson@gmail.com";
}

/**
 * Optional outbound webhook for scorecard submissions. When set, the scorecard
 * server action POSTs each captured lead (email + resolved segment + playbook
 * link) here, fire-and-forget — the seam a later email-automation/drip wires
 * into. Returns null when unset, so the action no-ops cleanly and on-screen
 * results never depend on it.
 */
export function scorecardWebhookUrl(): string | null {
  const value = process.env.SCORECARD_WEBHOOK_URL;
  return value && value.length > 0 ? value : null;
}
