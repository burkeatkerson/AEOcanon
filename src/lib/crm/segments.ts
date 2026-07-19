import "server-only";
import { createServiceClient } from "@/lib/db/supabase/server";
import type { Contact, Segment } from "./types";

/**
 * Segments group contacts for broadcasts and organization. Two kinds:
 *  - `static`  — explicit membership rows in `segment_members`.
 *  - `dynamic` — resolved at query time from a `definition` rule set.
 *
 * Dynamic rule shape (stored as jsonb):
 *   { "all": Rule[] }  // every rule must match (AND)
 *   { "any": Rule[] }  // at least one must match (OR)
 * where Rule = { field, op, value }:
 *   field: "source" | "stage" | "business_type" | "unsubscribed_all" | "tag"
 *   op:    "eq" | "neq" | "contains" (ilike, text fields) | "has" (tag only)
 *
 * The resolver evaluates each rule to a set of contact ids, then intersects
 * (all) or unions (any). Deliberately simple and read-only; it scales fine for a
 * single-operator CRM. Extend `idsForRule` to add fields/ops (see ADMIN_CRM.md).
 */

interface Rule {
  field: string;
  op: string;
  value: unknown;
}
interface Definition {
  all?: Rule[];
  any?: Rule[];
}

const COLUMN_FIELDS = new Set([
  "source",
  "stage",
  "business_type",
  "unsubscribed_all",
]);

export async function listSegments(): Promise<Segment[]> {
  const supabase = createServiceClient();
  const { data } = await supabase.from("segments").select("*").order("name");
  return data ?? [];
}

export async function getSegment(id: string): Promise<Segment | null> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("segments")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return data;
}

export async function getSegmentByKey(key: string): Promise<Segment | null> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("segments")
    .select("*")
    .eq("key", key)
    .maybeSingle();
  return data;
}

/** Contact ids matching a single rule. */
async function idsForRule(rule: Rule): Promise<string[]> {
  const supabase = createServiceClient();

  if (rule.field === "tag") {
    const { data: tag } = await supabase
      .from("tags")
      .select("id")
      .eq("name", String(rule.value).trim())
      .maybeSingle();
    if (!tag) return [];
    const { data } = await supabase
      .from("contact_tags")
      .select("contact_id")
      .eq("tag_id", tag.id);
    return (data ?? []).map((r) => r.contact_id);
  }

  if (!COLUMN_FIELDS.has(rule.field)) return [];
  let query = supabase.from("contacts").select("id");
  switch (rule.op) {
    case "neq":
      query = query.neq(rule.field, rule.value as never);
      break;
    case "contains":
      query = query.ilike(rule.field, `%${String(rule.value)}%`);
      break;
    case "eq":
    default:
      query = query.eq(rule.field, rule.value as never);
      break;
  }
  const { data } = await query;
  return (data ?? []).map((r) => r.id);
}

function intersect(sets: string[][]): string[] {
  if (sets.length === 0) return [];
  return sets.reduce((acc, set) => {
    const s = new Set(set);
    return acc.filter((id) => s.has(id));
  });
}

function union(sets: string[][]): string[] {
  return [...new Set(sets.flat())];
}

/**
 * Resolve a segment to the set of contact ids it currently contains. Static
 * segments read membership rows; dynamic segments evaluate their rules.
 */
export async function resolveSegmentContactIds(segmentId: string): Promise<string[]> {
  const segment = await getSegment(segmentId);
  if (!segment) return [];

  if (segment.kind === "static") {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("segment_members")
      .select("contact_id")
      .eq("segment_id", segmentId);
    return (data ?? []).map((r) => r.contact_id);
  }

  const def = (segment.definition ?? {}) as Definition;
  if (def.all?.length) {
    const sets = await Promise.all(def.all.map(idsForRule));
    return intersect(sets);
  }
  if (def.any?.length) {
    const sets = await Promise.all(def.any.map(idsForRule));
    return union(sets);
  }
  return [];
}

/** Resolve a segment to full contact rows (used for broadcasts). */
export async function resolveSegmentContacts(segmentId: string): Promise<Contact[]> {
  const ids = await resolveSegmentContactIds(segmentId);
  if (ids.length === 0) return [];
  const supabase = createServiceClient();
  const { data } = await supabase.from("contacts").select("*").in("id", ids);
  return data ?? [];
}

/** Add a contact to a static segment (no-op for dynamic ones). */
export async function addToSegment(
  segmentId: string,
  contactId: string,
): Promise<void> {
  const supabase = createServiceClient();
  await supabase
    .from("segment_members")
    .upsert(
      { segment_id: segmentId, contact_id: contactId },
      { onConflict: "segment_id,contact_id", ignoreDuplicates: true },
    );
}

export async function removeFromSegment(
  segmentId: string,
  contactId: string,
): Promise<void> {
  const supabase = createServiceClient();
  await supabase
    .from("segment_members")
    .delete()
    .eq("segment_id", segmentId)
    .eq("contact_id", contactId);
}
