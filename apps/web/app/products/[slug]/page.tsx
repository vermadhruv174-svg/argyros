import { notFound, redirect } from 'next/navigation';
import { fetchProductBySlug } from '@/lib/api-client';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ProductDetailClient } from '@/components/catalogue/product-detail-client';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: product.name,
    description: product.seoDescription ?? product.description ?? 'Sculptural everyday silver, made to order in 925 sterling.',
    openGraph: {
      title: product.name,
      description: product.seoDescription ?? product.description ?? '',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // 301 legacy slug redirect
  if (slug === 'celeste-halo-ring') {
    redirect('/products/nova-halo-ring');
  }

  const item = await fetchProductBySlug(slug);

  if (!item) {
    notFound();
  }

  return (
    <>
      <Header />
      <main id="main-content" className="shell py-6 md:py-10 flex-1">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Product',
              name: item.name,
              description: item.description ?? '',
              brand: { '@type': 'Brand', name: 'Argyros' },
              material: item.metalPurity,
              offers: item.variants.map((v) => ({
                '@type': 'Offer',
                priceCurrency: 'INR',
                price: (v.priceCents / 100).toFixed(2),
                availability: v.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
                itemCondition: 'https://schema.org/NewCondition',
                seller: { '@type': 'Organization', name: 'Argyros' },
              })),
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: 'Home',
                  item: 'https://argyros.in',
                },
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: item.category,
                  item: `https://argyros.in/shop?category=${item.category.toLowerCase()}`,
                },
                {
                  '@type': 'ListItem',
                  position: 3,
                  name: item.name,
                  item: `https://argyros.in/products/${item.slug}`,
                },
              ],
            }),
          }}
        />
        <ProductDetailClient item={item} />
      </main>
      <Footer />
    </>
  );
}
