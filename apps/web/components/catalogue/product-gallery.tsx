'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ZoomIn, ShieldCheck, Sparkles, X } from 'lucide-react';
import type { ProductDetailData } from '@/types/catalogue';

interface ProductGalleryProps {
  images: ProductDetailData['images'];
  name: string;
  category: string;
}

const VIEW_TITLES: Record<number, string> = {
  1: 'Primary Atelier View',
  2: 'On-Body Scale & Proportion',
  3: 'Macro Craftsmanship & Detail',
  4: 'Side Profile & Silhouette',
  5: 'Luxury Keepsake Packaging',
  6: '925 Hallmark & Authenticity',
};

export function ProductGallery({ images, name, category }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Touch swipe handling
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const safeImages = images && images.length > 0 ? images : [
    { id: 'fallback', url: '/images/jewellery-hero.jpg', alt: `${name} in solid 925 sterling silver`, position: 1 }
  ];

  const currentImage = safeImages[activeIndex] || safeImages[0];
  const totalCount = safeImages.length;

  const nextImage = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % totalCount);
  }, [totalCount]);

  const prevImage = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + totalCount) % totalCount);
  }, [totalCount]);

  // Keyboard navigation when gallery container is focused
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextImage();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevImage();
    } else if (e.key === 'Escape' && isModalOpen) {
      setIsModalOpen(false);
    }
  };

  // Mouse move for desktop zoom magnifier
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  // Touch swipe events
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 45;

    if (distance > minSwipeDistance) {
      // Swiped left -> next
      nextImage();
    } else if (distance < -minSwipeDistance) {
      // Swiped right -> prev
      prevImage();
    }
  };

  const currentPosition = currentImage.position || activeIndex + 1;
  const currentViewTitle = VIEW_TITLES[currentPosition] || `View ${activeIndex + 1} of ${totalCount}`;

  return (
    <div 
      className="space-y-4"
      ref={containerRef}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label={`${name} Product Gallery`}
    >
      {/* Main Viewport */}
      <div 
        className="relative aspect-[4/5] bg-[#0a1628] rounded-[2px] border border-gold/25 shadow-xl overflow-hidden group select-none cursor-crosshair focus:outline-none focus:ring-2 focus:ring-gold"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={() => setIsModalOpen(true)}
      >
        {/* Base Image */}
        <Image
          src={currentImage.url}
          alt={currentImage.alt || `${name} — ${currentViewTitle}`}
          fill
          priority={activeIndex === 0}
          sizes="(max-width: 1024px) 100vw, 50vw"
          className={`object-cover transition-transform duration-300 ease-out ${
            isZoomed ? 'scale-110 lg:opacity-0' : 'scale-100 opacity-100'
          }`}
        />

        {/* Desktop High-Resolution Zoom Lens (Shown on desktop hover) */}
        {isZoomed && (
          <div 
            className="hidden lg:block absolute inset-0 pointer-events-none overflow-hidden"
            style={{
              backgroundImage: `url(${currentImage.url})`,
              backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
              backgroundSize: '240%',
              backgroundRepeat: 'no-repeat',
            }}
          />
        )}

        {/* Top Badges */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
          <div className="liquid-glass-dark rounded-full px-3 py-1 text-[8px] font-bold tracking-[.18em] uppercase text-gold shadow-sm border border-gold/30">
            925 Sterling Silver
          </div>
          {currentPosition === 6 && (
            <div className="liquid-glass-dark rounded-full px-2.5 py-1 text-[8px] font-bold tracking-[.18em] uppercase text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <ShieldCheck size={10} /> Certified
            </div>
          )}
        </div>

        {/* View Indicator & Counter */}
        <div className="absolute bottom-4 left-4 z-10 liquid-glass-dark rounded-full px-3 py-1 text-[9px] font-medium tracking-wider text-white/90 border border-white/10 shadow-sm backdrop-blur-md">
          <span className="font-bold text-gold">{activeIndex + 1}</span> / {totalCount} · {currentViewTitle}
        </div>

        {/* Zoom Hint / Fullscreen Button */}
        <div className="absolute bottom-4 right-4 z-10 hidden sm:flex items-center gap-1.5 liquid-glass-dark rounded-full px-2.5 py-1 text-[9px] text-white/80 border border-white/10 hover:border-gold hover:text-gold transition-colors">
          <ZoomIn size={12} />
          <span>Click to expand</span>
        </div>

        {/* Navigation Arrows (Desktop & Tablet) */}
        {totalCount > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              aria-label="Previous view"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full liquid-glass-dark border border-white/15 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100 hover:bg-gold hover:text-ink hover:border-gold transition-all duration-200 shadow-lg"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              aria-label="Next view"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full liquid-glass-dark border border-white/15 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100 hover:bg-gold hover:text-ink hover:border-gold transition-all duration-200 shadow-lg"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Strip */}
      {totalCount > 1 && (
        <div 
          className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-gold/30"
          role="tablist"
          aria-label="Product image thumbnails"
        >
          {safeImages.map((img, idx) => {
            const isSelected = idx === activeIndex;
            const pos = img.position || idx + 1;
            const title = VIEW_TITLES[pos] || `View ${idx + 1}`;

            return (
              <button
                key={img.id || idx}
                type="button"
                role="tab"
                aria-selected={isSelected}
                aria-label={`Show ${title}`}
                onClick={() => setActiveIndex(idx)}
                className={`relative shrink-0 w-16 h-20 sm:w-20 sm:h-24 rounded-[2px] overflow-hidden border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gold ${
                  isSelected 
                    ? 'border-gold ring-1 ring-gold shadow-md scale-[1.03]' 
                    : 'border-line/70 opacity-70 hover:opacity-100 hover:border-gold/60'
                }`}
              >
                <Image
                  src={img.url}
                  alt={img.alt || `${name} thumbnail ${idx + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
                <span className="absolute bottom-0 inset-x-0 bg-ink/75 text-[8px] tracking-tight text-neutral-300 py-0.5 text-center truncate px-1">
                  {pos === 1 ? 'Hero' : pos === 2 ? 'Scale' : pos === 3 ? 'Detail' : pos === 4 ? 'Profile' : pos === 5 ? 'Box' : '925'}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Fullscreen Modal View */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-[#0a1628]/95 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={`${name} detailed view`}
          onClick={() => setIsModalOpen(false)}
        >
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            aria-label="Close high-resolution view"
            className="absolute top-6 right-6 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-gold hover:text-ink transition-colors focus:outline-none focus:ring-2 focus:ring-gold"
          >
            <X size={20} />
          </button>

          <div 
            className="relative w-full max-w-4xl max-h-[85vh] aspect-[4/5] sm:aspect-square"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={currentImage.url}
              alt={currentImage.alt || name}
              fill
              sizes="90vw"
              className="object-contain"
            />
          </div>

          <div className="mt-4 text-center text-white space-y-1">
            <p className="font-display text-xl text-gold">{name}</p>
            <p className="text-xs uppercase tracking-widest text-neutral-300">
              {currentViewTitle} ({activeIndex + 1} of {totalCount})
            </p>
          </div>

          {totalCount > 1 && (
            <div className="flex items-center gap-4 mt-6" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={prevImage}
                aria-label="Previous view"
                className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-gold hover:text-ink transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-xs text-neutral-400 tracking-wider">
                {activeIndex + 1} / {totalCount}
              </span>
              <button
                type="button"
                onClick={nextImage}
                aria-label="Next view"
                className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-gold hover:text-ink transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
