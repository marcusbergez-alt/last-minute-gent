import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/email/client";

export default function robots(): MetadataRoute.Robots {
  const site = getSiteUrl().replace(/\/$/, "");
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/dashboard", "/api", "/auth"],
      },
    ],
    sitemap: `${site}/sitemap.xml`,
    host: site,
  };
}
