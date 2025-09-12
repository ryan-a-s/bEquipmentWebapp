import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  assetPrefix: '/bEquipmentWebapp/',   // matches your repo name
  basePath: '/bEquipmentWebapp',       // matches your repo name
  output: 'export',                     // enables static export
};

export default nextConfig;
