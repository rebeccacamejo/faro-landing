# Testing — faro-landing

## Philosophy

The marketing site has minimal automated testing. Visual correctness matters more than unit coverage here. Manual testing the golden path (landing → waitlist → confirmation) before each production deploy is the standard.

## faro-pixel tests

The pixel package has a Vitest suite:

```bash
cd packages/faro-pixel
npx vitest run

# Watch mode during development
npx vitest
```

Tests cover: AI referrer detection, event payload format, error handling when faro-engine is unreachable.

## Manual test checklist (before production deploy)

- [ ] Landing page loads in English and Spanish
- [ ] Waitlist form submits successfully (check Supabase `waitlist` table)
- [ ] Confirmation screen shows position and referral link
- [ ] Blog listing page loads with all posts
- [ ] Individual blog post loads (try `/blog/aeo-vs-seo` or similar)
- [ ] FAQ accordion opens and closes
- [ ] Locale toggle switches between /en and /es without full page reload
- [ ] Referral link (`/refer/<code>`) shows the referral banner
- [ ] OG image endpoints work: `/api/og` and `/api/og/blog`

## Type checking

```bash
npx tsc --noEmit
```

Run before every PR. TypeScript errors in the marketing site often indicate a changed API or missing translation key.

---

*Owner: Rebecca · Last reviewed: 2026-05-10 · Questions? Open an issue or ask in #engineering*
