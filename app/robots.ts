import type { MetadataRoute } from "next";

// Faro's product is making businesses visible to AI — we explicitly welcome
// all AI training and citation crawlers. This is the opposite of what most
// sites do, and it's intentional.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "anthropic-ai", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "CCBot", allow: "/" },
      { userAgent: "*", allow: "/" },
    ],
    sitemap: "https://faro-jet.vercel.app/sitemap.xml",
  };
}
