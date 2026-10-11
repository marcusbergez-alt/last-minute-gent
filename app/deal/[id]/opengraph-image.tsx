import { ImageResponse } from "next/og";
import { createAdminClient } from "@/lib/supabase/admin";
import { BUSINESS_TYPE_LABEL, type BusinessType } from "@/lib/types";

export const alt = "Last-minute Gent — deal";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Params = { id: string };

const EURO = new Intl.NumberFormat("nl-BE", {
  style: "currency",
  currency: "EUR",
});

const DT = new Intl.DateTimeFormat("nl-BE", {
  weekday: "long",
  day: "numeric",
  month: "long",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Brussels",
});

export default async function Image(props: { params: Promise<Params> }) {
  const { id } = await props.params;
  const admin = createAdminClient();
  const { data: slot } = await admin
    .from("slots")
    .select(
      `start_tijd, behandeling_naam, kortingsprijs, normale_prijs,
       business:businesses(naam, type)`,
    )
    .eq("id", id)
    .maybeSingle<{
      start_tijd: string;
      behandeling_naam: string | null;
      kortingsprijs: number;
      normale_prijs: number;
      business: { naam: string; type: BusinessType } | null;
    }>();

  const naam = slot?.business?.naam ?? "Gentse zaak";
  const type = slot?.business
    ? BUSINESS_TYPE_LABEL[slot.business.type]
    : "Salon";
  const behandeling = slot?.behandeling_naam ?? "Behandeling";
  const wanneer = slot ? DT.format(new Date(slot.start_tijd)) : "Binnenkort";
  const kortingsPct =
    slot && Number(slot.normale_prijs) > 0
      ? Math.round(
          (1 - Number(slot.kortingsprijs) / Number(slot.normale_prijs)) * 100,
        )
      : 0;
  const prijsNieuw = slot ? EURO.format(Number(slot.kortingsprijs)) : "";
  const prijsOud = slot ? EURO.format(Number(slot.normale_prijs)) : "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          background: "#ffffff",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontSize: 22,
              color: "#52525b",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: 999,
                background: "#f59e0b",
              }}
            />
            Last-minute Gent
          </div>
          {kortingsPct > 0 && (
            <div
              style={{
                background: "#fde68a",
                color: "#78350f",
                borderRadius: 999,
                padding: "10px 22px",
                fontSize: 32,
                fontWeight: 700,
                letterSpacing: "-0.01em",
              }}
            >
              −{kortingsPct}%
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div
            style={{
              fontSize: 24,
              color: "#78350f",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            {type}
          </div>
          <div
            style={{
              fontSize: 76,
              fontWeight: 700,
              color: "#18181b",
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
            }}
          >
            {behandeling}
          </div>
          <div style={{ fontSize: 30, color: "#52525b" }}>
            {naam} · {wanneer}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
            <span style={{ fontSize: 72, fontWeight: 700, color: "#18181b" }}>
              {prijsNieuw}
            </span>
            <span
              style={{
                fontSize: 32,
                color: "#a1a1aa",
                textDecoration: "line-through",
              }}
            >
              {prijsOud}
            </span>
          </div>
          <div style={{ fontSize: 22, color: "#71717a" }}>
            Claim met één klik — betaal in de zaak
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
