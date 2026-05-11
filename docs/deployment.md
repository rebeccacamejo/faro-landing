# Deployment — faro-landing

## Target: Vercel

faro-landing is deployed to Vercel at `heyfaro.com`. Project ID: `prj_26sFaLkZBhfLb4jmoufAs7gpslo9`. Auto-deploys from `main`.

## Deploy a new version

```bash
git push origin main
```

Vercel builds and deploys automatically. Build takes ~45 seconds.

Manual deploy:
```bash
vercel --prod
```

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Server-side admin access for waitlist management |
| `RESEND_API_KEY` | Yes | Waitlist confirmation emails |

## Domain configuration

- `heyfaro.com` → Vercel (A record or CNAME)
- `www.heyfaro.com` → redirect to `heyfaro.com`

DNS is managed separately. Check Vercel → Project → Domains for current configuration.

## Rollback

Vercel → Deployments → find last good deploy → "Promote to Production."

---

*Owner: Rebecca · Last reviewed: 2026-05-10 · Questions? Open an issue or ask in #engineering*
