# Last-minute afspraken – bouwplan website

Oct 10, 2026 · @marcus bergez

Een website waar Gentse salons hun lege last-minute slots met korting aanbieden, en klanten die slots met één klik claimen. Dit plan is geschreven om rechtstreeks aan Claude Code te geven.

## Concept en verdienmodel

Salons vullen lege slots op, klanten krijgen korting, en jij verdient een vast bedrag per afspraak die echt doorgaat.

- **Aanbod:** Gentse kappers, nagel- en wimperstudio's en schoonheidsspecialisten geven slots voor vandaag, morgen of overmorgen door, met een kortingsprijs.
- **Vraag:** iedereen van 18 tot 35 in Gent, met studenten als eerste groep. Bereikt via de salons zelf (Instagram en QR-code) en via Instagram- en Facebookadvertenties.
- **Betaling:** de klant betaalt in de zaak, niet online. Zo hoeft de eerste versie geen betalingen te verwerken.
- **Jouw inkomsten:** vast bedrag per afspraak die doorging (voorstel: €2 à €3), maandelijks gefactureerd aan de zaak. De eerste maand gratis voor testzaken.
- **Werknaam:** nog te kiezen. Overal in de code staat `[NAAM]` als plaatshouder.

## Pagina's van de website

De eerste versie heeft acht pagina's: vier voor klanten, drie voor zaken en één voor jou als beheerder. Alles mobiel eerst, want bijna alle bezoekers komen via Instagram op hun gsm.

| Pagina | URL | Voor wie | Inhoud |
| --- | --- | --- | --- |
| Homepagina met aanbod | `/` | Klant | Korte belofte bovenaan, daaronder alle open slots als kaarten (zaak, behandeling, dag en uur, oude en nieuwe prijs). Filters: vandaag / morgen, type behandeling. Knop "Verwittig me bij nieuwe deals". |
| Slotdetail en claimen | `/deal/[id]` | Klant | Info over de zaak (adres, foto, Instagram-link), details van het slot, formulier met naam, gsm-nummer en e-mail, toestemmingsvakje, knop "Claim deze plek". |
| Bevestiging | `/deal/[id]/bevestigd` | Klant | Bevestigingscode, adres met kaartlink, tijdstip, "toon deze code in de zaak", knop om te annuleren. |
| Zaakpagina | `/zaak/[slug]` | Klant | Alle open slots van één zaak. Dit is de link achter de QR-code en de Instagram-story van die zaak. |
| Voor zaken | `/voor-zaken` | Zaak | Uitleg in 3 stappen, prijs, aanmeldformulier (zaaknaam, contactpersoon, e-mail, gsm, type zaak). |
| Zaakdashboard | `/dashboard` | Zaak | Slot toevoegen (datum, uur, behandeling, normale prijs, kortingsprijs), lijst van eigen slots met status, claims met naam en gsm, knop "gekomen" of "niet gekomen". |
| Zaakprofiel | `/dashboard/profiel` | Zaak | Naam, adres, foto, Instagram, behandelingen met standaardprijzen. |
| Beheer | `/admin` | Jij | Zaken goedkeuren, alle slots en claims zien, aantal doorgegane afspraken per zaak per maand (basis voor je factuur), inschrijvingen per bron. |

Daarnaast: een privacyverklaring, algemene voorwaarden en een cookiebanner.

## Hoofdflow van een boeking

Een boeking loopt in zeven stappen, en jij hoeft er niets handmatig aan te doen.

1. De zaak zet in het dashboard een slot online (minder dan 30 seconden werk).
2. Het slot verschijnt op de homepagina en de zaakpagina. Wie zich inschreef voor meldingen krijgt een e-mail.
3. Een klant opent het slot en claimt het met naam, gsm en e-mail. Het slot staat meteen op "bezet", zodat niemand anders het kan nemen.
4. De klant krijgt een bevestigingsmail met een korte code (bv. `K7F2`).
5. De zaak krijgt een e-mail met naam, gsm en code van de klant.
6. De klant komt langs, toont de code en betaalt de kortingsprijs in de zaak.
7. De zaak tikt in het dashboard "gekomen" of "niet gekomen". Enkel "gekomen" telt mee voor je factuur.

Regels:

- Een klant kan tot 3 uur voor het slot annuleren via de link in de mail; het slot komt dan terug vrij.
- Een slot dat voorbij is zonder claim, verdwijnt automatisch.
- Een klant met 2 keer "niet gekomen" kan geen slots meer claimen.

## Datamodel

Zes tabellen volstaan. Elke zaak ziet en wijzigt enkel haar eigen gegevens (row level security in Supabase).

| Tabel | Belangrijkste velden | Opmerking |
| --- | --- | --- |
| `businesses` | id, naam, slug, type, adres, foto\_url, instagram, e-mail, gsm, status (aangemeld / goedgekeurd / gepauzeerd), owner\_user\_id | Een zaak verschijnt pas online na jouw goedkeuring. |
| `services` | id, business\_id, naam, standaardprijs, duur\_minuten | Vooraf ingevuld, zodat een slot toevoegen snel gaat. |
| `slots` | id, business\_id, service\_id, start\_tijd, normale\_prijs, kortingsprijs, status (open / geclaimd / voorbij / geannuleerd) | Kortingsprijs moet lager zijn dan normale prijs. |
| `claims` | id, slot\_id, customer\_id, code, status (bevestigd / geannuleerd / gekomen / niet\_gekomen), aangemaakt\_op | Maximaal één actieve claim per slot. |
| `customers` | id, naam, gsm, e-mail, toestemming\_marketing, bron, aantal\_no\_shows | `bron` komt uit de UTM-parameters (zie meten). |
| `subscribers` | id, e-mail, voorkeur\_behandeling, bron, aangemaakt\_op | Voor meldingen bij nieuwe deals. |

