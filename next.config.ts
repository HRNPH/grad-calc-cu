import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/grad-calc-cu',
  assetPrefix: '/grad-calc-cu',
};

export default nextConfig;
