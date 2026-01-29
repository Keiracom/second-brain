import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow reading from brain folder outside the project
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Disable strict mode for smoother dev experience
  reactStrictMode: true,
  // Output standalone for Vercel
  output: 'standalone',
};

export default nextConfig;
