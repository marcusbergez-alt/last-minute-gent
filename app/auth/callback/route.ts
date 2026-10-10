import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slug";
import { BUSINESS_TYPES, type BusinessType } from "@/lib/types";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (!code) {
    return NextResponse.redirect(
      `${origin}/auth/signin?error=${encodeURIComponent("Geen code ontvangen.")}`,
    );
  }

  const supabase = await createClient();
  const { error: exchangeError } =
    await supabase.auth.exchangeCodeForSession(code);
  if (exchangeError) {
    return NextResponse.redirect(
      `${origin}/auth/signin?error=${encodeURIComponent(exchangeError.message)}`,
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: existing } = await supabase
      .from("businesses")
      .select("id")
      .eq("owner_user_id", user.id)
      .maybeSingle();

    const meta = user.user_metadata ?? {};
    const zaaknaam = typeof meta.signup_zaaknaam === "string"
      ? meta.signup_zaaknaam.trim()
      : "";
    const type = typeof meta.signup_type === "string"
      ? (meta.signup_type as BusinessType)
      : null;
    const gsm = typeof meta.signup_gsm === "string" ? meta.signup_gsm : null;

    if (!existing && zaaknaam && type && BUSINESS_TYPES.includes(type)) {
      // Slug met 6-char random suffix voor zekere uniciteit.
      const slug = `${slugify(zaaknaam) || "zaak"}-${Math.random()
        .toString(36)
        .slice(2, 8)}`;

      await supabase.from("businesses").insert({
        naam: zaaknaam,
        slug,
        type,
        email: user.email,
        gsm,
        owner_user_id: user.id,
      });
    }
  }

  return NextResponse.redirect(`${origin}${next}`);
}
