/**
 * CRM row-type aliases (derived from the typed Supabase `Database`) and the zod
 * contracts for the mutations that accept external input. Keeping the row shapes
 * here means the rest of the CRM refers to `Contact`, `Activity`, … rather than
 * deep `Database["public"]["Tables"][...]` paths.
 */
import { z } from "zod";
import type { Database } from "@/lib/db/types";
import { CONTACT_SOURCE_VALUES, CONTACT_STAGE_VALUES } from "./enums";

type T = Database["public"]["Tables"];

export type Contact = T["contacts"]["Row"];
export type Tag = T["tags"]["Row"];
export type Segment = T["segments"]["Row"];
export type SegmentMember = T["segment_members"]["Row"];
export type Activity = T["activities"]["Row"];
export type Note = T["notes"]["Row"];
export type EmailTemplate = T["email_templates"]["Row"];
export type Campaign = T["campaigns"]["Row"];
export type CampaignStep = T["campaign_steps"]["Row"];
export type Enrollment = T["enrollments"]["Row"];
export type EmailSend = T["email_sends"]["Row"];
export type Suppression = T["suppressions"]["Row"];

/**
 * Input to `ingestLead()` — the one funnel entry point every capture path calls.
 * Only `email` and `source` are required; everything else enriches the contact.
 * `tags` are tag names (created on demand). `enrollCampaignKeys` force-enrolls
 * into specific drips in addition to whatever the funnel map (funnel.ts) decides.
 */
export const ingestLeadSchema = z.object({
  email: z.string().trim().email().max(200),
  name: z.string().trim().max(200).optional(),
  businessName: z.string().trim().max(200).optional(),
  businessType: z.string().trim().max(200).optional(),
  website: z.string().trim().max(300).optional(),
  location: z.string().trim().max(200).optional(),
  source: z.enum(CONTACT_SOURCE_VALUES),
  tags: z.array(z.string().trim().min(1).max(60)).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  activity: z
    .object({
      type: z.string(),
      title: z.string().max(300),
      data: z.record(z.string(), z.unknown()).optional(),
    })
    .optional(),
  enrollCampaignKeys: z.array(z.string()).optional(),
});

export type IngestLeadInput = z.input<typeof ingestLeadSchema>;

/** Filters accepted by `listContacts()`. */
export interface ContactListFilters {
  search?: string;
  stage?: (typeof CONTACT_STAGE_VALUES)[number];
  source?: (typeof CONTACT_SOURCE_VALUES)[number];
  tag?: string; // tag name
  segmentId?: string;
  limit?: number;
  offset?: number;
}
