import type { NextConfig } from 'next';
import {
  assertProductionSecrets,
  CANONICAL_SITE_URL,
  isProductionEnvironment,
} from '../../packages/config/src';

const isProduction = isProductionEnvironment();
const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
const apiOrigin = (() => {
  try {
    return new URL(configuredApiUrl || 'http://localhost:4000/api').origin;
  } catch {
    return 'http://localhost:4000';
  }
})();

if (isProduction) {
  assertProductionSecrets(process.env, ['ORDER_TOKEN_SECRET']);

  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configuredSiteUrl && new URL(configuredSiteUrl).origin !== CANONICAL_SITE_URL) {
    throw new Error(
      `Production canonical URL must be ${CANONICAL_SITE_URL}; received ${configuredSiteUrl}.`,
    );
  }

  if (!configuredApiUrl || apiOrigin.startsWith('http://localhost')) {
    throw new Error('Production API URL must be configured as a public HTTPS origin.');
  }
}

const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com https://checkout.razorpay.com https://www.googletagmanager.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https: http://localhost:*",
      "frame-src https://js.stripe.com https://hooks.stripe.com https://api.razorpay.com",
       `connect-src 'self' ${apiOrigin} http://localhost:* https://api.stripe.com https://checkout.razorpay.com https://www.google-analytics.com`,
    ].join('; '),
  },
];


const nextConfig: NextConfig = {
  async headers() {
    const headersList = [...securityHeaders];
    if (!isProduction) {
      headersList.push({
        key: 'X-Robots-Tag',
        value: 'noindex, nofollow',
      });
    }
    return [
      {
        source: '/(.*)',
        headers: headersList,
      },
    ];
  },
  images: {
    unoptimized: true,
    qualities: [75, 95],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Allow mobile access without cross-origin dev warning
  // @ts-ignore
  allowedDevOrigins: ['192.168.29.114', 'localhost:3000', '127.0.0.1:3000', '*.trycloudflare.com'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:4000/api/:path*',
      },
    ];
  },
};

export default nextConfig;
