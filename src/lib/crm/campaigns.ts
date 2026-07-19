import "server-only";
import { createServiceClient } from "@/lib/db/supabase/server";
import type { Campaign, CampaignStep } from "./types";

/** Campaign + step lookups shared by the dashboard and the automation engine. */

export async function listCampaigns(): Promise<Campaign[]> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("campaigns")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getCampaign(id: string): Promise<Campaign | null> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("campaigns")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return data;
}

export async function getCampaignByKey(key: string): Promise<Campaign | null> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("campaigns")
    .select("*")
    .eq("key", key)
    .maybeSingle();
  return data;
}

/** Steps for a campaign, ordered. */
export async function getSteps(campaignId: string): Promise<CampaignStep[]> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("campaign_steps")
    .select("*")
    .eq("campaign_id", campaignId)
    .order("step_order", { ascending: true });
  return data ?? [];
}
