"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import LocaleToggle from "./LocaleToggle";

export default function Navbar() {
  const t = useTranslations("nav");
  const scrollY = useScrollPosition();
  const [menuOpen, setMenuOpen] = useState(false);

  const scrolled = scrollY >= 100;
  const showPulse = scrollY >= 600;

  return (
    <>
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
            onClick={() => setMenuOpen(false)}
          >
            Faro
          </Link>

          {/* Desktop nav */}
          <nav aria-label={t("primaryNav")} className="hidden md:flex items-center gap-6">
            <a
              href="/#how-it-works"
              className="font-sans text-sm text-charcoal/80 hover:text-navy no-underline hover:no-underline transition-colors"
            >
              {t("howItWorks")}
            </a>
            <Link
              href="/faq"
              className="font-sans text-sm text-charcoal/80 hover:text-navy no-underline hover:no-underline transition-colors"
            >
              {t("faq")}
            </Link>
            <a
              href="/#for-advisors"
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
              href="/#waitlist"
              className="relative bg-terracotta hover:bg-terracotta/90 text-cream font-sans text-sm font-medium px-5 py-2 rounded-md transition-colors no-underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-terracotta focus:ring-offset-2"
            >
              {showPulse && <span className="nav-cta-ring" aria-hidden="true" />}
              {t("joinWaitlist")}
            </a>
          </nav>

          {/* Mobile: locale toggle + hamburger + join */}
          <div className="flex md:hidden items-center gap-2">
            <LocaleToggle />
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label={menuOpen ? t("closeMenu") : t("openMenu")}
              className="p-2 text-navy hover:text-terracotta transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brass"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                {menuOpen ? (
                  <>
                    <line x1="4" y1="4" x2="16" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="16" y1="4" x2="4" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </>
                ) : (
                  <>
                    <line x1="3" y1="6" x2="17" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="3" y1="10" x2="17" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="3" y1="14" x2="17" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </>
                )}
              </svg>
            </button>
            <a
              href="/#waitlist"
              className="relative bg-terracotta hover:bg-terracotta/90 text-cream font-sans text-sm font-medium px-4 py-1.5 rounded-md transition-colors no-underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-terracotta focus:ring-offset-2"
            >
              {showPulse && <span className="nav-cta-ring" aria-hidden="true" />}
              {t("joinMobile")}
            </a>
          </div>
        </div>
      </header>

      {/* Mobile nav drawer */}
      {menuOpen && (
        <div
          id="mobile-nav"
          role="navigation"
          aria-label={t("mobileNav")}
          className="fixed inset-x-0 top-16 z-40 md:hidden bg-cream/98 backdrop-blur-md border-b border-brass/20 shadow-md"
        >
          <div className="px-6 py-6 flex flex-col gap-5">
            <a
              href="/#how-it-works"
              onClick={() => setMenuOpen(false)}
              className="font-sans text-base text-charcoal/80 hover:text-navy no-underline hover:no-underline transition-colors"
            >
              {t("howItWorks")}
            </a>
            <Link
              href="/faq"
              onClick={() => setMenuOpen(false)}
              className="font-sans text-base text-charcoal/80 hover:text-navy no-underline hover:no-underline transition-colors"
            >
              {t("faq")}
            </Link>
            <a
              href="/#for-advisors"
              onClick={() => setMenuOpen(false)}
              className="font-sans text-base text-charcoal/80 hover:text-navy no-underline hover:no-underline transition-colors"
            >
              {t("forAdvisors")}
            </a>
            <Link
              href="/blog"
              onClick={() => setMenuOpen(false)}
              className="font-sans text-base text-charcoal/80 hover:text-navy no-underline hover:no-underline transition-colors"
            >
              {t("blog")}
            </Link>
            <a
              href="#sign-in"
              onClick={() => setMenuOpen(false)}
              className="font-sans text-base text-charcoal/80 hover:text-navy no-underline hover:no-underline transition-colors"
            >
              {t("signIn")}
            </a>
          </div>
        </div>
      )}
    </>
  );
}
