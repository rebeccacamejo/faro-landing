"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

export default function LocaleToggle() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("footer");
  const otherLocale = locale === "en" ? "es" : "en";

  // Hash is client-only — read it after mount so SSR stays clean
  const [hash, setHash] = useState("");
  useEffect(() => {
    setHash(window.location.hash.slice(1));
    function onHashChange() {
      setHash(window.location.hash.slice(1));
    }
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return (
    <Link
      href={{ pathname, ...(hash ? { hash } : {}) }}
      locale={otherLocale}
      aria-label={t("languageToggleLabel")}
      className="font-sans text-sm text-charcoal/50 hover:text-charcoal transition-colors focus:outline-none focus:underline underline-offset-4 no-underline"
    >
      {t("languageToggle")}
    </Link>
  );
}
