import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  experimental: {
    // Avoid dev-only RSC manifest / HMR crashes (originalFactory.call).
    devtoolSegmentExplorer: false,
  },
};

export default nextConfig;
