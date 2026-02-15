import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: false,
  experimental: {
    turbo: undefined,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;