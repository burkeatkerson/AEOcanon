import { createServiceClient } from "@/lib/db/supabase/server";
import { logActivity } from "@/lib/crm/activities";
import { addSuppression } from "@/lib/mailer/suppressions";
import { resendWebhookSecret } from "@/lib/env";
import type { ActivityType, EmailSendStatus } from "@/lib/crm/enums";
import type { Database } from "@/lib/db/types";

type EmailSendUpdate = Database["public"]["Tables"]["email_sends"]["Update"];

/**
 * Resend event webhook. Correlates delivery/open/click/bounce/complaint events
 * back to the `email_sends` row (by provider_message_id) so the dashboard shows
 * real engagement, and auto-suppresses on bounce/complaint.
 *
 * Signature verification uses the Svix scheme Resend signs with (svix-id/
 * timestamp/signature headers), implemented with Web Crypto so we don't pull in
 * the svix package. If RESEND_WEBHOOK_SECRET is unset, events are accepted
 * best-effort with a warning (fine for dev; set the secret in production).
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const encoder = new TextEncoder();

function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i]! ^ b[i]!;
  return diff === 0;
}

function base64ToBytes(b64: string): Uint8Array<ArrayBuffer> {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

async function verifySvix(
  secret: string,
  headers: Headers,
  rawBody: string,
): Promise<boolean> {
  const id = headers.get("svix-id");
  const timestamp = headers.get("svix-timestamp");
  const signature = headers.get("svix-signature");
  if (!id || !timestamp || !signature) return false;

  const secretBytes = base64ToBytes(secret.replace(/^whsec_/, ""));
  const key = await crypto.subtle.importKey(
    "raw",
    secretBytes,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signed = `${id}.${timestamp}.${rawBody}`;
  const expected = new Uint8Array(
    await crypto.subtle.sign("HMAC", key, encoder.encode(signed)),
  );
  // Header may carry multiple space-separated "v1,<sig>" entries.
  for (const part of signature.split(" ")) {
    const sig = part.includes(",") ? part.split(",")[1] : part;
    if (!sig) continue;
    try {
      if (constantTimeEqual(expected, base64ToBytes(sig))) return true;
    } catch {
      /* skip malformed */
    }
  }
  return false;
}

// Engagement statuses only ever move forward; negative outcomes always win.
const RANK: Record<string, number> = {
  queued: 0,
  sent: 1,
  delivered: 2,
  opened: 3,
  clicked: 4,
};
const TERMINAL = new Set(["bounced", "complained", "failed"]);

const EVENT_MAP: Record<
  string,
  { status: EmailSendStatus; column?: string; activity: ActivityType }
> = {
  "email.delivered": { status: "delivered", column: "delivered_at", activity: "email_delivered" },
  "email.opened": { status: "opened", column: "opened_at", activity: "email_opened" },
  "email.clicked": { status: "clicked", column: "clicked_at", activity: "email_clicked" },
  "email.bounced": { status: "bounced", activity: "email_bounced" },
  "email.complained": { status: "complained", activity: "email_complained" },
};

export async function POST(req: Request): Promise<Response> {
  const raw = await req.text();
  const secret = resendWebhookSecret();
  if (secret) {
    const ok = await verifySvix(secret, req.headers, raw);
    if (!ok) return Response.json({ ok: false }, { status: 401 });
  } else {
    console.warn("[webhooks/resend] RESEND_WEBHOOK_SECRET unset — accepting unverified event");
  }

  let event: { type?: string; data?: { email_id?: string; to?: string | string[] } };
  try {
    event = JSON.parse(raw);
  } catch {
    return Response.json({ ok: false, error: "bad json" }, { status: 400 });
  }

  const eventType = event.type;
  const mapped = eventType ? EVENT_MAP[eventType] : undefined;
  if (!eventType || !mapped || !event.data?.email_id) {
    return Response.json({ ok: true, ignored: true });
  }

  const supabase = createServiceClient();
  const { data: send } = await supabase
    .from("email_sends")
    .select("id, status, contact_id")
    .eq("provider_message_id", event.data.email_id)
    .maybeSingle();

  if (!send) return Response.json({ ok: true, unmatched: true });

  const patch: Record<string, unknown> = {};
  const current = send.status;
  const shouldSetStatus =
    TERMINAL.has(mapped.status) ||
    (RANK[mapped.status] ?? 0) > (RANK[current] ?? 0);
  if (shouldSetStatus) patch.status = mapped.status;
  if (mapped.column) patch[mapped.column] = new Date().toISOString();
  if (Object.keys(patch).length > 0) {
    await supabase
      .from("email_sends")
      .update(patch as EmailSendUpdate)
      .eq("id", send.id);
  }

  if (send.contact_id) {
    await logActivity(send.contact_id, {
      type: mapped.activity,
      title: eventTitle(eventType),
    });
  }

  // Auto-suppress on bounce/complaint.
  const recipient = Array.isArray(event.data.to) ? event.data.to[0] : event.data.to;
  if (recipient && (eventType === "email.bounced" || eventType === "email.complained")) {
    await addSuppression(
      recipient,
      eventType === "email.bounced" ? "bounce" : "complaint",
      `resend:${eventType}`,
    );
    if (eventType === "email.complained" && send.contact_id) {
      await supabase
        .from("contacts")
        .update({ unsubscribed_all: true })
        .eq("id", send.contact_id);
    }
  }

  return Response.json({ ok: true });
}

function eventTitle(type: string): string {
  switch (type) {
    case "email.delivered":
      return "Email delivered";
    case "email.opened":
      return "Email opened";
    case "email.clicked":
      return "Email link clicked";
    case "email.bounced":
      return "Email bounced";
    case "email.complained":
      return "Marked as spam";
    default:
      return type;
  }
}
