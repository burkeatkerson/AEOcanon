import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminSessionSecret } from "@/lib/env";
import { ADMIN_COOKIE, verifySession, type SessionPayload } from "./session";

/**
 * Server-side admin session helpers for Server Components, layouts, route
 * handlers, and server actions. The request proxy (src/proxy.ts) is the first
 * gate, but per the Next.js data-security guidance a proxy matcher can be
 * bypassed — so every admin server action and route handler MUST also call
 * `requireAdmin()` here. Defense in depth, not proxy alone.
 */

/** Returns the verified session payload, or null if not logged in. */
export async function getAdminSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  return verifySession(token, adminSessionSecret());
}

/** True when the current request carries a valid admin session. */
export async function isAdmin(): Promise<boolean> {
  return (await getAdminSession()) !== null;
}

/**
 * Gate a protected surface: redirects to /login when there is no valid session.
 * Use at the top of admin layouts/pages and inside every admin server action.
 */
export async function requireAdmin(): Promise<SessionPayload> {
  const session = await getAdminSession();
  if (!session) redirect("/login");
  return session;
}
