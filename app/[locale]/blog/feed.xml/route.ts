import { NextRequest, NextResponse } from "next/server";
import { getAllPosts } from "@/lib/blog";

const BASE = "https://faro-jet.vercel.app";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET(
  _req: NextRequest,
  { params: { locale } }: { params: { locale: string } },
) {
  const posts = getAllPosts(locale);
  const isEs = locale === "es";

  const feedTitle = isEs
    ? "Faro — Notas de campo sobre la búsqueda con IA"
    : "Faro — Field notes on AI search";
  const feedDescription = isEs
    ? "Cómo los agentes de IA están cambiando cómo los clientes encuentran negocios en Miami."
    : "How AI agents are changing how customers find businesses in Miami.";
  const feedLink = `${BASE}/${locale}/blog`;
  const feedSelf = `${BASE}/${locale}/blog/feed.xml`;
  const language = isEs ? "es-us" : "en-us";

  const items = posts
    .map(
      (post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${BASE}/${locale}/blog/${post.slug}</link>
      <guid isPermaLink="true">${BASE}/${locale}/blog/${post.slug}</guid>
      <description>${escapeXml(post.excerpt)}</description>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <author>hello@heyfaro.com (${escapeXml(post.author)})</author>
      <category>${escapeXml(post.category)}</category>
    </item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(feedTitle)}</title>
    <link>${feedLink}</link>
    <description>${escapeXml(feedDescription)}</description>
    <language>${language}</language>
    <atom:link href="${feedSelf}" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${posts[0] ? new Date(posts[0].publishedAt).toUTCString() : new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
