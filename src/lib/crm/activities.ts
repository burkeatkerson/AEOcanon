import "server-only";
import { createServiceClient } from "@/lib/db/supabase/server";
import type { Json } from "@/lib/db/types";
import type { ActivityType } from "./enums";
import type { Activity } from "./types";

/**
 * The contact timeline. Activities are append-only — every capture, email event,
 * stage move, and note lands here so a contact's full history reads in one place.
 * Writing an activity also refreshes the contact's `last_activity_at`.
 */

export interface ActivityInput {
  type: ActivityType;
  title: string;
  data?: Record<string, unknown>;
  occurredAt?: string;
}

export async function logActivity(
  contactId: string,
  input: ActivityInput,
): Promise<void> {
  const supabase = createServiceClient();
  const occurred = input.occurredAt ?? new Date().toISOString();
  const { error } = await supabase.from("activities").insert({
    contact_id: contactId,
    type: input.type,
    title: input.title,
    data: (input.data as Json) ?? {},
    occurred_at: occurred,
  });
  if (error) {
    console.error("[crm] logActivity failed:", error.message);
    return;
  }
  await supabase
    .from("contacts")
    .update({ last_activity_at: occurred })
    .eq("id", contactId);
}

export async function getTimeline(
  contactId: string,
  limit = 100,
): Promise<Activity[]> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("activities")
    .select("*")
    .eq("contact_id", contactId)
    .order("occurred_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}
