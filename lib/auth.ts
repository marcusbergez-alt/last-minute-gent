import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Business } from "@/lib/types";

export const ADMIN_EMAIL = "marcus.bergez@gmail.com";

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/signin");
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.email !== ADMIN_EMAIL) redirect("/");
  return user;
}

export async function getOwnBusiness(): Promise<Business | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("businesses")
    .select("*")
    .eq("owner_user_id", user.id)
    .maybeSingle();

  return (data as Business | null) ?? null;
}
