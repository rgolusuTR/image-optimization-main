/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/image-optimization-main',
  assetPrefix: '/image-optimization-main/',
};

module.exports = nextConfig;