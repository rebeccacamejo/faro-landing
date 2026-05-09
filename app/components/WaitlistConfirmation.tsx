"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useAnalytics } from "@/hooks/useAnalytics";
import type { WaitlistConfirmationData, WaitlistStatusData } from "@/lib/types";

interface Props {
  data: WaitlistConfirmationData;
}

export default function WaitlistConfirmation({ data }: Props) {
  const locale = useLocale();
  const t = useTranslations("waitlist.confirmation");
  const { track } = useAnalytics();

  const [liveData, setLiveData] = useState(data);
  const [copied, setCopied] = useState(false);
  const [showLookup, setShowLookup] = useState(false);
  const hasTrackedUnlock = useRef(false);

  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_BASE_URL ?? "https://faro-jet.vercel.app";
  const referralLink = `${baseUrl}/${locale}/refer/${liveData.referral_code}`;

  const shareText =
    locale === "es"
      ? `Me acabo de inscribir en Faro — ayudan a los negocios pequeños a ser recomendados por ChatGPT y otros agentes de IA. Hecho para Miami. Vale la pena: ${referralLink}`
      : `I just signed up for Faro — they help small businesses get recommended by ChatGPT and other AI agents. Built for Miami. Worth a look: ${referralLink}`;
  const shareSubject = locale === "es" ? "Conoce Faro" : "Check out Faro";

  // Poll for live referral count every 30s; pause when tab is hidden
  useEffect(() => {
    const poll = async () => {
      if (document.visibilityState === "hidden") return;
      try {
        const res = await fetch(
          `/api/waitlist/status?code=${liveData.referral_code}`,
        );
        if (!res.ok) return;
        const fresh: WaitlistStatusData = await res.json();
        setLiveData((prev) => ({ ...prev, ...fresh }));
        if (fresh.referral_count >= 3 && !hasTrackedUnlock.current) {
          hasTrackedUnlock.current = true;
          track("referral_unlocked_priority");
        }
      } catch {}
    };

    const interval = setInterval(poll, 30_000);
    document.addEventListener("visibilitychange", poll);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", poll);
    };
  }, [liveData.referral_code, track]);

  // Fire signup event once on mount
  useEffect(() => {
    track("waitlist_signup_completed");
  }, [track]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      track("referral_link_copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  function shareVia(channel: "email" | "whatsapp" | "linkedin") {
    track("referral_share_clicked", { channel });
    const urls = {
      email: `mailto:?subject=${encodeURIComponent(shareSubject)}&body=${encodeURIComponent(shareText)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`,
    };
    window.open(urls[channel], "_blank", "noopener,noreferrer");
  }

  const referralCount = liveData.referral_count;
  const progressPct = Math.min(100, Math.round((referralCount / 3) * 100));

  return (
    <div className="max-w-lg mx-auto py-12 px-4">
      {/* Heading */}
      <h2 className="font-serif text-[36px] md:text-[44px] text-navy leading-tight mb-8">
        {t("heading")}
      </h2>

      {/* Position card */}
      <div className="border-2 border-terracotta rounded-xl p-6 mb-8 bg-white">
        <div className="font-serif text-[32px] text-navy leading-none mb-2">
          {t("positionOf", {
            position: liveData.position,
            total: liveData.total_signups,
          })}
        </div>
        <p className="font-sans text-sm text-charcoal/70">
          {t("pilotSlots", { slots: liveData.pilot_slots_remaining })}
        </p>
      </div>

      {/* Referral CTA */}
      <div className="bg-cream-deep rounded-xl p-6 mb-8">
        <h3 className="font-serif text-[28px] text-navy mb-3">
          {t("moveUpHeading")}
        </h3>
        <p className="font-sans text-base leading-relaxed text-charcoal mb-5">
          {t("moveUpBody")}
        </p>

        {/* Referral link + copy */}
        <p className="font-sans text-[11px] uppercase tracking-widest text-charcoal/50 mb-2">
          {t("yourLink")}
        </p>
        <div className="flex items-stretch gap-2 mb-5">
          <input
            readOnly
            value={referralLink}
            className="flex-1 min-w-0 px-4 py-3 rounded-md bg-cream border border-charcoal/20 font-sans text-sm text-navy focus:outline-none focus:ring-2 focus:ring-terracotta"
            onFocus={(e) => e.target.select()}
          />
          <button
            onClick={copyLink}
            className={`shrink-0 px-4 py-3 rounded-md font-sans text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-cream-deep ${
              copied
                ? "bg-brass/80 text-cream focus:ring-brass"
                : "bg-charcoal text-cream hover:bg-charcoal/80 focus:ring-charcoal"
            }`}
          >
            {copied ? t("copied") : t("copyLink")}
          </button>
        </div>

        {/* Share row */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => shareVia("whatsapp")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-md bg-[#25D366] text-white font-sans text-sm font-medium hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-1"
          >
            <WhatsAppIcon />
            {t("shareWhatsApp")}
          </button>
          <button
            onClick={() => shareVia("email")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-md bg-navy text-cream font-sans text-sm font-medium hover:bg-navy/80 transition-colors focus:outline-none focus:ring-2 focus:ring-navy focus:ring-offset-1"
          >
            <EmailIcon />
            {t("shareEmail")}
          </button>
          <button
            onClick={() => shareVia("linkedin")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-md bg-[#0077B5] text-white font-sans text-sm font-medium hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#0077B5] focus:ring-offset-1"
          >
            <LinkedInIcon />
            {t("shareLinkedIn")}
          </button>
        </div>
      </div>

      {/* Live referral counter */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="font-sans text-sm text-charcoal">
            {t("referralCount", { count: referralCount })}
          </span>
          {referralCount >= 3 && (
            <span className="bg-navy text-cream font-sans text-xs font-medium px-3 py-1 rounded-full">
              {t("priorityUnlocked")}
            </span>
          )}
        </div>
        <div className="h-1.5 rounded-full bg-cream-deep overflow-hidden">
          <div
            className="h-full rounded-full bg-brass transition-all duration-700"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Check your spot */}
      <p className="font-sans text-sm text-charcoal/60 text-center">
        {t("checkSpot")}{" "}
        <button
          onClick={() => setShowLookup(true)}
          className="text-terracotta hover:underline focus:outline-none focus:underline"
        >
          {t("checkSpotCta")}
        </button>
      </p>

      {/* Lookup modal */}
      {showLookup && (
        <LookupModal onClose={() => setShowLookup(false)} locale={locale} />
      )}
    </div>
  );
}

// ── Lookup modal ──────────────────────────────────────────────────────────────

function LookupModal({
  onClose,
  locale,
}: {
  onClose: () => void;
  locale: string;
}) {
  const t = useTranslations("waitlist.confirmation");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WaitlistStatusData | null>(null);
  const [errMsg, setErrMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrMsg("");
    try {
      const res = await fetch("/api/waitlist/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrMsg(data.error ?? "Not found.");
      } else {
        setResult(data);
      }
    } catch {
      setErrMsg("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-cream rounded-xl shadow-2xl w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-serif text-xl text-navy">{t("checkSpotCta")}</h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-charcoal/40 hover:text-charcoal text-2xl leading-none focus:outline-none"
          >
            ×
          </button>
        </div>

        {result ? (
          <div>
            <div className="border-2 border-terracotta rounded-lg p-4 mb-4">
              <div className="font-serif text-2xl text-navy mb-1">
                #{result.position}{" "}
                <span className="text-base text-charcoal/60">
                  of {result.total_signups}
                </span>
              </div>
              <div className="font-sans text-sm text-charcoal/70">
                {result.referral_count} of 3 referred
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-full bg-navy text-cream font-sans text-sm py-2.5 rounded-md hover:bg-navy/80 transition-colors"
            >
              {locale === "es" ? "Cerrar" : "Close"}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("lookupEmailPlaceholder")}
              disabled={loading}
              className="w-full px-4 py-3 rounded-md bg-white border border-charcoal/20 font-sans text-sm text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:ring-2 focus:ring-terracotta disabled:opacity-60"
            />
            {errMsg && (
              <p className="text-sm text-terracotta" role="alert">
                {errMsg}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-terracotta text-cream font-sans text-sm font-medium py-3 rounded-md hover:bg-terracotta/90 transition-colors disabled:opacity-60"
            >
              {loading ? "…" : t("lookupSubmit")}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ── Micro icons ───────────────────────────────────────────────────────────────

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.37 5.07L2 22l5.11-1.34A9.96 9.96 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm5.07 13.68c-.22.61-1.29 1.17-1.77 1.22-.45.05-.88.21-2.96-.62-2.5-1-4.08-3.59-4.2-3.76-.12-.17-.98-1.3-.98-2.48 0-1.18.62-1.76.84-2 .22-.24.48-.3.64-.3.16 0 .32 0 .46.01.15.01.35-.06.55.42.2.48.68 1.67.74 1.79.06.12.1.26.02.42-.08.16-.12.26-.24.4l-.36.42c-.12.12-.24.25-.1.49.14.24.62 1.02 1.33 1.65.91.81 1.68 1.06 1.92 1.18.24.12.38.1.52-.06.14-.16.6-.7.76-.94.16-.24.32-.2.54-.12.22.08 1.4.66 1.64.78.24.12.4.18.46.28.06.1.06.58-.16 1.19z"/>
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  );
}
