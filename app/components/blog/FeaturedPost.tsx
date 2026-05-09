import Link from "next/link";
import Image from "next/image";
import type { Post } from "@/lib/blog";
import { CATEGORY_LABELS, CATEGORY_LABELS_ES, formatDate } from "@/lib/blog";

interface Props {
  post: Post;
  locale: string;
}

export default function FeaturedPost({ post, locale }: Props) {
  const labels = locale === "es" ? CATEGORY_LABELS_ES : CATEGORY_LABELS;
  const categoryLabel = labels[post.category] ?? post.category;
  const readLabel = locale === "es" ? "min de lectura" : "min read";

  return (
    <Link
      href={`/${locale}/blog/${post.slug}`}
      className="group grid md:grid-cols-2 bg-cream-deep border border-brass/20 rounded-xl overflow-hidden no-underline hover:no-underline transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-terracotta focus:ring-offset-2 mb-12"
    >
      {/* Cover image — left half; if absent, collapses */}
      {post.coverImage && (
        <div className="relative aspect-video md:aspect-auto md:h-full min-h-[280px] overflow-hidden">
          <Image
            src={post.coverImage}
            alt=""
            fill
            className="object-cover object-center group-hover:scale-[1.02] transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      )}

      {/* Content — right half (or full-width if no image) */}
      <div className={`flex flex-col justify-center p-8 md:p-10 ${!post.coverImage ? "md:col-span-2" : ""}`}>
        {/* Category pill */}
        <span className="inline-block self-start mb-4 px-3 py-1 rounded-full font-sans text-[11px] font-semibold uppercase tracking-widest bg-brass text-navy">
          {categoryLabel}
        </span>

        <h2 className="font-serif text-[32px] md:text-[36px] leading-tight text-navy mb-4 group-hover:text-terracotta transition-colors">
          {post.title}
        </h2>

        <p className="font-sans text-base leading-relaxed text-charcoal mb-6">
          {post.excerpt}
        </p>

        <div className="flex items-center gap-2 font-sans text-xs text-charcoal/50">
          <span>{post.author}</span>
          <span aria-hidden="true">·</span>
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, locale)}</time>
          <span aria-hidden="true">·</span>
          <span>{post.readingTime} {readLabel}</span>
        </div>
      </div>
    </Link>
  );
}
