import Link from "next/link";

export const metadata = {
  title: "Privacyverklaring — Last-minute Gent",
  description:
    "Hoe we gegevens verzamelen, gebruiken en beschermen op Last-minute Gent.",
};

const LAATST_BIJGEWERKT = "11 oktober 2026";

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-12 text-zinc-800">
      <Link
        href="/"
        className="text-sm text-zinc-500 hover:text-zinc-900"
      >
        ← Terug
      </Link>

      <header className="mt-6 space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight">
          Privacyverklaring
        </h1>
        <p className="text-sm text-zinc-500">
          Laatst bijgewerkt: {LAATST_BIJGEWERKT}
        </p>
        <p className="rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
          <strong>Concept.</strong> Deze tekst beschrijft hoe we in de huidige
          praktijk met gegevens omgaan. Laat ze nog nakijken door een jurist of
          via Gentrepreneur vóór je echt live gaat.
        </p>
      </header>

      <article className="mt-8 space-y-8 text-[15px] leading-relaxed">
        <Section title="1. Wie zijn we?">
          <p>
            Last-minute Gent is een platform dat Gentse salons helpt om lege
            last-minute slots met korting aan te bieden aan klanten in Gent.
            Vragen in verband met je gegevens stuur je naar{" "}
            <a
              href="mailto:marcus.bergez@gmail.com"
              className="font-medium text-zinc-900 underline-offset-2 hover:underline"
            >
              marcus.bergez@gmail.com
            </a>
            .
          </p>
        </Section>

        <Section title="2. Welke gegevens verwerken we?">
          <p>Afhankelijk van hoe je ons gebruikt:</p>
          <ul className="list-disc space-y-1 pl-6">
            <li>
              <strong>Als zaak</strong> (eigenaar): e-mailadres (login via
              magische link), zaaknaam, adres, telefoonnummer,
              Instagram-handle, foto. Daarnaast de slots en kortingsprijzen die
              je zelf toevoegt.
            </li>
            <li>
              <strong>Als klant</strong> (iemand die een slot claimt): naam,
              gsm-nummer, e-mailadres, eventuele toestemming voor
              marketing-mails, bron van je bezoek (UTM-parameters zoals{" "}
              <code>?utm_source=instagram</code>), en het aantal keren dat je
              niet kwam opdagen.
            </li>
            <li>
              <strong>Als abonnee op meldingen</strong>: e-mailadres,
              voorkeur-type behandeling, en bron van inschrijving.
            </li>
          </ul>
        </Section>

        <Section title="3. Waarvoor en op basis waarvan?">
          <p>Elke verwerking heeft een wettelijke grondslag (art. 6 GDPR):</p>
          <ul className="list-disc space-y-1 pl-6">
            <li>
              <strong>Uitvoering overeenkomst</strong>: naam, gsm en e-mail van
              een klant delen we met de zaak zodat je afspraak kan doorgaan.
            </li>
            <li>
              <strong>Gerechtvaardigd belang</strong>: no-show-telling om
              platform-misbruik te vermijden. UTM-bron om onze kanalen te
              meten.
            </li>
            <li>
              <strong>Toestemming</strong>: marketing-e-mails naar klanten
              (apart aanvinkvak, nooit vooraf aangevinkt), de Meta-pixel voor
              advertenties (enkel na "Accepteer alles" in de cookiebanner), en
              inschrijving als abonnee.
            </li>
          </ul>
        </Section>

        <Section title="4. Hoe lang bewaren we gegevens?">
          <ul className="list-disc space-y-1 pl-6">
            <li>
              <strong>Claims en slots</strong>: zolang dat nodig is voor
              boekhouding en bewijsvoering (max. 7 jaar — Belgische
              boekhoudwet).
            </li>
            <li>
              <strong>Klant-contactgegevens</strong>: 24 maanden na laatste
              activiteit, tenzij je vraagt om eerder verwijderd te worden.
            </li>
            <li>
              <strong>Abonnee-e-mails</strong>: tot je uitschrijft.
            </li>
            <li>
              <strong>Cookies</strong>: zie sectie 7.
            </li>
          </ul>
        </Section>

        <Section title="5. Met wie delen we?">
          <ul className="list-disc space-y-1 pl-6">
            <li>
              <strong>De zaak die je kiest</strong> ziet enkel je naam, gsm en
              bevestigingscode. Je e-mailadres blijft bij ons.
            </li>
            <li>
              <strong>Supabase</strong> (Europees gehost, Frankfurt) als
              database- en authenticatie-provider. Verwerkersovereenkomst via
              hun Terms.
            </li>
            <li>
              <strong>Resend</strong> voor transactionele e-mails
              (bevestigingen, notificaties).
            </li>
            <li>
              <strong>Vercel</strong> als hosting-partij voor de website
              (standaard logs).
            </li>
          </ul>
          <p>
            We verkopen geen gegevens aan derden en gebruiken ze niet voor
            doeleinden buiten wat hierboven staat.
          </p>
        </Section>

        <Section title="6. Je rechten (GDPR)">
          <p>Je kan op elk moment vragen om:</p>
          <ul className="list-disc space-y-1 pl-6">
            <li>Inzage te krijgen in de gegevens die we over je hebben</li>
            <li>Je gegevens te laten corrigeren of verwijderen</li>
            <li>Verwerking te beperken of er bezwaar tegen te maken</li>
            <li>Je gegevens over te dragen naar een ander platform</li>
            <li>Je toestemming in te trekken (bv. marketing-mails)</li>
          </ul>
          <p>
            Mail{" "}
            <a
              href="mailto:marcus.bergez@gmail.com"
              className="font-medium text-zinc-900 underline-offset-2 hover:underline"
            >
              marcus.bergez@gmail.com
            </a>{" "}
            — we reageren binnen 30 dagen. Niet akkoord met onze reactie? Je
            kan ook klacht indienen bij de{" "}
            <a
              href="https://www.gegevensbeschermingsautoriteit.be/"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-zinc-900 underline-offset-2 hover:underline"
            >
              Gegevensbeschermingsautoriteit
            </a>
            .
          </p>
        </Section>

        <Section title="7. Cookies">
          <p>We onderscheiden twee soorten:</p>
          <ul className="list-disc space-y-1 pl-6">
            <li>
              <strong>Essentieel</strong>: login-sessie (Supabase), UTM-bron
              (30 dagen), consent-keuze. Altijd actief, geen alternatief.
            </li>
            <li>
              <strong>Marketing</strong>: Meta Pixel (Facebook / Instagram
              advertenties). Laadt enkel als je "Accepteer alles" aanklikt in
              de cookiebanner. Je kan je keuze later wijzigen door
              localStorage-key <code>lmg_consent_v1</code> te wissen.
            </li>
          </ul>
        </Section>

        <Section title="8. Minderjarigen">
          <p>
            Last-minute Gent richt zich op volwassenen (18+). Als je jonger
            bent, boek dan samen met een ouder of voogd en mail ons voor
            verwijdering.
          </p>
        </Section>

        <Section title="9. Wijzigingen">
          <p>
            We mogen deze verklaring aanpassen. Grote wijzigingen melden we per
            e-mail aan actieve gebruikers. De datum bovenaan geeft de laatste
            update.
          </p>
        </Section>
      </article>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}
