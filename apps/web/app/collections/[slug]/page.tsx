import { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ProductCard } from '@/components/catalogue/product-card';
import { CollectionWorldHero } from '@/components/collections/collection-world-hero';
import CollectionTracker from './tracker';

import { fetchCollectionBySlug } from '@/lib/api-client';
import { getCollectionWorld } from '@/lib/collection-worlds';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const collection = await fetchCollectionBySlug(slug);
  if (!collection) return { title: 'Collection Not Found' };
  const world = getCollectionWorld(slug);
  return {
    title: `${collection.name} — ${world.worldTitle} | Argyros 925`,
    description: collection.description ?? world.tagline,
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

  const collection = await fetchCollectionBySlug(slug);
  if (!collection) return notFound();

  // Redirect unpublished collection URL to /collections
  if (!collection.isPublished) {
    redirect('/collections');
  }

  const products: any[] = collection.products ?? [];
  const world = getCollectionWorld(slug);

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
      secondaryImage: p.images?.[1] ?? null,
      editorialBadge: p.editorialBadge ?? null,
      variants: p.variants ?? [],
    };
  });

  return (
    <>
      <Header />
      <main id="main-content" className="flex-1">
        <CollectionTracker slug={slug} />

        {/* ── Immersive Unique Collection World Hero ── */}
        <CollectionWorldHero
          slug={slug}
          collectionName={collection.name}
          collectionDescription={collection.description}
          productCount={productSummaries.length}
        />

        {/* ── Collection Product Grid with Thematic Ambiance ── */}
        <section className={`py-14 md:py-20 ${world.gridBg} transition-colors duration-500`}>
          <div className="shell">
            <div className="flex items-center justify-between border-b border-line pb-4 mb-8">
              <div>
                <p className="eyebrow text-gold text-[9px]">Curated Silhouettes</p>
                <h2 className="font-display text-2xl text-ink mt-0.5">
                  Pieces in {collection.name}
                </h2>
              </div>
              <span className="text-xs uppercase tracking-widest text-neutral-500 font-mono font-semibold">
                {productSummaries.length} {productSummaries.length === 1 ? 'Creation' : 'Creations'}
              </span>
            </div>

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
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
