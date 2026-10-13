import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { HeroThreePieces } from '@/components/home/hero-three-pieces';
import { WhyArgyros } from '@/components/home/why-argyros';
import { CuratedCollections } from '@/components/home/curated-collections';
import { CraftStory } from '@/components/home/craft-story';
import { UnboxingExperience } from '@/components/home/unboxing-experience';
import { InteractiveGiftTeaser } from '@/components/home/interactive-gift-teaser';
import { ConciergeTwoPaths } from '@/components/home/concierge-two-paths';
import { siteConfig } from '@argyros/config';
import { ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <>
      {/* Section 1: Luxury Announcement Bar & Header Navigation */}
      <Header />

      <main id="main-content" className="flex-1">
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Argyros',
              url: 'https://argyros.in',
              legalName: siteConfig.legal.entityName,
              description: 'Sculptural everyday silver, made to order in 925 sterling.',
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Argyros',
              url: 'https://argyros.in',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://argyros.in/shop?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />

        {/* Section 2: Hero Section — Immersive Jewellery Close-Look Portrait */}
        <section className="relative overflow-hidden min-h-[580px] md:min-h-[680px] flex items-center border-b border-line" aria-label="Hero">
          {/* Immersive Background Image: Jewellery Close-Up Portrait */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/jewellery-hero.jpg"
              alt="Argyros Sculptural Sterling Silver Jewellery — Handcrafted in 925 solid silver"
              fill
              priority
              quality={95}
              sizes="100vw"
              className="object-cover object-[center_35%] animate-dissolve-down"
            />
            {/* Ambient luxury cinematic overlay allowing the crisp jewellery portrait to shine through */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/25 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />
            {/* Translucent dissolve down to the page as you scroll */}
            <div className="absolute -bottom-1 inset-x-0 h-32 md:h-44 bg-gradient-to-b from-transparent via-[#FAF8F5]/80 to-[#FAF8F5] backdrop-blur-[2px] pointer-events-none" />
          </div>

          <div className="shell relative z-10 py-16 md:py-24 max-w-3xl">
            <div className="p-8 md:p-12 rounded-[2px] backdrop-blur-md bg-black/45 border border-white/15 text-white shadow-2xl space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-gold/50 bg-black/50 backdrop-blur-sm px-3.5 py-1 text-[9px] font-bold tracking-[.22em] text-gold uppercase shadow-sm">
                  <span>✦</span> {siteConfig.brand.houseLine}
                </div>
              </div>

              <div>
                <p className="mb-2 text-[10px] tracking-[.22em] text-gold uppercase font-bold">
                  A personal silver universe
                </p>
                <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl leading-[1.02] tracking-tight text-white">
                  Made to
                  <br />
                  <i className="font-serif italic font-normal text-gold">become</i>
                  <br />
                  yours.
                </h1>
              </div>

              <p className="max-w-xl text-base md:text-lg leading-relaxed text-white/85 font-light">
                Sculptural everyday silver, made to order in 925 sterling. Designed to be worn daily and kept for years.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
                <Link 
                  className="button shadow-md hover:shadow-xl depth-card px-6 py-3.5 text-xs tracking-wider" 
                  href="/collections/the-first-edition"
                >
                  Shop the First Edition <span className="ml-2 text-base" aria-hidden="true">→</span>
                </Link>
                <Link
                  className="px-5 py-3 text-[10px] font-bold tracking-[.18em] uppercase text-white hover:text-gold border border-white/30 bg-white/10 backdrop-blur-sm transition-colors rounded-sm shadow-sm"
                  href="/collections"
                >
                  Explore Collections
                </Link>
              </div>

              {/* Trust Strip */}
              <div className="pt-5 border-t border-white/15 grid grid-cols-3 gap-2 text-[9px] sm:text-[10px] font-bold tracking-wider text-white/70 uppercase">
                <div>✦ 925 Sterling</div>
                <div>✦ Made to Order</div>
                <div>✦ Haldwani Bench</div>
              </div>
            </div>
          </div>

          {/* Atelier Hallmark Seal on bottom-right of hero */}
          <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 z-10 hidden sm:flex items-center gap-2.5 bg-[#0a1628]/90 backdrop-blur-md px-4 py-2 rounded-[2px] border border-gold/30 text-white shadow-xl">
            <span className="font-display text-lg text-gold font-light">A</span>
            <div className="text-left">
              <p className="text-[9px] uppercase tracking-[.2em] font-bold text-white">925 Sterling Silver</p>
              <p className="text-[8px] uppercase tracking-[.15em] text-white/60">House of Siddhi Jewellers</p>
            </div>
          </div>
        </section>

        {/* Section 3: Three Hero Products (Entry-level, Bestseller, Premium Statement) */}
        <HeroThreePieces />

        {/* Section 4: Why Argyros (Three Proof Points Linking to Details) */}
        <WhyArgyros />

        {/* Section 5: Curated Collections (The First Edition, Daily Luxe, Premium Reserve, Pahadi Edit, Gifts Under ₹3,000) */}
        <CuratedCollections />

        {/* Section 6: Craft Story (5 Benchcraft Stages) */}
        <CraftStory />

        {/* Section 7: Socially Shareable Gift or Unboxing Moment */}
        <UnboxingExperience />

        {/* Section 8: Interactive Gift Finder Discovery Flow */}
        <InteractiveGiftTeaser />

        {/* Section 9: Heritage (Concise Story + Meet House of Siddhi Jewellers CTA) */}
        <section className="shell py-16 md:py-20" aria-label="Heritage Preview">
          <div className="liquid-glass-dark rounded-[2px] p-8 md:p-14 text-white border border-gold/30">
            <div className="max-w-2xl space-y-4">
              <p className="eyebrow text-gold">✦ House of Siddhi Jewellers</p>
              <h2 className="font-display text-3xl md:text-5xl text-white">
                A family of jewellers, <i className="font-serif italic font-normal text-gold">now in silver.</i>
              </h2>
              <p className="text-xs md:text-sm text-neutral-300 leading-relaxed font-light">
                Argyros comes from the House of Siddhi Jewellers, a third-generation family jewellery house in Haldwani, Uttarakhand, working in gold, silver and gemstones. We grew up around the bench, the scale and the loupe. Argyros is where that knowledge becomes a new kind of silver: sculptural, wearable, made to order.
              </p>
              <div className="pt-3">
                <Link 
                  href="/heritage" 
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] text-gold hover:underline"
                >
                  <span>Meet the House of Siddhi Jewellers</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Section 10: Email and WhatsApp Concierge (Two Clear Paths) */}
        <ConciergeTwoPaths />
      </main>

      {/* Section 11: Footer */}
      <Footer />
    </>
  );
}
