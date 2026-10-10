"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export async function signinAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!email) {
    redirect(`/auth/signin?error=${encodeURIComponent("Vul een e-mailadres in.")}`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: `${siteUrl()}/auth/callback`,
    },
  });

  if (error) {
    redirect(`/auth/signin?error=${encodeURIComponent(error.message)}`);
  }

  redirect(`/auth/check-email?email=${encodeURIComponent(email)}`);
}

export async function signoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
