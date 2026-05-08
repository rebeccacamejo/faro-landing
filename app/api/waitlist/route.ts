import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { appendFileSync } from "fs";
import { join } from "path";

// Lazy-initialize so missing key only errors at request time, not build time.
let _resend: Resend | null = null;
function getResend(): Resend {
  if (!_resend) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not set");
    }
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

const FROM = process.env.RESEND_FROM_EMAIL ?? "Faro <onboarding@resend.dev>";
const NOTIFY_TO = process.env.NOTIFY_EMAIL ?? "rcamejo04@gmail.com";

// ── Rate limiter ────────────────────────────────────────────────────────────
// Simple in-memory map: ip → list of submission timestamps.
// Max 3 submissions per IP per hour. Swap for Upstash Redis in production.
const rateMap = new Map<string, number[]>();
const RATE_LIMIT = 3;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const hits = (rateMap.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (hits.length >= RATE_LIMIT) return true;
  rateMap.set(ip, [...hits, now]);
  return false;
}

// ── Email helpers ────────────────────────────────────────────────────────────
function notificationHtml(
  email: string,
  business: string | undefined,
  audience: string,
  timestamp: string,
  ip: string,
): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="font-family:Arial,sans-serif;background:#f4f4f4;padding:32px;">
  <div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:8px;padding:32px;">
    <h2 style="margin:0 0 20px;color:#1A2B4A;font-size:20px;">New Faro waitlist signup</h2>
    <table style="width:100%;border-collapse:collapse;font-size:15px;color:#2A2A28;">
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:600;width:140px;">Email</td>
        <td style="padding:8px 0;border-bottom:1px solid #eee;">${email}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:600;">Business</td>
        <td style="padding:8px 0;border-bottom:1px solid #eee;">${business ?? "—"}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:600;">Audience</td>
        <td style="padding:8px 0;border-bottom:1px solid #eee;">${audience === "advisor" ? "CPA / Advisor" : "Business owner"}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:600;">Timestamp</td>
        <td style="padding:8px 0;border-bottom:1px solid #eee;">${timestamp}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;font-weight:600;">Source IP</td>
        <td style="padding:8px 0;">${ip}</td>
      </tr>
    </table>
  </div>
</body>
</html>`;
}

function confirmationHtml(email: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="font-family:Arial,sans-serif;background:#F8F4ED;padding:48px 24px;">
  <div style="max-width:520px;margin:0 auto;">
    <h1 style="font-family:Georgia,serif;font-size:36px;font-weight:400;color:#1A2B4A;margin:0 0 24px;line-height:1.2;">
      Thanks for joining.
    </h1>
    <p style="font-family:Arial,sans-serif;font-size:17px;line-height:1.7;color:#2A2A28;margin:0 0 16px;">
      We got your spot. We&rsquo;re onboarding our first ten Miami pilot clients
      and we&rsquo;ll be reaching out within a week to walk you through how Faro
      works and get your business set up.
    </p>
    <p style="font-family:Arial,sans-serif;font-size:17px;line-height:1.7;color:#2A2A28;margin:0 0 16px;">
      In the meantime, if you have questions, just reply to this email.
      We read every one.
    </p>
    <p style="font-family:Arial,sans-serif;font-size:17px;line-height:1.7;color:#2A2A28;margin:0 0 32px;">
      &mdash; Rebecca, Faro
    </p>
    <hr style="border:none;border-top:1px solid #EFE9DD;margin:0 0 24px;" />
    <p style="font-family:Arial,sans-serif;font-size:13px;color:#2A2A28;opacity:0.5;margin:0;">
      Faro &middot; Miami, FL &middot; You signed up at heyfaro.com with ${email}
    </p>
  </div>
</body>
</html>`;
}

// ── Route handler ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // IP for rate limiting — works behind Vercel's proxy headers too
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  let body: { email?: unknown; business?: unknown; audience?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { email, business, audience } = body;

  // Server-side email validation
  if (
    typeof email !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  ) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 422 },
    );
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanBusiness =
    typeof business === "string" && business.trim() ? business.trim() : undefined;
  const cleanAudience =
    audience === "advisor" ? "advisor" : "business";

  const timestamp = new Date().toISOString();

  // ── Local backup (fire-and-forget; don't block the response) ───────────────
  try {
    const entry = JSON.stringify({
      email: cleanEmail,
      business: cleanBusiness,
      audience: cleanAudience,
      timestamp,
      ip,
    });
    appendFileSync(join(process.cwd(), "waitlist-backup.jsonl"), entry + "\n", "utf8");
  } catch (err) {
    // Non-fatal — log and continue
    console.error("[waitlist] backup write failed:", err);
  }

  // ── Send emails via Resend ─────────────────────────────────────────────────
  try {
    const resend = getResend();
    await Promise.all([
      resend.emails.send({
        from: FROM,
        to: NOTIFY_TO,
        subject: `New Faro waitlist signup: ${cleanEmail}`,
        html: notificationHtml(cleanEmail, cleanBusiness, cleanAudience, timestamp, ip),
      }),
      resend.emails.send({
        from: FROM,
        to: cleanEmail,
        subject: "You're on the Faro waitlist",
        html: confirmationHtml(cleanEmail),
      }),
    ]);
  } catch (err) {
    console.error("[waitlist] resend error:", err);
    return NextResponse.json(
      { error: "We couldn't save your signup. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
