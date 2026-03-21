import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // 1. PERFORMANCE: Keep our chunking optimization
  webpack: (config, { isServer }) => {
    // Only apply chunk splitting to the client build
    if (!isServer) {
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        chunks: 'all',
        maxSize: 250000, // 250kb max chunk size before splitting
      };
    }
    return config;
  },
  turbopack: {}, // Silence Next.js 16 Turbopack warning when using custom webpack config

  // 2. SECURITY: Hide tech stack
  poweredByHeader: false,

  // 3. PERFORMANCE: Gzip compression is on by default, but this guarantees it
  compress: true,

  // 4. SECURITY: Advanced HTTP Headers
  async headers() {
    return [
      {
        source: '/(.*)', // Apply to all routes
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN', // Prevents Clickjacking
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff', // Prevents MIME-sniffing
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
