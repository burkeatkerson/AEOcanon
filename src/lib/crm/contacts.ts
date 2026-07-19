import "server-only";
import { createServiceClient } from "@/lib/db/supabase/server";
import type { Database, Json } from "@/lib/db/types";

type ContactUpdate = Database["public"]["Tables"]["contacts"]["Update"];
import type { ContactStage } from "./enums";
import { logActivity } from "./activities";
import { resolveSegmentContactIds } from "./segments";
import type { Contact, ContactListFilters } from "./types";

/**
 * Contact read/write helpers over the service-role client. Callers are assumed
 * already authorized (admin session or a trusted server capture path) — these
 * functions do not re-check auth. Emails are always normalized to lowercase so
 * the `lower(email)` unique index is the single source of identity.
 */

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** Fields that may be set/updated on a contact when capturing a lead. */
export interface ContactUpsert {
  email: string;
  name?: string | null;
  business_name?: string | null;
  business_type?: string | null;
  website?: string | null;
  location?: string | null;
  source?: Contact["source"];
  metadata?: Record<string, unknown>;
}

/**
 * Insert a contact or enrich the existing one. On conflict we never clobber a
 * populated field with null/empty — a later touch only fills gaps and refreshes
 * `last_activity_at`. Metadata is shallow-merged. Returns the stored row.
 */
export async function upsertContact(input: ContactUpsert): Promise<Contact | null> {
  const supabase = createServiceClient();
  const email = normalizeEmail(input.email);

  const { data: existing } = await supabase
    .from("contacts")
    .select("*")
    .eq("email", email)
    .maybeSingle();

  const now = new Date().toISOString();

  if (existing) {
    const patch: Record<string, unknown> = {
      last_activity_at: now,
      updated_at: now,
    };
    // Only fill gaps; don't overwrite existing values with new blanks.
    const fillable: (keyof ContactUpsert)[] = [
      "name",
      "business_name",
      "business_type",
      "website",
      "location",
    ];
    for (const key of fillable) {
      const value = input[key];
      if (value && !existing[key as keyof Contact]) patch[key] = value;
    }
    if (input.metadata) {
      patch.metadata = {
        ...((existing.metadata as Record<string, unknown>) ?? {}),
        ...input.metadata,
      } as Json;
    }
    const { data, error } = await supabase
      .from("contacts")
      .update(patch as ContactUpdate)
      .eq("id", existing.id)
      .select("*")
      .single();
    if (error) {
      console.error("[crm] contact update failed:", error.message);
      return existing;
    }
    return data;
  }

  const { data, error } = await supabase
    .from("contacts")
    .insert({
      email,
      name: input.name ?? null,
      business_name: input.business_name ?? null,
      business_type: input.business_type ?? null,
      website: input.website ?? null,
      location: input.location ?? null,
      source: input.source ?? "manual",
      metadata: (input.metadata as Json) ?? {},
      first_seen_at: now,
      last_activity_at: now,
    })
    .select("*")
    .single();

  if (error) {
    // Likely a race: another request inserted the same email. Re-select.
    const { data: raced } = await supabase
      .from("contacts")
      .select("*")
      .eq("email", email)
      .maybeSingle();
    if (raced) return raced;
    console.error("[crm] contact insert failed:", error.message);
    return null;
  }
  return data;
}

export async function getContact(id: string): Promise<Contact | null> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("contacts")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return data;
}

export async function getContactByEmail(email: string): Promise<Contact | null> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("contacts")
    .select("*")
    .eq("email", normalizeEmail(email))
    .maybeSingle();
  return data;
}

export interface ContactListResult {
  contacts: Contact[];
  total: number;
}

/**
 * Paginated, filterable contact list for the dashboard. Tag/segment filters are
 * resolved to an id set first, then applied — keeping the main query simple and
 * the joins explicit.
 */
export async function listContacts(
  filters: ContactListFilters = {},
): Promise<ContactListResult> {
  const supabase = createServiceClient();
  const limit = Math.min(filters.limit ?? 50, 200);
  const offset = filters.offset ?? 0;

  // Constrain to an id set when filtering by tag or segment.
  let idConstraint: string[] | null = null;
  if (filters.tag) {
    const { data: tag } = await supabase
      .from("tags")
      .select("id")
      .eq("name", filters.tag.trim())
      .maybeSingle();
    const ids = tag
      ? (
          await supabase
            .from("contact_tags")
            .select("contact_id")
            .eq("tag_id", tag.id)
        ).data?.map((r) => r.contact_id) ?? []
      : [];
    idConstraint = intersect(idConstraint, ids);
  }
  if (filters.segmentId) {
    const ids = await resolveSegmentContactIds(filters.segmentId);
    idConstraint = intersect(idConstraint, ids);
  }
  if (idConstraint && idConstraint.length === 0) {
    return { contacts: [], total: 0 };
  }

  let query = supabase
    .from("contacts")
    .select("*", { count: "exact" })
    .order("last_activity_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (filters.stage) query = query.eq("stage", filters.stage);
  if (filters.source) query = query.eq("source", filters.source);
  if (idConstraint) query = query.in("id", idConstraint);
  if (filters.search) {
    const term = `%${filters.search.trim()}%`;
    query = query.or(
      `email.ilike.${term},name.ilike.${term},business_name.ilike.${term}`,
    );
  }

  const { data, count, error } = await query;
  if (error) {
    console.error("[crm] listContacts failed:", error.message);
    return { contacts: [], total: 0 };
  }
  return { contacts: data ?? [], total: count ?? 0 };
}

function intersect(a: string[] | null, b: string[]): string[] {
  if (a === null) return b;
  const set = new Set(b);
  return a.filter((id) => set.has(id));
}

/** Move a contact along the funnel and record the change on the timeline. */
export async function updateContactStage(
  contactId: string,
  stage: ContactStage,
): Promise<void> {
  const supabase = createServiceClient();
  const { data: before } = await supabase
    .from("contacts")
    .select("stage")
    .eq("id", contactId)
    .maybeSingle();
  if (before?.stage === stage) return;

  await supabase
    .from("contacts")
    .update({ stage, updated_at: new Date().toISOString() })
    .eq("id", contactId);
  await logActivity(contactId, {
    type: "stage_changed",
    title: `Stage changed to ${stage}`,
    data: { from: before?.stage ?? null, to: stage },
  });
}

/** Refresh a contact's last-activity timestamp (called after any touch). */
export async function touchContact(contactId: string): Promise<void> {
  const supabase = createServiceClient();
  await supabase
    .from("contacts")
    .update({ last_activity_at: new Date().toISOString() })
    .eq("id", contactId);
}
