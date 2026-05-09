import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import {
  getPostsByCategory,
  CATEGORY_LABELS,
  CATEGORY_LABELS_ES,
  type PostCategory,
} from "@/lib/blog";
import PostCard from "@/app/components/blog/PostCard";
import CategoryFilter from "@/app/components/blog/CategoryFilter";
import Navbar from "@/app/components/Navbar";

const CATEGORIES: PostCategory[] = [
  "ai-search",
  "miami-business",
  "for-cpas",
  "case-studies",
  "bilingual",
];

export function generateStaticParams() {
  return ["en", "es"].flatMap((locale) =>
    CATEGORIES.map((category) => ({ locale, category })),
  );
}

export async function generateMetadata({
  params: { locale, category },
}: {
  params: { locale: string; category: string };
}): Promise<Metadata> {
  const labels = locale === "es" ? CATEGORY_LABELS_ES : CATEGORY_LABELS;
  const label = labels[category as PostCategory] ?? category;
  const BASE = "https://faro-jet.vercel.app";
  const title = `${label} | Faro Blog`;

  return {
    title,
    alternates: {
      canonical: `${BASE}/${locale}/blog/category/${category}`,
      languages: {
        en: `${BASE}/en/blog/category/${category}`,
        es: `${BASE}/es/blog/category/${category}`,
      },
    },
  };
}

export default function CategoryPage({
  params: { locale, category },
}: {
  params: { locale: string; category: string };
}) {
  setRequestLocale(locale);

  const posts = getPostsByCategory(locale, category);
  const labels = locale === "es" ? CATEGORY_LABELS_ES : CATEGORY_LABELS;
  const label = labels[category as PostCategory] ?? category;

  return (
    <>
      <Navbar />

      <section className="bg-cream-deep pt-32 pb-16">
        <div className="max-w-[1100px] mx-auto px-6">
          <p className="font-sans text-xs uppercase tracking-widest text-charcoal/40 mb-3">
            {locale === "es" ? "Categoría" : "Category"}
          </p>
          <h1 className="font-serif text-[48px] leading-tight text-navy">{label}</h1>
        </div>
      </section>

      <main className="bg-cream py-16">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="mb-10">
            <CategoryFilter locale={locale} activeCategory={category as PostCategory} />
          </div>

          {posts.length > 0 ? (
            <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
              {posts.map((post) => (
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
        <div className="max-w-[1100px] mx-auto px-6 py-10 flex items-center justify-between">
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
