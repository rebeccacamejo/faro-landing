import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import ScrollRestorer from "@/app/components/ScrollRestorer";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

const BASE_URL = "https://faro-jet.vercel.app";

// ── Global structured data ────────────────────────────────────────────────────

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${BASE_URL}/#organization`,
  name: "Faro",
  url: BASE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${BASE_URL}/icon-512.png`,
  },
  description:
    "AI visibility service for small and mid-sized businesses, sold through trusted advisors. Bilingual. Based in Miami.",
  areaServed: [
    { "@type": "State", "name": "Florida" },
    { "@type": "Country", "name": "United States" },
  ],
  knowsLanguage: ["en", "es"],
  foundingLocation: { "@type": "Place", name: "Miami, FL" },
  founder: [
    { "@type": "Person", name: "Rebecca Camejo" },
    // TODO: add co-founder name
  ],
  // TODO: add LinkedIn company page URL once live
  sameAs: [],
  contactPoint: {
    "@type": "ContactPoint",
    email: "hello@heyfaro.com",
    contactType: "customer service",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${BASE_URL}/#service`,
  name: "Faro AI Visibility Service",
  serviceType: "Answer Engine Optimization",
  description:
    "Monthly AI visibility monitoring and optimization for local and mid-sized businesses. Faro tracks ChatGPT, Claude, Perplexity, and Gemini recommendations and publishes content that earns citations from AI agents.",
  provider: { "@id": `${BASE_URL}/#organization` },
  areaServed: [
    { "@type": "State", name: "Florida" },
    { "@type": "Country", name: "United States" },
  ],
  audience: {
    "@type": "BusinessAudience",
    audienceType:
      "Small and mid-sized business owners and their trusted advisors (CPAs, bookkeepers, financial advisors)",
  },
  offers: [
    {
      "@type": "Offer",
      name: "Local",
      description:
        "AI visibility monitoring and optimization for single-location local businesses. Includes monthly two-page report, bilingual coverage, and co-branded CPA reporting.",
      price: "400",
      priceCurrency: "USD",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: "400",
        priceCurrency: "USD",
        unitCode: "MON",
        unitText: "month",
      },
    },
    {
      "@type": "Offer",
      name: "Growth",
      description:
        "AI visibility monitoring and optimization for multi-location businesses. Includes broader keyword monitoring, white-label report options, and priority support.",
      price: "1200",
      priceCurrency: "USD",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: "1200",
        priceCurrency: "USD",
        unitCode: "MON",
        unitText: "month",
      },
    },
    {
      "@type": "Offer",
      name: "Mid-cap",
      description:
        "Custom AI visibility solution for mid-cap companies with complex multi-market or multi-brand needs. Pricing starts at $3,500/month.",
      priceSpecification: {
        "@type": "PriceSpecification",
        description: "Custom pricing starting at $3,500/month",
        priceCurrency: "USD",
      },
    },
  ],
};

// ── Metadata ──────────────────────────────────────────────────────────────────

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: Omit<Props, "children">): Promise<Metadata> {
  const isEs = locale === "es";

  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: isEs
        ? "Faro — Que ChatGPT recomiende tu negocio"
        : "Faro — Get recommended by ChatGPT, Claude, and Perplexity",
      template: "%s | Faro",
    },
    description: isEs
      ? "Faro rastrea cómo los agentes de IA recomiendan tu negocio en ChatGPT, Claude, Perplexity y Gemini — y se asegura de que seas el elegido. Hecho en el sur de Florida. En inglés y español."
      : "Faro tracks how AI agents recommend small and mid-sized businesses across ChatGPT, Claude, Perplexity, and Gemini — then makes sure your business is the one they pick. Built for South Florida. In English and Español.",
    keywords: [
      "AI visibility",
      "AEO",
      "answer engine optimization",
      "GEO",
      "generative engine optimization",
      "Miami SMB",
      "CPA marketing",
      "ChatGPT recommendations",
    ],
    openGraph: {
      title: isEs
        ? "Faro — Visibilidad en IA para tu negocio"
        : "Faro — Get recommended by AI agents",
      description: isEs
        ? "Visibilidad en IA para negocios pequeños y medianos, a través de CPAs y asesores de confianza. Miami. Bilingüe."
        : "AI visibility for small and mid-sized businesses, sold through CPAs and trusted advisors. Miami-based. Bilingual.",
      url: isEs ? `${BASE_URL}/es` : BASE_URL,
      siteName: "Faro",
      images: [{ url: "/api/og", width: 1200, height: 630 }],
      locale: isEs ? "es_US" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: isEs
        ? "Faro — Visibilidad en IA para tu negocio"
        : "Faro — Get recommended by AI agents",
      description: isEs
        ? "Visibilidad en IA para negocios en el sur de Florida."
        : "AI visibility for small and mid-sized businesses. Built for South Florida.",
      images: ["/api/og"],
    },
    icons: {
      icon: [
        { url: "/icon.svg", type: "image/svg+xml" },
        { url: "/favicon.ico", sizes: "any" },
      ],
      apple: "/apple-icon.png",
    },
    manifest: "/manifest.json",
  };
}

// ── Layout ────────────────────────────────────────────────────────────────────

export default async function LocaleLayout({ children, params: { locale } }: Props) {
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${inter.variable} ${fraunces.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
        />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <ScrollRestorer />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
