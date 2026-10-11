import { cookies } from "next/headers";

export const BRON_COOKIE = "lmm_bron";

/** Leest de utm-bron cookie die door proxy.ts gezet werd. */
export async function getBron(): Promise<string | null> {
  const c = await cookies();
  return c.get(BRON_COOKIE)?.value ?? null;
}
