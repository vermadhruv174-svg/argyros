import type { NextConfig } from 'next';

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
      "connect-src 'self' http://localhost:* https://api.stripe.com https://checkout.razorpay.com https://www.google-analytics.com",
    ].join('; '),
  },
];


const nextConfig: NextConfig = {
  async headers() {
    const isProd = process.env.APP_ENV === 'production';
    const headersList = [...securityHeaders];
    if (!isProd) {
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
