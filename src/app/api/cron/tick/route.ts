import { runTick } from "@/lib/automation/tick";
import { cronSecret } from "@/lib/env";

/**
 * The automation heartbeat. Runs one tick of the drip + broadcast engine.
 *
 * Auth: `Authorization: Bearer <CRON_SECRET>`. On Vercel, setting the CRON_SECRET
 * env makes Vercel Cron attach this header automatically (see vercel.json). It's
 * also how you trigger a tick by hand:
 *   curl -H "Authorization: Bearer $CRON_SECRET" https://<host>/api/cron/tick
 *
 * GET and POST both work so any scheduler can call it. Idempotent — safe to run
 * as often as you like; the email_sends unique indexes prevent double-sends.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authorized(req: Request): boolean {
  let expected: string;
  try {
    expected = cronSecret();
  } catch {
    return false; // CRON_SECRET not configured — refuse rather than run open.
  }
  const header = req.headers.get("authorization") ?? "";
  const token = header.replace(/^Bearer\s+/i, "");
  return token.length > 0 && token === expected;
}

async function handle(req: Request): Promise<Response> {
  if (!authorized(req)) {
    return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  try {
    const summary = await runTick();
    return Response.json({ ok: true, ...summary });
  } catch (err) {
    const message = err instanceof Error ? err.message : "tick failed";
    console.error("[cron/tick] error:", message);
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}

export const GET = handle;
export const POST = handle;
