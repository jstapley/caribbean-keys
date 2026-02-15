import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: false,
  experimental: {
    turbo: undefined,
  },
};

export default nextConfig;