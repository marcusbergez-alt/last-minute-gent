import { ImageResponse } from "next/og";

export const alt = "Last-minute Gent — korting bij Gentse salons";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 72px",
          background:
            "radial-gradient(80% 60% at 50% 0%, #fff5ec 0%, #ffffff 60%)",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 24,
            color: "#52525b",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          <span
            style={{
              width: 12,
              height: 12,
              borderRadius: 999,
              background: "#f59e0b",
            }}
          />
          Last-minute Gent
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              fontSize: 86,
              fontWeight: 700,
              color: "#18181b",
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
            }}
          >
            Vul lege uren.
          </div>
          <div
            style={{
              fontSize: 86,
              fontWeight: 700,
              color: "#71717a",
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
            }}
          >
            Verdien aan last-minute.
          </div>
          <div
            style={{
              fontSize: 28,
              color: "#52525b",
              marginTop: 20,
              lineHeight: 1.4,
            }}
          >
            Last-minute afspraken bij Gentse salons — met korting.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 20,
            color: "#71717a",
          }}
        >
          <span>Kappers · nagel- &amp; wimperstudio's · schoonheidsspecialisten</span>
          <span style={{ color: "#18181b", fontWeight: 500 }}>Gent</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
