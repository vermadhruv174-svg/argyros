import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { siteConfig } from '@argyros/config';
import { Sparkles, MapPin, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Our Heritage | House of Siddhi Jewellers',
  description: 'Argyros comes from Siddhi Jewellers, a third-generation family jewellery house in Haldwani, Uttarakhand. Discover our heritage in silver.',
};

export default function HeritagePage() {
  const hasYear = siteConfig.siddhi.sinceYear && !siteConfig.siddhi.sinceYear.startsWith('[');
  const hasStore = siteConfig.siddhi.storeAddress && !siteConfig.siddhi.storeAddress.startsWith('[');

  return (
    <>
      <Header />
      <main id="main-content" className="flex-1">
        {/* Hero Section: Immersive Full-Section Uttarakhand Himalayan Sunrise Background */}
        <section className="relative overflow-hidden min-h-[580px] md:min-h-[680px] flex items-center border-b border-line">
          {/* Immersive Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/uttarakhand-sunrise.jpg"
              alt="Sunrise glowing over the Himalayan mountain peaks in Uttarakhand"
              fill
              priority
              quality={95}
              sizes="100vw"
              className="object-cover object-[center_35%] animate-dissolve-down"
            />
            {/* Ambient luxury cinematic overlay allowing the crisp mountain peaks to shine through */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />
            {/* Translucent dissolve down to the page as you scroll */}
            <div className="absolute -bottom-1 inset-x-0 h-32 md:h-44 bg-gradient-to-b from-transparent via-[#FAF8F5]/80 to-[#FAF8F5] backdrop-blur-[2px] pointer-events-none" />
          </div>

          <div className="shell relative z-10 py-16 md:py-24 max-w-3xl">
            <div className="p-8 md:p-12 rounded-[2px] backdrop-blur-md bg-black/40 border border-white/15 text-white shadow-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-gold/50 bg-black/50 backdrop-blur-sm px-3.5 py-1 text-[9px] font-bold tracking-[.22em] text-gold uppercase shadow-sm mb-6">
                <span>✦</span> HOUSE OF SIDDHI JEWELLERS
              </div>
              <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl leading-[1.05] text-white tracking-tight">
                A family of jewellers, <i className="font-serif italic font-normal text-gold">now in silver.</i>
              </h1>
              <p className="mt-6 text-base md:text-lg leading-relaxed text-white/85 font-light max-w-xl">
                Argyros comes from Siddhi Jewellers, a third-generation family jewellery house in Haldwani, Uttarakhand, working in gold, silver and gemstones. We grew up around the bench, the scale and the loupe. Argyros is where that knowledge becomes a new kind of silver: sculptural, wearable, made to order.
              </p>
              {hasYear && (
                <p className="mt-6 text-xs uppercase tracking-[.2em] text-gold font-bold">
                  Serving families in Haldwani since {siteConfig.siddhi.sinceYear}.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* The Craft */}
        <section className="bg-[#0a1628] py-16 md:py-24 text-white">
          <div className="shell">
            <div className="max-w-xl mb-12">
              <p className="eyebrow text-gold">The Making</p>
              <h2 className="font-display text-4xl text-white mt-2">How a piece is made.</h2>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              <div className="border border-white/10 p-6 rounded bg-white/5 space-y-3">
                <span className="font-display text-2xl text-gold">01</span>
                <h3 className="font-display text-xl">Sculptural Design</h3>
                <p className="text-xs text-white/70 leading-relaxed font-light">
                  Forms begin as hand sketches and wax carvings, balancing tactile comfort with architectural presence.
                </p>
              </div>

              <div className="border border-white/10 p-6 rounded bg-white/5 space-y-3">
                <span className="font-display text-2xl text-gold">02</span>
                <h3 className="font-display text-xl">Lost-Wax Casting</h3>
                <p className="text-xs text-white/70 leading-relaxed font-light">
                  Each piece is cast in solid 925 sterling silver alloyed precisely to 92.5% purity for enduring strength.
                </p>
              </div>

              <div className="border border-white/10 p-6 rounded bg-white/5 space-y-3">
                <span className="font-display text-2xl text-gold">03</span>
                <h3 className="font-display text-xl">Artisan Setting</h3>
                <p className="text-xs text-white/70 leading-relaxed font-light">
                  Gemstones and micro-pavé accents are seated and burnished under high magnification by master setters.
                </p>
              </div>

              <div className="border border-white/10 p-6 rounded bg-white/5 space-y-3">
                <span className="font-display text-2xl text-gold">04</span>
                <h3 className="font-display text-xl">Hand Polishing</h3>
                <p className="text-xs text-white/70 leading-relaxed font-light">
                  Multi-stage buffing brings out a deep, mirror-like luster or a velvety satin brush before final inspection.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Visit the House (render only if store address is filled) */}
        {hasStore && (
          <section className="shell py-16 border-b border-line">
            <div className="max-w-xl space-y-4">
              <p className="eyebrow text-gold">Visit the House</p>
              <h2 className="font-display text-3xl text-ink">Visit Siddhi Jewellers in Haldwani</h2>
              <div className="flex items-start gap-3 text-xs text-neutral-600 pt-2">
                <MapPin size={18} className="text-gold shrink-0 mt-0.5" />
                <p>{siteConfig.siddhi.storeAddress}</p>
              </div>
              {siteConfig.siddhi.storeHours && (
                <div className="flex items-center gap-3 text-xs text-neutral-600">
                  <Clock size={18} className="text-gold shrink-0" />
                  <p>{siteConfig.siddhi.storeHours}</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* CTA Row */}
        <section className="shell py-16 md:py-20 text-center">
          <h2 className="font-display text-3xl md:text-4xl text-ink mb-6">
            Begin with the debut edition or commission a unique piece.
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/collections/the-first-edition" className="button">
              Shop the First Edition →
            </Link>
            <Link href="/bespoke" className="button bg-white text-ink border border-line hover:border-gold">
              ✦ Commission a Piece
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
