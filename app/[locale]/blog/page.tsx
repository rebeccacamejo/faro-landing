import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getAllPosts, getFeaturedPost } from "@/lib/blog";
import PostCard from "@/app/components/blog/PostCard";
import FeaturedPost from "@/app/components/blog/FeaturedPost";
import CategoryFilter from "@/app/components/blog/CategoryFilter";
import Navbar from "@/app/components/Navbar";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "es" }];
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const isEs = locale === "es";
  const title = isEs
    ? "Blog — Notas de campo sobre la búsqueda con IA | Faro"
    : "Blog — Field notes on AI search | Faro";
  const description = isEs
    ? "Cómo los agentes de IA están cambiando cómo los clientes encuentran negocios en Miami — y qué hacer al respecto."
    : "How AI agents are changing how customers find businesses — and what to do about it.";
  const BASE = "https://faro-jet.vercel.app";

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE}/${locale}/blog`,
      languages: { en: `${BASE}/en/blog`, es: `${BASE}/es/blog` },
    },
    openGraph: { title, description, url: `${BASE}/${locale}/blog`, type: "website" },
  };
}

export default function BlogIndexPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);

  const featured = getFeaturedPost(locale);
  const allPosts = getAllPosts(locale);
  const gridPosts = allPosts.filter((p) => !p.featured);

  const headline =
    locale === "es"
      ? "Notas de campo sobre la búsqueda con IA."
      : "Field notes on AI search.";
  const subhead =
    locale === "es"
      ? "Cómo los agentes de IA están cambiando cómo los clientes encuentran negocios — y qué hacer al respecto."
      : "How AI agents are changing how customers find businesses — and what to do about it.";

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="bg-cream-deep pt-32 pb-16">
        <div className="max-w-[1100px] mx-auto px-6">
          <h1 className="font-serif text-[48px] md:text-[56px] leading-tight text-navy mb-4 max-w-[700px]">
            {headline}
          </h1>
          <p className="font-sans text-lg text-charcoal/70 max-w-[560px]">{subhead}</p>
        </div>
      </section>

      <main className="bg-cream py-16">
        <div className="max-w-[1100px] mx-auto px-6">
          {/* Featured */}
          {featured && <FeaturedPost post={featured} locale={locale} />}

          {/* Category filter */}
          <div className="mb-8">
            <CategoryFilter locale={locale} activeCategory="all" />
          </div>

          {/* Grid */}
          {gridPosts.length > 0 ? (
            <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
              {gridPosts.map((post) => (
                <PostCard key={post.slug} post={post} locale={locale} />
              ))}
            </div>
          ) : (
            <p className="font-sans text-charcoal/50 text-center py-16">
              {locale === "es" ? "Próximamente." : "More posts coming soon."}
            </p>
          )}
        </div>
      </main>

      <footer className="bg-cream-deep">
        <div className="max-w-[1100px] mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-sans text-sm text-charcoal/60">
            Faro · Miami, FL ·{" "}
            <a href="mailto:hello@heyfaro.com" className="text-charcoal/60 hover:text-terracotta no-underline hover:underline transition-colors">
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
