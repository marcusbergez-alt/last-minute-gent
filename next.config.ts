import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Auth-first app: elke pagina leest cookies, Cache Components verwacht
  // expliciet gecachete data of Suspense-grenzen. Voor nu uit.
  // partialPrefetching vereist cacheComponents, dus beide uit.
  cacheComponents: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
