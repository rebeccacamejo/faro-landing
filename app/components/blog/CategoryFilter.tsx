import Link from "next/link";
import type { PostCategory } from "@/lib/blog";
import { CATEGORY_LABELS, CATEGORY_LABELS_ES } from "@/lib/blog";

const CATEGORIES: Array<PostCategory | "all"> = [
  "all",
  "ai-search",
  "miami-business",
  "for-cpas",
  "case-studies",
  "bilingual",
];

interface Props {
  locale: string;
  activeCategory: PostCategory | "all";
}

export default function CategoryFilter({ locale, activeCategory }: Props) {
  const labels = locale === "es" ? CATEGORY_LABELS_ES : CATEGORY_LABELS;

  return (
    <nav aria-label={locale === "es" ? "Filtrar por categoría" : "Filter by category"}>
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => {
          const isActive = cat === activeCategory;
          const href =
            cat === "all"
              ? `/${locale}/blog`
              : `/${locale}/blog/category/${cat}`;

          return (
            <Link
              key={cat}
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={[
                "px-4 py-1.5 rounded-full font-sans text-sm font-medium transition-colors duration-150 no-underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-terracotta focus:ring-offset-1",
                isActive
                  ? "bg-navy text-cream"
                  : "bg-transparent text-charcoal border border-brass/50 hover:border-brass hover:text-navy",
              ].join(" ")}
            >
              {labels[cat]}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
