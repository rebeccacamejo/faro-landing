import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

const PILOT_SLOTS = 10;

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.json({ error: "Missing code parameter." }, { status: 400 });
  }

  const db = getSupabase();
  const { data, error } = await db
    .from("waitlist_signups")
    .select("email, business_name, referral_code, referral_count, created_at")
    .eq("referral_code", code.toLowerCase())
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json({ error: "Referral code not found." }, { status: 404 });
  }

  const [positionResult, totalResult] = await Promise.all([
    db.rpc("get_waitlist_position", {
      p_referral_count: data.referral_count,
      p_created_at: data.created_at,
    }),
    db.from("waitlist_signups").select("*", { count: "exact", head: true }),
  ]);

  const position = (positionResult.data as number) ?? 1;
  const total_signups = totalResult.count ?? 1;
  const pilot_slots_remaining = Math.max(0, PILOT_SLOTS);

  return NextResponse.json({
    email: data.email,
    business: data.business_name,
    referral_code: data.referral_code,
    referral_count: data.referral_count,
    position,
    total_signups,
    pilot_slots_remaining,
  });
}
