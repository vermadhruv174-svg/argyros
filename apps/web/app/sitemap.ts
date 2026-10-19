import { fetchProducts } from '@/lib/api-client';
import { CANONICAL_SITE_URL, getAppEnvironment } from '@argyros/config';
import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (getAppEnvironment() !== 'production') {
    return [];
  }

  const baseUrl = CANONICAL_SITE_URL;
  const catalogue = await fetchProducts();

  const productUrls = catalogue.data.map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const staticPages = [
    '',
    '/shop',
    '/collections',
    '/collections/the-first-edition',
    '/collections/premium-reserve',
    '/collections/daily-luxe',
    '/collections/gifts-under-3000',
    '/gifts',
    '/bespoke',
    '/heritage',
    '/support',
    '/size-guide',
    '/contact',
    '/privacy',
    '/terms',
    '/shipping-policy',
    '/returns',
    '/contact-and-grievance',
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '' ? ('daily' as const) : ('weekly' as const),
    priority: path === '' ? 1.0 : 0.7,
  }));

  return [...staticPages, ...productUrls];
}
