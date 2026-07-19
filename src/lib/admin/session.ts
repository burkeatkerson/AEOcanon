/**
 * Admin session crypto — deliberately framework-agnostic and dependency-free so
 * it runs in BOTH the request proxy (src/proxy.ts) and server actions / route
 * handlers. It only does the maths: mint a signed session token, verify one, and
 * constant-time-check the admin password. Reading/writing the actual cookie is
 * the caller's job (proxy uses NextRequest cookies; server code uses
 * next/headers — see guard.ts and actions.ts).
 *
 * The token is `base64url(payload).base64url(HMAC-SHA256(payload))`, signed with
 * ADMIN_SESSION_SECRET. There is exactly one admin, so the payload is minimal.
 */

export const ADMIN_COOKIE = "aeo_admin";
/** Session lifetime: 7 days. */
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export interface SessionPayload {
  /** Subject — always "admin"; present for forward-compatibility. */
  sub: "admin";
  /** Issued-at, epoch ms. */
  iat: number;
  /** Expiry, epoch ms. */
  exp: number;
}

const encoder = new TextEncoder();

function base64urlEncode(bytes: Uint8Array): string {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64urlToBytes(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(padded + "=".repeat((4 - (padded.length % 4)) % 4));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function hmac(secret: string, data: string): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  return new Uint8Array(sig);
}

/** Length-safe constant-time comparison of two byte arrays. */
function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i]! ^ b[i]!;
  return diff === 0;
}

/** Mint a signed session token valid for SESSION_MAX_AGE_SECONDS. */
export async function signSession(secret: string): Promise<string> {
  const now = Date.now();
  const payload: SessionPayload = {
    sub: "admin",
    iat: now,
    exp: now + SESSION_MAX_AGE_SECONDS * 1000,
  };
  const body = base64urlEncode(encoder.encode(JSON.stringify(payload)));
  const sig = base64urlEncode(await hmac(secret, body));
  return `${body}.${sig}`;
}

/**
 * Verify a session token's signature and expiry. Returns the payload when valid,
 * or null for any tampering, malformed input, or expiry — callers treat null as
 * "not logged in".
 */
export async function verifySession(
  token: string | undefined | null,
  secret: string,
): Promise<SessionPayload | null> {
  if (!token) return null;
  const dot = token.indexOf(".");
  if (dot <= 0) return null;
  const body = token.slice(0, dot);
  const providedSig = token.slice(dot + 1);

  let expectedSig: Uint8Array;
  let provided: Uint8Array;
  try {
    expectedSig = await hmac(secret, body);
    provided = base64urlToBytes(providedSig);
  } catch {
    return null;
  }
  if (!constantTimeEqual(expectedSig, provided)) return null;

  try {
    const payload = JSON.parse(
      new TextDecoder().decode(base64urlToBytes(body)),
    ) as SessionPayload;
    if (payload.sub !== "admin") return null;
    if (typeof payload.exp !== "number" || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

/**
 * Constant-time password check. Both sides are HMAC'd with the session secret
 * first so the comparison never leaks the expected length and only ever compares
 * fixed-size digests.
 */
export async function verifyPassword(
  provided: string,
  expected: string,
  secret: string,
): Promise<boolean> {
  const [a, b] = await Promise.all([
    hmac(secret, provided),
    hmac(secret, expected),
  ]);
  return constantTimeEqual(a, b);
}
