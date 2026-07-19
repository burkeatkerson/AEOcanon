/**
 * The CRM's closed value sets, kept in one dependency-free module so the typed
 * Supabase client (src/lib/db/types.ts), the zod contracts (src/lib/crm/types.ts),
 * and the automation engine all share exactly one source of truth — a value can
 * never drift between the database enum, the validator, and the UI. Each `*_VALUES`
 * array mirrors the corresponding Postgres enum in supabase/migrations/0004_crm.sql;
 * the union type is derived from it.
 */

export const CONTACT_SOURCE_VALUES = [
  "scorecard",
  "contact_form",
  "audit",
  "manual",
  "import",
] as const;
export type ContactSource = (typeof CONTACT_SOURCE_VALUES)[number];

export const CONTACT_STAGE_VALUES = [
  "new",
  "engaged",
  "qualified",
  "customer",
  "unqualified",
] as const;
export type ContactStage = (typeof CONTACT_STAGE_VALUES)[number];

export const SEGMENT_KIND_VALUES = ["static", "dynamic"] as const;
export type SegmentKind = (typeof SEGMENT_KIND_VALUES)[number];

export const ACTIVITY_TYPE_VALUES = [
  "form_submitted",
  "scorecard_completed",
  "note_added",
  "stage_changed",
  "tag_added",
  "tag_removed",
  "enrolled",
  "unenrolled",
  "email_sent",
  "email_delivered",
  "email_opened",
  "email_clicked",
  "email_bounced",
  "email_complained",
  "unsubscribed",
  "booked_call",
] as const;
export type ActivityType = (typeof ACTIVITY_TYPE_VALUES)[number];

export const CAMPAIGN_TYPE_VALUES = ["drip", "broadcast"] as const;
export type CampaignType = (typeof CAMPAIGN_TYPE_VALUES)[number];

export const CAMPAIGN_STATUS_VALUES = [
  "draft",
  "active",
  "paused",
  "archived",
] as const;
export type CampaignStatus = (typeof CAMPAIGN_STATUS_VALUES)[number];

export const ENROLLMENT_STATUS_VALUES = [
  "active",
  "completed",
  "paused",
  "canceled",
  "unsubscribed",
] as const;
export type EnrollmentStatus = (typeof ENROLLMENT_STATUS_VALUES)[number];

export const EMAIL_SEND_STATUS_VALUES = [
  "queued",
  "sent",
  "delivered",
  "opened",
  "clicked",
  "bounced",
  "complained",
  "failed",
  "suppressed",
] as const;
export type EmailSendStatus = (typeof EMAIL_SEND_STATUS_VALUES)[number];

export const SUPPRESSION_REASON_VALUES = [
  "unsubscribe",
  "bounce",
  "complaint",
  "manual",
] as const;
export type SuppressionReason = (typeof SUPPRESSION_REASON_VALUES)[number];
