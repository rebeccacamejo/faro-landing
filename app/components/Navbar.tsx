"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import LocaleToggle from "./LocaleToggle";

export default function Navbar() {
  const t = useTranslations("nav");
  const scrollY = useScrollPosition();

  const scrolled = scrollY >= 100;
  const showPulse = scrollY >= 600;

  return (
    <header
      className={[
        "fixed top-0 inset-x-0 z-50 transition-all duration-200 border-b",
        scrolled
          ? "bg-cream/95 backdrop-blur-md shadow-sm border-brass/20"
          : "bg-transparent border-transparent",
      ].join(" ")}
    >
      <div className="max-w-[1100px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Wordmark */}
        <Link
          href="/"
          className="font-serif text-2xl text-navy no-underline hover:no-underline"
          aria-label={t("homeLabel")}
        >
          Faro
        </Link>

        {/* Desktop nav: links → toggle → sign in → CTA */}
        <nav aria-label={t("primaryNav")} className="hidden md:flex items-center gap-6">
          <a
            href="#how-it-works"
            className="font-sans text-sm text-charcoal/80 hover:text-navy no-underline hover:no-underline transition-colors"
          >
            {t("howItWorks")}
          </a>
          <a
            href="#for-advisors"
            className="font-sans text-sm text-charcoal/80 hover:text-navy no-underline hover:no-underline transition-colors"
          >
            {t("forAdvisors")}
          </a>
          <Link
            href="/blog"
            className="font-sans text-sm text-charcoal/80 hover:text-navy no-underline hover:no-underline transition-colors"
          >
            {t("blog")}
          </Link>

          <LocaleToggle />

          <a
            href="#sign-in"
            className="font-sans text-sm text-charcoal/80 hover:text-navy no-underline hover:no-underline transition-colors"
          >
            {t("signIn")}
          </a>
          <a
            href="#waitlist"
            className="relative bg-terracotta hover:bg-terracotta/90 text-cream font-sans text-sm font-medium px-5 py-2 rounded-md transition-colors no-underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-terracotta focus:ring-offset-2"
          >
            {showPulse && <span className="nav-cta-ring" aria-hidden="true" />}
            {t("joinWaitlist")}
          </a>
        </nav>

        {/* Mobile: toggle + compact Join CTA */}
        <div className="flex md:hidden items-center gap-3">
          <LocaleToggle />
          <a
            href="#waitlist"
            className="relative bg-terracotta hover:bg-terracotta/90 text-cream font-sans text-sm font-medium px-4 py-1.5 rounded-md transition-colors no-underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-terracotta focus:ring-offset-2"
          >
            {showPulse && <span className="nav-cta-ring" aria-hidden="true" />}
            {t("joinMobile")}
          </a>
        </div>
      </div>
    </header>
  );
}
