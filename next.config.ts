import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/image-optimization-main',
  assetPrefix: '/image-optimization-main/',
};

export default nextConfig;
