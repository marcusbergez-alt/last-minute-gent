"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BUSINESS_TYPES, type BusinessType } from "@/lib/types";

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

function failBack(reason: string): never {
  redirect(`/voor-zaken?error=${encodeURIComponent(reason)}`);
}

export async function signupAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const zaaknaam = String(formData.get("zaaknaam") ?? "").trim();
  const contactpersoon = String(formData.get("contactpersoon") ?? "").trim();
  const gsm = String(formData.get("gsm") ?? "").trim();
  const type = String(formData.get("type") ?? "") as BusinessType;

  if (!email || !zaaknaam || !contactpersoon || !gsm) {
    failBack("Vul alle velden in.");
  }
  if (!BUSINESS_TYPES.includes(type)) {
    failBack("Kies een geldig type zaak.");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: `${siteUrl()}/auth/callback`,
      data: {
        signup_zaaknaam: zaaknaam,
        signup_contactpersoon: contactpersoon,
        signup_gsm: gsm,
        signup_type: type,
      },
    },
  });

  if (error) failBack(error.message);

  redirect(`/auth/check-email?email=${encodeURIComponent(email)}`);
}
