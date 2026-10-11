import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const BRON_COOKIE = "lmm_bron";
const BRON_MAX_AGE = 60 * 60 * 24 * 30; // 30 dagen

export async function proxy(request: NextRequest) {
  const response = await updateSession(request);

  // UTM-capture: eerste visit met ?utm_source=... bewaart de bron
  // als cookie zodat latere claim/subscribe hem kent.
  const utmSource = request.nextUrl.searchParams.get("utm_source");
  if (utmSource) {
    const utmCampaign = request.nextUrl.searchParams.get("utm_campaign");
    const bron = utmCampaign
      ? `${utmSource}:${utmCampaign}`
      : utmSource;
    response.cookies.set(BRON_COOKIE, bron, {
      maxAge: BRON_MAX_AGE,
      path: "/",
      sameSite: "lax",
      httpOnly: false,
    });
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
