import { notFound } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import AdminTable from "./AdminTable";

export const dynamic = "force-dynamic";

interface Signup {
  id: string;
  email: string;
  business_name: string | null;
  audience: string;
  referral_code: string;
  referred_by_code: string | null;
  referral_count: number;
  created_at: string;
  locale: string;
}

export default async function AdminWaitlistPage({
  searchParams,
}: {
  searchParams: { key?: string };
}) {
  if (searchParams.key !== process.env.ADMIN_SECRET) {
    notFound();
  }

  let signups: Signup[] = [];
  let fetchError = "";

  try {
    const db = getSupabase();
    const { data, error } = await db
      .from("waitlist_signups")
      .select(
        "id, email, business_name, audience, referral_code, referred_by_code, referral_count, created_at, locale",
      )
      .order("referral_count", { ascending: false })
      .order("created_at", { ascending: true });

    if (error) throw error;
    signups = (data ?? []) as Signup[];
  } catch (err) {
    fetchError = err instanceof Error ? err.message : "Unknown error";
  }

  const date = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div style={{ padding: "40px 32px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ marginBottom: "32px", display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 600, color: "#1A2B4A", margin: "0 0 4px" }}>
            Faro Waitlist
          </h1>
          <p style={{ fontSize: "14px", color: "#888", margin: 0 }}>
            {signups.length} signup{signups.length !== 1 ? "s" : ""} · {date}
          </p>
        </div>
        <AdminTable signups={signups} downloadOnly />
      </div>

      {fetchError ? (
        <div style={{ padding: "16px", background: "#fee", border: "1px solid #fcc", borderRadius: "8px", color: "#c00" }}>
          Error: {fetchError}
        </div>
      ) : signups.length === 0 ? (
        <p style={{ color: "#888" }}>No signups yet.</p>
      ) : (
        <AdminTable signups={signups} />
      )}
    </div>
  );
}
