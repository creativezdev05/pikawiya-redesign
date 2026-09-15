import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['untapped-stitch-impending.ngrok-free.dev'],
    images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.ngrok-free.dev',
      },
    ],
  },
  // Allows the HMR connection over the proxy
  async headers() {
    return [
      {
        source: '/_next/hmr',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
    ]
  },

};

export default nextConfig;
