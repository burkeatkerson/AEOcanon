"use server";

import { requireAdmin } from "@/lib/admin/guard";
import { createServiceClient } from "@/lib/db/supabase/server";
import { enrollByCampaignKey } from "@/lib/automation/enroll";
import { runTick, type TickSummary } from "@/lib/automation/tick";
import { addSuppression, removeSuppression } from "@/lib/mailer/suppressions";
import type { CampaignStatus, ContactStage } from "./enums";
import { updateContactStage } from "./contacts";
import { ingestLead } from "./ingest";
import { addNote, deleteNote, updateNote } from "./notes";
import { addTag, removeTag } from "./tags";
import { addToSegment, removeFromSegment } from "./segments";

/**
 * Dashboard mutations. Every export re-verifies the admin session with
 * `requireAdmin()` — the request proxy is only the first gate, and a server
 * action is a POST to its own route that a proxy matcher could miss. These wrap
 * the domain helpers so the (future) front-end has one import surface.
 */

export async function setContactStage(contactId: string, stage: ContactStage) {
  await requireAdmin();
  await updateContactStage(contactId, stage);
}

export async function tagContact(contactId: string, name: string) {
  await requireAdmin();
  await addTag(contactId, name);
}

export async function untagContact(contactId: string, name: string) {
  await requireAdmin();
  await removeTag(contactId, name);
}

export async function createNote(contactId: string, body: string) {
  await requireAdmin();
  return addNote(contactId, body);
}

export async function editNote(id: string, body: string) {
  await requireAdmin();
  await updateNote(id, body);
}

export async function removeNote(id: string) {
  await requireAdmin();
  await deleteNote(id);
}

export async function addContactToSegment(segmentId: string, contactId: string) {
  await requireAdmin();
  await addToSegment(segmentId, contactId);
}

export async function removeContactFromSegment(segmentId: string, contactId: string) {
  await requireAdmin();
  await removeFromSegment(segmentId, contactId);
}

export async function suppressEmail(email: string) {
  await requireAdmin();
  await addSuppression(email, "manual", "admin");
}

export async function unsuppressEmail(email: string) {
  await requireAdmin();
  await removeSuppression(email);
}

export async function enrollContact(contactId: string, campaignKey: string) {
  await requireAdmin();
  return enrollByCampaignKey(contactId, campaignKey);
}

export async function setCampaignStatus(campaignId: string, status: CampaignStatus) {
  await requireAdmin();
  const supabase = createServiceClient();
  await supabase
    .from("campaigns")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", campaignId);
}

/** Schedule a broadcast campaign to go out at a given ISO timestamp. */
export async function scheduleBroadcast(campaignId: string, scheduledAtIso: string) {
  await requireAdmin();
  const supabase = createServiceClient();
  await supabase
    .from("campaigns")
    .update({
      status: "active",
      scheduled_at: scheduledAtIso,
      sent_at: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", campaignId);
}

/** Manually add a contact from the dashboard (source = manual). */
export async function createContact(input: {
  email: string;
  name?: string;
  businessName?: string;
  website?: string;
  location?: string;
  tags?: string[];
}) {
  await requireAdmin();
  return ingestLead({
    ...input,
    source: "manual",
    activity: { type: "form_submitted", title: "Added manually in the dashboard" },
  });
}

/** Fire the automation engine on demand (e.g. a "Run now" dashboard button). */
export async function runAutomationNow(): Promise<TickSummary> {
  await requireAdmin();
  return runTick();
}
