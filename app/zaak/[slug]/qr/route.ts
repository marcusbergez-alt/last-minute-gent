import { NextResponse, type NextRequest } from "next/server";
import QRCode from "qrcode";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSiteUrl } from "@/lib/email/client";

type Params = { slug: string };

export async function GET(
  request: NextRequest,
  context: { params: Promise<Params> },
) {
  const { slug } = await context.params;
  const { searchParams } = new URL(request.url);

  const admin = createAdminClient();
  const { data: biz } = await admin
    .from("businesses")
    .select("slug")
    .eq("slug", slug)
    .eq("status", "goedgekeurd")
    .maybeSingle();

  if (!biz) {
    return NextResponse.json(
      { error: "zaak_niet_gevonden_of_niet_goedgekeurd" },
      { status: 404 },
    );
  }

  const sizeRaw = Number(searchParams.get("size") ?? "512");
  const size = Math.max(128, Math.min(2048, sizeRaw || 512));

  const site = getSiteUrl().replace(/\/$/, "");
  const target = `${site}/zaak/${slug}?utm_source=salon-qr&utm_campaign=${encodeURIComponent(slug)}`;

  const png = await QRCode.toBuffer(target, {
    type: "png",
    errorCorrectionLevel: "M",
    margin: 2,
    width: size,
    color: { dark: "#18181b", light: "#ffffffff" },
  });

  return new NextResponse(new Uint8Array(png), {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
      "Content-Disposition": `inline; filename="qr-${slug}.png"`,
    },
  });
}
