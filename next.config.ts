import type { NextConfig } from "next";

/**
 * Two build modes:
 * - default: full app (server routes, OAuth, Claude, database) for Node hosts.
 * - STATIC_EXPORT=1: marketing site + case studies as a static export for GitHub Pages
 *   (run via `npm run build:static`, which removes the server-only routes first).
 */
const isStatic = process.env.STATIC_EXPORT === "1";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  // No "N" dev badge in the corner (keeps dev-mode screenshots and recordings clean).
  devIndicators: false,
  ...(isStatic
    ? { output: "export" as const, distDir: ".next-static", basePath, trailingSlash: true, images: { unoptimized: true } }
    : {
        // NEXT_DIST_DIR lets a production build run next to a dev server (e.g. for demo recordings).
        distDir: process.env.NEXT_DIST_DIR || ".next",
        // Case studies are read from disk at runtime by dynamic routes (results page, admin).
        outputFileTracingIncludes: { "/**": ["./content/**/*"] },
      }),
};

export default nextConfig;
