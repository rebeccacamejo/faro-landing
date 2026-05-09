import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Script from "next/script";
import Navbar from "@/app/components/Navbar";
import FAQAccordion from "@/app/components/FAQAccordion";

const BASE = "https://faro-jet.vercel.app";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "es" }];
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "faq.metadata" });
  const title = t("title");
  const description = t("description");

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE}/${locale}/faq`,
      languages: { en: `${BASE}/en/faq`, es: `${BASE}/es/faq` },
    },
    openGraph: {
      title,
      description,
      url: `${BASE}/${locale}/faq`,
      type: "website",
    },
  };
}

type FAQItem = { q: string; a: string };
type FAQSection = { title: string; slug: string; items: FAQItem[] };

export default async function FAQPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "faq" });

  const sections = t.raw("sections") as FAQSection[];

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: sections.flatMap((section) =>
      section.items.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a,
        },
      }))
    ),
  };

  return (
    <>
      <Navbar />

      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Hero */}
      <section className="bg-cream-deep pt-32 pb-16">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="font-serif text-[48px] leading-[1.1] text-navy mb-5">
            {t("hero.heading")}
          </h1>
          <p className="font-sans text-lg text-charcoal/70 leading-relaxed max-w-[560px]">
            {t("hero.subhead")}
          </p>
        </div>
      </section>

      {/* FAQ body */}
      <main className="bg-cream py-16">
        <div className="max-w-3xl mx-auto px-6">
          <FAQAccordion sections={sections} />
        </div>
      </main>

      {/* Bottom CTA */}
      <section className="bg-cream-deep py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="font-sans text-lg text-charcoal leading-relaxed">
            {t("ctaBand.prefix")}
            <a
              href="mailto:hello@heyfaro.com"
              className="text-terracotta hover:underline transition-colors"
            >
              {t("ctaBand.email")}
            </a>
            {t("ctaBand.mid")}
            <a
              href={`/${locale}#waitlist`}
              className="text-terracotta hover:underline transition-colors"
            >
              {t("ctaBand.waitlist")}
            </a>
            {t("ctaBand.suffix")}
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-cream-deep border-t border-brass/10" role="contentinfo">
        <div className="max-w-3xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-sans text-sm text-charcoal/60">
            Faro · Miami, FL ·{" "}
            <a
              href="mailto:hello@heyfaro.com"
              className="text-charcoal/60 hover:text-terracotta no-underline hover:underline transition-colors"
            >
              hello@heyfaro.com
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
