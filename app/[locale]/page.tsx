import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import Image from "next/image";
import NextLink from "next/link";
import Navbar from "../components/Navbar";
import LivePrompts from "../components/LivePrompts";
import FadeUp from "../components/FadeUp";
import WaitlistBand from "../components/WaitlistBand";
import { getAllPosts } from "@/lib/blog";

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

export default function Home({
  params: { locale },
  searchParams,
}: {
  params: { locale: string };
  searchParams?: { ref?: string };
}) {
  setRequestLocale(locale);
  const t = useTranslations();
  const tPrompts = useTranslations("prompts");
  const promptCards = (tPrompts.raw("cards") as Array<{ agent: string; query: string }>);
  const referralRef = typeof searchParams?.ref === "string" ? searchParams.ref : undefined;
  const latestPosts = getAllPosts(locale).slice(0, 2);

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
            <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
              {/* Left — headline + CTAs */}
              <div className="flex-1">
                <h1
                  id="hero-heading"
                  className="font-serif text-[40px] md:text-[48px] lg:text-[60px] leading-[1.1] tracking-tight text-navy mb-8"
                >
                  {t("hero.headline")}
                </h1>
                <p className="font-sans text-lg md:text-xl text-charcoal/70 leading-relaxed mb-10 max-w-[560px]">
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

              {/* Right — live AI query cards */}
              <div className="w-full md:w-[420px] flex-shrink-0">
                <div className="mb-3 flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 animate-pulse rounded-full bg-terracotta"
                  />
                  <span className="font-sans text-[11px] uppercase tracking-widest text-charcoal/40">
                    {tPrompts("liveLabel")}
                  </span>
                </div>
                <LivePrompts
                  cards={promptCards}
                  searchingText={tPrompts("searching")}
                  liveLabel={tPrompts("liveLabel")}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── THE PROBLEM ──────────────────────────────────────────── */}
        <section aria-labelledby="problem-heading" className="bg-cream-deep">
          <div className="max-w-[1100px] mx-auto px-6 py-24 md:py-32">
            <FadeUp>
              <h2
                id="problem-heading"
                className="font-serif text-[32px] md:text-[40px] leading-tight text-navy mb-12 max-w-[700px]"
              >
                {t("problem.heading")}
              </h2>
            </FadeUp>
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
            <FadeUp>
              <h2
                id="how-heading"
                className="font-serif text-[32px] md:text-[40px] text-navy mb-16"
              >
                {t("howItWorks.heading")}
              </h2>
            </FadeUp>
            <div className="grid md:grid-cols-3 gap-12 md:gap-8 lg:gap-16">
              {(["step1", "step2", "step3"] as const).map((step, i) => (
                <div key={step}>
                  <FadeUp delay={i * 0.1 + 0.2} className="mb-5">
                    <span
                      aria-hidden="true"
                      className="block font-serif text-[48px] text-terracotta leading-none"
                    >
                      {i + 1}
                    </span>
                  </FadeUp>
                  <FadeUp delay={i * 0.1}>
                    <div>
                      <h3 className="font-serif text-xl text-navy mb-4">
                        {t(`howItWorks.${step}.heading`)}
                      </h3>
                      <p className="font-sans text-base leading-relaxed text-charcoal/80">
                        {t(`howItWorks.${step}.body`)}
                      </p>
                    </div>
                  </FadeUp>
                </div>
              ))}
            </div>
            <FadeUp delay={0.4}>
              <p className="mt-14 font-sans text-base text-charcoal/60">
                {locale === "es"
                  ? "¿Tienes preguntas sobre precios, plazos o cómo funciona exactamente? "
                  : "Questions about pricing, timelines, or exactly how this works? "}
                <NextLink
                  href={`/${locale}/faq`}
                  className="text-terracotta hover:underline transition-colors no-underline"
                >
                  {locale === "es"
                    ? "Lee las preguntas frecuentes sobre Faro"
                    : "Read our FAQ — everything answered in plain language"}
                </NextLink>
                .
              </p>
            </FadeUp>
          </div>
        </section>

        {/* ── MIAMI ANCHOR ─────────────────────────────────────────── */}
        {/*
          Photo: La Esquina de la Fama, Calle Ocho, Little Havana, Miami.
          Source: Pexels #8707116 — Sami Abdullah (free commercial use).
          Cropped landscape from portrait original; optimized to ~128 KB via sharp.
        */}
        <section aria-label="Built for South Florida">
          <div className="relative w-full overflow-hidden" style={{ height: "480px" }}>
            <Image
              src="/miami-anchor.jpg"
              alt="La Esquina de la Fama on Calle Ocho — a Cuban restaurant in Miami's Little Havana, warm string lights glowing at dusk, bilingual menus, a worker at the counter"
              fill
              className="object-cover object-center"
              priority={false}
              sizes="100vw"
            />
            {/* Cream wash at 8% to tie the image into the page palette */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ backgroundColor: "rgba(248,244,237,0.08)" }}
              aria-hidden="true"
            />
          </div>
          <div className="bg-cream py-10 text-center px-6">
            <p className="font-serif text-[28px] italic text-navy leading-tight mb-3">
              Made in Miami. For Miami.
            </p>
            <p className="font-sans text-sm text-charcoal/60">
              We built Faro for the businesses that built this city.
            </p>
          </div>
        </section>

        {/* ── FOR ADVISORS ─────────────────────────────────────────── */}
        <section
          id="for-advisors"
          aria-labelledby="advisors-heading"
          className="bg-cream-deep"
        >
          <div className="max-w-[1100px] mx-auto px-6 py-24 md:py-32">
            <FadeUp>
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
            </FadeUp>
          </div>
        </section>

        {/* ── WAITLIST ─────────────────────────────────────────────── */}
        <section
          id="waitlist"
          aria-labelledby="waitlist-heading"
          className="bg-cream overflow-hidden"
        >
          <WaitlistBand
            headingId="waitlist-heading"
            headingText={t("waitlist.heading")}
            subheadText={t("waitlist.subhead")}
            referralRef={referralRef}
          />
        </section>
      </main>

      {/* ── FROM THE BLOG ────────────────────────────────────────────── */}
      {latestPosts.length > 0 && (
        <section aria-labelledby="blog-preview-heading" className="bg-cream py-20">
          <div className="max-w-[1100px] mx-auto px-6">
            <FadeUp>
              <div className="flex items-baseline justify-between mb-10">
                <h2 id="blog-preview-heading" className="font-serif text-[28px] md:text-[32px] text-navy">
                  {locale === "es" ? "Del blog." : "From the blog."}
                </h2>
                <NextLink
                  href={`/${locale}/blog`}
                  className="font-sans text-sm text-charcoal/60 hover:text-navy no-underline hover:underline transition-colors"
                >
                  {locale === "es" ? "Ver todos los artículos →" : "All posts →"}
                </NextLink>
              </div>
            </FadeUp>
            <div className="grid md:grid-cols-2 gap-8">
              {latestPosts.map((post) => (
                <FadeUp key={post.slug}>
                  <article className="border-t border-brass/20 pt-6">
                    <p className="font-sans text-[11px] uppercase tracking-widest text-charcoal/40 mb-3">
                      {post.category.replace(/-/g, " ")}
                    </p>
                    <h3 className="font-serif text-xl text-navy mb-3 leading-snug">
                      <NextLink
                        href={`/${locale}/blog/${post.slug}`}
                        className="no-underline hover:text-terracotta transition-colors"
                      >
                        {post.title}
                      </NextLink>
                    </h3>
                    <p className="font-sans text-sm text-charcoal/70 leading-relaxed mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <NextLink
                      href={`/${locale}/blog/${post.slug}`}
                      className="font-sans text-sm text-terracotta no-underline hover:underline transition-colors"
                    >
                      {locale === "es" ? "Leer artículo →" : "Read post →"}
                    </NextLink>
                  </article>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>
      )}

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
          <p className="font-sans text-xs text-charcoal/50">
            Available in English and Español
          </p>
        </div>
      </footer>
    </>
  );
}
