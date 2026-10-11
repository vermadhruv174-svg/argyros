import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

interface CuratedCollectionItem {
  slug: string;
  name: string;
  tagline: string;
  pieceCount: string;
  imageUrl: string;
  bgGradient: string;
}

const COLLECTIONS: CuratedCollectionItem[] = [
  {
    slug: 'the-first-edition',
    name: 'The First Edition',
    tagline: 'Debut edit: 15 sculptural foundation pieces cast in solid 925 sterling.',
    pieceCount: '15 Pieces',
    imageUrl: '/images/jewellery-hero.jpg',
    bgGradient: 'from-[#0a1628] to-[#12233c]',
  },
  {
    slug: 'daily-luxe',
    name: 'Daily Luxe',
    tagline: 'Lightweight, tactile essentials engineered for every morning and stack.',
    pieceCount: '6 Pieces',
    imageUrl: '/images/products/luna-hoop-earrings-1-hero.svg',
    bgGradient: 'from-[#141b22] to-[#1c2631]',
  },
  {
    slug: 'premium-reserve',
    name: 'Premium Reserve',
    tagline: 'Heavy gauge cuffs, signets, and sculptural collars with substantial silver weight.',
    pieceCount: '8 Pieces',
    imageUrl: '/images/products/equinox-statement-ring-1-hero.svg',
    bgGradient: 'from-[#1a1412] to-[#291e1a]',
  },
  {
    slug: 'pahadi-edit',
    name: 'Pahadi Edit',
    tagline: 'Himalayan ridge contours and ancestral Kumaon motifs refined in modern silver.',
    pieceCount: '4 Pieces',
    imageUrl: '/images/uttarakhand-sunrise.jpg',
    bgGradient: 'from-[#161d19] to-[#212b25]',
  },
  {
    slug: 'gifts-under-3000',
    name: 'Gifts Under ₹3,000',
    tagline: 'Solid 925 fine jewellery gifts with uncompromised karigar finishing.',
    pieceCount: '3 Pieces',
    imageUrl: '/images/products/nova-halo-ring-1-hero.svg',
    bgGradient: 'from-[#231e13] to-[#332c1b]',
  },
];

export function CuratedCollections() {
  return (
    <section className="shell py-16 md:py-20" aria-label="Curated Collections">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <p className="eyebrow text-gold">Curated Edits</p>
          <h2 className="mt-2 font-display text-3xl md:text-5xl text-ink">
            The Collections.
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 font-light mt-1">
            Explore curated edits structured around daily wearability, ancestral weight, and gifting.
          </p>
        </div>
        <Link
          href="/collections"
          className="text-xs uppercase tracking-wider font-bold text-ink hover:text-gold transition-colors shrink-0 flex items-center gap-1"
        >
          <span>All Collections</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {COLLECTIONS.map((c, idx) => (
          <Link
            key={c.slug}
            href={`/collections/${c.slug}`}
            className={`group relative overflow-hidden rounded-[2px] border border-line/80 bg-gradient-to-br ${c.bgGradient} p-6 sm:p-8 flex flex-col justify-between text-white shadow-sm hover:border-gold/50 hover:shadow-xl transition-all duration-300 ${
              idx === 0 ? 'sm:col-span-2 lg:col-span-2 aspect-[16/9] sm:aspect-[21/9]' : 'aspect-[4/3] sm:aspect-[16/10]'
            }`}
          >
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0 opacity-40 group-hover:opacity-55 transition-opacity duration-700">
              <Image
                src={c.imageUrl}
                alt={c.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
            </div>

            {/* Top Badge */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="text-[9px] uppercase tracking-[.22em] text-gold font-bold">
                Argyros Edit
              </span>
              <span className="text-[9px] uppercase tracking-wider text-white/80 bg-white/10 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/10">
                {c.pieceCount}
              </span>
            </div>

            {/* Bottom Info */}
            <div className="relative z-10 mt-12">
              <h3 className="font-display text-2xl sm:text-3xl text-white group-hover:text-gold transition-colors">
                {c.name}
              </h3>
              <p className="mt-1.5 text-xs text-neutral-300 font-light max-w-md line-clamp-2">
                {c.tagline}
              </p>
              <div className="mt-4 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[.18em] text-gold">
                <span>Explore Edit</span>
                <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
