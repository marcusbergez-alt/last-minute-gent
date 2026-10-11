import { Button, Section, Text } from "@react-email/components";
import { Layout, emailStyles } from "../layout";

export type ClaimConfirmationProps = {
  klantNaam: string;
  behandeling: string;
  zaakNaam: string;
  zaakAdres: string | null;
  startTijdLabel: string;
  code: string;
  kortingsPrijsLabel: string;
  bevestigdUrl: string;
  kanAnnuleren: boolean;
};

export function ClaimConfirmationEmail(props: ClaimConfirmationProps) {
  return (
    <Layout preview={`Je plek bij ${props.zaakNaam} is bevestigd — code ${props.code}`}>
      <Text style={emailStyles.h1}>Je plek is geboekt</Text>
      <Text style={emailStyles.p}>
        Dag {props.klantNaam.split(" ")[0]}, bedankt voor je boeking bij{" "}
        <strong>{props.zaakNaam}</strong>. Toon de code hieronder bij aankomst
        in de zaak.
      </Text>

      <Section
        style={{
          backgroundColor: "#fef3c7",
          borderRadius: "10px",
          padding: "18px",
          textAlign: "center" as const,
          margin: "16px 0",
        }}
      >
        <Text
          style={{
            fontSize: "11px",
            color: "#78350f",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            margin: "0 0 6px 0",
          }}
        >
          Bevestigingscode
        </Text>
        <Text style={emailStyles.code}>{props.code}</Text>
      </Section>

      <Section style={emailStyles.row}>
        <Text style={emailStyles.label}>Behandeling</Text>
        <Text style={emailStyles.value}>{props.behandeling}</Text>
      </Section>
      <Section style={emailStyles.row}>
        <Text style={emailStyles.label}>Wanneer</Text>
        <Text style={emailStyles.value}>{props.startTijdLabel}</Text>
      </Section>
      <Section style={emailStyles.row}>
        <Text style={emailStyles.label}>Zaak</Text>
        <Text style={emailStyles.value}>
          {props.zaakNaam}
          {props.zaakAdres ? ` · ${props.zaakAdres}` : ""}
        </Text>
      </Section>
      <Section style={{ padding: "8px 0 0 0" }}>
        <Text style={emailStyles.label}>Prijs (betalen in de zaak)</Text>
        <Text style={emailStyles.value}>{props.kortingsPrijsLabel}</Text>
      </Section>

      <Section style={{ paddingTop: "24px" }}>
        <Button href={props.bevestigdUrl} style={emailStyles.button}>
          Bekijk mijn boeking
        </Button>
      </Section>

      {props.kanAnnuleren && (
        <Text style={{ ...emailStyles.p, fontSize: "12px", color: "#71717a", marginTop: "20px" }}>
          Niet meer nodig? Je kan tot 3 uur voor je afspraak gratis annuleren via
          de link hierboven.
        </Text>
      )}
    </Layout>
  );
}

export default ClaimConfirmationEmail;
