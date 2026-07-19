/**
 * Hand-written `Database` type matching supabase/migrations/*.sql. Once a real
 * Supabase project exists, regenerate from the live schema:
 *   npm run db:types         (see package.json — set your project id first)
 * Until then this keeps the typed client honest against the migrations. The
 * scorecard enum types are reused from the app's scorecard contract so the
 * typed client and the scoring logic can never drift.
 */
import type { Branch, Segment, Tier } from "@/lib/scorecard/types";
import type {
  ActivityType,
  CampaignStatus,
  CampaignType,
  ContactSource,
  ContactStage,
  EmailSendStatus,
  EnrollmentStatus,
  SegmentKind,
  SuppressionReason,
} from "@/lib/crm/enums";

type ScorecardTier = Tier;
type PlaybookSegment = Segment;
type ScorecardBranch = Branch;

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      audits: {
        Row: {
          id: string;
          url: string;
          normalized_url: string;
          scores: Json | null;
          report: Json | null;
          platform: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          url: string;
          normalized_url: string;
          scores?: Json | null;
          report?: Json | null;
          platform?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          url?: string;
          normalized_url?: string;
          scores?: Json | null;
          report?: Json | null;
          platform?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      leads: {
        Row: {
          id: string;
          email: string;
          site_url: string | null;
          audit_id: string | null;
          intent: string | null;
          details: Json | null;
          booked: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          site_url?: string | null;
          audit_id?: string | null;
          intent?: string | null;
          details?: Json | null;
          booked?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          site_url?: string | null;
          audit_id?: string | null;
          intent?: string | null;
          details?: Json | null;
          booked?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "leads_audit_id_fkey";
            columns: ["audit_id"];
            referencedRelation: "audits";
            referencedColumns: ["id"];
          },
        ];
      };
      scorecard_submissions: {
        Row: {
          id: string;
          email: string;
          business_type: string | null;
          business_name: string | null;
          location: string | null;
          website: string | null;
          branch: ScorecardBranch;
          answers: Json;
          pillar_scores: Json | null;
          total_score: number | null;
          percent: number | null;
          tier: ScorecardTier | null;
          segment: PlaybookSegment;
          site_read: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          business_type?: string | null;
          business_name?: string | null;
          location?: string | null;
          website?: string | null;
          branch: ScorecardBranch;
          answers: Json;
          pillar_scores?: Json | null;
          total_score?: number | null;
          percent?: number | null;
          tier?: ScorecardTier | null;
          segment: PlaybookSegment;
          site_read?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          business_type?: string | null;
          business_name?: string | null;
          location?: string | null;
          website?: string | null;
          branch?: ScorecardBranch;
          answers?: Json;
          pillar_scores?: Json | null;
          total_score?: number | null;
          percent?: number | null;
          tier?: ScorecardTier | null;
          segment?: PlaybookSegment;
          site_read?: Json | null;
          created_at?: string;
        };
        Relationships: [];
      };
      contacts: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          business_name: string | null;
          business_type: string | null;
          website: string | null;
          location: string | null;
          source: ContactSource;
          stage: ContactStage;
          unsubscribed_all: boolean;
          metadata: Json;
          first_seen_at: string;
          last_activity_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string | null;
          business_name?: string | null;
          business_type?: string | null;
          website?: string | null;
          location?: string | null;
          source?: ContactSource;
          stage?: ContactStage;
          unsubscribed_all?: boolean;
          metadata?: Json;
          first_seen_at?: string;
          last_activity_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          business_name?: string | null;
          business_type?: string | null;
          website?: string | null;
          location?: string | null;
          source?: ContactSource;
          stage?: ContactStage;
          unsubscribed_all?: boolean;
          metadata?: Json;
          first_seen_at?: string;
          last_activity_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      tags: {
        Row: { id: string; name: string; color: string | null; created_at: string };
        Insert: { id?: string; name: string; color?: string | null; created_at?: string };
        Update: { id?: string; name?: string; color?: string | null; created_at?: string };
        Relationships: [];
      };
      contact_tags: {
        Row: { contact_id: string; tag_id: string; created_at: string };
        Insert: { contact_id: string; tag_id: string; created_at?: string };
        Update: { contact_id?: string; tag_id?: string; created_at?: string };
        Relationships: [
          {
            foreignKeyName: "contact_tags_contact_id_fkey";
            columns: ["contact_id"];
            referencedRelation: "contacts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "contact_tags_tag_id_fkey";
            columns: ["tag_id"];
            referencedRelation: "tags";
            referencedColumns: ["id"];
          },
        ];
      };
      segments: {
        Row: {
          id: string;
          key: string;
          name: string;
          description: string | null;
          kind: SegmentKind;
          definition: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          name: string;
          description?: string | null;
          kind?: SegmentKind;
          definition?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          key?: string;
          name?: string;
          description?: string | null;
          kind?: SegmentKind;
          definition?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      segment_members: {
        Row: { segment_id: string; contact_id: string; created_at: string };
        Insert: { segment_id: string; contact_id: string; created_at?: string };
        Update: { segment_id?: string; contact_id?: string; created_at?: string };
        Relationships: [
          {
            foreignKeyName: "segment_members_segment_id_fkey";
            columns: ["segment_id"];
            referencedRelation: "segments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "segment_members_contact_id_fkey";
            columns: ["contact_id"];
            referencedRelation: "contacts";
            referencedColumns: ["id"];
          },
        ];
      };
      activities: {
        Row: {
          id: string;
          contact_id: string;
          type: ActivityType;
          title: string;
          data: Json;
          occurred_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          contact_id: string;
          type: ActivityType;
          title: string;
          data?: Json;
          occurred_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          contact_id?: string;
          type?: ActivityType;
          title?: string;
          data?: Json;
          occurred_at?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "activities_contact_id_fkey";
            columns: ["contact_id"];
            referencedRelation: "contacts";
            referencedColumns: ["id"];
          },
        ];
      };
      notes: {
        Row: {
          id: string;
          contact_id: string;
          body: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          contact_id: string;
          body: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          contact_id?: string;
          body?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "notes_contact_id_fkey";
            columns: ["contact_id"];
            referencedRelation: "contacts";
            referencedColumns: ["id"];
          },
        ];
      };
      email_templates: {
        Row: {
          id: string;
          key: string;
          name: string;
          subject: string;
          html: string;
          text: string | null;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          name: string;
          subject: string;
          html: string;
          text?: string | null;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          key?: string;
          name?: string;
          subject?: string;
          html?: string;
          text?: string | null;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      campaigns: {
        Row: {
          id: string;
          key: string;
          name: string;
          description: string | null;
          type: CampaignType;
          status: CampaignStatus;
          segment_id: string | null;
          from_name: string | null;
          from_email: string | null;
          reply_to: string | null;
          scheduled_at: string | null;
          sent_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          name: string;
          description?: string | null;
          type?: CampaignType;
          status?: CampaignStatus;
          segment_id?: string | null;
          from_name?: string | null;
          from_email?: string | null;
          reply_to?: string | null;
          scheduled_at?: string | null;
          sent_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          key?: string;
          name?: string;
          description?: string | null;
          type?: CampaignType;
          status?: CampaignStatus;
          segment_id?: string | null;
          from_name?: string | null;
          from_email?: string | null;
          reply_to?: string | null;
          scheduled_at?: string | null;
          sent_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "campaigns_segment_id_fkey";
            columns: ["segment_id"];
            referencedRelation: "segments";
            referencedColumns: ["id"];
          },
        ];
      };
      campaign_steps: {
        Row: {
          id: string;
          campaign_id: string;
          step_order: number;
          send_after_minutes: number;
          template_key: string | null;
          subject: string | null;
          html: string | null;
          text: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          campaign_id: string;
          step_order: number;
          send_after_minutes?: number;
          template_key?: string | null;
          subject?: string | null;
          html?: string | null;
          text?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          campaign_id?: string;
          step_order?: number;
          send_after_minutes?: number;
          template_key?: string | null;
          subject?: string | null;
          html?: string | null;
          text?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "campaign_steps_campaign_id_fkey";
            columns: ["campaign_id"];
            referencedRelation: "campaigns";
            referencedColumns: ["id"];
          },
        ];
      };
      enrollments: {
        Row: {
          id: string;
          campaign_id: string;
          contact_id: string;
          status: EnrollmentStatus;
          current_step: number;
          next_run_at: string | null;
          enrolled_at: string;
          completed_at: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          campaign_id: string;
          contact_id: string;
          status?: EnrollmentStatus;
          current_step?: number;
          next_run_at?: string | null;
          enrolled_at?: string;
          completed_at?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          campaign_id?: string;
          contact_id?: string;
          status?: EnrollmentStatus;
          current_step?: number;
          next_run_at?: string | null;
          enrolled_at?: string;
          completed_at?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "enrollments_campaign_id_fkey";
            columns: ["campaign_id"];
            referencedRelation: "campaigns";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "enrollments_contact_id_fkey";
            columns: ["contact_id"];
            referencedRelation: "contacts";
            referencedColumns: ["id"];
          },
        ];
      };
      email_sends: {
        Row: {
          id: string;
          contact_id: string | null;
          campaign_id: string | null;
          step_id: string | null;
          enrollment_id: string | null;
          template_key: string | null;
          to_email: string;
          subject: string;
          status: EmailSendStatus;
          provider_message_id: string | null;
          error: string | null;
          created_at: string;
          sent_at: string | null;
          delivered_at: string | null;
          opened_at: string | null;
          clicked_at: string | null;
        };
        Insert: {
          id?: string;
          contact_id?: string | null;
          campaign_id?: string | null;
          step_id?: string | null;
          enrollment_id?: string | null;
          template_key?: string | null;
          to_email: string;
          subject: string;
          status?: EmailSendStatus;
          provider_message_id?: string | null;
          error?: string | null;
          created_at?: string;
          sent_at?: string | null;
          delivered_at?: string | null;
          opened_at?: string | null;
          clicked_at?: string | null;
        };
        Update: {
          id?: string;
          contact_id?: string | null;
          campaign_id?: string | null;
          step_id?: string | null;
          enrollment_id?: string | null;
          template_key?: string | null;
          to_email?: string;
          subject?: string;
          status?: EmailSendStatus;
          provider_message_id?: string | null;
          error?: string | null;
          created_at?: string;
          sent_at?: string | null;
          delivered_at?: string | null;
          opened_at?: string | null;
          clicked_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "email_sends_contact_id_fkey";
            columns: ["contact_id"];
            referencedRelation: "contacts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "email_sends_campaign_id_fkey";
            columns: ["campaign_id"];
            referencedRelation: "campaigns";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "email_sends_enrollment_id_fkey";
            columns: ["enrollment_id"];
            referencedRelation: "enrollments";
            referencedColumns: ["id"];
          },
        ];
      };
      suppressions: {
        Row: {
          email: string;
          reason: SuppressionReason;
          source: string | null;
          created_at: string;
        };
        Insert: {
          email: string;
          reason: SuppressionReason;
          source?: string | null;
          created_at?: string;
        };
        Update: {
          email?: string;
          reason?: SuppressionReason;
          source?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      scorecard_tier: ScorecardTier;
      playbook_segment: PlaybookSegment;
      scorecard_branch: ScorecardBranch;
      contact_source: ContactSource;
      contact_stage: ContactStage;
      segment_kind: SegmentKind;
      activity_type: ActivityType;
      campaign_type: CampaignType;
      campaign_status: CampaignStatus;
      enrollment_status: EnrollmentStatus;
      email_send_status: EmailSendStatus;
      suppression_reason: SuppressionReason;
    };
    CompositeTypes: Record<string, never>;
  };
}
