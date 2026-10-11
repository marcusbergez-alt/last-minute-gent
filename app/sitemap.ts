import type { MetadataRoute } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSiteUrl } from "@/lib/email/client";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl().replace(/\/$/, "");
  const now = new Date();

  const statics: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "hourly", priority: 1 },
    {
      url: `${base}/voor-zaken`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${base}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${base}/voorwaarden`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];

  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from("businesses")
      .select("slug, aangemaakt_op")
      .eq("status", "goedgekeurd");

    const zaken: MetadataRoute.Sitemap = (data ?? []).map((b) => ({
      url: `${base}/zaak/${b.slug}`,
      lastModified: b.aangemaakt_op ? new Date(b.aangemaakt_op) : now,
      changeFrequency: "daily",
      priority: 0.8,
    }));

    return [...statics, ...zaken];
  } catch {
    return statics;
  }
}
