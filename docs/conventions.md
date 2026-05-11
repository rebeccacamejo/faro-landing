# Conventions — faro-landing

## Code style

**Linter:** Next.js built-in ESLint
**Type checker:** TypeScript (strict via Next.js config)

```bash
npm run lint
npx tsc --noEmit
```

No separate Prettier config. Use your editor's format-on-save with the Prettier extension.

## Design tokens

Same brand as faro-ops. Colors, fonts, and spacing are defined in `tailwind.config.ts`. Never use hex values directly in JSX.

| Color | Tailwind class |
|---|---|
| `#F8F4ED` (cream) | `bg-cream`, `text-cream` |
| `#1A2B4A` (navy) | `bg-navy`, `text-navy` |
| `#C45A3D` (terracotta) | `bg-terracotta` |

Fonts: Fraunces (serif headings), Inter (body). Loaded via `next/font` in root layout.

## Translation strings

Every user-visible string must exist in both `messages/en.json` and `messages/es.json`. Spanish is not an afterthought — both files are updated together.

When adding a string:
1. Add to `messages/en.json` with the English value
2. Add to `messages/es.json` with a real Spanish translation (not Google Translate — review for Miami Spanish register)
3. Use `useTranslations('namespace')` in the component

## Blog content standards

- Always answer a question in the first paragraph
- Include a clear meta description (excerpt) in frontmatter
- Category must be one of: `aeo`, `local-seo`, `ai-tools`, `case-studies`, `product`
- All posts reviewed before merging (blog quality = marketing quality)

## Commit and PR conventions

Same as faro-engine. See [faro-engine/docs/conventions.md](../../faro-engine/docs/conventions.md).

---

*Owner: Rebecca · Last reviewed: 2026-05-10 · Questions? Open an issue or ask in #engineering*
