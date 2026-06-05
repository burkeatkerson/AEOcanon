/**
 * Hand-written `Database` type matching supabase/migrations/0001_init.sql.
 * Once a real Supabase project exists, regenerate from the live schema:
 *   npm run db:types         (see package.json — set your project id first)
 * Until then this keeps the typed client honest against the migration.
 */
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
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
