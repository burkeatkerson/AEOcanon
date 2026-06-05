import "server-only";
import { assertSafeUrl, BlockedUrlError } from "./url-guard";
import { auditUserAgent } from "@/lib/env";

/**
 * Hardened server-side fetch for audited sites. Every hop (including redirects)
 * is re-validated against the SSRF guard, requests carry a hard timeout, the
 * response body is capped, and a clear, honest user-agent is sent.
 */
export interface SafeFetchOptions {
  /** Abort after this many ms. Default 10s. */
  timeoutMs?: number;
  /** Stop reading the body past this many bytes. Default 2 MB. */
  maxBytes?: number;
  /** Max redirects to follow (each re-validated). Default 3. */
  maxRedirects?: number;
  /** Override the user-agent. Defaults to AUDIT_USER_AGENT. */
  userAgent?: string;
  /** Accept header. Default HTML-first. */
  accept?: string;
}

export interface SafeFetchResult {
  /** Final URL actually fetched (after redirects). */
  finalUrl: string;
  status: number;
  headers: Headers;
  contentType: string | null;
  body: string;
  /** True if the body hit `maxBytes` and was truncated. */
  truncated: boolean;
}

export { BlockedUrlError };

async function readCapped(
  response: Response,
  maxBytes: number,
): Promise<{ body: string; truncated: boolean }> {
  const reader = response.body?.getReader();
  if (!reader) return { body: "", truncated: false };
  const decoder = new TextDecoder();
  const chunks: string[] = [];
  let received = 0;
  let truncated = false;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    received += value.byteLength;
    if (received > maxBytes) {
      const allowed = value.byteLength - (received - maxBytes);
      chunks.push(decoder.decode(value.subarray(0, allowed), { stream: true }));
      truncated = true;
      await reader.cancel();
      break;
    }
    chunks.push(decoder.decode(value, { stream: true }));
  }
  chunks.push(decoder.decode());
  return { body: chunks.join(""), truncated };
}

export async function safeFetch(
  rawUrl: string,
  options: SafeFetchOptions = {},
): Promise<SafeFetchResult> {
  const {
    timeoutMs = 10_000,
    maxBytes = 2_000_000,
    maxRedirects = 3,
    accept = "text/html,application/xhtml+xml,*/*;q=0.8",
  } = options;
  const userAgent = options.userAgent ?? auditUserAgent();

  let current = await assertSafeUrl(rawUrl);

  for (let redirects = 0; ; redirects += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    let response: Response;
    try {
      response = await fetch(current, {
        signal: controller.signal,
        redirect: "manual", // we follow + re-validate redirects ourselves
        headers: { "user-agent": userAgent, accept },
      });
    } finally {
      clearTimeout(timer);
    }

    const isRedirect = response.status >= 300 && response.status < 400;
    const location = response.headers.get("location");
    if (isRedirect && location) {
      if (redirects >= maxRedirects) {
        throw new BlockedUrlError("Too many redirects.");
      }
      // Resolve relative redirects against the current URL, then re-validate.
      const next = new URL(location, current);
      current = await assertSafeUrl(next.toString());
      continue;
    }

    const { body, truncated } = await readCapped(response, maxBytes);
    return {
      finalUrl: current.toString(),
      status: response.status,
      headers: response.headers,
      contentType: response.headers.get("content-type"),
      body,
      truncated,
    };
  }
}
