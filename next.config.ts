import type { NextConfig } from "next";
const isProd = process.env.NODE_ENV === 'production';
const nextConfig: NextConfig = {
  /* config options here */
  /* config for commiting to github pages? */
    reactStrictMode: true,
  images: {
    unoptimized: true, // Disable default image optimization
  },
  assetPrefix: isProd ? '/bEquipmentWebapp/' : '',
  basePath: isProd ? '/bEquipmentWebapp' : '',
  output: 'export'
};

export default nextConfig;
