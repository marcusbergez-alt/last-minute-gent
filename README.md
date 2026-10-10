# Startup 1 — Last-minute afspraken

Website waar Gentse salons (kappers, nagel- en wimperstudio's, schoonheidsspecialisten)
hun lege last-minute slots met korting aanbieden, en klanten die slots met één klik claimen.

Volledig bouwplan staat in [`PLAN.md`](./PLAN.md).

## Stack

- Next.js 16 (App Router, Turbopack, TypeScript, React 19)
- Tailwind CSS v4
- Supabase (Postgres, Auth via magic link, Europese regio)
- `@supabase/ssr` voor cookies-based auth

## Lokaal starten

1. Dependencies:
   ```bash
   npm install
   ```
2. Kopieer env-template en vul je Supabase-keys in (Settings → API in het Supabase dashboard):
   ```bash
   cp .env.local.example .env.local
   ```
3. Start de dev-server:
   ```bash
   npm run dev
   ```
   Open http://localhost:3000.

## Supabase migraties

```bash
# Eenmalig: koppel aan je cloud-project (project-ref vind je in dashboard URL).
npx supabase link --project-ref <jouw-project-ref>

# Push migraties naar de cloud:
npx supabase db push
```

## Project-structuur

- `app/` — App Router pages & layouts (NL, mobile-first)
- `lib/supabase/` — Supabase clients voor browser, server en middleware
- `middleware.ts` — ververst de Supabase-sessie op elke request
- `supabase/migrations/` — SQL-migraties, versioned via git
- `PLAN.md` — productplan en fases

## Fases (uit PLAN.md)

- **Fase 0** — Project opzetten + datamodel (huidige fase)
- **Fase 1** — Zaken en slots (`/voor-zaken`, `/dashboard`, `/admin`)
- **Fase 2** — Aanbod en claimen (`/`, `/deal/[id]`, `/zaak/[slug]`)
- **Fase 3** — E-mails via Resend + regels
- **Fase 4** — Meten, cookiebanner, livegang op Vercel
