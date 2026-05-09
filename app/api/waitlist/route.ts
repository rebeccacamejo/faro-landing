import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getSupabase } from "@/lib/supabase";

const FROM = process.env.RESEND_FROM_EMAIL ?? "Faro <onboarding@resend.dev>";
const NOTIFY_TO = process.env.NOTIFY_EMAIL ?? "rcamejo04@gmail.com";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://faro-jet.vercel.app";
const PILOT_SLOTS = 10;
// Chars that avoid 0/o/1/l confusion
const CODE_CHARS = "abcdefghijkmnpqrstuvwxyz23456789";

let _resend: Resend | null = null;
function getResend(): Resend {
  if (!_resend) {
    if (!process.env.RESEND_API_KEY) throw new Error("RESEND_API_KEY is not set");
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

async function generateReferralCode(): Promise<string> {
  const db = getSupabase();
  for (let i = 0; i < 10; i++) {
    const code = Array.from(
      { length: 6 },
      () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)],
    ).join("");
    const { data } = await db
      .from("waitlist_signups")
      .select("id")
      .eq("referral_code", code)
      .maybeSingle();
    if (!data) return code;
  }
  throw new Error("Failed to generate unique referral code after 10 attempts");
}

// ── Email templates ───────────────────────────────────────────────────────────

function notificationHtml(opts: {
  email: string;
  business: string | undefined;
  audience: string;
  locale: string;
  referredByEmail: string | null;
  position: number;
  total: number;
  ip: string;
}) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="font-family:Arial,sans-serif;background:#f4f4f4;padding:32px;">
  <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:8px;padding:32px;">
    <h2 style="margin:0 0 20px;color:#1A2B4A;font-size:20px;">New Faro waitlist signup</h2>
    <table style="width:100%;border-collapse:collapse;font-size:15px;color:#2A2A28;">
      <tr><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:600;width:140px;">Email</td><td style="padding:8px 0;border-bottom:1px solid #eee;">${opts.email}</td></tr>
      <tr><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:600;">Business</td><td style="padding:8px 0;border-bottom:1px solid #eee;">${opts.business ?? "—"}</td></tr>
      <tr><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:600;">Audience</td><td style="padding:8px 0;border-bottom:1px solid #eee;">${opts.audience === "advisor" ? "CPA / Advisor" : "Business owner"}</td></tr>
      <tr><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:600;">Locale</td><td style="padding:8px 0;border-bottom:1px solid #eee;">${opts.locale}</td></tr>
      <tr><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:600;">Position</td><td style="padding:8px 0;border-bottom:1px solid #eee;">#${opts.position} of ${opts.total}</td></tr>
      <tr><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:600;">Referred by</td><td style="padding:8px 0;border-bottom:1px solid #eee;">${opts.referredByEmail ?? "—"}</td></tr>
      <tr><td style="padding:8px 0;font-weight:600;">Source IP</td><td style="padding:8px 0;">${opts.ip}</td></tr>
    </table>
  </div>
