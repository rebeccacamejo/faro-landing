import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import Navbar from "../components/Navbar";
import WaitlistForm from "../components/WaitlistForm";
import LocaleToggle from "../components/LocaleToggle";

function LighthouseBeam() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 320 480"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute top-0 right-0 w-64 md:w-80 lg:w-96 h-auto opacity-[0.06] pointer-events-none select-none"
    >
      <line x1="160" y1="180" x2="320" y2="0" stroke="#1A2B4A" strokeWidth="1.5" />
      <line x1="160" y1="180" x2="300" y2="20" stroke="#1A2B4A" strokeWidth="1" />
      <line x1="160" y1="180" x2="260" y2="40" stroke="#1A2B4A" strokeWidth="0.75" />
      <line x1="160" y1="180" x2="320" y2="60" stroke="#1A2B4A" strokeWidth="0.5" />
      <rect x="145" y="180" width="30" height="120" rx="2" stroke="#1A2B4A" strokeWidth="1.5" fill="none" />
      <rect x="138" y="165" width="44" height="20" rx="3" stroke="#1A2B4A" strokeWidth="1.5" fill="none" />
      <circle cx="160" cy="175" r="5" stroke="#1A2B4A" strokeWidth="1.5" fill="none" />
      <rect x="130" y="300" width="60" height="16" rx="2" stroke="#1A2B4A" strokeWidth="1.5" fill="none" />
      <line x1="138" y1="230" x2="182" y2="230" stroke="#1A2B4A" strokeWidth="1" />
      <line x1="138" y1="260" x2="182" y2="260" stroke="#1A2B4A" strokeWidth="1" />
    </svg>
  );
}

export default function Home({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = useTranslations();

  return (
    <>
      <Navbar />

      <main id="main-content">
        {/* ── HERO ─────────────────────────────────────────────────── */}
        <section
          aria-labelledby="hero-heading"
          className="relative min-h-[calc(100vh-4rem)] flex items-center pt-16 overflow-hidden"
        >
          <LighthouseBeam />
          <div className="max-w-[1100px] mx-auto px-6 py-24 md:py-32 w-full">
            <div className="max-w-[720px]">
              <h1
                id="hero-heading"
                className="font-serif text-[40px] md:text-[56px] lg:text-[68px] leading-[1.1] tracking-tight text-navy mb-8"
              >
                {t("hero.headline")}
              </h1>
              <p className="font-sans text-lg md:text-xl text-charcoal/70 leading-relaxed mb-10 max-w-[600px]">
                {t("hero.subhead")}
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <a
                  href="#waitlist"
                  className="bg-terracotta hover:bg-terracotta/90 text-cream font-sans font-medium text-lg px-8 py-4 rounded-md transition-colors no-underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-terracotta focus:ring-offset-2 focus:ring-offset-cream"
                >
                  {t("hero.cta")}
                </a>
                <a
                  href="#for-advisors"
                  className="font-sans text-base text-charcoal/60 hover:text-terracotta no-underline hover:no-underline hover:underline transition-colors"
                >
                  {t("hero.advisorLink")}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── THE PROBLEM ──────────────────────────────────────────── */}
        <section aria-labelledby="problem-heading" className="bg-cream-deep">
          <div className="max-w-[1100px] mx-auto px-6 py-24 md:py-32">
            <h2
              id="problem-heading"
              className="font-serif text-[32px] md:text-[40px] leading-tight text-navy mb-12 max-w-[700px]"
            >
              {t("problem.heading")}
            </h2>
            <div className="max-w-[700px] space-y-6">
              <p className="font-sans text-lg leading-loose text-charcoal">
                {t("problem.para1")}
              </p>
              <p className="font-sans text-lg leading-loose text-charcoal">
                {t("problem.para2")}
              </p>
              <p className="font-sans text-lg leading-loose text-charcoal">
                {t("problem.para3")}
              </p>
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ─────────────────────────────────────────── */}
        <section
          id="how-it-works"
          aria-labelledby="how-heading"
          className="bg-cream"
        >
          <div className="max-w-[1100px] mx-auto px-6 py-24 md:py-32">
            <h2
              id="how-heading"
              className="font-serif text-[32px] md:text-[40px] text-navy mb-16"
            >
              {t("howItWorks.heading")}
            </h2>
            <div className="grid md:grid-cols-3 gap-12 md:gap-8 lg:gap-16">
              {(["step1", "step2", "step3"] as const).map((step, i) => (
                <div key={step}>
                  <span
                    aria-hidden="true"
                    className="block font-serif text-[48px] text-terracotta leading-none mb-5"
                  >
                    {i + 1}
                  </span>
                  <h3 className="font-serif text-xl text-navy mb-4">
                    {t(`howItWorks.${step}.heading`)}
                  </h3>
                  <p className="font-sans text-base leading-relaxed text-charcoal/80">
                    {t(`howItWorks.${step}.body`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FOR ADVISORS ─────────────────────────────────────────── */}
        <section
          id="for-advisors"
          aria-labelledby="advisors-heading"
          className="bg-cream-deep"
        >
          <div className="max-w-[1100px] mx-auto px-6 py-24 md:py-32">
            <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
              <div>
                <h2
                  id="advisors-heading"
                  className="font-serif text-[32px] md:text-[40px] leading-tight text-navy"
                >
                  {t("forAdvisors.heading")}
                </h2>
              </div>
              <div className="space-y-6">
                <p className="font-sans text-lg leading-relaxed text-charcoal">
                  {t("forAdvisors.para1")}
                </p>
                <p className="font-sans text-lg leading-relaxed text-charcoal">
                  {t("forAdvisors.para2")}
                </p>
                <a
                  href="#waitlist?audience=advisor"
                  className="inline-block bg-navy hover:bg-navy/90 text-cream font-sans font-medium text-base px-7 py-3.5 rounded-md transition-colors no-underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-navy focus:ring-offset-2 focus:ring-offset-cream-deep mt-2"
                >
                  {t("forAdvisors.cta")}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── WAITLIST ─────────────────────────────────────────────── */}
        <section
          id="waitlist"
          aria-labelledby="waitlist-heading"
          className="bg-navy"
        >
          <div className="max-w-[1100px] mx-auto px-6 py-24 md:py-32">
            <div className="max-w-lg mx-auto text-center mb-10">
              <h2
                id="waitlist-heading"
                className="font-serif text-[36px] md:text-[48px] text-cream mb-4"
              >
                {t("waitlist.heading")}
              </h2>
              <p className="font-sans text-lg text-cream/70">
                {t("waitlist.subhead")}
              </p>
            </div>
            <WaitlistForm />
          </div>
        </section>
      </main>

      {/* ── FOOTER ───────────────────────────────────────────────────── */}
      <footer className="bg-cream-deep" role="contentinfo">
        <div className="max-w-[1100px] mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-sans text-sm text-charcoal/60 text-center sm:text-left">
            {t("footer.tagline")}{" "}
            <a
              href={`mailto:${t("footer.email")}`}
              className="text-charcoal/60 hover:text-terracotta no-underline hover:underline transition-colors"
            >
              {t("footer.email")}
            </a>
          </p>
          <LocaleToggle />
        </div>
      </footer>
    </>
  );
}
