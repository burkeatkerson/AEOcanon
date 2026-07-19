import "server-only";
import { SITE_URL } from "@/lib/site";
import { unsubscribeSecret } from "@/lib/env";

/**
 * Signed, stateless unsubscribe links. The token is
 * `base64url(email).base64url(HMAC-SHA256(email))` — no database lookup needed to
 * validate an opt-out, and the signature makes the address untamperable. The
 * /api/unsubscribe route verifies it before adding a suppression.
 */

const encoder = new TextEncoder();

function b64urlEncode(bytes: Uint8Array): string {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlToBytes(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(padded + "=".repeat((4 - (padded.length % 4)) % 4));
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

async function sign(data: string): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(unsubscribeSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(data)));
}

function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i]! ^ b[i]!;
  return diff === 0;
}

export async function unsubscribeToken(email: string): Promise<string> {
  const normalized = email.trim().toLowerCase();
  const body = b64urlEncode(encoder.encode(normalized));
  const sig = b64urlEncode(await sign(normalized));
  return `${body}.${sig}`;
}

/** Absolute unsubscribe URL for a given email. */
export async function unsubscribeUrl(email: string): Promise<string> {
  const token = await unsubscribeToken(email);
  return `${SITE_URL}/api/unsubscribe?token=${encodeURIComponent(token)}`;
}

/** Verify a token; returns the email it authorizes, or null. */
export async function verifyUnsubscribeToken(
  token: string | null | undefined,
): Promise<string | null> {
  if (!token) return null;
  const dot = token.indexOf(".");
  if (dot <= 0) return null;
  const body = token.slice(0, dot);
  try {
    const email = new TextDecoder().decode(b64urlToBytes(body));
    const expected = await sign(email);
    const provided = b64urlToBytes(token.slice(dot + 1));
    return constantTimeEqual(expected, provided) ? email : null;
  } catch {
    return null;
  }
}