</body>
</html>`;
}

function confirmationHtml(opts: {
  email: string;
  business: string | undefined;
  locale: string;
  referralLink: string;
  position: number;
  total: number;
  pilotSlots: number;
}) {
  const isEs = opts.locale === "es";
  const shareText = isEs
    ? `Me acabo de inscribir en Faro — ayudan a los negocios pequeños a ser recomendados por ChatGPT y otros agentes de IA. Hecho para Miami. Vale la pena: ${opts.referralLink}`
    : `I just signed up for Faro — they help small businesses get recommended by ChatGPT and other AI agents. Built for Miami. Worth a look: ${opts.referralLink}`;
  const subject = isEs ? "Conoce Faro" : "Check out Faro";

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
  const emailUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(shareText)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(opts.referralLink)}`;

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width" /></head>
<body style="font-family:Arial,sans-serif;background:#F8F4ED;margin:0;padding:48px 24px;">
  <div style="max-width:520px;margin:0 auto;">
    <h1 style="font-family:Georgia,serif;font-size:36px;font-weight:400;color:#1A2B4A;margin:0 0 24px;line-height:1.2;">
      ${isEs ? "Estás en la lista." : "You're on the list."}
    </h1>

    <div style="border:2px solid #C45A3D;border-radius:12px;padding:20px 24px;margin-bottom:28px;background:#ffffff;">
      <div style="font-family:Georgia,serif;font-size:32px;font-weight:400;color:#1A2B4A;margin:0 0 6px;">
        ${isEs ? `Eres el #${opts.position} de ${opts.total}.` : `You're #${opts.position} of ${opts.total}.`}
      </div>
      <div style="font-family:Arial,sans-serif;font-size:15px;color:#2A2A28;">
        ${isEs ? `Estamos incorporando a ${opts.pilotSlots} clientes piloto.` : `We're onboarding ${opts.pilotSlots} pilot clients.`}
      </div>
    </div>

    <div style="background:#EFE9DD;border-radius:8px;padding:24px;margin-bottom:28px;">
      <h2 style="font-family:Georgia,serif;font-size:22px;font-weight:400;color:#1A2B4A;margin:0 0 12px;">
        ${isEs ? "Sube en la lista." : "Move up the waitlist."}
      </h2>
      <p style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#2A2A28;margin:0 0 16px;">
        ${isEs
          ? "Elegimos nuestros primeros diez clientes piloto según el orden de inscripción — y cuántos otros negocios traigas contigo. Refiere a tres negocios para avanzar al frente."
          : "We pick our first ten pilot clients based on signup order — and how many other businesses you bring with you. Refer three businesses to jump to the front."}
      </p>

      <p style="font-family:Arial,sans-serif;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:#2A2A28;margin:0 0 8px;">
        ${isEs ? "Tu enlace de referido" : "Your referral link"}
      </p>
      <div style="background:#fff;border:1px solid #d4c9b8;border-radius:6px;padding:12px 16px;font-family:monospace;font-size:13px;color:#1A2B4A;word-break:break-all;margin-bottom:16px;">
        ${opts.referralLink}
      </div>

      <div>
        <a href="${whatsappUrl}" style="display:inline-block;background:#25D366;color:#ffffff;padding:10px 18px;border-radius:6px;text-decoration:none;font-family:Arial,sans-serif;font-size:14px;font-weight:600;margin:4px 6px 4px 0;">WhatsApp</a>
        <a href="${emailUrl}" style="display:inline-block;background:#1A2B4A;color:#ffffff;padding:10px 18px;border-radius:6px;text-decoration:none;font-family:Arial,sans-serif;font-size:14px;font-weight:600;margin:4px 6px 4px 0;">${isEs ? "Correo" : "Email"}</a>
        <a href="${linkedinUrl}" style="display:inline-block;background:#0077B5;color:#ffffff;padding:10px 18px;border-radius:6px;text-decoration:none;font-family:Arial,sans-serif;font-size:14px;font-weight:600;margin:4px 0;">LinkedIn</a>
      </div>
    </div>

    <p style="font-family:Arial,sans-serif;font-size:15px;line-height:1.7;color:#2A2A28;margin:0 0 32px;">
      ${isEs ? "Cualquier pregunta, responde este correo. Los leemos todos." : "Any questions, just reply to this email. We read every one."}
    </p>

    <hr style="border:none;border-top:1px solid #EFE9DD;margin:0 0 20px;" />
    <p style="font-family:Arial,sans-serif;font-size:13px;color:rgba(42,42,40,0.5);margin:0;">
      Faro &middot; Miami, FL &middot; ${isEs ? "Te inscribiste con" : "You signed up with"} ${opts.email}
    </p>
  </div>
</body>
</html>`;
}

function referralNotificationHtml(opts: {
  newSignupBusiness: string | undefined;
  referralCount: number;
  locale: string;
}) {
  const isEs = opts.locale === "es";
  const who = opts.newSignupBusiness
    ? (isEs ? opts.newSignupBusiness : opts.newSignupBusiness)
    : (isEs ? "Alguien" : "Someone");
  const unlockedMsg =
    opts.referralCount >= 3
      ? (isEs
          ? " Has desbloqueado la prioridad piloto. Nos pondremos en contacto pronto."
          : " You've unlocked pilot priority. We'll be in touch soon.")
      : "";

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="font-family:Arial,sans-serif;background:#F8F4ED;margin:0;padding:48px 24px;">
  <div style="max-width:520px;margin:0 auto;">
    <h1 style="font-family:Georgia,serif;font-size:32px;font-weight:400;color:#1A2B4A;margin:0 0 20px;">
      ${isEs ? "Alguien se unió gracias a ti." : "Someone joined because of you."}
    </h1>
    <p style="font-family:Arial,sans-serif;font-size:16px;line-height:1.7;color:#2A2A28;margin:0 0 16px;">
      ${isEs
        ? `${who} acaba de unirse a la lista de espera de Faro usando tu enlace. Ahora tienes ${opts.referralCount} de 3 referidos.${unlockedMsg}`
        : `${who} just joined the Faro waitlist using your link. You're now at ${opts.referralCount} of 3 referrals.${unlockedMsg}`}
    </p>
    <hr style="border:none;border-top:1px solid #EFE9DD;margin:24px 0;" />
    <p style="font-family:Arial,sans-serif;font-size:13px;color:rgba(42,42,40,0.5);margin:0;">
      Faro &middot; Miami, FL
    </p>
  </div>
