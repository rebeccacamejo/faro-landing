import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";

const BASE_URL = "https://faro-jet.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const enPosts = getAllPosts("en");
  const esPosts = getAllPosts("es");

  const postEntries: MetadataRoute.Sitemap = [...enPosts, ...esPosts].map((post) => ({
    url: `${BASE_URL}/${post.locale}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const blogIndexEntries: MetadataRoute.Sitemap = ["en", "es"].map((locale) => ({
    url: `${BASE_URL}/${locale}/blog`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: `${BASE_URL}/en`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/es`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...blogIndexEntries,
    ...postEntries,
  ];
}
