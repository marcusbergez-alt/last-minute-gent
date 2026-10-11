import { Button, Section, Text } from "@react-email/components";
import { Layout, emailStyles } from "../layout";

export type NewSlotDigestProps = {
  zaakNaam: string;
  behandeling: string;
  startTijdLabel: string;
  normalePrijsLabel: string;
  kortingsPrijsLabel: string;
  kortingsPct: number;
  dealUrl: string;
};

export function NewSlotDigestEmail(props: NewSlotDigestProps) {
  return (
    <Layout
      preview={`Nieuwe deal: ${props.behandeling} bij ${props.zaakNaam} — ${props.kortingsPrijsLabel}`}
    >
      <Text style={emailStyles.h1}>Nieuwe last-minute deal</Text>
      <Text style={emailStyles.p}>
        Er staat een vers slot online in Gent. Deze deals gaan snel — bekijken
        en claimen in één klik.
      </Text>

      <Section
        style={{
          backgroundColor: "#fafafa",
          border: "1px solid #e4e4e7",
          borderRadius: "10px",
          padding: "18px",
          margin: "12px 0 18px 0",
        }}
      >
        <Text
          style={{
            fontSize: "11px",
            color: "#78350f",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            margin: "0 0 6px 0",
          }}
        >
          {props.kortingsPct > 0 ? `−${props.kortingsPct}% korting` : "Last-minute"}
        </Text>
        <Text
          style={{
            fontSize: "18px",
            fontWeight: 600,
            color: "#18181b",
            margin: "0 0 2px 0",
          }}
        >
          {props.behandeling}
        </Text>
        <Text style={{ fontSize: "13px", color: "#52525b", margin: "0 0 10px 0" }}>
          {props.zaakNaam} · {props.startTijdLabel}
        </Text>
        <Text style={{ fontSize: "16px", margin: 0 }}>
          <strong>{props.kortingsPrijsLabel}</strong>{" "}
          <span
            style={{
              textDecoration: "line-through",
              color: "#a1a1aa",
              fontSize: "13px",
              marginLeft: "4px",
            }}
          >
            {props.normalePrijsLabel}
          </span>
        </Text>
      </Section>

      <Section>
        <Button href={props.dealUrl} style={emailStyles.button}>
          Claim deze plek
        </Button>
      </Section>

      <Text
        style={{
          ...emailStyles.p,
          fontSize: "11px",
          color: "#a1a1aa",
          marginTop: "20px",
        }}
      >
        Je ontvangt deze omdat je je inschreef voor meldingen op Startup 1. Niet
        meer interessant? Antwoord op deze mail en we zetten je offline.
      </Text>
    </Layout>
  );
}

export default NewSlotDigestEmail;
