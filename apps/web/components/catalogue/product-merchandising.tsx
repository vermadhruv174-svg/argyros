'use client';

import React from 'react';
import type { ProductDetailData, ProductSummary } from '@/types/catalogue';
import { ProductCard } from '@/components/catalogue/product-card';
import { useRecentlyViewed } from '@/lib/recently-viewed';
import { FOUNDATION_PRODUCTS, getProductSummary } from '@/lib/catalogue-data';
import Link from 'next/link';
import { Sparkles, Layers, Gift, Compass } from 'lucide-react';

interface ProductMerchandisingProps {
  currentProduct: ProductDetailData;
}

export function ProductMerchandising({ currentProduct }: ProductMerchandisingProps) {
  const recentlyViewedSlugs = useRecentlyViewed(currentProduct.slug);

  // Map of all foundation products as summaries for quick slug lookup
  const allSummariesMap = React.useMemo(() => {
    const map = new Map<string, ProductSummary>();
    FOUNDATION_PRODUCTS.forEach((p) => {
      map.set(p.slug, getProductSummary(p));
    });
    return map;
  }, []);

  const stackSlugs = currentProduct.relatedSlugs?.completeTheStack || [];
  const pairsSlugs = currentProduct.relatedSlugs?.pairsWellWith || [];
  const editSlugs = currentProduct.relatedSlugs?.fromSameEdit || [];
  const giftSlugs = currentProduct.relatedSlugs?.giftWithThisPiece || [];

  // Fallback to other items in same category if no explicit pairs
  const sameCategoryFallback = React.useMemo(() => {
    return FOUNDATION_PRODUCTS
      .filter((p) => p.slug !== currentProduct.slug && p.category === currentProduct.category)
      .slice(0, 3)
      .map(getProductSummary);
  }, [currentProduct.slug, currentProduct.category]);

  const stackProducts = stackSlugs.map((s) => allSummariesMap.get(s)).filter((p): p is ProductSummary => Boolean(p));
  const pairsProducts = pairsSlugs.map((s) => allSummariesMap.get(s)).filter((p): p is ProductSummary => Boolean(p));
  const editProducts = editSlugs.map((s) => allSummariesMap.get(s)).filter((p): p is ProductSummary => Boolean(p));
  const giftProducts = giftSlugs.map((s) => allSummariesMap.get(s)).filter((p): p is ProductSummary => Boolean(p));

  const recentlyViewedProducts = recentlyViewedSlugs
    .map((s) => allSummariesMap.get(s))
    .filter((p): p is ProductSummary => Boolean(p))
    .slice(0, 4);

  // Combine stack and pairs into a cohesive recommendation set
  const primaryPairing = stackProducts.length > 0 
    ? { title: 'Complete the Stack', subtitle: 'Sculptural pairings curated to balance weight, proportion and texture', items: stackProducts, icon: Layers }
    : pairsProducts.length > 0
    ? { title: 'Pairs Well With', subtitle: 'Harmonious silver accents handpicked by our atelier karigars', items: pairsProducts, icon: Sparkles }
    : sameCategoryFallback.length > 0
    ? { title: `More from ${currentProduct.category}`, subtitle: 'Explore complementary silversmithing silhouettes in this edit', items: sameCategoryFallback, icon: Sparkles }
    : null;

  return (
    <section className="mt-20 pt-16 border-t border-line/80 space-y-20">
      {/* 1. Complete the Stack / Pairs Well With */}
      {primaryPairing && primaryPairing.items.length > 0 && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-gold text-xs font-bold uppercase tracking-[.2em] mb-1.5">
                <primaryPairing.icon size={14} />
                <span>Atelier Recommendations</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl text-ink">
                {primaryPairing.title}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 font-light mt-1">
                {primaryPairing.subtitle}
              </p>
            </div>
            <Link 
              href="/shop" 
              className="text-xs uppercase tracking-wider font-bold text-ink hover:text-gold transition-colors shrink-0"
            >
              Explore Full Atelier →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {primaryPairing.items.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      )}

      {/* 2. From the Same Edit / Curated Edit */}
      {editProducts.length > 0 && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-gold text-xs font-bold uppercase tracking-[.2em] mb-1.5">
                <Compass size={14} />
                <span>The Edit</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl text-ink">
                From the Same Collection
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 font-light mt-1">
                Cohesive silhouettes sharing ancestral Haldwani geometry and bench finish
              </p>
            </div>
            {currentProduct.collections[0] && (
              <Link 
                href={`/collections/${currentProduct.collections[0].slug}`} 
                className="text-xs uppercase tracking-wider font-bold text-ink hover:text-gold transition-colors shrink-0"
              >
                View {currentProduct.collections[0].name} →
              </Link>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {editProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      )}

      {/* 3. Gift With This Piece */}
      {giftProducts.length > 0 && (
        <div className="p-6 sm:p-8 rounded-[2px] bg-[#FAF8F5] border border-gold/30 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold/20 pb-4">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-ink text-gold flex items-center justify-center shrink-0 border border-gold/40">
                <Gift size={20} />
              </div>
              <div>
                <h3 className="font-display text-xl sm:text-2xl text-ink">
                  Gift With This Piece
                </h3>
                <p className="text-xs text-neutral-600 font-light">
                  Complimentary keepsake unboxing and embossed handwritten note included with every order.
                </p>
              </div>
            </div>
            <Link 
              href="/gifts" 
              className="text-xs uppercase tracking-wider font-bold text-gold hover:underline shrink-0"
            >
              Try AI Gift Finder →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {giftProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      )}

      {/* 4. Recently Viewed */}
      {recentlyViewedProducts.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.2em] text-neutral-500 mb-1">
                Your Browsing Atelier
              </p>
              <h2 className="font-display text-2xl sm:text-3xl text-ink">
                Recently Viewed
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {recentlyViewedProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
