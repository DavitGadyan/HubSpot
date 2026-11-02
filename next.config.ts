import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Case studies are read from disk at runtime by dynamic routes (results page, admin).
  outputFileTracingIncludes: {
    "/**": ["./content/**/*"],
  },
};

export default nextConfig;
