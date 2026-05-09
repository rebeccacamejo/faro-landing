import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
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

export default async function LocaleLayout({ children, params: { locale } }: Props) {
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${inter.variable} ${fraunces.variable}`}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
