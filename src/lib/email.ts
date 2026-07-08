import "server-only";
import { Resend } from "resend";
import { contactFromEmail, contactToEmail, resendApiKey } from "./env";

/**
 * Server-only email delivery for the contact form. The destination address is
 * resolved here (env, server-side) and never crosses to the client, so Burke's
 * inbox is never exposed on the page. Delivery degrades gracefully: with no
 * RESEND_API_KEY configured, callers get `{ ok: false, reason: "unconfigured" }`
 * and the UI steers the prospect to booking instead of showing a hard error.
 */

export interface ContactSubmission {
  name: string;
  email: string;
  website?: string;
  interest: string;
  message: string;
}

export type SendResult =
  | { ok: true }
  | { ok: false; reason: "unconfigured" | "error" };

function renderText(sub: ContactSubmission): string {
  return [
    `New inquiry from the AEO Canon contact form`,
    ``,
    `Name:     ${sub.name}`,
    `Email:    ${sub.email}`,
    `Website:  ${sub.website?.trim() ? sub.website : "—"}`,
    `Interest: ${sub.interest}`,
    ``,
    `Message:`,
    sub.message,
  ].join("\n");
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderHtml(sub: ContactSubmission): string {
  const website = sub.website?.trim() ? escapeHtml(sub.website) : "—";
  return [
    `<h2 style="margin:0 0 12px">New inquiry — AEO Canon</h2>`,
    `<table style="border-collapse:collapse;font-family:system-ui,sans-serif;font-size:14px">`,
    `<tr><td style="padding:4px 12px 4px 0;color:#666">Name</td><td><strong>${escapeHtml(sub.name)}</strong></td></tr>`,
    `<tr><td style="padding:4px 12px 4px 0;color:#666">Email</td><td>${escapeHtml(sub.email)}</td></tr>`,
    `<tr><td style="padding:4px 12px 4px 0;color:#666">Website</td><td>${website}</td></tr>`,
    `<tr><td style="padding:4px 12px 4px 0;color:#666">Interest</td><td>${escapeHtml(sub.interest)}</td></tr>`,
    `</table>`,
    `<p style="font-family:system-ui,sans-serif;font-size:14px;white-space:pre-wrap;margin-top:16px">${escapeHtml(sub.message)}</p>`,
  ].join("");
}

export async function sendContactEmail(
  sub: ContactSubmission,
): Promise<SendResult> {
  const key = resendApiKey();
  if (!key) return { ok: false, reason: "unconfigured" };

  try {
    const resend = new Resend(key);
    const { error } = await resend.emails.send({
      from: contactFromEmail(),
      to: contactToEmail(),
      replyTo: sub.email,
      subject: `New AEO inquiry from ${sub.name} — ${sub.interest}`,
      text: renderText(sub),
      html: renderHtml(sub),
    });
    if (error) return { ok: false, reason: "error" };
    return { ok: true };
  } catch {
    return { ok: false, reason: "error" };
  }
}
