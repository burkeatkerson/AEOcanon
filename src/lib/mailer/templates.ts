import "server-only";
import { createServiceClient } from "@/lib/db/supabase/server";
import type { EmailTemplate } from "@/lib/crm/types";

/** DB-backed reusable email templates, looked up by their stable `key`. */

export async function getTemplate(key: string): Promise<EmailTemplate | null> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("email_templates")
    .select("*")
    .eq("key", key)
    .maybeSingle();
  return data;
}

export async function listTemplates(): Promise<EmailTemplate[]> {
  const supabase = createServiceClient();
  const { data } = await supabase.from("email_templates").select("*").order("name");
  return data ?? [];
}
