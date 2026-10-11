import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Server-only client met service_role key.
 * BYPAST RLS — enkel gebruiken in server actions voor interne lookups
 * (bv. ophalen van zaak-email voor transactionele e-mails).
 * NOOIT exporteren naar de browser.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      "Supabase admin client vereist NEXT_PUBLIC_SUPABASE_URL en SUPABASE_SERVICE_ROLE_KEY.",
    );
  }
  return createSupabaseClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
