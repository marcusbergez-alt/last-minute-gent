"use server";

import { createClient } from "@/lib/supabase/server";

export async function subscribeAction(
  formData: FormData,
): Promise<{ ok?: true; error?: string }> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const voorkeur =
    String(formData.get("voorkeur_behandeling") ?? "").trim() || null;
  const bron =
    String(formData.get("bron") ?? "homepage").trim() || "homepage";

  if (!email || !email.includes("@")) {
    return { error: "Vul een geldig e-mailadres in." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("subscribers").insert({
    email,
    voorkeur_behandeling: voorkeur,
    bron,
  });

  if (error) {
    // Unique violation (al ingeschreven) voelen we als success.
    if (error.code === "23505") return { ok: true };
    return { error: error.message };
  }

  return { ok: true };
}
