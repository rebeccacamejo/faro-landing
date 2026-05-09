import Link from "next/link";
import type { Post } from "@/lib/blog";
import { CATEGORY_LABELS, CATEGORY_LABELS_ES, formatDate } from "@/lib/blog";

interface Props {
  post: Post;
  locale: string;
}

export default function PostCard({ post, locale }: Props) {
  const labels = locale === "es" ? CATEGORY_LABELS_ES : CATEGORY_LABELS;
  const categoryLabel = labels[post.category] ?? post.category;
  const readLabel = locale === "es" ? "min de lectura" : "min read";

  return (
    <Link
      href={`/${locale}/blog/${post.slug}`}
      className="group flex flex-col bg-cream-deep border border-brass/20 rounded-lg p-6 no-underline hover:no-underline transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-terracotta focus:ring-offset-2"
    >
      {/* Category pill */}
      <span className="inline-block self-start mb-3 px-2.5 py-1 rounded-full font-sans text-[11px] font-semibold uppercase tracking-widest bg-brass/15 text-navy">
        {categoryLabel}
      </span>

      {/* Title */}
      <h3 className="font-serif text-[22px] leading-tight text-navy mb-3 group-hover:text-terracotta transition-colors">
        {post.title}
      </h3>

      {/* Excerpt */}
      <p className="font-sans text-sm leading-relaxed text-charcoal/80 line-clamp-3 flex-1 mb-4">
        {post.excerpt}
      </p>

      {/* Meta row */}
      <div className="flex items-center gap-2 font-sans text-xs text-charcoal/50">
        <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, locale)}</time>
        <span aria-hidden="true">·</span>
        <span>{post.readingTime} {readLabel}</span>
      </div>
    </Link>
  );
}
