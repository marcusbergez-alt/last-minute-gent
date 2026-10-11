"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getBron } from "@/lib/bron";

export async function claimAction(
  formData: FormData,
): Promise<{ error?: string }> {
  const slotId = String(formData.get("slot_id") ?? "").trim();
  const naam = String(formData.get("naam") ?? "").trim();
  const gsm = String(formData.get("gsm") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const toestemming = formData.get("toestemming_marketing") === "1";

  if (!slotId) return { error: "Geen slot opgegeven." };
  if (!naam) return { error: "Vul je naam in." };
  if (!gsm) return { error: "Vul je gsm-nummer in." };
  if (!email || !email.includes("@")) return { error: "Ongeldig e-mailadres." };

  const bron = await getBron();

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("claim_slot", {
    p_slot_id: slotId,
    p_naam: naam,
    p_gsm: gsm,
    p_email: email,
    p_toestemming: toestemming,
    p_bron: bron,
  });

  if (error) {
    // RPC-level errors (RAISE EXCEPTION) komen hier binnen als message.
    return { error: error.message };
  }

  const row = Array.isArray(data) ? data[0] : data;
  const claimId: string | undefined = row?.claim_id;
  if (!claimId) return { error: "Onbekende fout bij claim." };

  redirect(`/deal/${slotId}/bevestigd?claim=${claimId}`);
}
