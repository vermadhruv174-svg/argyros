'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

interface ShowcasePiece {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  category: string;
  weightGrams: number | string;
  priceRupees: number;
  imageUrl: string;
  tag: string;
}

const SHOWCASE_PIECES: ShowcasePiece[] = [
  {
    id: 'p1',
    slug: 'nova-halo-ring',
    name: 'Nova Halo Ring',
    subtitle: 'Sculptural circular halo with rounded comfort-fit shank.',
    category: 'Rings',
    weightGrams: 4.2,
    priceRupees: 2890,
    imageUrl: '/images/jewellery-hero.jpg',
    tag: 'Debut Foundation Piece',
  },
  {
    id: 'p2',
    slug: 'equinox-statement-ring',
    name: 'Equinox Statement Ring',
    subtitle: 'Architectural wide band with satin face and razor mirror bevels.',
    category: 'Rings',
    weightGrams: 8.8,
    priceRupees: 6290,
    imageUrl: '/images/collections-hero.jpg',
    tag: 'Premium Reserve',
  },
  {
    id: 'p3',
    slug: 'siddhi-heirloom-kada',
    name: 'Siddhi Heirloom Kada',
    subtitle: 'Heavyweight solid 925 cuff featuring hand-forged fluting.',
    category: 'Bracelets & Cuffs',
    weightGrams: 24.2,
    priceRupees: 8490,
    imageUrl: '/images/collections-hero.jpg',
    tag: 'Master Karigar Heritage',
  },
  {
    id: 'p4',
    slug: 'celestine-choker',
    name: 'Celestine Choker',
    subtitle: 'Artisanal box link collar designed to sit flush against the collarbone.',
    category: 'Necklaces',
    weightGrams: 8.4,
    priceRupees: 4890,
    imageUrl: '/images/jewellery-hero.jpg',
    tag: 'Daily Luxe Edit',
  },
  {
    id: 'p5',
    slug: 'luna-hoop-earrings',
    name: 'Luna Hoop Earrings',
    subtitle: 'Hand-sculpted crescent hoop cast in solid 925 sterling silver.',
    category: 'Earrings',
    weightGrams: '4.6g – 7.2g',
    priceRupees: 2490,
    imageUrl: '/images/jewellery-hero.jpg',
    tag: 'Gifts Under ₹3,000',
  },
  {
    id: 'p6',
    slug: 'hansli-minimal-collar',
    name: 'Hansli Minimal Collar',
    subtitle: 'A contemporary refinement of ancestral Kumaon torque collars.',
    category: 'Necklaces',
    weightGrams: 18.5,
    priceRupees: 7890,
    imageUrl: '/images/collections-hero.jpg',
    tag: 'Pahadi Edit',
  },
];

export function RevolvingPiecesBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % SHOWCASE_PIECES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + SHOWCASE_PIECES.length) % SHOWCASE_PIECES.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 4500);

    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  const active = SHOWCASE_PIECES[currentIndex];

  return (
    <section
      className="shell py-12 md:py-16"
      aria-label="Revolving Flagship Pieces Showcase"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative overflow-hidden rounded-[2px] bg-gradient-to-br from-[#0a1628] via-[#07101e] to-[#040810] border border-gold/30 shadow-2xl text-white">
        {/* Ambient background glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-900/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid lg:grid-cols-[1.1fr_1.2fr] items-center p-8 md:p-14 lg:p-16 gap-10">
          {/* Left Column: Piece Information */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/20 border border-gold/40 text-[9px] font-bold uppercase tracking-[.2em] text-gold">
                <Sparkles size={11} /> {active.tag}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-white/50">
                {active.category}
              </span>
            </div>

            <div>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight transition-all duration-300">
                {active.name}
              </h2>
              <p className="mt-3 text-sm text-white/75 font-light leading-relaxed max-w-md">
                {active.subtitle}
              </p>
            </div>

            {/* Spec Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded bg-white/5 border border-white/10">
                <p className="text-[9px] uppercase tracking-widest text-gold font-bold">Fine Silver</p>
                <p className="text-sm font-semibold text-white mt-0.5">~{active.weightGrams}g</p>
              </div>
              <div className="p-3 rounded bg-white/5 border border-white/10">
                <p className="text-[9px] uppercase tracking-widest text-gold font-bold">Purity</p>
                <p className="text-sm font-semibold text-white mt-0.5">925 BIS Mark</p>
              </div>
              <div className="p-3 rounded bg-white/5 border border-white/10 col-span-2 sm:col-span-1">
                <p className="text-[9px] uppercase tracking-widest text-gold font-bold">Edition Price</p>
                <p className="text-sm font-bold text-emerald-400 mt-0.5">
                  ₹{active.priceRupees.toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            {/* Actions & Carousel Navigation */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                href={`/products/${active.slug}`}
                className="button bg-gold text-[#0a1628] hover:bg-[#d4b05a] border-none px-7 flex items-center gap-2 shadow-xl hover:scale-105 transition-transform"
              >
                <span>Inspect Piece</span>
                <ArrowRight size={14} />
              </Link>

              {/* Prev / Next controls */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={prevSlide}
                  aria-label="Previous showcase piece"
                  className="h-10 w-10 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-white hover:border-gold hover:text-gold transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={nextSlide}
                  aria-label="Next showcase piece"
                  className="h-10 w-10 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-white hover:border-gold hover:text-gold transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            {/* Slide Indicators / Tabs */}
            <div className="pt-4 flex items-center gap-2">
              {SHOWCASE_PIECES.map((piece, idx) => (
                <button
                  key={piece.id}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Jump to ${piece.name}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentIndex
                      ? 'w-10 bg-gold'
                      : 'w-2 bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
              <span className="text-[9px] uppercase tracking-widest text-white/40 ml-3">
                0{currentIndex + 1} / 0{SHOWCASE_PIECES.length}
              </span>
            </div>
          </div>

          {/* Right Column: Hero Visual with Translucent Frame */}
          <div className="relative aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3] w-full rounded-[2px] overflow-hidden border border-gold/30 shadow-2xl group">
            <Image
              src={active.imageUrl}
              alt={active.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center transition-all duration-700 ease-out group-hover:scale-105"
            />
            {/* Film grain / dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

            {/* Floating Hallmark Inscription Tag */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between p-3 rounded bg-black/60 backdrop-blur-md border border-white/15 text-xs text-white">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-gold" />
                <span className="text-[10px] uppercase font-bold tracking-wider">
                  Solid 925 Hallmark · 6-Digit Laser HUID
                </span>
              </div>
              <span className="text-[10px] text-white/60 font-light">
                Haldwani Atelier
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
