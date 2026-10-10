"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import type { BusinessStatus } from "@/lib/types";

const ALLOWED_STATUSES: BusinessStatus[] = [
  "aangemeld",
  "goedgekeurd",
  "gepauzeerd",
];

export async function setBusinessStatusAction(formData: FormData) {
  await requireAdmin();

  const businessId = String(formData.get("business_id") ?? "").trim();
  const status = String(formData.get("status") ?? "") as BusinessStatus;

  if (!businessId || !ALLOWED_STATUSES.includes(status)) return;

  const supabase = await createClient();
  await supabase
    .from("businesses")
    .update({ status })
    .eq("id", businessId);

  revalidatePath("/admin");
}
