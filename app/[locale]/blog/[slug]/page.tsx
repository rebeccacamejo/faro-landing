import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import Script from "next/script";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import Image from "next/image";
import {
  getAllPosts,
  getPost,
  getRelatedPosts,
  CATEGORY_LABELS,
  CATEGORY_LABELS_ES,
  formatDate,
  type Post,
  type Faq,
} from "@/lib/blog";
import Callout from "@/app/components/blog/Callout";
import PostCard from "@/app/components/blog/PostCard";
import Navbar from "@/app/components/Navbar";

// ── Static params ─────────────────────────────────────────────────────────────

export function generateStaticParams() {
  return ["en", "es"].flatMap((locale) =>
    getAllPosts(locale).map((p) => ({ locale, slug: p.slug })),
  );
}

// ── SEO Metadata ──────────────────────────────────────────────────────────────

export async function generateMetadata({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const post = getPost(locale, slug);
  if (!post) return {};

  const BASE = "https://faro-jet.vercel.app";
  const url = `${BASE}/${locale}/blog/${slug}`;
  return {
    title: `${post.title} | Faro`,
    description: post.excerpt,
    authors: [{ name: post.author }],
    alternates: {
      canonical: url,
      languages: {
        en: `${BASE}/en/blog/${slug}`,
        es: `${BASE}/es/blog/${slug}`,
      },
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author],
      images: [
        post.coverImage
          ? { url: post.coverImage, width: 1200, height: 630 }
          : {
              url: `/api/og/blog?title=${encodeURIComponent(post.title)}&subtitle=${encodeURIComponent(post.excerpt.slice(0, 110))}`,
              width: 1200,
              height: 630,
            },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [
        post.coverImage ||
          `/api/og/blog?title=${encodeURIComponent(post.title)}&subtitle=${encodeURIComponent(post.excerpt.slice(0, 110))}`,
      ],
    },
  };
}

// ── JSON-LD ───────────────────────────────────────────────────────────────────

function buildArticleSchema(post: Post, locale: string) {
  const BASE = "https://faro-jet.vercel.app";
  const url = `${BASE}/${locale}/blog/${post.slug}`;

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: { "@type": "Organization", name: post.author },
    publisher: {
      "@type": "Organization",
      name: "Faro",
      logo: { "@type": "ImageObject", url: `${BASE}/icon.svg` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    ...(post.coverImage && {
      image: { "@type": "ImageObject", url: `${BASE}${post.coverImage}` },
    }),
    articleBody: post.content.slice(0, 500).replace(/[#*`<>[\]]/g, ""),
  };

  if (post.category === "for-cpas") {
    schema.audience = {
      "@type": "BusinessAudience",
      audienceType: "CPAs and accounting professionals",
    };
  }

  if (post.category === "miami-business" || post.category === "ai-search") {
    schema.locationCreated = { "@type": "Place", name: "Miami, FL" };
  }

  return schema;
}

function buildFaqSchema(faqs: Faq[]) {
  if (faqs.length < 2) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };
}

// ── MDX custom components ─────────────────────────────────────────────────────

const mdxComponents = {
  Callout,
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className="font-serif text-[32px] leading-tight text-navy mt-12 mb-4 first:mt-0"
      {...props}
    />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="font-serif text-[24px] leading-tight text-navy mt-8 mb-3" {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="font-sans text-lg text-charcoal leading-[1.8] mb-6" {...props} />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      className="text-terracotta underline underline-offset-4 hover:text-terracotta/80 transition-colors"
      {...props}
    />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="border-l-4 border-brass pl-6 py-2 my-6 font-serif italic text-xl text-charcoal"
      {...props}
    />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="font-sans text-lg text-charcoal space-y-2 mb-6 pl-0 list-none" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="font-sans text-lg text-charcoal space-y-2 mb-6 pl-4 list-decimal [&_li::marker]:text-brass" {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="flex gap-3 before:content-['·'] before:text-brass before:font-bold before:shrink-0 before:mt-0.5" {...props} />
  ),
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong className="font-semibold text-navy" {...props} />
  ),
  em: (props: React.HTMLAttributes<HTMLElement>) => (
    <em className="italic" {...props} />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code
      className="font-mono text-sm bg-cream-deep text-charcoal px-1.5 py-0.5 rounded"
      {...props}
    />
  ),
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <pre
      className="font-mono text-sm bg-cream-deep text-charcoal p-4 rounded-md overflow-x-auto my-6"
      {...props}
    />
  ),
  hr: () => <hr className="border-t border-brass/20 my-10" />,
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function PostPage({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}) {
  setRequestLocale(locale);

  const post = getPost(locale, slug);
  if (!post) notFound();

  const related = getRelatedPosts(locale, slug, post.category, 3);
  const labels = locale === "es" ? CATEGORY_LABELS_ES : CATEGORY_LABELS;
  const categoryLabel = labels[post.category] ?? post.category;
  const readLabel = locale === "es" ? "min de lectura" : "min read";
  const articleSchema = buildArticleSchema(post, locale);
  const faqSchema = post.faqs.length >= 2 ? buildFaqSchema(post.faqs) : null;

  return (
    <>
      <Navbar />

      {/* JSON-LD */}
      <Script
        id="article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {faqSchema && (
        <Script
          id="faq-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <main className="bg-cream">
        <article className="max-w-prose mx-auto px-6 pt-32 pb-20">
          {/* Back link */}
          <Link
            href={`/${locale}/blog`}
            className="inline-flex items-center gap-2 font-sans text-sm text-charcoal/60 hover:text-charcoal no-underline hover:no-underline mb-10 transition-colors group"
          >
            <span aria-hidden="true" className="group-hover:-translate-x-0.5 transition-transform">←</span>
            {locale === "es" ? "Volver al blog" : "Back to blog"}
          </Link>

          {/* Category pill */}
          <span className="inline-block mb-4 px-3 py-1 rounded-full font-sans text-[11px] font-semibold uppercase tracking-widest bg-brass/15 text-navy">
            {categoryLabel}
          </span>

          {/* Title */}
          <h1 className="font-serif text-[40px] md:text-[48px] leading-tight text-navy mb-6">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-sans text-base text-charcoal/60 mb-10">
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, locale)}</time>
            <span aria-hidden="true">·</span>
            <span>{post.readingTime} {readLabel}</span>
            <span aria-hidden="true">·</span>
            <span>{post.author}</span>
          </div>

          {/* Cover image */}
          {post.coverImage && (
            <div className="relative aspect-video w-full rounded-md overflow-hidden mb-10">
              <Image
                src={post.coverImage}
                alt=""
                fill
                className="object-cover"
                priority
                sizes="(max-width: 65ch) 100vw, 65ch"
              />
            </div>
          )}

          {/* Body */}
          <div>
            <MDXRemote source={post.content} components={mdxComponents} />
          </div>

          {/* FAQ section */}
          {post.faqs.length > 0 && (
            <section className="mt-16 pt-10 border-t border-brass/20" aria-labelledby="faq-heading">
              <h2 id="faq-heading" className="font-serif text-[28px] text-navy mb-8">
                {locale === "es" ? "Preguntas frecuentes" : "Frequently asked questions"}
              </h2>
              <dl className="space-y-8">
                {post.faqs.map((faq, i) => (
                  <div key={i}>
                    <dt className="font-serif text-xl text-navy mb-2">{faq.q}</dt>
                    <dd className="font-sans text-base leading-relaxed text-charcoal/80">{faq.a}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {/* CTA footer */}
          <div className="mt-16 bg-cream-deep rounded-xl p-8">
            <h3 className="font-serif text-[26px] text-navy mb-3">
              {locale === "es" ? "¿Quieres esto para tu negocio?" : "Want this for your business?"}
            </h3>
            <p className="font-sans text-base text-charcoal/80 mb-6">
              {locale === "es"
                ? "Faro rastrea cómo la IA recomienda negocios en Miami y te posiciona donde más importa."
                : "Faro tracks how AI recommends Miami businesses and gets you cited where it matters."}
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <a
                href={`/${locale}#waitlist`}
                className="inline-block bg-terracotta hover:bg-terracotta/90 text-cream font-sans font-medium text-base px-6 py-3 rounded-md transition-colors no-underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-terracotta focus:ring-offset-2"
              >
                {locale === "es" ? "Únete a la lista" : "Join the waitlist"}
              </a>
              <Link
                href={`/${locale}/faq`}
                className="inline-block font-sans text-base text-charcoal/60 hover:text-navy no-underline hover:underline transition-colors py-3"
              >
                {locale === "es"
                  ? "Ver preguntas frecuentes sobre Faro →"
                  : "Read our FAQ — pricing, how it works, who it's for →"}
              </Link>
            </div>
          </div>
        </article>

        {/* Related posts */}
        {related.length > 0 && (
          <section className="bg-cream-deep py-16">
            <div className="max-w-[1100px] mx-auto px-6">
              <h2 className="font-serif text-[28px] text-navy mb-8">
                {locale === "es" ? "Más artículos" : "More posts"}
              </h2>
              <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
                {related.map((p) => (
                  <PostCard key={p.slug} post={p} locale={locale} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="bg-cream-deep border-t border-brass/10">
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
