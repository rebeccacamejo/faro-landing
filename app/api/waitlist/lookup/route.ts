import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

const PILOT_SLOTS = 10;

export async function POST(req: NextRequest) {
  let body: { email?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { email } = body;
  if (
    typeof email !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  ) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 422 });
  }

  const db = getSupabase();
  const { data, error } = await db
    .from("waitlist_signups")
    .select("email, business_name, referral_code, referral_count, created_at")
    .eq("email", email.trim().toLowerCase())
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json({ error: "Email not found on the waitlist." }, { status: 404 });
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
