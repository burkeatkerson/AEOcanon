import { createServiceClient } from "@/lib/db/supabase/server";

/**
 * Minimal admin dashboard: live counts pulled straight from the CRM tables so
 * the whole backend is visibly wired. This is a placeholder — the real console
 * (contact tables, campaign controls, segment builder, timeline) is the
 * front-end phase. Kept dynamic so counts are always current.
 */
export const dynamic = "force-dynamic";

async function counts() {
  const supabase = createServiceClient();
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [contacts, activeEnrollments, sends7d, activeCampaigns, suppressions] =
    await Promise.all([
      supabase.from("contacts").select("*", { count: "exact", head: true }),
      supabase
        .from("enrollments")
        .select("*", { count: "exact", head: true })
        .eq("status", "active"),
      supabase
        .from("email_sends")
        .select("*", { count: "exact", head: true })
        .gte("created_at", sevenDaysAgo),
      supabase
        .from("campaigns")
        .select("*", { count: "exact", head: true })
        .eq("status", "active"),
      supabase.from("suppressions").select("*", { count: "exact", head: true }),
    ]);

  return {
    contacts: contacts.count ?? 0,
    activeEnrollments: activeEnrollments.count ?? 0,
    sends7d: sends7d.count ?? 0,
    activeCampaigns: activeCampaigns.count ?? 0,
    suppressions: suppressions.count ?? 0,
  };
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div
      style={{
        border: "1px solid #eee",
        borderRadius: 10,
        padding: "16px 18px",
        minWidth: 150,
      }}
    >
      <div style={{ fontSize: 28, fontWeight: 700 }}>{value}</div>
      <div style={{ fontSize: 13, color: "#666" }}>{label}</div>
    </div>
  );
}

export default async function AdminDashboard() {
  let stats;
  try {
    stats = await counts();
  } catch {
    return (
      <div>
        <h1 style={{ fontSize: 20 }}>Dashboard</h1>
        <p style={{ color: "#b91c1c", fontSize: 14 }}>
          Couldn&rsquo;t reach the database. Confirm Supabase env vars are set and
          migrations 0004/0005 are applied.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ fontSize: 20, marginBottom: 16 }}>Dashboard</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
        <Stat label="Contacts" value={stats.contacts} />
        <Stat label="Active enrollments" value={stats.activeEnrollments} />
        <Stat label="Emails (7 days)" value={stats.sends7d} />
        <Stat label="Active campaigns" value={stats.activeCampaigns} />
        <Stat label="Suppressions" value={stats.suppressions} />
      </div>
      <p style={{ color: "#888", fontSize: 13, marginTop: 24, lineHeight: 1.6 }}>
        Backend is wired. The full CRM console — contacts, segments, campaigns,
        timeline — ships in the front-end phase. See <code>ADMIN_CRM.md</code>.
      </p>
    </div>
  );
}
