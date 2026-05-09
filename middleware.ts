import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match all paths except API routes, admin, Next.js internals, and static files.
  // Note: feed.xml is served by a route handler at /[locale]/blog/feed.xml — the
  // dot in the URL segment bypasses this matcher, so Next.js routes it directly.
  matcher: ["/((?!api|admin|_next|_vercel|.*\\..*).*)"],
};
