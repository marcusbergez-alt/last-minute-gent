import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * DEV-ONLY login shortcut: /api/dev-signin?email=you@example.com
 * Bypast email rate-limits door server-side een magic-link-token te
 * verifiëren en direct sessie-cookies op localhost te zetten.
 * In production is deze route disabled.
 */
export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "disabled_in_production" }, {
      status: 404,
    });
  }

  const { searchParams, origin } = new URL(request.url);
  const email = searchParams.get("email")?.trim().toLowerCase();
  if (!email) {
    return NextResponse.json({ error: "missing_email" }, { status: 400 });
  }

  // 1) Admin genereert een magic-link-token (geen mail verstuurd).
  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email,
  });

  if (error || !data?.properties?.hashed_token) {
    return NextResponse.json(
      { error: error?.message ?? "no_token" },
      { status: 500 },
    );
  }

  // 2) Verifieer dat token via de user-client -> session cookies worden gezet
  //    op localhost (ons eigen domein) in plaats van op *.supabase.co.
  const supabase = await createClient();
  const { error: verifyError } = await supabase.auth.verifyOtp({
    type: "magiclink",
    token_hash: data.properties.hashed_token,
  });

  if (verifyError) {
    return NextResponse.json(
      { error: verifyError.message },
      { status: 500 },
    );
  }

  const next = searchParams.get("next") ?? "/dashboard";
  return NextResponse.redirect(`${origin}${next}`);
}
