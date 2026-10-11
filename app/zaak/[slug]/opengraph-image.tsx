import { ImageResponse } from "next/og";
import { createAdminClient } from "@/lib/supabase/admin";
import { BUSINESS_TYPE_LABEL, type BusinessType } from "@/lib/types";

export const alt = "Last-minute Gent — zaakpagina";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
// Edge runtime werkt niet met service_role fetch via @supabase/supabase-js;
// Node runtime is prima voor OG-images (en wordt gecachet via tags).

type Params = { slug: string };

export default async function Image(props: { params: Promise<Params> }) {
  const { slug } = await props.params;
  const admin = createAdminClient();
  const { data: biz } = await admin
    .from("businesses")
    .select("naam, type, adres")
    .eq("slug", slug)
    .eq("status", "goedgekeurd")
    .maybeSingle<{ naam: string; type: BusinessType; adres: string | null }>();

  const naam = biz?.naam ?? "Last-minute Gent";
  const type = biz ? BUSINESS_TYPE_LABEL[biz.type] : "Gentse salon";
  const adres = biz?.adres ?? "Gent";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
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

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              fontSize: 28,
              color: "#78350f",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            {type}
          </div>
          <div
            style={{
              fontSize: 96,
              fontWeight: 700,
              color: "#18181b",
              letterSpacing: "-0.02em",
              lineHeight: 1.02,
            }}
          >
            {naam}
          </div>
          <div style={{ fontSize: 32, color: "#52525b" }}>{adres}</div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 22,
            color: "#71717a",
          }}
        >
          <span>Bekijk open last-minute slots</span>
          <span style={{ color: "#18181b", fontWeight: 500 }}>
            Last-minute Gent
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
