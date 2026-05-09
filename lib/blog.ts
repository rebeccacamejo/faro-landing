import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

export type PostCategory =
  | "ai-search"
  | "miami-business"
  | "for-cpas"
  | "case-studies"
  | "bilingual";

export interface Faq {
  q: string;
  a: string;
}

export interface Post {
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  author: string;
  category: PostCategory;
  readingTime: number;
  coverImage: string;
  featured: boolean;
  locale: string;
  faqs: Faq[];
  content: string;
}

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");

export function getPostSlugs(locale: string): string[] {
  const dir = path.join(CONTENT_DIR, locale);
  try {
    return fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".mdx"))
      .map((f) => f.replace(/\.mdx$/, ""));
  } catch {
    return [];
  }
}

export function getPost(locale: string, slug: string): Post | null {
  const filePath = path.join(CONTENT_DIR, locale, `${slug}.mdx`);
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);
    const rt = readingTime(content);
    return {
      title: data.title ?? "",
      slug: data.slug ?? slug,
      excerpt: data.excerpt ?? "",
      publishedAt: data.publishedAt ?? "",
      author: data.author ?? "Faro",
      category: data.category ?? "ai-search",
      readingTime: data.readingTime ?? Math.ceil(rt.minutes),
      coverImage: data.coverImage ?? "",
      featured: data.featured ?? false,
      locale,
      faqs: data.faqs ?? [],
      content,
    };
  } catch {
    return null;
  }
}

export function getAllPosts(locale: string): Post[] {
  return getPostSlugs(locale)
    .map((slug) => getPost(locale, slug))
    .filter((p): p is Post => p !== null)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
}

export function getPostsByCategory(locale: string, category: string): Post[] {
  return getAllPosts(locale).filter((p) => p.category === category);
}

export function getFeaturedPost(locale: string): Post | undefined {
  return getAllPosts(locale).find((p) => p.featured);
}

export function getRelatedPosts(
  locale: string,
  currentSlug: string,
  category: string,
  limit = 3,
): Post[] {
  const same = getAllPosts(locale).filter(
    (p) => p.slug !== currentSlug && p.category === category,
  );
  const rest = getAllPosts(locale).filter(
    (p) => p.slug !== currentSlug && p.category !== category,
  );
  return [...same, ...rest].slice(0, limit);
}

export const CATEGORY_LABELS: Record<PostCategory | "all", string> = {
  all: "All",
  "ai-search": "AI Search",
  "miami-business": "Miami Business",
  "for-cpas": "For CPAs",
  "case-studies": "Case Studies",
  bilingual: "Bilingual",
};

export const CATEGORY_LABELS_ES: Record<PostCategory | "all", string> = {
  all: "Todo",
  "ai-search": "Búsqueda en IA",
  "miami-business": "Negocios en Miami",
  "for-cpas": "Para CPAs",
  "case-studies": "Casos de estudio",
  bilingual: "Bilingüe",
};

export function formatDate(iso: string, locale: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString(locale === "es" ? "es-US" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
