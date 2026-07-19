import "server-only";
import { createServiceClient } from "@/lib/db/supabase/server";
import { logActivity } from "./activities";
import type { Note } from "./types";

/**
 * Freeform admin notes on a contact. Unlike timeline activities these are
 * editable and deletable. Creating a note also drops a `note_added` marker on the
 * timeline so the history stays complete.
 */

export async function listNotes(contactId: string): Promise<Note[]> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("notes")
    .select("*")
    .eq("contact_id", contactId)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function addNote(contactId: string, body: string): Promise<Note | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("notes")
    .insert({ contact_id: contactId, body })
    .select("*")
    .single();
  if (error) {
    console.error("[crm] addNote failed:", error.message);
    return null;
  }
  await logActivity(contactId, {
    type: "note_added",
    title: "Note added",
    data: { preview: body.slice(0, 140) },
  });
  return data;
}

export async function updateNote(id: string, body: string): Promise<void> {
  const supabase = createServiceClient();
  await supabase
    .from("notes")
    .update({ body, updated_at: new Date().toISOString() })
    .eq("id", id);
}

export async function deleteNote(id: string): Promise<void> {
  const supabase = createServiceClient();
  await supabase.from("notes").delete().eq("id", id);
}
