import { Button, Section, Text } from "@react-email/components";
import { Layout, emailStyles } from "../layout";

export type BusinessNotificationProps = {
  zaakNaam: string;
  behandeling: string;
  startTijdLabel: string;
  klantNaam: string;
  klantGsm: string;
  code: string;
  dashboardUrl: string;
};

export function BusinessNotificationEmail(props: BusinessNotificationProps) {
  return (
    <Layout
      preview={`Nieuwe boeking van ${props.klantNaam} — ${props.behandeling}`}
    >
      <Text style={emailStyles.h1}>Nieuwe boeking</Text>
      <Text style={emailStyles.p}>
        {props.zaakNaam}, een slot werd zonet geclaimd. De klant toont de code
        bij aankomst — betaling gebeurt bij jou in de zaak.
      </Text>

      <Section style={emailStyles.row}>
        <Text style={emailStyles.label}>Behandeling</Text>
        <Text style={emailStyles.value}>{props.behandeling}</Text>
      </Section>
      <Section style={emailStyles.row}>
        <Text style={emailStyles.label}>Wanneer</Text>
        <Text style={emailStyles.value}>{props.startTijdLabel}</Text>
      </Section>
      <Section style={emailStyles.row}>
        <Text style={emailStyles.label}>Klant</Text>
        <Text style={emailStyles.value}>
          {props.klantNaam} ·{" "}
          <a
            href={`tel:${props.klantGsm.replace(/\s+/g, "")}`}
            style={{ color: "#18181b" }}
          >
            {props.klantGsm}
          </a>
        </Text>
      </Section>
      <Section style={{ padding: "8px 0 0 0" }}>
        <Text style={emailStyles.label}>Verwachte code</Text>
        <Text
          style={{
            ...emailStyles.value,
            fontFamily:
              "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            fontSize: "20px",
            fontWeight: 600,
            letterSpacing: "0.1em",
          }}
        >
          {props.code}
        </Text>
      </Section>

      <Section style={{ paddingTop: "24px" }}>
        <Button href={props.dashboardUrl} style={emailStyles.button}>
          Open je dashboard
        </Button>
      </Section>

      <Text
        style={{
          ...emailStyles.p,
          fontSize: "12px",
          color: "#71717a",
          marginTop: "20px",
        }}
      >
        Na de afspraak markeer je in je dashboard &lt;gekomen&gt; of &lt;niet
        gekomen&gt;. Enkel &lt;gekomen&gt; telt mee voor je maandfactuur.
      </Text>
    </Layout>
  );
}

export default BusinessNotificationEmail;
