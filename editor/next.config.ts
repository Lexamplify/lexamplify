import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/editor",
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
