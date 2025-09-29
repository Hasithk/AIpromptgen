/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['images.pexels.com', 'via.placeholder.com'],
    unoptimized: false,
  },
  // experimental options removed: appDir is enabled by default in Next.js 13+
};

module.exports = nextConfig;
