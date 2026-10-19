import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { EarlyAccessCapture } from '@/components/ui/early-access-capture';
import { fetchCollections } from '@/lib/api-client';
import { getCollectionWorld } from '@/lib/collection-worlds';

export const metadata: Metadata = {
  title: 'Collection Worlds — Sculptural Editions in 925 Sterling Silver | Argyros',
  description: 'Explore the curated collection worlds of Argyros: The Celestial First Edition, Kumaon Pine Ridges, The Sunlit Bench, The Obsidian Vault, and Keepsake Gifts.',
};

export default async function CollectionsPage() {
  const all: any[] = await fetchCollections();

  // Published collections with pieces
  const published = all.filter((c: any) => c.isPublished && (c._count?.products || 0) > 0);

  // Editorial coming soon collections
  const comingSoon = all.filter((c: any) => !c.isPublished && c.kind === 'editorial');

  return (
    <>
      <Header />
      <main id="main-content" className="flex-1">
        {/* Page Hero: Immersive Full-Section Curated Collections Background */}
        <section className="relative overflow-hidden min-h-[520px] md:min-h-[620px] flex items-center border-b border-line">
          {/* Immersive Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/collections-hero.jpg"
              alt="Sculpted sterling silver collection display on natural sandstone and linen"
              fill
              priority
              quality={95}
              sizes="100vw"
              className="object-cover object-[center_40%] animate-dissolve-down"
            />
            {/* Ambient luxury cinematic overlay allowing the jewellery display to shine through */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/30 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />
            {/* Translucent dissolve down to the page as you scroll */}
            <div className="absolute -bottom-1 inset-x-0 h-32 md:h-44 bg-gradient-to-b from-transparent via-[#FAF8F5]/80 to-[#FAF8F5] backdrop-blur-[2px] pointer-events-none" />
          </div>

          <div className="shell relative z-10 py-16 md:py-24 max-w-3xl">
            <div className="p-8 md:p-12 rounded-[2px] backdrop-blur-md bg-black/45 border border-white/15 text-white shadow-2xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/15 border border-gold/40 text-gold rounded-full text-[10px] font-bold tracking-widest uppercase">
                <span>✦ The Argyros Universe</span>
              </div>
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl leading-none tracking-tight text-white font-normal">
                Collection Worlds
              </h1>
              <p className="text-base md:text-lg text-white/85 max-w-xl leading-relaxed font-light">
                Each collection represents an independent aesthetic universe in solid 925 sterling silver. Handcrafted to order with master karigar bench finishing in Uttarakhand.
              </p>
            </div>
          </div>
        </section>

        {/* Published Active Collection Worlds */}
        <section className="shell py-14 md:py-20">
          <div className="flex items-center justify-between border-b border-line pb-4 mb-10">
            <div>
              <p className="eyebrow text-gold text-[9px]">Distinct Thematic Atmospheres</p>
              <h2 className="font-display text-3xl text-ink mt-1">Active Collection Worlds</h2>
            </div>
            <span className="text-xs uppercase tracking-widest text-neutral-500 font-mono font-semibold">
              {published.length} Worlds Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {published.map((c: any) => {
              const world = getCollectionWorld(c.slug);
              return (
                <Link
                  key={c.id}
                  href={`/collections/${c.slug}`}
                  className={`group relative min-h-[340px] rounded-[2px] bg-gradient-to-br ${world.cardGradient} border ${world.accentBorder} p-7 flex flex-col justify-between text-white shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden`}
                >
                  {/* Atmospheric Background Image Overlay */}
                  <div className="absolute inset-0 z-0 opacity-20 group-hover:opacity-35 transition-opacity duration-500">
                    <Image
                      src={world.heroImage}
                      alt={c.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover scale-100 group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
                  </div>

                  {/* Ambient Colored Corner Halo */}
                  <div
                    className="absolute -top-16 -right-16 w-40 h-40 rounded-full blur-3xl pointer-events-none opacity-40 group-hover:opacity-70 transition-opacity"
                    style={{ backgroundColor: world.accentColor }}
                  />

                  {/* Card Header: World Identifier Badge */}
                  <div className="relative z-10 flex items-center justify-between gap-3">
                    <span className={`text-[9px] uppercase tracking-[.22em] font-bold px-2.5 py-1 rounded-full ${world.badgeBg} ${world.badgeText} border border-white/10 shadow-sm`}>
                      ✦ WORLD {world.worldNumber} · {world.worldTitle}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-white/70 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full font-mono border border-white/10">
                      {c._count?.products || 0} pieces
                    </span>
                  </div>

                  {/* Card Body & CTA */}
                  <div className="relative z-10 mt-12 space-y-2">
                    <h2 className="font-display text-3xl md:text-4xl leading-tight text-white group-hover:text-gold transition-colors font-normal">
                      {c.name}
                    </h2>
                    <p className="text-xs font-serif italic text-gold/80 line-clamp-1">
                      &ldquo;{world.tagline}&rdquo;
                    </p>
                    <p className="text-xs text-white/70 line-clamp-2 font-light leading-relaxed">
                      {c.description || world.storyParagraph}
                    </p>

                    <div className="pt-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.2em] text-gold group-hover:text-white transition-colors">
                      <span>Enter This World</span>
                      <span className="transition-transform group-hover:translate-x-1.5 font-mono">→</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Editorial "Coming Soon" Row */}
        {comingSoon.length > 0 && (
          <section className="shell pb-24">
            <div className="border-t border-line pt-12">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="eyebrow text-gold text-[9px]">In Craft & Assay</p>
                  <h3 className="font-display text-2xl text-ink mt-0.5">Upcoming Worlds</h3>
                </div>
                <span className="text-xs uppercase tracking-widest text-neutral-500 font-mono">
                  {comingSoon.length} In Atelier
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                {comingSoon.map((c: any) => {
                  const world = getCollectionWorld(c.slug);
                  return (
                    <div
                      key={c.id}
                      className={`relative rounded-[2px] p-8 border ${world.accentBorder} bg-gradient-to-br ${world.cardGradient} text-white space-y-4 shadow-xl overflow-hidden`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[9px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full ${world.badgeBg} ${world.badgeText} border border-white/10`}>
                          ✦ WORLD {world.worldNumber} · {world.worldTitle}
                        </span>
                        <span className="text-[9px] uppercase tracking-wider text-white/50 bg-white/10 px-2.5 py-1 rounded-full font-mono">
                          In Atelier
                        </span>
                      </div>

                      <h4 className="font-display text-3xl text-white font-normal">
                        {c.name}
                      </h4>
                      <p className="text-xs font-serif italic text-gold/80">
                        &ldquo;{world.tagline}&rdquo;
                      </p>
                      <p className="text-xs text-white/70 leading-relaxed font-light">
                        {c.description || world.storyParagraph}
                      </p>

                      <div className="pt-2">
                        <EarlyAccessCapture
                          source={`collection:${c.slug}`}
                          className="!p-6 !bg-black/30 !border-white/10 !shadow-none"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
