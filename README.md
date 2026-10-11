# Last-minute Gent

Website waar Gentse salons (kappers, nagel- en wimperstudio's,
schoonheidsspecialisten) hun lege last-minute slots met korting aanbieden,
en klanten die slots met één klik claimen.

Volledig bouwplan staat in [`PLAN.md`](./PLAN.md).

## Stack

- Next.js 16 (App Router, Turbopack, TypeScript, React 19)
- Tailwind CSS v4
- Supabase (Postgres, Auth via magic link, EU-regio)
- `@supabase/ssr` voor cookies-based auth
- Resend voor transactionele e-mails
- GSAP + Lenis + react-bits voor animaties op de homepage
- Hosting op Vercel

## Lokaal starten

```bash
npm install
cp .env.local.example .env.local      # vul keys in
npm run dev                            # http://localhost:3000
```

### Dev-login (bypass email rate limit)

Supabase heeft een strikte rate-limit op magic-link mails. In dev kan je
rechtstreeks ingelogd worden zonder mail:

```
http://localhost:3000/api/dev-signin?email=marcus.bergez@gmail.com
```

Deze route is in productie uitgeschakeld (`NODE_ENV !== "development"`).

## Supabase migraties

```bash
npx supabase link --project-ref <jouw-project-ref>
npx supabase db push
```

Migraties staan in [`supabase/migrations/`](./supabase/migrations/), gesorteerd
op timestamp.

## Project-structuur

- `app/` — App Router pages & layouts (NL, mobile-first)
- `components/` — Shared components (home, consent, SplitText, UI)
- `lib/supabase/` — Browser-, server-, admin- en middleware-clients
- `lib/email/` — Resend-wrapper + React Email templates
- `lib/auth.ts` — auth-helpers (requireUser, requireAdmin, getOwnBusiness)
- `lib/bron.ts` — UTM-bron cookie helper
- `proxy.ts` — Next 16 proxy (ex-middleware): sessie-refresh + UTM-capture
- `supabase/migrations/` — SQL-migraties
- `PLAN.md` — productplan

## Env variabelen

| Var | Doel | Verplicht |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service_role key (server-only) | ✅ |
| `NEXT_PUBLIC_SITE_URL` | Volledige site-URL voor magic-link redirects | ✅ |
| `NEXT_PUBLIC_ADMIN_EMAIL` | Admin e-mail (document, policy is hardcoded) | ⚠️ |
| `RESEND_API_KEY` | Resend API key | ✅ voor mails |
| `EMAIL_FROM` | Afzender, bv. `"Last-minute Gent <noreply@domein.be>"` | ✅ voor mails |
| `NEXT_PUBLIC_FEE_PER_SHOW` | Factuurbedrag per doorgegane afspraak (default `3`) | optioneel |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta Pixel ID (laadt enkel na cookie-consent) | optioneel |

## Vercel deployment

1. **Push naar GitHub** (zie `git remote add origin ...`)
2. **Importeer in Vercel**: https://vercel.com/new → selecteer deze repo
3. **Framework**: Vercel detecteert Next.js automatisch
4. **Env variables**: kopieer alle verplichte vars uit tabel hierboven in Vercel
   dashboard → Settings → Environment Variables
5. **Build**: Vercel draait `npm run build` automatisch
6. **Supabase redirect URL whitelist**: voeg
   `https://<jouw-vercel-domein>.vercel.app/auth/callback` toe aan Supabase →
   Authentication → URL Configuration → Redirect URLs
7. **NEXT_PUBLIC_SITE_URL**: pas aan naar `https://<jouw-vercel-domein>.vercel.app`
8. **Custom domein** (later): Vercel Settings → Domains + DNS-records bij je
   registrar

### Vóór livegang

- [ ] Legal pages (`/privacy`, `/voorwaarden`) nagekeken (Gentrepreneur of
  jurist)
- [ ] Ondernemingsnummer ingevuld in `/voorwaarden`
- [ ] Resend custom domein geverifieerd (`EMAIL_FROM` naar `noreply@domein.be`)
- [ ] Supabase email rate limits aangepast voor production (via custom SMTP)
- [ ] 5+ Gentse zaken aangemeld en goedgekeurd met echte slots
- [ ] QR-codes + Instagram-stories klaar voor elke zaak
- [ ] Advertentie-test (€50–€100, 2 weken, met eigen UTM-links)

## Fases (uit PLAN.md)

- ✅ **Fase 0** — Project opzetten + datamodel
- ✅ **Fase 1** — Zaken en slots (`/voor-zaken`, `/dashboard`, `/admin`)
- ✅ **Fase 2** — Aanbod en claimen (`/`, `/deal/[id]`, `/zaak/[slug]`)
- ✅ **Fase 3** — E-mails via Resend + regels (pg_cron, no-show-blokkade)
- ✅ **Fase 4** — Admin-overzicht, cookiebanner, Meta Pixel, legal pages, Vercel-ready
