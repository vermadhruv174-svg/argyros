import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const isProd = process.env.APP_ENV === 'production';
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://argyros.in';

  if (!isProd) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    };
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/bag', '/checkout', '/account', '/track', '/admin'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
