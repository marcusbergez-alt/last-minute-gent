"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getOwnBusiness, requireUser } from "@/lib/auth";
import type { ClaimStatus } from "@/lib/types";

export async function addSlotAction(
  formData: FormData,
): Promise<{ error?: string }> {
  await requireUser();
  const business = await getOwnBusiness();
  if (!business) return { error: "Geen zaak gekoppeld aan je account." };

  const iso = String(formData.get("start_tijd_iso") ?? "").trim();
  const behandeling = String(formData.get("behandeling_naam") ?? "").trim();
  const normale = Number(formData.get("normale_prijs"));
  const korting = Number(formData.get("kortingsprijs"));

  if (!iso) return { error: "Vul een datum en uur in." };
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return { error: "Ongeldige datum." };
  if (date.getTime() <= Date.now()) {
    return { error: "Het slot moet in de toekomst liggen." };
  }
  if (!behandeling) return { error: "Vul de behandelingsnaam in." };
  if (!(normale > 0)) return { error: "Normale prijs moet groter zijn dan 0." };
  if (!(korting >= 0)) return { error: "Kortingsprijs moet 0 of hoger zijn." };
  if (korting >= normale) {
    return { error: "Kortingsprijs moet lager zijn dan de normale prijs." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("slots").insert({
    business_id: business.id,
    start_tijd: date.toISOString(),
    behandeling_naam: behandeling,
    normale_prijs: normale,
    kortingsprijs: korting,
  });

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  return {};
}

const ALLOWED_MARK_STATUSES: ClaimStatus[] = [
  "gekomen",
  "niet_gekomen",
  "geannuleerd",
];

export async function markClaimAction(formData: FormData) {
  await requireUser();

  const claimId = String(formData.get("claim_id") ?? "").trim();
  const status = String(formData.get("status") ?? "") as ClaimStatus;

  if (!claimId || !ALLOWED_MARK_STATUSES.includes(status)) return;

  const supabase = await createClient();
  const { error } = await supabase
    .from("claims")
    .update({ status })
    .eq("id", claimId);

  if (!error && status === "niet_gekomen") {
    // Verhoog aantal_no_shows op de klant.
    const { data: claim } = await supabase
      .from("claims")
      .select("customer_id")
      .eq("id", claimId)
      .maybeSingle();

    if (claim?.customer_id) {
      await supabase.rpc("increment_no_show", {
        p_customer_id: claim.customer_id,
      });
    }
  }

  revalidatePath("/dashboard");
}
