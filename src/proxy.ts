import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE, verifySession } from "@/lib/admin/session";

/**
 * Request proxy (Next 16's renamed `middleware`). First gate on the admin area:
 * unauthenticated requests to /admin/* are redirected to /login, and an already
 * logged-in visitor hitting /login is bounced to the dashboard.
 *
 * This is the coarse gate only. Per Next's data-security guidance, a proxy
 * matcher can be bypassed and Server Functions are POSTs to their own route — so
 * the real authorization lives in `requireAdmin()` (src/lib/admin/guard.ts),
 * which every admin page, route handler, and server action calls. The secret is
 * read straight from the environment (not the `server-only` env module) so the
 * proxy stays self-contained, as the framework recommends.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const secret = process.env.ADMIN_SESSION_SECRET;
  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  const session = secret ? await verifySession(token, secret) : null;

  if (pathname === "/login") {
    if (session) return NextResponse.redirect(new URL("/admin", request.url));
    return NextResponse.next();
  }

  // Everything else the matcher catches is under /admin.
  if (!session) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
