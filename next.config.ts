import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: '/uploads/images/**',
        search: '',
      },
    ],
  },

  experimental: {
    serverActions: {
      bodySizeLimit: '100mb',
    },
  },
  
};

export default nextConfig;

