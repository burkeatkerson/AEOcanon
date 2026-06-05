import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/db/types";

/**
 * Browser (anon) Supabase client for future client components. Reads the public
 * env vars inlined by Next at build time. All writes from the browser are
 * subject to RLS (currently deny-all) — trusted writes go through the
 * service-role client in `server.ts` instead.
 */
export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error(
      "[supabase] NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set.",
    );
  }
  return createBrowserClient<Database>(url, anonKey);
}