## Wat bewust niet in de eerste versie zit

Deze dingen wachten tot je weet dat zaken en klanten het gebruiken.

- Online betalen of aanbetalingen
- Een app in de App Store of Google Play
- Koppeling met Salonized, Planity, Treatwell of andere agenda's
- Automatische facturatie (je maakt de maandfactuur zelf op basis van het beheeroverzicht)
- Sms- of WhatsApp-meldingen (eerst gratis e-mail)
- Reviews, accounts voor klanten en favorieten
- Andere steden dan Gent

## Techniek, advertenties meten en privacy

Gebruik gratis instapniveaus en meet vanaf dag één welk kanaal boekingen oplevert, want dat bepaalt of je advertenties winstgevend zijn.

**Techniek**

- Next.js met Tailwind, gehost op Vercel
- Supabase voor database en login (magische e-maillink voor zaken, Europese regio)
- E-mails via een dienst met een gratis instapniveau, zoals Resend
- Een eigen domeinnaam (de enige vaste kost, enkele euro's per jaar)

**Meten welk kanaal werkt**

- Elke link krijgt UTM-parameters, bv. `?utm_source=salon&utm_campaign=zaaknaam` voor een QR-code en `?utm_source=instagram&utm_campaign=test1` voor een advertentie.
- De site bewaart de bron bij elke inschrijving en claim, en het beheerpanel toont claims en doorgegane afspraken per bron.
- Rekensom per advertentiecampagne: uitgegeven bedrag gedeeld door doorgegane afspraken = kost per afspraak. Ligt die hoger dan wat je per afspraak verdient, dan pas je de advertentie aan.
- De Meta-pixel voor Instagram- en Facebookadvertenties komt pas na toestemming via de cookiebanner.

**Privacy (GDPR)**

- Toestemmingsvakjes staan nooit vooraf aangevinkt; marketingmails zijn een apart vakje.
- De zaak krijgt enkel naam, gsm en code van haar eigen klanten.
- Een afmeldlink in elke e-mail, en klantgegevens worden verwijderd op vraag.
- Laat je privacyverklaring en voorwaarden nakijken, bijvoorbeeld via Gentrepreneur, voor je live gaat.

## Bouwvolgorde met prompts voor Claude Code

Bouw in vijf fases en test elke fase voor je de volgende start. Kopieer dit hele document eerst als `PLAN.md` in je projectmap, zodat Claude Code het altijd kan teruglezen.

**Fase 0 – project opzetten**

```markdown
Lees PLAN.md. Zet een Next.js-project op met Tailwind en Supabase, mobiel eerst, alle teksten in het Nederlands. Maak het datamodel uit PLAN.md als Supabase-migratie, met row level security zodat elke zaak enkel haar eigen data ziet. Toon me eerst het datamodel en wacht op mijn akkoord voor je code schrijft.
```

**Fase 1 – zaken en slots**

```markdown
Bouw de pagina's /voor-zaken (aanmeldformulier), /dashboard (login met magische e-maillink, slot toevoegen, eigen slots zien) en /dashboard/profiel uit PLAN.md. Een nieuwe zaak krijgt status 'aangemeld' tot ik ze goedkeur in /admin. Bouw ook een eenvoudige /admin om zaken goed te keuren, enkel toegankelijk voor mijn e-mailadres.
```

**Fase 2 – aanbod en claimen**

```markdown
Bouw de homepagina (/), /deal/[id], /deal/[id]/bevestigd en /zaak/[slug] uit PLAN.md. Claimen moet atomair zijn: als twee mensen tegelijk claimen, krijgt maar één het slot. Genereer een korte bevestigingscode van 4 tekens. Bewaar de UTM-bron uit de URL bij de klant.
```

**Fase 3 – e-mails en regels**

```markdown
Voeg e-mails toe via Resend: bevestiging aan de klant met code en annuleerlink, melding aan de zaak, en een melding aan subscribers bij een nieuw slot. Voeg de regels uit PLAN.md toe: annuleren tot 3 uur vooraf, voorbije slots verbergen, klanten met 2 no-shows blokkeren.
```

**Fase 4 – meten en livegang**

```markdown
Voeg aan /admin een overzicht toe van claims en doorgegane afspraken per maand, per zaak en per UTM-bron. Voeg een cookiebanner toe en laad de Meta-pixel pas na toestemming. Maak een privacyverklaring en algemene voorwaarden als conceptpagina's. Zet alles klaar voor deployment op Vercel.
```

**Voor je live gaat**

- [ ] Zelf een volledige boeking doorlopen, als zaak en als klant
- [ ] Minstens 5 Gentse zaken goedgekeurd met echte slots
- [ ] Elke zaak heeft haar QR-code en een Instagram-story klaar
- [ ] Privacyverklaring nagekeken
- [ ] Advertentietest klaar: €50 tot €100, twee weken, met eigen UTM-links
