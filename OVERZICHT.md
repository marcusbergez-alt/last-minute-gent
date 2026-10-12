# Last-minute Gent — Projectoverzicht

> Dit document geeft een volledig overzicht van het project. Lees eerst dit,
> daarna [`PLAN.md`](./PLAN.md) voor het oorspronkelijke productplan en
> [`README.md`](./README.md) voor technische setup-instructies.

Datum laatste update: 2026-10-12 · Status: **live op Vercel (stealth, geen eigen domein nog)**

---

## 1. Wat is het?

Last-minute Gent is een webplatform waar **Gentse salons** (kappers, nagel-
en wimperstudio's, schoonheidsspecialisten) hun lege last-minute slots met
korting aanbieden. Klanten claimen een slot met één klik en betalen de
kortingsprijs rechtstreeks in de zaak.

**Verdienmodel**: €3 (voorlopig) per afspraak die effectief doorging,
maandelijks gefactureerd aan de zaak. Eerste maand gratis voor testzaken.

**Doelgroep**:
- *Vraag*: Gentenaars tussen 18–35, studenten als eerste groep. Bereikt via
  salon-Instagram, QR-codes aan de kassa en Facebook/Instagram-advertenties.
- *Aanbod*: Gentse salons die last-minute uren willen opvullen.

**Betaling**: enkel in de zaak. Het platform int geen betalingen — vereenvoudigt
heel wat administratief en wettelijk werk voor v1.

---

## 2. Wat is er al gebouwd?

Alle 5 originele fases uit [`PLAN.md`](./PLAN.md) zijn afgerond + een pre-live
sprint:

| Fase | Status | Resultaat |
|------|--------|-----------|
| 0 | ✅ | Next.js 16 + Tailwind + Supabase, datamodel met RLS, 6 tabellen |
| 1 | ✅ | Zaak-aanmelding, dashboard, admin-goedkeuring |
| 2 | ✅ | Publieke homepage met deals-grid, deal-detail, bevestigingspagina, zaakpagina |
| 3 | ✅ | Transactionele e-mails via Resend, auto-expire van voorbije slots via pg_cron |
| 4 | ✅ | Admin-overzicht (factuur-basis), cookiebanner, Meta-pixel scaffold, legal pages |
| Pre-live | ✅ | QR-code per zaak, Open Graph previews, sitemap, robots.txt |

**Live URL** (stealth, niet publiek gedeeld):
https://last-minute-gent.vercel.app

---

## 3. Techniek-stack

| Laag | Technologie | Reden |
|------|-------------|-------|
| Framework | **Next.js 16** (App Router, Turbopack) | Server Components + Server Actions zonder aparte backend |
| Taal | **TypeScript** strict | Type-safety |
| UI | **Tailwind CSS v4** | Snelle styling, mobile-first |
| Animatie | **GSAP 3.15 + Lenis 1.3 + react-bits** | Smooth scroll + text-animaties op homepage |
| UI componenten | **shadcn/ui** | Registry voor react-bits imports |
| Database | **Supabase Postgres** (EU-regio, Frankfurt) | GDPR-compliant hosting, RLS |
| Auth | **Supabase Auth** (magic link) | Geen wachtwoorden, email-based |
| Server client | **`@supabase/ssr`** | Cookies-based auth voor App Router |
| E-mail | **Resend** | Transactioneel, React Email templates |
| Hosting | **Vercel Hobby** (gratis) | Automatische CI/CD vanaf GitHub main |
| Versiebeheer | **GitHub** | `marcusbergez-alt/last-minute-gent` |

**Alles Nederlands**: UI-teksten, database-kolomnamen, email-templates. Alle
tijden in Europe/Brussels. Mobile-first want 95%+ van bezoekers komt via
Instagram op gsm.

---

## 4. Externe diensten en koppelingen

### Supabase (database + auth)
- **Project ref**: `bdaqocgrqctxnhrextte`
- **Dashboard**: https://supabase.com/dashboard/project/bdaqocgrqctxnhrextte
- **Regio**: EU Central (Frankfurt)
- **Tabellen**: `businesses`, `services`, `slots`, `claims`, `customers`,
  `subscribers` — alle met Row Level Security
- **RPCs** (Postgres-functies): `claim_slot`, `cancel_claim`,
  `get_claim_summary`, `increment_no_show`, `is_admin`
- **Cron**: `pg_cron`-job `expire-open-slots` draait elke minuut en zet
  verlopen open slots op `voorbij`

### Resend (e-mails)
- **API-key**: zie `.env.local` (niet gecommit, aparte secret)
- **Sender**: `onboarding@resend.dev` (dev-sender, enkel naar
  `marcus.bergez@gmail.com`)
- **Templates** in `lib/email/templates/`:
  1. `claim-confirmation` → klant krijgt code na claim
  2. `business-notification` → zaak krijgt melding bij nieuwe claim
  3. `new-slot-digest` → subscribers krijgen melding bij elke nieuwe slot

### Vercel (hosting)
- **Project**: `last-minute-gent`
- **Deploy**: automatisch op elke push naar `main`
- **Preview**: automatisch per branch
- **Env vars**: ingesteld in Vercel dashboard (zie `.env.local.example` voor lijst)

### GitHub (code)
- **Repo**: https://github.com/marcusbergez-alt/last-minute-gent
- **Branch**: `main`
- **Hooks**: Vercel deploy triggert automatisch

---

## 5. URL's en routes

Alle 22 routes op https://last-minute-gent.vercel.app:

### Publiek (geen login)
- `/` — hero + live deals-grid met filters (vandaag/morgen/alles, type zaak)
- `/voor-zaken` — aanmeldformulier voor nieuwe zaken
- `/auth/signin` — inloggen (magic link)
- `/auth/callback` — verwerkt magic-link redirect
- `/auth/check-email` — "we hebben je een link gestuurd"
- `/deal/[id]` — slot-detail + claim-formulier
- `/deal/[id]/bevestigd?claim=<uuid>` — bevestiging met code + cancel-knop
- `/zaak/[slug]` — zaakpagina met alle open slots (QR-doel)
- `/zaak/[slug]/qr?size=1024` — QR-PNG download
- `/privacy` — privacyverklaring
- `/voorwaarden` — algemene voorwaarden
- `/sitemap.xml` + `/robots.txt` — SEO
- `/opengraph-image`, `/zaak/[slug]/opengraph-image`, `/deal/[id]/opengraph-image`
  — dynamische Open Graph previews voor sociale media

### Zaak-eigenaar (ingelogd)
- `/dashboard` — status, slot-lijst, add-slot form, claim-management
- `/dashboard/profiel` — zaakprofiel bewerken + QR-code download

### Admin (enkel voor `marcus.bergez@gmail.com`)
- `/admin` — zaken goedkeuren / pauzeren / herintegreren
- `/admin/overzicht` — claims per zaak per maand met factuur-bedrag,
  UTM-bron rapport

### Dev-only (op prod gedisabled)
- `/api/dev-signin?email=X` — bypass email rate-limit lokaal

---

## 6. Hoofdflows

### Flow A — Zaak meldt zich aan
```
/voor-zaken → form invullen (naam, contactpersoon, e-mail, gsm, type)
          → magic-link verstuurd (user_metadata bevat zaakinfo)
          → klik link in mail → /auth/callback
          → businesses-rij aangemaakt met status='aangemeld'
          → redirect /dashboard
          → zie "In behandeling" + mag al slots toevoegen
          (nog niet publiek zichtbaar)
```

### Flow B — Admin keurt goed
```
Admin logt in via /auth/signin → /admin
      → ziet zaak onder "Wachtend op goedkeuring"
      → klik "Goedkeuren" → status='goedgekeurd'
      → zaak verschijnt publiek + slots verschijnen in /
```

### Flow C — Klant claimt slot
```
Bezoeker op / → ziet deals-grid → klik een kaart → /deal/[id]
             → form (naam, gsm, email, consent) → submit
             → claim_slot RPC: atomair (SELECT FOR UPDATE op slot)
                - checkt status='open' en start_tijd > now()
                - dedupeert customer op gsm
                - genereert 4-char code
                - update slot naar 'geclaimd'
             → redirect /deal/[id]/bevestigd?claim=<uuid>
             → after(): 2 e-mails via Resend
                1. klant krijgt code + cancel-link
                2. zaak krijgt naam/gsm/code van klant
             → klant toont code bij aankomst, betaalt in de zaak
```

### Flow D — Na de afspraak
```
Zaak op /dashboard → ziet claim → klik "Gekomen" of "Niet gekomen"
    - Gekomen: claim.status='gekomen', telt mee voor factuur
    - Niet gekomen: increment_no_show RPC bump't aantal_no_shows;
      bij 2 no-shows kan die gsm geen nieuwe slots meer claimen
Admin op /admin/overzicht → ziet maandoverzicht per zaak met factuurbedrag
      (aantal 'gekomen' × €3)
```

### Flow E — UTM-tracking
```
Bezoeker klikt bv. https://.../?utm_source=instagram&utm_campaign=studio-luna
          → proxy.ts zet cookie 'lmm_bron' = 'instagram:studio-luna' (30 dagen)
          → bij elke claim/subscribe schrijft server die cookie weg als 'bron'
          → /admin/overzicht toont inschrijvingen + claims per bron
```

### Flow F — Automatische expire
```
Slot start_tijd passeert → pg_cron 'expire-open-slots' draait elke minuut
    - open slots met start_tijd <= now() → status='voorbij'
    - geclaimd slots blijven staan (zaak moet nog markeren)
```

---

## 7. Datamodel

6 tabellen in Supabase schema `public`:

### `businesses`
Zaken die zich aangemeld hebben.
- `id` uuid, `naam`, `slug` (uniek, URL-friendly), `type`
  (kapper/nagelstudio/wimperstudio/schoonheidsspecialist)
- `adres`, `foto_url`, `instagram`, `email`, `gsm`
- `status`: aangemeld / goedgekeurd / gepauzeerd
- `owner_user_id` → `auth.users` (owner uit Supabase Auth)

### `services`
Behandelingen per zaak met standaardprijzen. **Nog niet gebruikt in v1**
(uitgesteld tot Fase 2+); slots hebben `behandeling_naam` als vrije tekst.

### `slots`
Een beschikbaar last-minute slot.
- `business_id`, `service_id` (nullable), `behandeling_naam` (vrije tekst)
- `start_tijd` (timestamptz), `normale_prijs`, `kortingsprijs`
  (`CHECK (korting < normaal)`)
- `status`: open / geclaimd / voorbij / geannuleerd

### `claims`
Een boeking van een klant op een slot.
- `slot_id`, `customer_id`, `code` (4 tekens)
- `status`: bevestigd / geannuleerd / gekomen / niet_gekomen
- UNIQUE partial index: één bevestigde claim per slot (atomariteit)

### `customers`
Mensen die ooit een slot claimden.
- `naam`, `gsm`, `email`, `toestemming_marketing`
- `bron` (UTM uit cookie), `aantal_no_shows`
- Dedupeerd op `gsm` bij een nieuwe claim

### `subscribers`
E-mails voor "verwittig me bij nieuwe deals".
- `email` (unique), `voorkeur_behandeling`, `bron`

### RLS-samenvatting
- **Publiek** mag goedgekeurde zaken + hun open toekomstige slots lezen
- **Zaak-eigenaar** mag eigen alles lezen + eigen slots CRUD; eigen claims
  updaten (gekomen/niet-gekomen)
- **Admin** (`is_admin()` = email == `marcus.bergez@gmail.com`) mag alles
- Klant-gegevens worden nooit publiek getoond; de zaak ziet alleen klanten
  via haar eigen claims
- INSERTs op `claims` en `customers` enkel via `claim_slot` RPC (security
  definer, atomair)

---

## 8. Belangrijke bestanden en mappen

```
app/
├── layout.tsx                          root metadata, cookiebanner, pixel
├── page.tsx                            hero + deals grid
├── globals.css                         Tailwind + shadcn tokens
├── robots.ts, sitemap.ts               SEO
├── opengraph-image.tsx                 default OG-image
│
├── voor-zaken/                         zaak-aanmelding
├── auth/signin, auth/callback,
│   auth/check-email/                   magic-link flow
├── dashboard/                          zaak-dashboard + profiel
├── admin/                              admin + /overzicht
├── deal/[id]/                          slot-detail + claim-form
│   └── bevestigd/                      confirmatie + cancel
├── zaak/[slug]/                        zaakpagina + /qr + /opengraph-image
├── privacy/, voorwaarden/              legal
└── api/dev-signin/                     dev-only login shortcut

components/
├── home/                               hero, deals-grid, reveal, subscriber-form
├── consent/                            cookie-banner, meta-pixel
├── providers/lenis-provider.tsx        smooth scroll
├── SplitText.tsx                       react-bits text animatie
└── ui/button.tsx                       shadcn

lib/
├── supabase/{client,server,admin,middleware}.ts
├── email/{client,send,layout,templates}
├── auth.ts                             requireUser, requireAdmin, getOwnBusiness
├── bron.ts                             UTM-cookie helper
├── slug.ts                             slugify
└── types.ts                            BusinessType, Business, Slot, Claim, …

proxy.ts                                Next 16 edge-proxy (ex-middleware):
                                        - supabase sessie-refresh op elke request
                                        - UTM-capture in cookie

supabase/migrations/                    6 SQL-migraties, chronologisch:
├── …_init.sql                          Fase 0: 6 tabellen + enums + RLS + claim_slot
├── …_slot_behandeling_vrije_tekst.sql  Fase 1: slots.behandeling_naam vrije tekst
├── …_increment_no_show.sql             Fase 1: RPC voor no-show counter
├── …_public_claim_rpcs.sql             Fase 2: get_claim_summary + cancel_claim
└── …_expire_slots_cron.sql             Fase 3: pg_cron voor expire
```

---

## 9. Env variabelen

Alle vars staan in `.env.local` (lokaal, niet gecommit) en zijn ook geconfigureerd
in Vercel dashboard voor productie.

| Variabele | Soort | Waar nodig |
|-----------|-------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | public | Alle Supabase-calls |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | public | Client en server-side anon queries |
| `SUPABASE_SERVICE_ROLE_KEY` | **secret** | Admin-ops (sitemap, admin-overzicht, email-dispatch) |
| `NEXT_PUBLIC_SITE_URL` | public | Magic-link redirects + sitemap absolute URLs |
| `NEXT_PUBLIC_ADMIN_EMAIL` | public | Documentatie; admin-check zit hardcoded in `is_admin()` RLS |
| `RESEND_API_KEY` | **secret** | Alle transactionele mails |
| `EMAIL_FROM` | public | Sender name + address |
| `NEXT_PUBLIC_FEE_PER_SHOW` | public | Factuurbedrag in /admin/overzicht (default `3`) |
| `NEXT_PUBLIC_META_PIXEL_ID` | public, optioneel | Meta Pixel laadt enkel als deze gezet is én consent gegeven |

---

## 10. Belangrijke commando's

```bash
# Lokaal starten
npm install
npm run dev                          # http://localhost:3000

# Snel inloggen in dev (bypass email rate-limit)
# Open in browser: http://localhost:3000/api/dev-signin?email=marcus.bergez@gmail.com

# Build-check (gebruik ook Vercel preview)
npm run build

# Supabase migratie toepassen op cloud
export SUPABASE_ACCESS_TOKEN=<pat>
npx supabase link --project-ref bdaqocgrqctxnhrextte   # eenmalig
npx supabase db push                                   # push nieuwe migraties
```

---

## 11. Wat is NOG niet gedaan (pre-launch checklist)

### Juridisch en content
- [ ] **Legal pages laten nakijken** door Gentrepreneur of een jurist
  (`/privacy` en `/voorwaarden` zijn drafts met disclaimer)
- [ ] **Ondernemingsnummer** invullen in `/voorwaarden` (regel 1-regel-fix)

### E-mail-infrastructuur voor productie
- [ ] **Resend custom domein** verifiëren (bv. `lastminutegent.be` toevoegen
  in Resend dashboard, SPF/DKIM-records bij registrar). Dan
  `EMAIL_FROM="Last-minute Gent <noreply@lastminutegent.be>"` zetten in
  Vercel env vars → geen `onboarding@resend.dev` restrictie meer, mails
  gaan naar iedereen.
- [ ] **Supabase custom SMTP** instellen via Resend (Supabase dashboard →
  Project Settings → Auth → SMTP). Verhoogt Supabase's eigen rate-limit op
  magic-link e-mails naar normale productie-waardes.

### Eigen domein
- [ ] **`lastminutegent.be`** kopen bij Combell (~€6/jaar)
- [ ] In Vercel: Settings → Domains → Add → DNS-records bij Combell toevoegen
- [ ] `NEXT_PUBLIC_SITE_URL` in Vercel updaten naar `https://lastminutegent.be`
- [ ] Supabase redirect URL whitelist aanpassen (`https://lastminutegent.be/auth/callback`)

### Go-to-market
- [ ] **5+ Gentse zaken** contacteren, aanmelden en goedkeuren
- [ ] Elke zaak krijgt haar **QR-code uit `/dashboard/profiel`** om in het
  salon te hangen
- [ ] Elke zaak maakt een **Instagram-story** die naar haar zaakpagina linkt
- [ ] **Advertentietest** draaien: €50–€100 Instagram/Facebook ads met eigen
  UTM-links (bv. `?utm_source=instagram&utm_campaign=test1`)

### Monitoring (nice to have, later)
- [ ] Error tracking (Sentry, gratis tier)
- [ ] Analytics (Vercel Analytics is gratis + GDPR-vriendelijker dan GA)

---

## 12. Belangrijke design-keuzes (en waarom)

- **Alles in het Nederlands**, inclusief databasekolommen. Reden: Belgische
  zaken, Belgisch publiek, geen internationale ambities voor v1. Trade-off:
  mix met Engelse Supabase-fields (`auth.users`, `aangemaakt_op` → `created_at`
  equivalent is Nederlands).
- **Geen online betalingen**. Klant betaalt in de zaak. Vermijdt payment
  processor, chargebacks, boekhouding voor Last-minute Gent. Trade-off: hogere
  no-show-kans (gemitigeerd door de 2-no-shows-blokkade regel).
- **Magic link auth i.p.v. wachtwoord**. Supabase default, geen wachtwoord-
  reset-infra nodig. Trade-off: Supabase gratis-tier heeft lage e-mail
  rate-limits (daarom custom SMTP via Resend als TODO).
- **Admin-email hardcoded** in `is_admin()` Postgres-functie (RLS-niveau).
  Enig admin-persoon in v1. Voor meer admins: tabel `admins` toevoegen met
  user_id refs.
- **UTM-bron in cookie** (30 dagen). Werkt zelfs als klant eerst de homepage
  bezoekt en later een slot claimt. Server leest cookie bij elke claim.
- **No-show-blokkade**: dedupe op `gsm` zorgt dat één persoon niet via
  verschillende e-mails de blokkade kan omzeilen. Trade-off: gezinnen die
  één gsm delen kunnen gezamenlijk geblokkeerd worden (edge case,
  acceptabel voor v1).
- **pg_cron voor expire** i.p.v. Vercel-cron. Reden: database-native, geen
  extra infra, geen Vercel-cron-rate-limits. Trade-off: enkel beschikbaar
  omdat Supabase pg_cron hostend ondersteunt.
- **Light theme only** (`color-scheme: light` op `<html>`). Dark mode-infra
  staat klaar via shadcn-tokens maar niet actief. Reden: salon-business,
  warm en toegankelijk, consistentere Instagram-shares.

---

## 13. Known issues en limitaties

- **Dev email rate-limit**: Supabase free-tier staat maar ~3–4 magic-link
  mails/uur per e-mailadres toe. Workaround lokaal:
  `http://localhost:3000/api/dev-signin?email=X` (uitgeschakeld op productie).
  Oplossing voor productie: custom SMTP via Resend.
- **Resend dev-sender**: `onboarding@resend.dev` mag **alleen** naar het
  Resend-account-adres sturen (= `marcus.bergez@gmail.com`). Pas na verified
  domain gaan mails naar iedereen.
- **Timezone**: Alles in `Europe/Brussels` wall-clock. Datumfilter op
  homepage (vandaag/morgen) rekent correct via `toLocaleDateString('sv-SE',
  {timeZone: 'Europe/Brussels'})`. Slot-input in dashboard converteert
  `datetime-local` client-side naar UTC ISO voor opslag.
- **Cache Components in Next 16**: uitgezet (`next.config.ts`:
  `cacheComponents: false`). Reden: alle pagina's lezen cookies voor auth,
  Cache Components verwachtte dan expliciete Suspense-grenzen die niet pasten
  bij een auth-first app.
- **`qrcode` on Node runtime**: QR-route is `nodejs` runtime (geen Edge),
  want `qrcode` package heeft Node Buffer. Werkt prima.

---

## 14. Credentials en toegang

**Secrets staan NIET in de git-repo**. Enkel in:
- `.env.local` (lokaal op jouw machine, in `.gitignore`)
- Vercel dashboard → Settings → Environment Variables
- Supabase dashboard → Settings → API (de 3 keys)
- Resend dashboard → API Keys

Supabase access-token (voor CLI, bv. `supabase db push`): genereren op
https://supabase.com/dashboard/account/tokens.

**Belangrijkste dashboards**:
- Supabase: https://supabase.com/dashboard/project/bdaqocgrqctxnhrextte
- Resend: https://resend.com/emails
- Vercel: https://vercel.com/dashboard
- GitHub: https://github.com/marcusbergez-alt/last-minute-gent

---

## 15. Tips voor wie het project overneemt / meebouwt

1. **Start lokaal**: lees `README.md`, run `npm install && npm run dev`.
2. **Lees PLAN.md** voor het oorspronkelijke product-plan en de 5 fases.
3. **Elke feature-aanpassing**: push naar `main` → Vercel deployt automatisch.
   Voor risicovolle wijzigingen: maak een branch, krijg een preview-URL,
   test, dan pas mergen.
4. **Database-wijziging**: schrijf een nieuwe SQL-file in
   `supabase/migrations/` met timestamp-prefix, dan `npx supabase db push`.
   **Nooit** bestaande migraties bewerken.
5. **Nieuwe pagina**: zet in `app/<route>/page.tsx`. Nederlandse teksten,
   mobile-first, zelfde typografische stijl als bestaande pagina's.
6. **Nieuwe server-action**: `"use server"` bovenaan, voer input-validatie
   uit, gebruik `createClient()` (anon context) of `createAdminClient()`
   (service_role, bypast RLS — enkel voor interne ops).
7. **Email versturen**: nieuwe template in `lib/email/templates/`,
   send-helper in `lib/email/send.ts`, trigger via `after()` in de server
   action zodat het niet-blocking is.
