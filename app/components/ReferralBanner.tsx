"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useAnalytics } from "@/hooks/useAnalytics";

interface Props {
  code: string;
  referrerBusiness: string | null;
  isValid: boolean;
}

export default function ReferralBanner({ code, referrerBusiness, isValid }: Props) {
  const [dismissed, setDismissed] = useState(false);
  const t = useTranslations("refer");
  const { track } = useAnalytics();

  useEffect(() => {
    if (isValid) {
      // Persist ref in cookie for 30 days so it survives navigation before signup
      document.cookie = `faro_ref=${code}; max-age=${30 * 24 * 60 * 60}; path=/; SameSite=Lax`;
      track("referral_visit", { code });
    }
  }, [code, isValid, track]);

  if (dismissed) return null;

  const message = isValid
    ? referrerBusiness
      ? t("bannerValidWith", { business: referrerBusiness })
      : t("bannerValidWithout")
    : t("bannerInvalid");

  return (
    <div
      role="banner"
      className="bg-navy text-cream"
    >
      <div className="max-w-[1100px] mx-auto px-6 py-3 flex items-center justify-between gap-4">
        <p className="font-sans text-sm">{message}</p>
        <button
          onClick={() => setDismissed(true)}
          aria-label={t("dismiss")}
          className="shrink-0 text-cream/50 hover:text-cream text-xl leading-none transition-colors focus:outline-none focus:ring-2 focus:ring-cream/40 rounded"
        >
          ×
        </button>
      </div>
    </div>
  );
}
