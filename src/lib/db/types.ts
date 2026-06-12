/**
 * Hand-written `Database` type matching supabase/migrations/*.sql. Once a real
 * Supabase project exists, regenerate from the live schema:
 *   npm run db:types         (see package.json — set your project id first)
 * Until then this keeps the typed client honest against the migrations. The
 * scorecard enum types are reused from the app's scorecard contract so the
 * typed client and the scoring logic can never drift.
 */
import type { Branch, Segment, Tier } from "@/lib/scorecard/types";

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
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      scorecard_tier: ScorecardTier;
      playbook_segment: PlaybookSegment;
      scorecard_branch: ScorecardBranch;
    };
    CompositeTypes: Record<string, never>;
  };
}