</body>
</html>`;
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";
  const userAgent = req.headers.get("user-agent") ?? "";

  let body: {
    email?: unknown;
    business?: unknown;
    audience?: unknown;
    ref?: unknown;
    locale?: unknown;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { email, business, audience, ref, locale } = body;

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
  const cleanAudience = audience === "advisor" ? "advisor" : "owner";
  const cleanLocale = locale === "es" ? "es" : "en";
  const cleanRef =
    typeof ref === "string" && ref.trim() ? ref.trim().toLowerCase() : undefined;

  const db = getSupabase();

  // Rate limit: max 3 successful signups per IP per hour
  const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count: ipCount } = await db
    .from("waitlist_signups")
    .select("*", { count: "exact", head: true })
    .eq("ip_address", ip)
    .gte("created_at", hourAgo);

  if ((ipCount ?? 0) >= 3) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  // Validate referral code if provided
  let referredByCode: string | undefined;
  let referrerData: {
    email: string;
    business_name: string | null;
    locale: string;
    referral_count: number;
  } | null = null;

  if (cleanRef) {
    const { data } = await db
      .from("waitlist_signups")
      .select("email, business_name, locale, referral_count")
      .eq("referral_code", cleanRef)
      .maybeSingle();
    if (data) {
      referredByCode = cleanRef;
      referrerData = data;
    }
  }

  // Generate unique referral code
  let referralCode: string;
  try {
    referralCode = await generateReferralCode();
  } catch (err) {
    console.error("[waitlist] referral code error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }

  // Insert
  const { data: inserted, error: insertError } = await db
    .from("waitlist_signups")
    .insert({
      email: cleanEmail,
      business_name: cleanBusiness ?? null,
      audience: cleanAudience,
      referral_code: referralCode,
      referred_by_code: referredByCode ?? null,
      locale: cleanLocale,
      ip_address: ip,
      user_agent: userAgent,
    })
    .select("id, created_at, referral_count")
    .single();

  if (insertError) {
    if (insertError.code === "23505") {
      return NextResponse.json(
        { error: "That email is already on the waitlist." },
        { status: 409 },
      );
    }
    console.error("[waitlist] insert error:", insertError);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }

  // Increment referrer count atomically
  if (referredByCode) {
    await db.rpc("increment_referral_count", { referrer_code: referredByCode });
  }

  // Calculate position and total in parallel
  const [positionResult, totalResult] = await Promise.all([
    db.rpc("get_waitlist_position", {
      p_referral_count: 0,
      p_created_at: inserted.created_at,
    }),
    db.from("waitlist_signups").select("*", { count: "exact", head: true }),
  ]);

  const position = (positionResult.data as number) ?? 1;
  const totalSignups = totalResult.count ?? 1;
  // Update when a status column is added: max(0, PILOT_SLOTS - count(status='accepted'))
  const pilotSlotsRemaining = Math.max(0, PILOT_SLOTS);

  const referralLink = `${BASE_URL}/${cleanLocale}/refer/${referralCode}`;

  console.log(
    "[waitlist:signup]",
    JSON.stringify({
      email: cleanEmail,
      business: cleanBusiness,
      audience: cleanAudience,
      locale: cleanLocale,
      referred_by: referredByCode,
      referral_code: referralCode,
      position,
      ip,
    }),
  );

  // Send emails — failure doesn't fail the request (data already saved)
  const resend = getResend();
  const emailJobs = [
    resend.emails.send({
      from: FROM,
      to: NOTIFY_TO,
      subject: `New Faro waitlist signup: ${cleanEmail}`,
      html: notificationHtml({
        email: cleanEmail,
        business: cleanBusiness,
        audience: cleanAudience,
        locale: cleanLocale,
        referredByEmail: referrerData?.email ?? null,
        position,
        total: totalSignups,
        ip,
      }),
    }),
    resend.emails.send({
      from: FROM,
      to: cleanEmail,
      subject:
        cleanLocale === "es"
          ? "Estás en la lista de Faro — así puedes avanzar"
          : "You're on the Faro waitlist — here's how to move up",
      html: confirmationHtml({
        email: cleanEmail,
        business: cleanBusiness,
        locale: cleanLocale,
        referralLink,
        position,
        total: totalSignups,
        pilotSlots: pilotSlotsRemaining,
      }),
    }),
  ];

  if (referrerData && referredByCode) {
    emailJobs.push(
      resend.emails.send({
        from: FROM,
        to: referrerData.email,
        subject:
          referrerData.locale === "es"
            ? "Alguien se unió a Faro gracias a ti"
            : "Someone joined Faro because of you",
        html: referralNotificationHtml({
          newSignupBusiness: cleanBusiness,
          referralCount: referrerData.referral_count + 1,
          locale: referrerData.locale,
        }),
      }),
    );
  }

  Promise.all(emailJobs).catch((err) =>
    console.error("[waitlist] email error:", err),
  );

  return NextResponse.json({
    referral_code: referralCode,
    position,
    total_signups: totalSignups,
    referral_count: 0,
    pilot_slots_remaining: pilotSlotsRemaining,
  });
}
