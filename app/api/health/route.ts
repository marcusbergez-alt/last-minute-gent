import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Diagnostiek endpoint. Toont of elke env var staat én of elke client
 * effectief de DB kan bereiken. Veilig: lekt geen secret-waarden, enkel
 * boolean "set?" en lengte.
 */
export async function GET() {
  const env = {
    NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_URL_value: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY_len:
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length ?? 0,
    SUPABASE_SERVICE_ROLE_KEY_len:
      process.env.SUPABASE_SERVICE_ROLE_KEY?.length ?? 0,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? null,
    EMAIL_FROM_set: !!process.env.EMAIL_FROM,
    RESEND_API_KEY_len: process.env.RESEND_API_KEY?.length ?? 0,
    NODE_ENV: process.env.NODE_ENV,
  };

  let anonProbe: unknown;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("businesses")
      .select("slug, status, naam")
      .eq("status", "goedgekeurd");
    anonProbe = error
      ? { error: error.message, code: error.code }
      : { rows: data?.length ?? 0, sample: data?.[0] ?? null };
  } catch (e) {
    anonProbe = { thrown: String(e) };
  }

  let adminProbe: unknown;
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("businesses")
      .select("slug, status, naam");
    adminProbe = error
      ? { error: error.message, code: error.code }
      : { rows: data?.length ?? 0, sample: data?.[0] ?? null };
  } catch (e) {
    adminProbe = { thrown: String(e) };
  }

  return NextResponse.json({ env, anonProbe, adminProbe });
}
