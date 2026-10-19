'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';
import { getCollectionWorld, COLLECTION_WORLDS } from '@/lib/collection-worlds';

interface CollectionWorldHeroProps {
  slug: string;
  collectionName: string;
  collectionDescription?: string | null;
  productCount: number;
}

export function CollectionWorldHero({
  slug,
  collectionName,
  collectionDescription,
  productCount,
}: CollectionWorldHeroProps) {
  const { language, t } = useLanguage();
  const world = getCollectionWorld(slug);
  const isHindi = language === 'hi';

  const otherWorlds = Object.values(COLLECTION_WORLDS).filter((w) => w.slug !== slug);

  return (
    <div className="relative overflow-hidden border-b border-line">
      {/* ── World Background Atmospheric Image & Gradients ──────────────── */}
      <div className="absolute inset-0 z-0">
        <Image
          src={world.heroImage}
          alt={`${collectionName} - ${world.worldTitle}`}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center animate-dissolve-down scale-105 transition-transform duration-1000"
        />
        {/* Thematic Deep Atmospheric Gradients specific to this World */}
        <div className={`absolute inset-0 bg-gradient-to-r ${world.bgGradient} opacity-90 mix-blend-multiply pointer-events-none`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/40 pointer-events-none" />

        {/* Ambient Colored Radial Light Halo */}
        <div
          className="absolute -top-32 right-1/4 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none opacity-40"
          style={{ backgroundColor: world.accentColor }}
        />

        {/* Translucent Dissolve to Page Bottom */}
        <div className="absolute -bottom-1 inset-x-0 h-32 md:h-44 bg-gradient-to-b from-transparent via-[#FAF8F5]/80 to-[#FAF8F5] backdrop-blur-[2px] pointer-events-none" />
      </div>

      {/* ── Hero Foreground Content ────────────────────────────────────── */}
      <div className="shell relative z-10 py-16 md:py-24 max-w-5xl text-white">
        {/* Breadcrumb Navigation */}
        <nav className="text-[10px] uppercase tracking-[.2em] text-white/70 mb-8 flex items-center gap-2" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gold transition-colors">
            {t('nav.shop', 'Home')}
          </Link>
          <span className="text-white/40">/</span>
          <Link href="/collections" className="hover:text-gold transition-colors">
            {t('nav.collections', 'Collections')}
          </Link>
          <span className="text-white/40">/</span>
          <span className="text-gold font-bold">{collectionName}</span>
        </nav>

        {/* World Card Glass Presentation */}
        <div className="p-8 md:p-12 rounded-[2px] backdrop-blur-xl bg-black/40 border border-white/15 shadow-2xl space-y-6 relative overflow-hidden">
          {/* Subtle Top Specular Sheen */}
          <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />

          {/* World Header Pill & Piece Counter */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full ${world.badgeBg} border ${world.accentBorder} ${world.badgeText} text-[10px] font-bold tracking-widest uppercase shadow-sm`}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: world.accentColor }} />
              <span>
                {isHindi ? world.worldTitleHi : `✦ WORLD ${world.worldNumber} · ${world.worldTitle}`}
              </span>
            </div>

            <span className="text-[10px] uppercase tracking-widest text-white/80 bg-white/10 px-3 py-1 rounded-full font-mono font-semibold border border-white/10">
              {productCount} {productCount === 1 ? 'Piece' : 'Pieces'}
            </span>
          </div>

          {/* Headline & Poetic Tagline */}
          <div className="space-y-3">
            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl leading-[1.05] tracking-tight text-white font-normal">
              {collectionName}
            </h1>
            <p className="text-sm md:text-base font-serif italic text-gold/90 max-w-2xl leading-relaxed">
              &ldquo;{isHindi ? world.taglineHi : world.tagline}&rdquo;
            </p>
          </div>

          {/* Narrative Story Paragraph */}
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-light max-w-2xl">
            {isHindi ? world.storyParagraphHi : (collectionDescription || world.storyParagraph)}
          </p>

          {/* Technical Craftsmanship & Provenance Row */}
          <div className="pt-6 border-t border-white/10 grid sm:grid-cols-3 gap-4 text-[11px] text-white/70">
            <div>
              <p className="text-gold font-bold text-[9px] uppercase tracking-widest">Material Signature</p>
              <p className="text-white/90 mt-0.5">{world.materialSignature}</p>
            </div>
            <div>
              <p className="text-gold font-bold text-[9px] uppercase tracking-widest">Haldwani Craft Technique</p>
              <p className="text-white/90 mt-0.5">{world.karigarTechnique}</p>
            </div>
            <div>
              <p className="text-gold font-bold text-[9px] uppercase tracking-widest">Atelier Provenance</p>
              <p className="text-white/90 mt-0.5">{world.provenanceNote}</p>
            </div>
          </div>
        </div>

        {/* ── Interactive World Travel Bar ───────────────────────────────── */}
        <div className="mt-8 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[10px] uppercase tracking-widest text-white/60 font-semibold mr-1">
            {isHindi ? 'अन्य संसार देखें:' : 'Travel to Worlds:'}
          </span>
          {otherWorlds.map((w) => (
            <Link
              key={w.slug}
              href={`/collections/${w.slug}`}
              className="px-3 py-1 rounded-full border border-white/20 bg-black/40 backdrop-blur-md text-white/80 hover:text-gold hover:border-gold/60 text-[10px] tracking-wider uppercase transition-all duration-200"
            >
              <span>{isHindi ? w.worldTitleHi : w.worldTitle}</span>
              <span className="ml-1 text-gold">→</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
