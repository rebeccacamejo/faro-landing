import createMiddleware from "next-intl/middleware";
import { type NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

const BOT_RE =
  /GPTBot|ClaudeBot|PerplexityBot|anthropic-ai|ChatGPT-User|Google-Extended|CCBot/i;

export default function middleware(req: NextRequest) {
  const response = intlMiddleware(req);

  // Best-effort bot visit logging — fire and forget, never blocks the response.
  // To set up the table: run this SQL in Supabase:
  //   create table faro_bot_visits (
  //     id uuid primary key default gen_random_uuid(),
  //     user_agent text,
  //     path text,
  //     locale text,
  //     visited_at timestamptz default now()
  //   );
  const ua = req.headers.get("user-agent") ?? "";
  if (BOT_RE.test(ua)) {
    logBotVisit(req, ua).catch(() => undefined);
  }

  return response;
}

async function logBotVisit(req: NextRequest, userAgent: string): Promise<void> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) return;

  const path = req.nextUrl.pathname;
  // Extract locale from path prefix (e.g. /en/faq → "en")
  const locale = path.split("/")[1] ?? "";

  await fetch(`${supabaseUrl}/rest/v1/faro_bot_visits`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ user_agent: userAgent, path, locale }),
  });
}

export const config = {
  // Match all paths except API routes, admin, Next.js internals, and static files.
  // Note: feed.xml is served by a route handler at /[locale]/blog/feed.xml — the
  // dot in the URL segment bypasses this matcher, so Next.js routes it directly.
  matcher: ["/((?!api|admin|_next|_vercel|.*\\..*).*)"],
};
