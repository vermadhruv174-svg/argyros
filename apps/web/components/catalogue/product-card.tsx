'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ProductImage } from '@/components/media/product-image';
import { useAuth } from '@/lib/auth-context';
import { Heart } from 'lucide-react';

interface ProductCardProps {
  product: {
    id: string;
    slug: string;
    name: string;
    category: string;
    weightGrams?: number | string | null;
    primaryImage?: {
      url: string;
      alt?: string;
    } | null;
    secondaryImage?: {
      url: string;
      alt?: string;
    } | null;
    editorialBadge?: string | null;
    availableSizes?: string[];
    variants?: Array<{
      id: string;
      priceCents: number;
      compareAtCents?: number | null;
      stock?: number;
      size?: string | null;
    }>;
    minPriceCents?: number;
    maxPriceCents?: number;
    compareAtCents?: number | null;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const { user } = useAuth();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const lowestVariant = product.variants ? [...product.variants].sort((a, b) => a.priceCents - b.priceCents)[0] : undefined;
  const priceRupees = lowestVariant
    ? Math.round(lowestVariant.priceCents / 100)
    : product.minPriceCents
    ? Math.round(product.minPriceCents / 100)
    : 0;
  const compareAtRupees = lowestVariant?.compareAtCents
    ? Math.round(lowestVariant.compareAtCents / 100)
    : product.compareAtCents
    ? Math.round(product.compareAtCents / 100)
    : null;

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      window.location.href = `/login?redirect=/products/${product.slug}`;
      return;
    }

    const targetVariantId = lowestVariant?.id ?? product.id;
    if (!targetVariantId || wishlistLoading) return;

    setWishlistLoading(true);
    try {
      const res = await fetch(`/api/wishlist/${targetVariantId}`, {
        method: 'POST',
        credentials: 'include',
      });
      if (res.ok) {
        setIsWishlisted(!isWishlisted);
      }
    } catch {
      // ignore
    } finally {
      setWishlistLoading(false);
    }
  };

  const hasMultipleSizes = (product.availableSizes && product.availableSizes.length > 1) || (product.variants && product.variants.length > 1);

  return (
    <div className="group relative flex flex-col">
      <div className="relative overflow-hidden rounded-sm bg-[#0a1628]/5">
        <Link href={`/products/${product.slug}`} className="block relative aspect-[4/5]">
          {/* Primary Product Image */}
          <div className={`absolute inset-0 transition-opacity duration-500 ${product.secondaryImage ? 'group-hover:opacity-0' : ''}`}>
            <ProductImage
              src={product.primaryImage?.url}
              alt={product.primaryImage?.alt || product.name}
              name={product.name}
              category={product.category}
              aspectRatio="4/5"
            />
          </div>

          {/* Secondary / Alternate Hover Image if present */}
          {product.secondaryImage && (
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <ProductImage
                src={product.secondaryImage.url}
                alt={product.secondaryImage.alt || `${product.name} alternate profile`}
                name={product.name}
                category={product.category}
                aspectRatio="4/5"
              />
            </div>
          )}

          {/* Editorial Badge if present */}
          {product.editorialBadge && (
            <div className="absolute top-2.5 left-2.5 z-20">
              <span className="inline-block bg-[#0a1628]/90 text-gold px-2.5 py-0.5 text-[8px] font-bold uppercase tracking-[.18em] rounded-[2px] border border-gold/30 backdrop-blur-sm shadow-sm">
                ✦ {product.editorialBadge}
              </span>
            </div>
          )}

          {/* Quick Inspect Bar overlay on hover */}
          <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
            <span className="text-[10px] uppercase tracking-[.18em] text-white font-bold drop-shadow-sm flex items-center gap-1.5">
              <span>Inspect Piece</span>
              <span>→</span>
            </span>
          </div>
        </Link>

        {/* Wishlist button */}
        <button
          type="button"
          onClick={toggleWishlist}
          disabled={wishlistLoading}
          aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          className="absolute top-3 right-3 z-20 min-h-[44px] min-w-[44px] inline-flex items-center justify-center p-2 rounded-full bg-white/80 backdrop-blur-md text-ink hover:text-gold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          <Heart
            size={18}
            className={`stroke-[1.5] transition-colors ${
              isWishlisted ? 'fill-gold text-gold' : 'text-ink/80 hover:text-gold'
            }`}
          />
        </button>
      </div>

      <div className="mt-4 flex flex-col space-y-1">
        <div className="flex items-baseline justify-between">
          <p className="text-[10px] font-bold uppercase tracking-[.18em] text-neutral-500">
            {product.category} · Made to Order
          </p>
          {product.weightGrams && (
            <span className="text-[10px] text-neutral-400">
              {Number(product.weightGrams)}g
            </span>
          )}
        </div>

        <Link href={`/products/${product.slug}`} className="hover:text-gold transition-colors">
          <h3 className="font-display text-lg text-ink line-clamp-1">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-baseline justify-between pt-0.5">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-ink">
              ₹{priceRupees.toLocaleString('en-IN')}
            </span>
            {compareAtRupees && compareAtRupees > priceRupees && (
              <span className="text-xs text-neutral-400 line-through">
                ₹{compareAtRupees.toLocaleString('en-IN')}
              </span>
            )}
          </div>
          {hasMultipleSizes && (
            <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-medium">
              Sizes Available
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
