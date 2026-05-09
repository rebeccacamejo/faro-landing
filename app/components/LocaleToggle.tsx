"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

function saveLocalePreference(newLocale: string) {
  if (typeof window === "undefined") return;
  // Scroll position — restored by ScrollRestorer on the next page mount
  sessionStorage.setItem("faro-scroll-restore", String(Math.round(window.scrollY)));
  // Persist preference so returning visits land on the right locale
  try {
    localStorage.setItem("faro-locale-preference", newLocale);
  } catch {}
  // Cookie read by next-intl middleware for the root / redirect
  document.cookie = `NEXT_LOCALE=${newLocale}; max-age=${365 * 24 * 60 * 60}; path=/; SameSite=Lax`;
}

export default function LocaleToggle() {
  const locale = useLocale();
  const pathname = usePathname();

  // Hash is client-only — read after mount so SSR is clean
  const [hash, setHash] = useState("");
  useEffect(() => {
    setHash(window.location.hash.slice(1));
    function onHashChange() {
      setHash(window.location.hash.slice(1));
    }
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const href = { pathname, ...(hash ? { hash } : {}) } as Parameters<typeof Link>[0]["href"];

  const pillBase =
    "px-3 py-1 text-xs font-medium uppercase tracking-wide rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-navy/30 focus:ring-offset-1 focus:ring-offset-cream-deep";
  const active = "bg-navy text-cream";
  const inactive = "bg-transparent text-charcoal/60 hover:text-charcoal";

  return (
    <div
      role="group"
      aria-label="Language"
      className="flex items-center rounded-full p-1 bg-cream-deep border border-brass/30"
    >
      <Link
        href={href}
        locale="en"
        aria-current={locale === "en" ? "true" : undefined}
        onClick={() => saveLocalePreference("en")}
        className={`${pillBase} ${locale === "en" ? active : inactive}`}
      >
        EN<span className="sr-only"> English</span>
      </Link>
      <Link
        href={href}
        locale="es"
        aria-current={locale === "es" ? "true" : undefined}
        onClick={() => saveLocalePreference("es")}
        className={`${pillBase} ${locale === "es" ? active : inactive}`}
      >
        ES<span className="sr-only"> Español</span>
      </Link>
    </div>
  );
}
