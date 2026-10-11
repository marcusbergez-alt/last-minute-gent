"use server";

import { after } from "next/server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getBron } from "@/lib/bron";
import { getSiteUrl } from "@/lib/email/client";
import {
  sendClaimConfirmation,
  sendBusinessNotification,
} from "@/lib/email/send";

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

  if (error) return { error: error.message };

  const row = Array.isArray(data) ? data[0] : data;
  const claimId: string | undefined = row?.claim_id;
  const code: string | undefined = row?.code;
  if (!claimId || !code) return { error: "Onbekende fout bij claim." };

  // Mails worden na response verstuurd zodat de klant geen 2s wacht.
  after(async () => {
    try {
      const admin = createAdminClient();
      const { data: slot } = await admin
        .from("slots")
        .select(
          `id, start_tijd, behandeling_naam, kortingsprijs, normale_prijs,
           business:businesses(naam, slug, adres, email)`,
        )
        .eq("id", slotId)
        .maybeSingle();

      if (!slot) return;
      const business = (slot as { business: unknown }).business as
        | {
            naam: string;
            slug: string;
            adres: string | null;
            email: string | null;
          }
        | null;
      if (!business) return;

      const site = getSiteUrl();
      const startDate = new Date(slot.start_tijd);
      const startTijdLabel = DT.format(startDate);
      const kortingsPrijsLabel = EURO.format(Number(slot.kortingsprijs));
      const bevestigdUrl = `${site}/deal/${slotId}/bevestigd?claim=${claimId}`;
      const kanAnnuleren =
        startDate.getTime() - Date.now() > 3 * 60 * 60 * 1000;

      await Promise.all([
        sendClaimConfirmation(email, {
          klantNaam: naam,
          behandeling: slot.behandeling_naam ?? "Behandeling",
          zaakNaam: business.naam,
          zaakAdres: business.adres,
          startTijdLabel,
          code,
          kortingsPrijsLabel,
          bevestigdUrl,
          kanAnnuleren,
        }),
        business.email
          ? sendBusinessNotification(business.email, {
              zaakNaam: business.naam,
              behandeling: slot.behandeling_naam ?? "Behandeling",
              startTijdLabel,
              klantNaam: naam,
              klantGsm: gsm,
              code,
              dashboardUrl: `${site}/dashboard`,
            })
          : Promise.resolve(),
      ]);
    } catch (e) {
      console.error("[claim] email dispatch error:", e);
    }
  });

  redirect(`/deal/${slotId}/bevestigd?claim=${claimId}`);
}
