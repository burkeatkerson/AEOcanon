import "server-only";
import { SITE_URL, siteConfig } from "@/lib/site";
import type { Contact } from "@/lib/crm/types";
import { unsubscribeUrl } from "./unsubscribe";

/**
 * Email rendering: {{variable}} interpolation plus a shared, inline-styled base
 * layout and an auto-appended unsubscribe footer. Campaign/step/template bodies
 * are written as inner HTML fragments — the layout and footer are added here so
 * every automated email is consistent and CAN-SPAM-compliant without the author
 * remembering to add them.
 *
 * Variable values are HTML-escaped in the HTML render (never in the text render)
 * so a stray character in a contact's name can't break or inject markup.
 */

export type Vars = Record<string, string | number | null | undefined>;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Replace {{key}} tokens. Unknown tokens render empty. */
export function interpolate(template: string, vars: Vars, escape: boolean): string {
  return template.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, key: string) => {
    const raw = vars[key];
    if (raw === null || raw === undefined) return "";
    const str = String(raw);
    return escape ? escapeHtml(str) : str;
  });
}

/** Standard variables available in every automated email. */
export async function contactVars(
  contact: Pick<Contact, "email" | "name">,
  extra: Vars = {},
): Promise<Vars> {
  const firstName = contact.name?.trim().split(/\s+/)[0] || "there";
  return {
    first_name: firstName,
    name: contact.name ?? "",
    email: contact.email,
    site_url: SITE_URL,
    site_name: siteConfig.name,
    unsubscribe_url: await unsubscribeUrl(contact.email),
    ...extra,
  };
}

/** Wrap a rendered HTML fragment in the base layout + unsubscribe footer. */
export function layout(innerHtml: string, unsubscribeHref: string): string {
  return `<!doctype html><html><body style="margin:0;background:#f6f6f4;padding:24px 0">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:12px;padding:32px;font-family:system-ui,-apple-system,Segoe UI,sans-serif;font-size:15px;line-height:1.6;color:#1a1a1a">
<tr><td>${innerHtml}</td></tr>
<tr><td style="padding-top:24px;border-top:1px solid #eee;margin-top:24px;color:#888;font-size:12px;line-height:1.5">
${escapeHtml(siteConfig.name)} · You're receiving this because you signed up at ${escapeHtml(SITE_URL.replace(/^https?:\/\//, ""))}.<br>
<a href="${unsubscribeHref}" style="color:#888">Unsubscribe</a>
</td></tr>
</table></td></tr></table></body></html>`;
}

export interface RenderedEmail {
  subject: string;
  html: string;
  text: string;
}

/**
 * Render a subject + HTML/text body for a specific contact: interpolate
 * variables, wrap the HTML in the layout, and synthesize a plain-text fallback
 * from the provided text (or a stripped version of the HTML fragment).
 */
export async function renderForContact(
  contact: Pick<Contact, "email" | "name">,
  body: { subject: string; html: string; text?: string | null },
  extra: Vars = {},
): Promise<RenderedEmail> {
  const vars = await contactVars(contact, extra);
  const subject = interpolate(body.subject, vars, false);
  const innerHtml = interpolate(body.html, vars, true);
  const html = layout(innerHtml, String(vars.unsubscribe_url));
  const textSource = body.text ?? stripHtml(body.html);
  const text =
    interpolate(textSource, vars, false) +
    `\n\n—\n${siteConfig.name}\nUnsubscribe: ${vars.unsubscribe_url}`;
  return { subject, html, text };
}

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
