# Getting Started — faro-landing

This guide gets the marketing site running locally. Budget 10-15 minutes.

## Prerequisites

| Requirement | Version | Check |
|---|---|---|
| Node.js | 20+ | `node --version` |
| npm | 10+ | `npm --version` |
| Git | any | `git --version` |

You do not need faro-engine running to work on the marketing site. The site only calls Supabase directly (for the waitlist) and Resend (for confirmation emails).

## Local setup

### 1. Clone and install

```bash
git clone https://github.com/rebeccacamejo/faro-landing
cd faro-landing
npm install
```

Expected: npm installs ~12 dependencies in a few seconds. No native compilation needed.

### 2. Configure environment

```bash
cp .env.local.example .env.local
```

Fill in the Supabase values (get them from Supabase → Settings → API):

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://ivgbrjlwxjwyjpvzuvgg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...   # anon/public key
SUPABASE_SERVICE_ROLE_KEY=eyJ...       # service_role key (server-only)

# Optional — leave blank to skip confirmation emails in dev
RESEND_API_KEY=re_...
```

The `NEXT_PUBLIC_` keys are embedded in the browser bundle — never put secrets there. The service role key is only accessed server-side in route handlers.

### 3. Start the dev server

```bash
npm run dev
```

Site runs at `http://localhost:3000`. You should see the Faro landing page.

Toggle locale by navigating to `/en` (English) or `/es` (Spanish). The locale is stored in the URL prefix, not a cookie, so both languages can be open simultaneously in different tabs.

### 4. Verify key routes

| URL | What to check |
|---|---|
| `http://localhost:3000` | Landing page loads, hero section visible |
| `http://localhost:3000/es` | Spanish version, all copy translated |
| `http://localhost:3000/blog` | Blog listing page with 6 seed posts |
| `http://localhost:3000/faq` | FAQ accordion |
| `http://localhost:3000/refer/test123` | Referral banner appears |

Waitlist form submission requires Supabase to be configured. Without it, form submit will error (the Supabase client will throw on `.insert()`).

## How i18n works

Locale is configured in `i18n/routing.ts`. The middleware in `middleware.ts` detects the user's browser language and redirects `/` to `/en` or `/es`. All pages live under `app/[locale]/`.

Translation strings live in `messages/en.json` and `messages/es.json`. The `next-intl` library resolves `t('key')` at render time based on the current locale segment.

To add a new translated string:
1. Add the key to both `messages/en.json` and `messages/es.json`
2. Use `const t = useTranslations('namespace')` in the component

## Blog

Blog posts are MDX files in `content/blog/`. Each file has frontmatter:

```yaml
---
title: "Post title"
date: "2026-05-01"
category: "aeo"
excerpt: "Short description for the listing page."
author: "Rebecca Camejo"
---
```

To add a post: create a new `.mdx` file in `content/blog/`. The slug is the filename without extension. The post appears in the listing at `/blog` and at `/blog/[slug]`.

## faro-pixel package

The attribution tracker is a separate package in `packages/faro-pixel/`. It builds to `public/pixel.js` (served from heyfaro.com/pixel.js) and `dist/` (for npm distribution).

```bash
cd packages/faro-pixel
npm install
node build.mjs
```

Tests:
```bash
cd packages/faro-pixel
npx vitest run
```

## How to run linting

```bash
npm run lint
```

Uses Next.js's built-in ESLint config. No additional configuration needed.

## How to run tests

The marketing site itself has no Jest/Vitest tests — it's a content-heavy site where visual verification matters more than unit tests. The pixel package has Vitest tests (see above).

For integration testing the waitlist flow, submit the form manually in a browser against the local dev server.

## Troubleshooting

### Port 3000 already in use

faro-ops runs on 3001 by default. If you have other Next.js apps on 3000:
```bash
npm run dev -- --port 3002
```

### "supabaseUrl is required"

The `.env.local` file isn't being loaded. Confirm it exists in the repo root (not inside `app/`). Next.js only loads `.env.local` from the root.

### Waitlist form submits but shows an error

Check the browser console and the terminal where `npm run dev` is running. Common causes:
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` is wrong (copy from Supabase, not a custom key)
- The `waitlist` table doesn't exist in your Supabase project — run the migrations from faro-engine first

### Blog posts not showing

Confirm the `.mdx` file has valid frontmatter (no missing quotes, valid date format `YYYY-MM-DD`). The `lib/blog.ts` reader will silently skip files with invalid frontmatter.

---

*Owner: Rebecca · Last reviewed: 2026-05-10 · Questions? Open an issue or ask in #engineering*
