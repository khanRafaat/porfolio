import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hide the floating "N" dev badge — it confuses full-page screenshots
  devIndicators: false,
  images: {
    remotePatterns: [
      // MinIO in local dev (cover images, OG images)
      { protocol: "http", hostname: "localhost", port: "9000" },
    ],
  },
};

export default nextConfig;
