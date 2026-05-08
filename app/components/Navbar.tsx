"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const t = useTranslations("nav");

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 16);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-cream/95 backdrop-blur-sm shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-[1100px] mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="font-serif text-2xl text-navy no-underline hover:no-underline"
          aria-label={t("homeLabel")}
        >
          Faro
        </Link>

        {/* Desktop nav */}
        <nav aria-label={t("primaryNav")} className="hidden md:flex items-center gap-8">
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
          <a
            href="#sign-in"
            className="font-sans text-sm text-charcoal/80 hover:text-navy no-underline hover:no-underline transition-colors"
          >
            {t("signIn")}
          </a>
          <a
            href="#waitlist"
            className="bg-terracotta hover:bg-terracotta/90 text-cream font-sans text-sm font-medium px-5 py-2 rounded-md transition-colors no-underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-terracotta focus:ring-offset-2"
          >
            {t("joinWaitlist")}
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-navy focus:outline-none focus:ring-2 focus:ring-terracotta rounded"
          aria-label={t(menuOpen ? "closeMenu" : "openMenu")}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span className="block w-5 h-px bg-navy mb-1.5 transition-all" />
          <span className="block w-5 h-px bg-navy mb-1.5 transition-all" />
          <span className="block w-5 h-px bg-navy transition-all" />
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <nav
          aria-label={t("mobileNav")}
          className="md:hidden bg-cream border-t border-navy/10 px-6 py-4 flex flex-col gap-4"
        >
          <a
            href="#how-it-works"
            onClick={() => setMenuOpen(false)}
            className="font-sans text-base text-charcoal/80 hover:text-navy no-underline hover:no-underline"
          >
            {t("howItWorks")}
          </a>
          <a
            href="#for-advisors"
            onClick={() => setMenuOpen(false)}
            className="font-sans text-base text-charcoal/80 hover:text-navy no-underline hover:no-underline"
          >
            {t("forAdvisors")}
          </a>
          <a
            href="#sign-in"
            onClick={() => setMenuOpen(false)}
            className="font-sans text-base text-charcoal/80 hover:text-navy no-underline hover:no-underline"
          >
            {t("signIn")}
          </a>
          <a
            href="#waitlist"
            onClick={() => setMenuOpen(false)}
            className="bg-terracotta text-cream font-sans text-base font-medium px-5 py-2.5 rounded-md text-center no-underline hover:no-underline w-full"
          >
            {t("joinWaitlist")}
          </a>
        </nav>
      )}
    </header>
  );
}
