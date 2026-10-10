"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getOwnBusiness, requireUser } from "@/lib/auth";

function cleanUrl(input: string): string | null {
  const value = input.trim();
  if (!value) return null;
  try {
    const u = new URL(value);
    if (u.protocol !== "https:" && u.protocol !== "http:") return null;
    return u.toString();
  } catch {
    return null;
  }
}

export async function saveProfileAction(formData: FormData) {
  await requireUser();
  const business = await getOwnBusiness();
  if (!business) {
    redirect(
      `/dashboard/profiel?error=${encodeURIComponent("Geen zaak gekoppeld.")}`,
    );
  }

  const naam = String(formData.get("naam") ?? "").trim();
  if (!naam) {
    redirect(
      `/dashboard/profiel?error=${encodeURIComponent("Naam mag niet leeg zijn.")}`,
    );
  }

  const adres = String(formData.get("adres") ?? "").trim() || null;
  const fotoRaw = String(formData.get("foto_url") ?? "").trim();
  const foto_url = fotoRaw ? cleanUrl(fotoRaw) : null;
  if (fotoRaw && !foto_url) {
    redirect(
      `/dashboard/profiel?error=${encodeURIComponent("Foto-URL is ongeldig.")}`,
    );
  }
  const instagram =
    String(formData.get("instagram") ?? "").trim() || null;
  const email = String(formData.get("email") ?? "").trim() || null;
  const gsm = String(formData.get("gsm") ?? "").trim() || null;

  const supabase = await createClient();
  const { error } = await supabase
    .from("businesses")
    .update({ naam, adres, foto_url, instagram, email, gsm })
    .eq("id", business.id);

  if (error) {
    redirect(
      `/dashboard/profiel?error=${encodeURIComponent(error.message)}`,
    );
  }

  revalidatePath("/dashboard/profiel");
  revalidatePath("/dashboard");
  redirect("/dashboard/profiel?ok=1");
}
