import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: ['via.placeholder.com', 'drive.google.com'], // Add your image host here
  },
};

export default nextConfig;
