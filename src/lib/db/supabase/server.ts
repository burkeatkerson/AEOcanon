import "server-only";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseServerConfig } from "@/lib/env";
import type { Database } from "@/lib/db/types";

/**
 * Service-role client for trusted server-side writes (e.g. storing an audit or
 * a lead). Bypasses RLS, so it must NEVER be imported into client code — this
 * module is `server-only`. No session persistence; it's request-scoped.
 */
export function createServiceClient() {
  const { url, serviceRoleKey } = supabaseServerConfig();
  return createClient<Database>(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * Request-scoped SSR client bound to the incoming cookies, for any future
 * user-scoped access under RLS (anon key). Cookie writes are no-ops when called
 * from a Server Component render.
 */
export async function createSupabaseServerClient() {
  const { url, anonKey } = supabaseServerConfig();
  const cookieStore = await cookies();
  return createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Called from a Server Component (cookies are read-only there);
          // session refresh is handled in proxy/middleware when added.
        }
      },
    },
  });
}
