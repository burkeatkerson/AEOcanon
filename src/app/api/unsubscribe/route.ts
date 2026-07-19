import { createServiceClient } from "@/lib/db/supabase/server";
import { getContactByEmail } from "@/lib/crm/contacts";
import { logActivity } from "@/lib/crm/activities";
import { addSuppression } from "@/lib/mailer/suppressions";
import { verifyUnsubscribeToken } from "@/lib/mailer/unsubscribe";

/**
 * One-click unsubscribe. The token in the link is a signed email (see
 * src/lib/mailer/unsubscribe.ts) — no login, no lookup needed to validate.
 * GET renders a small confirmation page (human click); POST supports RFC 8058
 * `List-Unsubscribe-Post` one-click from mail clients. Both add a suppression,
 * flag the contact, and cancel any active enrollments.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function unsubscribe(email: string): Promise<void> {
  await addSuppression(email, "unsubscribe", "link");
  const contact = await getContactByEmail(email);
  if (!contact) return;
  const supabase = createServiceClient();
  await supabase
    .from("contacts")
    .update({ unsubscribed_all: true, updated_at: new Date().toISOString() })
    .eq("id", contact.id);
  await supabase
    .from("enrollments")
    .update({ status: "unsubscribed", next_run_at: null })
    .eq("contact_id", contact.id)
    .eq("status", "active");
  await logActivity(contact.id, {
    type: "unsubscribed",
    title: "Unsubscribed from all email",
  });
}

function page(message: string, ok: boolean): Response {
  const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="robots" content="noindex"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Unsubscribe</title></head><body style="font-family:system-ui,sans-serif;max-width:520px;margin:15vh auto;padding:0 24px;text-align:center;color:#1a1a1a"><h1 style="font-size:20px">${ok ? "You're unsubscribed" : "Link problem"}</h1><p style="color:#555;line-height:1.6">${message}</p></body></html>`;
  return new Response(html, {
    status: ok ? 200 : 400,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

export async function GET(req: Request): Promise<Response> {
  const token = new URL(req.url).searchParams.get("token");
  const email = await verifyUnsubscribeToken(token);
  if (!email) {
    return page("This unsubscribe link is invalid or has expired.", false);
  }
  await unsubscribe(email);
  return page(
    `${email} has been removed from all AEO Canon emails. You can close this tab.`,
    true,
  );
}

export async function POST(req: Request): Promise<Response> {
  // One-click clients may send the token in the query or the form body.
  const url = new URL(req.url);
  let token = url.searchParams.get("token");
  if (!token) {
    try {
      const form = await req.formData();
      token = (form.get("token") as string | null) ?? null;
    } catch {
      /* no body */
    }
  }
  const email = await verifyUnsubscribeToken(token);
  if (!email) return Response.json({ ok: false }, { status: 400 });
  await unsubscribe(email);
  return Response.json({ ok: true });
}
