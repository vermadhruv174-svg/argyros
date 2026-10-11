import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

interface HeroPiece {
  tier: 'Entry Essential' | 'Core Bestseller' | 'Premium Statement';
  slug: string;
  name: string;
  category: string;
  priceRupees: number;
  weightGrams: number;
  reason: string;
  imageUrl: string;
  badge: string;
}

const HERO_PIECES: HeroPiece[] = [
  {
    tier: 'Entry Essential',
    slug: 'aura-stud-earrings',
    name: 'Aura Stud Earrings',
    category: 'Earrings',
    priceRupees: 1890,
    weightGrams: 2.8,
    reason: 'Pure minimalist mirror-polished domes with custom safety posts. The effortless entry into solid 925 silver.',
    imageUrl: '/images/products/luna-hoop-earrings-1-hero.svg',
    badge: 'Under ₹2,000',
  },
  {
    tier: 'Core Bestseller',
    slug: 'nova-halo-ring',
    name: 'Nova Halo Ring',
    category: 'Rings',
    priceRupees: 3490,
    weightGrams: 4.2,
    reason: 'Our definitive sculptural silhouette. Soft architectural curvature designed for daily wear and modern stacking.',
    imageUrl: '/images/products/nova-halo-ring-1-hero.svg',
    badge: 'Atelier Icon',
  },
  {
    tier: 'Premium Statement',
    slug: 'equinox-statement-ring',
    name: 'Equinox Statement Ring',
    category: 'Rings',
    priceRupees: 6290,
    weightGrams: 8.8,
    reason: 'Substantial 8.8g presence featuring satin-brushed center face contrasted by razor mirror-polished bevels.',
    imageUrl: '/images/products/equinox-statement-ring-1-hero.svg',
    badge: 'Substantial 8.8g',
  },
];

export function HeroThreePieces() {
  return (
    <section className="shell py-12 md:py-16" aria-label="Hero Products">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-gold text-[10px] font-bold uppercase tracking-[.22em] mb-1.5">
            <Sparkles size={12} />
            <span>Where to Begin</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl text-ink">
            Three Foundations.
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 font-light mt-1 max-w-xl">
            From everyday minimalist accents to heavyweight architectural silver. Each cast in solid 925 and finished by hand.
          </p>
        </div>
        <Link
          href="/shop"
          className="text-xs uppercase tracking-wider font-bold text-ink hover:text-gold transition-colors shrink-0 flex items-center gap-1.5"
        >
          <span>View All 15 Pieces</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {HERO_PIECES.map((piece) => (
          <div
            key={piece.slug}
            className="group relative flex flex-col justify-between rounded-[2px] border border-line/80 bg-white p-6 shadow-sm hover:border-gold/60 hover:shadow-xl transition-all duration-300"
          >
            <div>
              {/* Header Tier & Tag */}
              <div className="flex items-center justify-between pb-4 border-b border-line/50">
                <span className="text-[9px] uppercase tracking-[.2em] font-bold text-neutral-500">
                  {piece.tier}
                </span>
                <span className="text-[9px] uppercase tracking-wider font-bold text-gold bg-[#FAF8F5] border border-gold/30 px-2 py-0.5 rounded-full">
                  {piece.badge}
                </span>
              </div>

              {/* Product Visual */}
              <Link href={`/products/${piece.slug}`} className="block relative aspect-[4/5] my-5 overflow-hidden rounded-[2px] bg-[#0a1628]/5">
                <Image
                  src={piece.imageUrl}
                  alt={`${piece.name} — solid 925 sterling silver`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 liquid-glass-dark rounded-full px-2.5 py-0.5 text-[8px] font-bold tracking-widest uppercase text-gold">
                  ~{piece.weightGrams}g 925 Silver
                </div>
              </Link>

              {/* Info */}
              <div className="space-y-1.5">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-display text-2xl text-ink group-hover:text-gold transition-colors">
                    <Link href={`/products/${piece.slug}`}>
                      {piece.name}
                    </Link>
                  </h3>
                  <span className="text-sm font-bold text-ink">
                    ₹{piece.priceRupees.toLocaleString('en-IN')}
                  </span>
                </div>
                <p className="text-xs text-neutral-600 font-light leading-relaxed">
                  {piece.reason}
                </p>
              </div>
            </div>

            {/* Inspect CTA */}
            <div className="pt-5 mt-5 border-t border-line/60">
              <Link
                href={`/products/${piece.slug}`}
                className="w-full py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-ink border border-line bg-[#FAF8F5] rounded-[2px] flex items-center justify-center gap-2 group-hover:bg-ink group-hover:text-white group-hover:border-ink transition-all duration-200"
              >
                <span>Inspect Piece</span>
                <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
