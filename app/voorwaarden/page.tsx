import Link from "next/link";

export const metadata = {
  title: "Algemene voorwaarden — Last-minute Gent",
  description:
    "De spelregels tussen klanten, zaken en Last-minute Gent.",
};

const LAATST_BIJGEWERKT = "11 oktober 2026";

export default function VoorwaardenPage() {
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
          Algemene voorwaarden
        </h1>
        <p className="text-sm text-zinc-500">
          Laatst bijgewerkt: {LAATST_BIJGEWERKT}
        </p>
        <p className="rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
          <strong>Concept.</strong> Deze versie is geschreven voor de eerste
          testen. Vul het ondernemingsnummer in en laat de tekst nakijken door
          een jurist of via Gentrepreneur vóór je echt live gaat.
        </p>
      </header>

      <article className="mt-8 space-y-8 text-[15px] leading-relaxed">
        <Section title="1. Partijen">
          <p>
            Deze voorwaarden gelden tussen (a) Last-minute Gent, uitgebaat
            door Marcus Bergez (hierna "wij" of "het platform",
            ondernemingsnummer <em>[TODO BE 0xxx.xxx.xxx]</em>), (b) de{" "}
            <strong>zaak</strong> die zich via het platform aanmeldt en slots
            publiceert, en (c) de <strong>klant</strong> die via het platform
            een slot claimt.
          </p>
        </Section>

        <Section title="2. Wat biedt het platform?">
          <p>
            Last-minute Gent zet open last-minute slots van Gentse salons
            (kappers, nagel- en wimperstudio's, schoonheidsspecialisten) online
            met korting. Klanten claimen een slot met één klik en betalen de
            kortingsprijs in de zaak zelf. Het platform zelf int geen
            betalingen van klanten.
          </p>
        </Section>

        <Section title="3. Hoe werkt een boeking?">
          <ol className="list-decimal space-y-1 pl-6">
            <li>De zaak publiceert een slot met een kortingsprijs.</li>
            <li>
              De klant claimt het slot online met naam, gsm en e-mail. Het slot
              staat meteen op bezet.
            </li>
            <li>
              De klant ontvangt per e-mail een 4-cijferige bevestigingscode.
            </li>
            <li>
              De klant komt langs, toont de code en betaalt de kortingsprijs
              rechtstreeks aan de zaak.
            </li>
          </ol>
        </Section>

        <Section title="4. Spelregels voor klanten">
          <ul className="list-disc space-y-1 pl-6">
            <li>
              Een boeking is bindend. Annuleren kan gratis tot{" "}
              <strong>3 uur</strong> voor het slot via de link in de
              bevestigingsmail.
            </li>
            <li>
              Twee keer niet opdagen leidt tot blokkade: het gsm-nummer kan
              geen nieuwe slots meer claimen.
            </li>
            <li>
              Het aangegeven kortingstarief is het bedrag dat je in de zaak
              betaalt. Extra opties / behandelingen in de zaak worden volgens
              de normale tarieven van de zaak gerekend.
            </li>
          </ul>
        </Section>

        <Section title="5. Spelregels voor zaken">
          <ul className="list-disc space-y-1 pl-6">
            <li>
              Je publiceert enkel slots die effectief vrij zijn op het moment
              dat je ze online zet.
            </li>
            <li>
              De kortingsprijs die je opgeeft, is de prijs die de klant in de
              zaak betaalt voor de aangeboden behandeling.
            </li>
            <li>
              Je verwerkt klantgegevens die je via het platform ontvangt
              uitsluitend voor de boeking in kwestie. Direct marketing enkel
              met expliciete toestemming van de klant.
            </li>
            <li>
              Na elke afspraak markeer je in het dashboard of de klant{" "}
              <em>gekomen</em> of <em>niet gekomen</em> is. Enkel{" "}
              <em>gekomen</em> telt mee voor je factuur.
            </li>
          </ul>
        </Section>

        <Section title="6. Prijzen en facturatie">
          <ul className="list-disc space-y-1 pl-6">
            <li>
              Voor de zaak: <strong>€3</strong> (excl. btw) per afspraak die
              daadwerkelijk doorging. De eerste maand is gratis voor
              testzaken.
            </li>
            <li>
              Facturatie gebeurt maandelijks op basis van het overzicht in
              <code> /admin/overzicht</code>.
            </li>
            <li>
              Voor de klant: geen kosten via het platform. Je betaalt de
              kortingsprijs rechtstreeks aan de zaak.
            </li>
          </ul>
        </Section>

        <Section title="7. Aansprakelijkheid">
          <p>
            Het platform treedt op als bemiddelaar tussen klant en zaak. We
            garanderen geen specifieke kwaliteit van de behandeling in de zaak,
            geen specifieke beschikbaarheid, en geen specifiek resultaat van
            advertentiecampagnes. We doen redelijke inspanningen om de site
            beschikbaar en veilig te houden, maar sluiten onze
            aansprakelijkheid uit voor indirecte schade. Niets in deze clausule
            beperkt de aansprakelijkheid die wettelijk niet uitgesloten kan
            worden.
          </p>
        </Section>

        <Section title="8. Beëindiging">
          <p>
            De zaak kan haar account op elk moment pauzeren via het dashboard
            of door ons te mailen. De klant kan vragen om verwijdering van
            persoonsgegevens via{" "}
            <a
              href="mailto:marcus.bergez@gmail.com"
              className="font-medium text-zinc-900 underline-offset-2 hover:underline"
            >
              marcus.bergez@gmail.com
            </a>
            . Lopende boekingen worden eerst afgehandeld.
          </p>
        </Section>

        <Section title="9. Wijzigingen">
          <p>
            We kunnen deze voorwaarden aanpassen. Materiële wijzigingen melden
            we aan actieve zaken minstens 14 dagen op voorhand per e-mail.
          </p>
        </Section>

        <Section title="10. Toepasselijk recht en bevoegde rechtbank">
          <p>
            Belgisch recht is van toepassing. Geschillen worden voorgelegd aan
            de rechtbanken van <strong>Gent</strong>, onverminderd dwingende
            consumentenbescherming.
          </p>
        </Section>

        <Section title="11. Contact">
          <p>
            Vragen? Mail{" "}
            <a
              href="mailto:marcus.bergez@gmail.com"
              className="font-medium text-zinc-900 underline-offset-2 hover:underline"
            >
              marcus.bergez@gmail.com
            </a>
            .
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
