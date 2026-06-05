import "server-only";
import { isIP } from "node:net";
import { lookup } from "node:dns/promises";
import { z } from "zod";

/**
 * SSRF protection for user-submitted URLs. Enforces http/https, rejects
 * private/loopback/link-local/CGNAT/metadata addresses, and — critically —
 * resolves the hostname and re-checks every resolved IP, defeating DNS
 * rebinding where a public-looking host points at an internal address.
 */
export class BlockedUrlError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BlockedUrlError";
  }
}

const urlSchema = z.string().trim().min(1).max(2048).url();

const BLOCKED_HOST_SUFFIXES = [".local", ".internal", ".localhost"];
const BLOCKED_HOSTNAMES = new Set(["localhost", "metadata.google.internal"]);

function isBlockedIPv4(ip: string): boolean {
  const parts = ip.split(".").map((p) => Number(p));
  if (parts.length !== 4 || parts.some((n) => Number.isNaN(n))) return true;
  const [a, b] = parts as [number, number, number, number];
  if (a === 0) return true; // "this" network
  if (a === 10) return true; // private
  if (a === 127) return true; // loopback
  if (a === 169 && b === 254) return true; // link-local incl. cloud metadata 169.254.169.254
  if (a === 172 && b >= 16 && b <= 31) return true; // private
  if (a === 192 && b === 168) return true; // private
  if (a === 100 && b >= 64 && b <= 127) return true; // CGNAT
  if (a >= 224) return true; // multicast / reserved
  return false;
}

function isBlockedIPv6(ip: string): boolean {
  const v = ip.toLowerCase();
  if (v === "::1" || v === "::") return true; // loopback / unspecified
  if (v.startsWith("fc") || v.startsWith("fd")) return true; // unique-local fc00::/7
  if (v.startsWith("fe80")) return true; // link-local
  if (v.startsWith("::ffff:")) {
    // IPv4-mapped IPv6 — validate the embedded v4 address.
    const mapped = v.slice("::ffff:".length);
    if (mapped.includes(".")) return isBlockedIPv4(mapped);
  }
  return false;
}

function isBlockedIP(ip: string): boolean {
  const family = isIP(ip);
  if (family === 4) return isBlockedIPv4(ip);
  if (family === 6) return isBlockedIPv6(ip);
  return true; // not a recognizable IP — refuse
}

/**
 * Validate a user-supplied URL and assert it is safe to fetch server-side.
 * Returns the parsed URL on success; throws `BlockedUrlError` otherwise.
 */
export async function assertSafeUrl(raw: string): Promise<URL> {
  const parsed = urlSchema.safeParse(raw);
  if (!parsed.success) {
    throw new BlockedUrlError("Enter a valid URL.");
  }

  let url: URL;
  try {
    url = new URL(parsed.data);
  } catch {
    throw new BlockedUrlError("Enter a valid URL.");
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new BlockedUrlError("Only http and https URLs are allowed.");
  }

  // URL.hostname wraps IPv6 literals in brackets — strip them for checks.
  const host = url.hostname.replace(/^\[|\]$/g, "").toLowerCase();

  if (
    BLOCKED_HOSTNAMES.has(host) ||
    BLOCKED_HOST_SUFFIXES.some((suffix) => host.endsWith(suffix))
  ) {
    throw new BlockedUrlError("Refusing to fetch a private or internal host.");
  }

  // Literal IP in the URL — check directly, no DNS needed.
  if (isIP(host)) {
    if (isBlockedIP(host)) {
      throw new BlockedUrlError("Refusing to fetch a private IP address.");
    }
    return url;
  }

  // Resolve and verify every address the host maps to (anti-rebinding).
  let records: { address: string }[];
  try {
    records = await lookup(host, { all: true });
  } catch {
    throw new BlockedUrlError("Could not resolve that host.");
  }
  if (records.length === 0) {
    throw new BlockedUrlError("That host did not resolve.");
  }
  for (const record of records) {
    if (isBlockedIP(record.address)) {
      throw new BlockedUrlError(
        "That host resolves to a private or internal address.",
      );
    }
  }

  return url;
}
