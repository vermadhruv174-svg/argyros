import { notFound } from 'next/navigation';
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

  const primaryImage = product.images[0]?.url;

  return {
    title: product.seoTitle || `${product.name} — 925 Sterling Silver`,
    description: product.seoDescription || product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: primaryImage ? [{ url: primaryImage }] : [],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await fetchProductBySlug(slug);

  if (!item) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="shell py-6 md:py-10 flex-1">
        <ProductDetailClient item={item} />
      </main>
      <Footer />
    </>
  );
}
