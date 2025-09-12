import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  /* config for commiting to github pages? */
  output: 'export', 
  distDir: 'dist',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
