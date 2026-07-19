import "server-only";
import { createServiceClient } from "@/lib/db/supabase/server";
import type { SuppressionReason } from "@/lib/crm/enums";

/**
 * The global send-block list. Every automated send checks `isSuppressed` first,
 * so an unsubscribe, hard bounce, or spam complaint permanently stops mail to
 * that address regardless of campaign. Emails are stored lowercased.
 */

function norm(email: string): string {
  return email.trim().toLowerCase();
}

export async function isSuppressed(email: string): Promise<boolean> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("suppressions")
    .select("email")
    .eq("email", norm(email))
    .maybeSingle();
  return Boolean(data);
}

export async function addSuppression(
  email: string,
  reason: SuppressionReason,
  source?: string,
): Promise<void> {
  const supabase = createServiceClient();
  await supabase
    .from("suppressions")
    .upsert(
      { email: norm(email), reason, source: source ?? null },
      { onConflict: "email", ignoreDuplicates: true },
    );
}

export async function removeSuppression(email: string): Promise<void> {
  const supabase = createServiceClient();
  await supabase.from("suppressions").delete().eq("email", norm(email));
}
