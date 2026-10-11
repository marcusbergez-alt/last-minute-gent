"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function cancelClaimAction(formData: FormData) {
  const claimId = String(formData.get("claim_id") ?? "").trim();
  const slotId = String(formData.get("slot_id") ?? "").trim();
  if (!claimId || !slotId) return;

  const supabase = await createClient();
  const { error } = await supabase.rpc("cancel_claim", {
    p_claim_id: claimId,
  });

  if (error) {
    redirect(
      `/deal/${slotId}/bevestigd?claim=${claimId}&error=${encodeURIComponent(error.message)}`,
    );
  }

  redirect(`/deal/${slotId}/bevestigd?claim=${claimId}`);
}
