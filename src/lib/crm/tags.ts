import "server-only";
import { createServiceClient } from "@/lib/db/supabase/server";
import { logActivity } from "./activities";
import type { Tag } from "./types";

/**
 * Tags — lightweight, free-form labels for organizing contacts (source markers,
 * interests, campaign membership). `ensureTag` is the idempotent get-or-create
 * used by the ingest path so a new label never fails a capture.
 */

export async function listTags(): Promise<Tag[]> {
  const supabase = createServiceClient();
  const { data } = await supabase.from("tags").select("*").order("name");
  return data ?? [];
}

/** Get a tag by name, creating it if absent. Returns its id. */
export async function ensureTag(name: string, color?: string): Promise<string | null> {
  const supabase = createServiceClient();
  const clean = name.trim();
  const { data: existing } = await supabase
    .from("tags")
    .select("id")
    .eq("name", clean)
    .maybeSingle();
  if (existing) return existing.id;

  const { data, error } = await supabase
    .from("tags")
    .insert({ name: clean, color: color ?? null })
    .select("id")
    .single();
  if (error) {
    // Race: re-select.
    const { data: raced } = await supabase
      .from("tags")
      .select("id")
      .eq("name", clean)
      .maybeSingle();
    return raced?.id ?? null;
  }
  return data.id;
}

/** Attach a tag (by name) to a contact. Idempotent; records the timeline event. */
export async function addTag(contactId: string, name: string): Promise<void> {
  const tagId = await ensureTag(name);
  if (!tagId) return;
  const supabase = createServiceClient();
  const { data: existing } = await supabase
    .from("contact_tags")
    .select("contact_id")
    .eq("contact_id", contactId)
    .eq("tag_id", tagId)
    .maybeSingle();
  if (existing) return;

  await supabase.from("contact_tags").insert({ contact_id: contactId, tag_id: tagId });
  await logActivity(contactId, {
    type: "tag_added",
    title: `Tagged "${name.trim()}"`,
    data: { tag: name.trim() },
  });
}

export async function removeTag(contactId: string, name: string): Promise<void> {
  const supabase = createServiceClient();
  const { data: tag } = await supabase
    .from("tags")
    .select("id")
    .eq("name", name.trim())
    .maybeSingle();
  if (!tag) return;
  await supabase
    .from("contact_tags")
    .delete()
    .eq("contact_id", contactId)
    .eq("tag_id", tag.id);
  await logActivity(contactId, {
    type: "tag_removed",
    title: `Removed tag "${name.trim()}"`,
    data: { tag: name.trim() },
  });
}

/** Tag names currently on a contact. */
export async function getContactTags(contactId: string): Promise<string[]> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("contact_tags")
    .select("tags(name)")
    .eq("contact_id", contactId);
  return (data ?? [])
    .map((r) => (r.tags as { name: string } | null)?.name)
    .filter((n): n is string => Boolean(n));
}
