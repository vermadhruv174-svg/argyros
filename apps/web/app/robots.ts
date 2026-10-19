import { CANONICAL_SITE_URL, getAppEnvironment } from '@argyros/config';
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  if (getAppEnvironment() !== 'production') {
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
      disallow: ['/api/', '/admin'],
    },
    sitemap: `${CANONICAL_SITE_URL}/sitemap.xml`,
  };
}
