import { fetchProducts } from '@/lib/api-client';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ProductCard } from '@/components/catalogue/product-card';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop All Pieces',
  description: 'Explore sculptural 925 sterling silver rings, earrings, necklaces and bracelets. Made to order with master karigar finishing.',
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q, category } = await searchParams;
  const catalogue = await fetchProducts(q, category);

  return (
    <>
      <Header />
      <main id="main-content" className="shell py-10 flex-1">
        <p className="eyebrow text-gold">Shop collection</p>
        <h1 className="mt-2 font-display text-5xl">Sterling silver, made personal.</h1>

        <form method="GET" action="/shop" className="my-8 flex flex-col gap-3 border-y border-line py-4 md:flex-row md:items-center md:justify-between">
          <input
            type="search"
            name="q"
            defaultValue={q || ''}
            placeholder="Search rings, earrings, necklaces..."
            aria-label="Search jewellery catalogue"
            className="min-h-[44px] w-full bg-transparent text-sm outline-none md:max-w-md border-b border-line focus:border-gold"
          />
          {category && <input type="hidden" name="category" value={category} />}
          <div className="flex items-center gap-4">
            <button type="submit" className="button min-h-[44px] py-0 text-xs">
              Filter Catalogue
            </button>
          </div>
        </form>

        <p className="mb-5 text-xs text-neutral-600 font-semibold">
          {catalogue.data.length} {catalogue.data.length === 1 ? 'piece' : 'pieces'} found
        </p>

        {catalogue.data.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-line p-8 my-8">
            <h2 className="font-display text-2xl">No pieces matched your search</h2>
            <p className="mt-2 text-xs text-neutral-600">Try adjusting your terms or explore our entire collection.</p>
            <a href="/shop" className="button mt-6 text-xs">
              Clear filters
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-4 md:gap-6">
            {catalogue.data.map((product) => (
              <ProductCard product={product} key={product.slug} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
