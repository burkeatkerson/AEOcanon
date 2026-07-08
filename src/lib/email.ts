import "server-only";
import { Resend } from "resend";
import { contactFromEmail, contactToEmail, resendApiKey } from "./env";
import { siteConfig } from "./site";

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

function confirmationText(sub: ContactSubmission): string {
  return [
    `Hi ${sub.name},`,
    ``,
    `Thanks for reaching out to AEO Canon — your message came through and we'll`,
    `reply personally soon.`,
    ``,
    `Want to talk sooner? Grab a time here and we'll walk through where AI puts`,
    `your business today and the highest-leverage fixes:`,
    siteConfig.calendlyUrl,
    ``,
    `— Burke Atkerson, AEO Canon`,
  ].join("\n");
}

function confirmationHtml(sub: ContactSubmission): string {
  return [
    `<p style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.6">Hi ${escapeHtml(sub.name)},</p>`,
    `<p style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.6">Thanks for reaching out to AEO Canon — your message came through and we&rsquo;ll reply personally soon.</p>`,
    `<p style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.6">Want to talk sooner? <a href="${siteConfig.calendlyUrl}">Book a quick call</a> and we&rsquo;ll walk through where AI puts your business today and the highest-leverage fixes.</p>`,
    `<p style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.6">— Burke Atkerson, AEO Canon</p>`,
  ].join("");
}

/**
 * Confirmation autoresponder sent to the person who submitted the form. Sent
 * best-effort (a failure never blocks the main inquiry). NOTE: delivery to
 * external submitters requires a Resend-verified sending domain — the shared
 * onboarding sender only delivers to your own account address. So this activates
 * fully once CONTACT_FROM_EMAIL is set to a verified-domain sender.
 */
export async function sendContactConfirmation(
  sub: ContactSubmission,
): Promise<SendResult> {
  const key = resendApiKey();
  if (!key) return { ok: false, reason: "unconfigured" };

  try {
    const resend = new Resend(key);
    const { error } = await resend.emails.send({
      from: contactFromEmail(),
      to: sub.email,
      replyTo: contactToEmail(),
      subject: "Thanks for reaching out to AEO Canon",
      text: confirmationText(sub),
      html: confirmationHtml(sub),
    });
    if (error) return { ok: false, reason: "error" };
    return { ok: true };
  } catch {
    return { ok: false, reason: "error" };
  }
}
