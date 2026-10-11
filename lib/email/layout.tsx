import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export function Layout({
  preview,
  children,
  footer,
}: {
  preview: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <Html lang="nl">
      <Head />
      <Preview>{preview}</Preview>
      <Body
        style={{
          backgroundColor: "#f6f6f5",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
          margin: 0,
          padding: 0,
        }}
      >
        <Container
          style={{
            maxWidth: "560px",
            margin: "0 auto",
            padding: "32px 20px",
          }}
        >
          <Section style={{ paddingBottom: "20px" }}>
            <Text
              style={{
                fontSize: "15px",
                fontWeight: 600,
                color: "#18181b",
                margin: 0,
              }}
            >
              Last-minute Gent
            </Text>
            <Text
              style={{
                fontSize: "11px",
                color: "#71717a",
                margin: "2px 0 0 0",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Last-minute afspraken · Gent
            </Text>
          </Section>

          <Section
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              padding: "28px",
              border: "1px solid #e4e4e7",
            }}
          >
            {children}
          </Section>

          <Hr
            style={{
              borderColor: "#e4e4e7",
              margin: "28px 0 16px 0",
            }}
          />

          <Section>
            {footer ?? (
              <Text style={{ fontSize: "11px", color: "#a1a1aa", margin: 0 }}>
                Je ontvangt deze e-mail omdat je iets geboekt of ingeschreven
                hebt op Last-minute Gent. Vragen? Antwoord op deze mail.
              </Text>
            )}
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export const emailStyles = {
  h1: {
    fontSize: "22px",
    fontWeight: 600,
    color: "#18181b",
    margin: "0 0 12px 0",
    letterSpacing: "-0.01em",
  } as const,
  p: {
    fontSize: "14px",
    lineHeight: "1.6",
    color: "#3f3f46",
    margin: "0 0 12px 0",
  } as const,
  small: {
    fontSize: "12px",
    color: "#71717a",
    margin: "0 0 6px 0",
  } as const,
  code: {
    fontFamily:
      "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    fontSize: "32px",
    fontWeight: 600,
    letterSpacing: "0.2em",
    color: "#18181b",
    margin: 0,
  } as const,
  button: {
    backgroundColor: "#18181b",
    color: "#ffffff",
    padding: "11px 20px",
    borderRadius: "8px",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: 500,
    display: "inline-block",
  } as const,
  buttonSecondary: {
    border: "1px solid #d4d4d8",
    color: "#18181b",
    padding: "10px 20px",
    borderRadius: "8px",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: 500,
    display: "inline-block",
  } as const,
  row: {
    padding: "8px 0",
    borderBottom: "1px solid #f4f4f5",
  } as const,
  label: {
    fontSize: "11px",
    color: "#71717a",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    margin: "0 0 2px 0",
  } as const,
  value: {
    fontSize: "14px",
    color: "#18181b",
    margin: 0,
  } as const,
};
