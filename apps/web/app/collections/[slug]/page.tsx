import { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ProductCard } from '@/components/catalogue/product-card';
import CollectionTracker from './tracker';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

async function getCollection(slug: string) {
  try {
    const res = await fetch(`${API_URL}/collections/${slug}`, { next: { revalidate: 60 } });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error('Failed to fetch');
    return await res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCollection(slug);
  if (!collection) return { title: 'Collection Not Found' };
  return {
    title: `${collection.name}`,
    description: collection.description ?? 'A curated collection of 925 sterling silver jewellery.',
  };
}

export default async function CollectionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // 301 legacy redirects
  if (slug === 'new-arrivals') {
    redirect('/collections/the-first-edition');
  }
  if (slug === 'diwali-2026') {
    redirect('/collections');
  }

  const collection = await getCollection(slug);
  if (!collection) return notFound();

  // Section 5.1: Redirect any unpublished collection URL to /collections (302)
  if (!collection.isPublished) {
    redirect('/collections');
  }

  const products: any[] = collection.products ?? [];

  // Shape product items for ProductCard
  const productSummaries = products.map((pc: any) => {
    const p = pc.product;
    return {
      id: p.id,
      slug: p.slug,
      name: p.name,
      category: p.category,
      weightGrams: p.weightGrams,
      primaryImage: p.images?.[0] ?? null,
      variants: p.variants ?? [],
    };
  });

  return (
    <>
      <Header />
      <main id="main-content" className="flex-1">
        <CollectionTracker slug={slug} />

        {/* 5.4 Breadcrumb, Hero & Header */}
        <div className="shell py-12 md:py-16 border-b border-line">
          <nav className="text-[10px] uppercase tracking-[.18em] text-neutral-500 mb-4" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-gold">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/collections" className="hover:text-gold">Collections</Link>
            <span className="mx-2">/</span>
            <span className="text-ink font-semibold">{collection.name}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="eyebrow text-gold mb-2">
                {collection.kind === 'editorial' ? '✦ Editorial Edition' : '✦ Curated Edit'}
              </p>
              <h1 className="font-display text-5xl md:text-7xl text-ink leading-tight">
                {collection.name}
              </h1>
              {collection.description && (
                <p className="mt-3 text-sm text-neutral-600 max-w-lg leading-relaxed font-light">
                  {collection.description}
                </p>
              )}
            </div>

            <div className="text-xs uppercase tracking-widest text-neutral-500 font-bold">
              {productSummaries.length} {productSummaries.length === 1 ? 'Piece' : 'Pieces'}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <section className="shell py-14 md:py-20">
          {productSummaries.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 md:gap-7">
              {productSummaries.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-24 text-center max-w-md mx-auto space-y-4">
              <h3 className="font-display text-3xl text-neutral-400">No pieces here yet.</h3>
              <p className="text-xs text-neutral-500">
                Browse our debut edition of handcrafted sterling silver pieces.
              </p>
              <Link href="/collections/the-first-edition" className="button inline-flex">
                Browse the First Edition →
              </Link>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
