"use server";

import { after } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getOwnBusiness, requireUser } from "@/lib/auth";
import type { ClaimStatus } from "@/lib/types";
import { getSiteUrl } from "@/lib/email/client";
import { sendNewSlotDigest } from "@/lib/email/send";

const EURO = new Intl.NumberFormat("nl-BE", {
  style: "currency",
  currency: "EUR",
});

const DT = new Intl.DateTimeFormat("nl-BE", {
  weekday: "long",
  day: "numeric",
  month: "long",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Brussels",
});

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
  const { data: inserted, error } = await supabase
    .from("slots")
    .insert({
      business_id: business.id,
      start_tijd: date.toISOString(),
      behandeling_naam: behandeling,
      normale_prijs: normale,
      kortingsprijs: korting,
    })
    .select("id")
    .maybeSingle();

  if (error) return { error: error.message };

  // Alleen een digest sturen als de zaak publiek is.
  if (
    inserted?.id &&
    business.status === "goedgekeurd"
  ) {
    const slotId = inserted.id as string;
    const kortingsPct = Math.round((1 - korting / normale) * 100);

    after(async () => {
      try {
        const admin = createAdminClient();
        const { data: subs } = await admin
          .from("subscribers")
          .select("email");
        const emails = (subs ?? [])
          .map((s) => s.email as string)
          .filter(Boolean);
        if (emails.length === 0) return;

        await sendNewSlotDigest(emails, {
          zaakNaam: business.naam,
          behandeling,
          startTijdLabel: DT.format(date),
          normalePrijsLabel: EURO.format(normale),
          kortingsPrijsLabel: EURO.format(korting),
          kortingsPct,
          dealUrl: `${getSiteUrl()}/deal/${slotId}`,
        });
      } catch (e) {
        console.error("[new-slot] digest error:", e);
      }
    });
  }

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
