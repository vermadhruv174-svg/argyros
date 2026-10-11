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

        {/* Section 2: Hero Section */}
        <section className="shell py-4 md:py-6" aria-label="Hero">
          <div className="relative grid min-h-[580px] sm:min-h-[640px] overflow-hidden rounded-[2px] border border-line/70 bg-[#0a1628] shadow-2xl md:grid-cols-[1.1fr_1.1fr]">
            {/* Left Column: Direct Value & Clear Calls to Action */}
            <div className="relative z-10 flex flex-col justify-between p-7 sm:p-10 md:p-14 bg-gradient-to-br from-[#FAF8F5]/98 via-[#F3EFE7]/95 to-[#EAE4D7]/98">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-white/70 px-3.5 py-1 text-[9px] font-bold tracking-[.22em] text-[#8F682F] uppercase shadow-sm">
                  <span>✦</span> {siteConfig.brand.houseLine}
                </div>
                <div className="editorial-rule mt-5 bg-gold/80" />
              </div>

              <div className="max-w-lg pb-4 pt-6 md:pt-10">
                <p className="mb-3 text-[10px] tracking-[.22em] text-[#6E6255] uppercase font-bold">
                  A personal silver universe
                </p>
                <h1 className="font-display text-[clamp(2.8rem,6.5vw,6rem)] leading-[.9] tracking-[-.045em] text-ink">
                  Made to
                  <br />
                  <i className="font-serif italic font-normal text-gold">become</i>
                  <br />
                  yours.
                </h1>
                <p className="mt-6 max-w-sm text-xs sm:text-sm leading-6 sm:leading-7 text-[#50463C] font-light">
                  Sculptural everyday silver, made to order in 925 sterling. Designed to be worn daily and kept for years.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
                  <Link 
                    className="button shadow-md hover:shadow-xl depth-card px-6 py-3.5 text-xs tracking-wider" 
                    href="/collections/the-first-edition"
                  >
                    Shop the First Edition <span className="ml-2 text-base" aria-hidden="true">→</span>
                  </Link>
                  <Link
                    className="px-5 py-3 text-[10px] font-bold tracking-[.18em] uppercase text-ink hover:text-gold border border-line/90 bg-white/70 transition-colors rounded-sm shadow-sm"
                    href="/collections"
                  >
                    Explore Collections
                  </Link>
                </div>
              </div>

              {/* Trust Strip */}
              <div className="pt-5 border-t border-line/60 grid grid-cols-3 gap-2 text-[8px] sm:text-[9px] font-bold tracking-wider text-ink/70 uppercase">
                <div>✦ 925 Sterling</div>
                <div>✦ Made to Order</div>
                <div>✦ Haldwani Bench</div>
              </div>
            </div>

            {/* Right Column: Editorial Visual with Visible Above-the-Fold Jewelry Context */}
            <div className="relative min-h-[360px] sm:min-h-[440px] md:min-h-full overflow-hidden group">
              <Image
                src="/images/jewellery-hero.jpg"
                alt="Argyros Sculptural Sterling Silver Jewellery — Handcrafted in 925 solid silver"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/85 via-transparent to-black/20 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#FAF8F5]/30 via-transparent to-transparent hidden md:block pointer-events-none" />

              {/* Atelier Hallmark Seal */}
              <div className="absolute bottom-6 left-6 right-6 md:left-auto md:right-8 z-10 flex items-center justify-between md:justify-end gap-3">
                <div className="bg-[#0a1628]/90 backdrop-blur-md px-4 py-2 rounded-[2px] border border-gold/30 text-white shadow-xl flex items-center gap-2.5">
                  <span className="font-display text-lg text-gold font-light">A</span>
                  <div className="text-left">
                    <p className="text-[9px] uppercase tracking-[.2em] font-bold text-white">925 Sterling Silver</p>
                    <p className="text-[8px] uppercase tracking-[.15em] text-white/60">House of Siddhi Jewellers</p>
                  </div>
                </div>
              </div>
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
