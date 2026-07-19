import "server-only";
import { Resend } from "resend";
import { createServiceClient } from "@/lib/db/supabase/server";
import { marketingFromEmail, resendApiKey } from "@/lib/env";
import type { Contact } from "@/lib/crm/types";
import { isSuppressed } from "./suppressions";
import { renderForContact, type Vars } from "./render";
import { unsubscribeUrl } from "./unsubscribe";

/**
 * The single send path for all CRM/automation email. Guarantees:
 *  1. Suppression is checked first — suppressed addresses are logged and skipped.
 *  2. An `email_sends` row is the idempotency ledger. Drip sends carry
 *     (enrollment_id, step_id) and broadcasts carry (campaign_id, contact_id);
 *     the DB's partial-unique indexes make a duplicate insert fail, so the tick
 *     engine can run repeatedly and never double-send.
 *  3. Delivery degrades gracefully — with no RESEND_API_KEY the row is recorded
 *     as `queued` and the caller still advances (mirrors src/lib/email.ts).
 *
 * The caller passes RAW subject/body (with {{variables}}); rendering + the base
 * layout + unsubscribe footer/headers are applied here.
 */

export type SendResult =
  | { status: "sent"; sendId: string; providerId: string | null }
  | { status: "queued"; sendId: string } // recorded but not delivered (no Resend key)
  | { status: "failed"; sendId: string; error: string }
  | { status: "suppressed" }
  | { status: "duplicate" }
  | { status: "error"; error: string };

export type Dedupe = "enrollment_step" | "broadcast" | "none";

export interface SendParams {
  contact: Pick<Contact, "id" | "email" | "name">;
  subject: string;
  html: string;
  text?: string | null;
  campaignId?: string | null;
  stepId?: string | null;
  enrollmentId?: string | null;
  templateKey?: string | null;
  fromName?: string | null;
  fromEmail?: string | null;
  replyTo?: string | null;
  dedupe?: Dedupe;
  extraVars?: Vars;
}

function resolveFrom(fromName?: string | null, fromEmail?: string | null): string {
  if (fromEmail) {
    return fromName ? `${fromName} <${fromEmail}>` : fromEmail;
  }
  return marketingFromEmail();
}

export async function sendEmail(params: SendParams): Promise<SendResult> {
  const supabase = createServiceClient();
  const email = params.contact.email.trim().toLowerCase();

  if (await isSuppressed(email)) {
    await supabase.from("email_sends").insert({
      contact_id: params.contact.id ?? null,
      campaign_id: params.campaignId ?? null,
      step_id: params.stepId ?? null,
      enrollment_id: params.enrollmentId ?? null,
      template_key: params.templateKey ?? null,
      to_email: email,
      subject: params.subject.slice(0, 300),
      status: "suppressed",
    });
    return { status: "suppressed" };
  }

  const rendered = await renderForContact(
    { email, name: params.contact.name ?? null },
    { subject: params.subject, html: params.html, text: params.text },
    params.extraVars,
  );

  // Reserve the idempotency slot. A unique-violation means this exact
  // (enrollment, step) or (campaign, contact) was already handled.
  const { data: row, error: insertErr } = await supabase
    .from("email_sends")
    .insert({
      contact_id: params.contact.id ?? null,
      campaign_id: params.campaignId ?? null,
      step_id: params.stepId ?? null,
      enrollment_id: params.enrollmentId ?? null,
      template_key: params.templateKey ?? null,
      to_email: email,
      subject: rendered.subject.slice(0, 300),
      status: "queued",
    })
    .select("id")
    .single();

  if (insertErr) {
    if (insertErr.code === "23505") return { status: "duplicate" };
    console.error("[mailer] send-record insert failed:", insertErr.message);
    return { status: "error", error: insertErr.message };
  }
  const sendId = row.id;

  const key = resendApiKey();
  if (!key) {
    // No provider configured: leave the row queued. The caller still advances;
    // a real send happens once RESEND_API_KEY is set (see ADMIN_CRM.md TODOs).
    return { status: "queued", sendId };
  }

  try {
    const resend = new Resend(key);
    const unsubHref = await unsubscribeUrl(email);
    const { data, error } = await resend.emails.send({
      from: resolveFrom(params.fromName, params.fromEmail),
      to: email,
      replyTo: params.replyTo ?? undefined,
      subject: rendered.subject,
      html: rendered.html,
      text: rendered.text,
      headers: {
        "List-Unsubscribe": `<${unsubHref}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
    });
    if (error) {
      await supabase
        .from("email_sends")
        .update({ status: "failed", error: error.message })
        .eq("id", sendId);
      return { status: "failed", sendId, error: error.message };
    }
    await supabase
      .from("email_sends")
      .update({
        status: "sent",
        provider_message_id: data?.id ?? null,
        sent_at: new Date().toISOString(),
      })
      .eq("id", sendId);
    return { status: "sent", sendId, providerId: data?.id ?? null };
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    await supabase
      .from("email_sends")
      .update({ status: "failed", error: message })
      .eq("id", sendId);
    return { status: "failed", sendId, error: message };
  }
}

/** Convenience: a one-off transactional send to a contact (no dedupe). */
export async function sendTransactional(
  contact: Pick<Contact, "id" | "email" | "name">,
  body: { subject: string; html: string; text?: string | null },
  opts: { templateKey?: string; replyTo?: string; extraVars?: Vars } = {},
): Promise<SendResult> {
  return sendEmail({
    contact,
    subject: body.subject,
    html: body.html,
    text: body.text,
    templateKey: opts.templateKey ?? null,
    replyTo: opts.replyTo ?? null,
    dedupe: "none",
    extraVars: opts.extraVars,
  });
}
