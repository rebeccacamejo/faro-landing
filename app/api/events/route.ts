import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  let body: { event_name?: unknown; properties?: unknown; anonymous_id?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { event_name, properties, anonymous_id } = body;
  if (typeof event_name !== "string" || !event_name) {
    return NextResponse.json({ error: "event_name is required." }, { status: 422 });
  }

  try {
    const db = getSupabase();
    await db.from("faro_events").insert({
      event_name,
      properties: typeof properties === "object" && properties !== null ? properties : {},
      anonymous_id: typeof anonymous_id === "string" ? anonymous_id : null,
    });
  } catch (err) {
    console.error("[events] insert error:", err);
    // Don't fail the client — analytics is best-effort
  }

  return NextResponse.json({ ok: true });
}
