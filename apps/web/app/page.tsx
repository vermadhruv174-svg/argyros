import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ProductCard } from '@/components/catalogue/product-card';
import { fetchProducts } from '@/lib/api-client';
import { siteConfig } from '@argyros/config';
import { Sparkles, Hammer, Gift, ShieldCheck } from 'lucide-react';
import { EarlyAccessCapture } from '@/components/ui/early-access-capture';

export default async function HomePage() {
  const catalogue = await fetchProducts();
  const featuredProducts = catalogue.data.slice(0, 4);

  let publishedCollections: any[] = [];
  try {
    const res = await fetch('http://localhost:4000/api/collections', { next: { revalidate: 60 } });
    if (res.ok) {
      const collections = await res.json();
      publishedCollections = collections.filter((c: any) => c.isPublished && (c._count?.products || 0) > 0);
    }
  } catch (error) {
    console.error('Failed to fetch collections for home page', error);
  }

  return (
    <>
      <Header />
      <main id="main-content" className="flex-1">
        {/* JSON-LD Schemas */}
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

        {/* 4.1 Hero Section */}
        <section className="shell py-4 md:py-6" aria-label="Hero">
          <div className="relative grid min-h-[640px] overflow-hidden rounded-[2px] border border-line/70 bg-[#0a1628] shadow-2xl md:grid-cols-[1.1fr_1.1fr]">
            {/* Left Content Column */}
            <div className="relative z-10 flex flex-col justify-between p-8 md:p-14 bg-gradient-to-br from-[#FAF8F5]/95 via-[#F3EFE7]/90 to-[#EAE4D7]/95">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-white/70 px-3.5 py-1 text-[9px] font-bold tracking-[.22em] text-[#8F682F] uppercase shadow-sm">
                  <span>✦</span> {siteConfig.brand.houseLine}
                </div>
                <div className="editorial-rule mt-6 bg-gold" />
              </div>

              <div className="max-w-lg pb-4 pt-10">
                <p className="mb-4 text-[10px] tracking-[.22em] text-[#6E6255] uppercase font-bold">
                  A personal silver universe
                </p>
                <h1 className="font-display text-[clamp(3.4rem,7vw,7rem)] leading-[.85] tracking-[-.055em] text-ink">
                  Made to
                  <br />
                  <i className="font-serif italic font-normal text-gold">become</i>
                  <br />
                  yours.
                </h1>
                <p className="mt-8 max-w-sm text-sm leading-7 text-[#50463C] font-light">
                  Sculptural everyday silver, made to order in 925 sterling. Designed to be worn daily and kept for years.
                </p>
                <div className="mt-9 flex flex-wrap items-center gap-4">
                  <Link className="button shadow-md hover:shadow-xl depth-card" href="/collections/the-first-edition">
                    Shop the First Edition <span className="ml-3 text-base" aria-hidden="true">→</span>
                  </Link>
                  <Link
                    className="px-6 py-3.5 text-[10px] font-bold tracking-[.18em] uppercase text-ink hover:text-gold border border-line/90 bg-white/60 transition-colors rounded-sm shadow-sm"
                    href="/collections"
                  >
                    Explore Collections
                  </Link>
                </div>
              </div>

              {/* 4.1 Trust Chips */}
              <div className="pt-6 border-t border-line/60 grid grid-cols-3 gap-2 text-[9px] font-bold tracking-wider text-ink/70 uppercase">
                <div>✦ 925 Sterling Silver</div>
                <div>✦ Made to Order</div>
                <div>✦ Master Karigar Heritage</div>
              </div>
            </div>

            {/* 4.1 Right Hero Visual: Editorial jewellery close look portrait */}
            <div className="relative min-h-[440px] md:min-h-full overflow-hidden group">
              <Image
                src="/images/jewellery-hero.jpg"
                alt="Argyros Sculptural Sterling Silver Jewellery — Hand-finished Ring and Chain"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105"
              />

              {/* Gentle luxury vignettes and film grain gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/85 via-transparent to-black/20 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#FAF8F5]/30 via-transparent to-transparent hidden md:block pointer-events-none" />

              {/* Atelier Hallmark Badge floating in bottom corner */}
              <div className="absolute bottom-6 left-6 right-6 md:left-auto md:right-8 z-10 flex items-center justify-between md:justify-end gap-3">
                <div className="bg-[#0a1628]/85 backdrop-blur-md px-4 py-2 rounded-[2px] border border-gold/30 text-white shadow-xl flex items-center gap-2.5">
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

        {/* 4.2 Collections Strip: only published with productCount > 0 */}
        {publishedCollections.length > 0 && (
          <section className="shell py-16 md:py-20" aria-label="Collections Strip">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <p className="eyebrow text-gold">Curated Edits</p>
                <h2 className="mt-3 font-display text-4xl md:text-5xl text-ink">The Collections.</h2>
              </div>
              <Link href="/collections" className="border-b border-ink pb-1 text-[10px] font-bold uppercase tracking-[.15em] hover:text-gold transition-colors">
                View all collections →
              </Link>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {publishedCollections.map((c: any) => (
                <Link
                  href={`/collections/${c.slug}`}
                  key={c.id}
                  className="group relative aspect-[16/10] overflow-hidden rounded-[2px] bg-gradient-to-br from-[#0a1628] to-[#07101e] border border-gold/20 shadow-md p-6 flex flex-col justify-between text-white hover:border-gold/50 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] uppercase tracking-[.2em] text-gold font-bold">
                      {c.kind === 'editorial' ? 'Editorial Edition' : 'Curated Edit'}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-white/60 bg-white/10 px-2 py-0.5 rounded-full">
                      {c._count?.products || 0} Pieces
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display text-2xl text-white group-hover:text-gold transition-colors">
                      {c.name}
                    </h3>
                    <p className="mt-1 text-xs text-white/70 line-clamp-2 font-light">
                      {c.description}
                    </p>
                    <div className="mt-4 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[.18em] text-gold">
                      <span>Explore</span>
                      <span className="transition-transform group-hover:translate-x-1">→</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Featured Catalogue Grid */}
        <section className="shell py-16 md:py-24" aria-label="Featured Collection">
          <div className="grid gap-8 md:grid-cols-[.7fr_1.3fr] md:items-end">
            <div>
              <p className="eyebrow text-gold">The first chapter</p>
              <h2 className="mt-4 font-display text-4xl md:text-6xl text-ink">
                Quiet pieces.
                <br />
                <i className="font-serif italic font-normal text-gold">Lasting impact.</i>
              </h2>
            </div>
            <p className="max-w-md pb-1 text-sm leading-7 text-neutral-600 font-light">
              Designed for the moments that don’t need an audience. Explore our debut edition of sculptural rings, luminous hoops and close-to-the-heart pendants.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-7">
            {featuredProducts.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link className="inline-block border-b border-ink pb-2 text-[10px] font-bold tracking-[.16em] uppercase hover:text-gold transition-colors" href="/shop">
              View all pieces →
            </Link>
          </div>
        </section>

        {/* 4.3 "The Argyros promise" */}
        <section className="bg-[#0a1628] py-20 text-white" aria-label="The Argyros Promise">
          <div className="shell">
            <div className="text-center max-w-xl mx-auto mb-14">
              <p className="eyebrow text-gold">Our Philosophy</p>
              <h2 className="mt-3 font-display text-4xl md:text-5xl text-white">
                The Argyros promise.
              </h2>
              <div className="editorial-rule mx-auto mt-4 bg-gold" />
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="border border-white/10 p-8 rounded-[2px] bg-white/5 space-y-4">
                <Sparkles size={24} className="text-gold stroke-[1.5]" />
                <h3 className="font-display text-2xl text-white">925, through and through.</h3>
                <p className="text-xs leading-relaxed text-white/70">
                  Every piece is cast in 925 sterling silver: 92.5% pure silver, alloyed for strength so it holds its shape and its edge.
                </p>
              </div>

              <div className="border border-white/10 p-8 rounded-[2px] bg-white/5 space-y-4">
                <Hammer size={24} className="text-gold stroke-[1.5]" />
                <h3 className="font-display text-2xl text-white">Made by master karigars.</h3>
                <p className="text-xs leading-relaxed text-white/70">
                  Finished by hand in the tradition of the House of Siddhi Jewellers, a third-generation jewellery family from Haldwani, Uttarakhand.
                </p>
              </div>

              <div className="border border-white/10 p-8 rounded-[2px] bg-white/5 space-y-4">
                <Gift size={24} className="text-gold stroke-[1.5]" />
                <h3 className="font-display text-2xl text-white">Gifted with intention.</h3>
                <p className="text-xs leading-relaxed text-white/70">
                  Every order arrives in gift-ready packaging, with a care card and polishing cloth.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4.4 Gift Section */}
        <section className="shell py-20 md:py-24" aria-label="Gift Edit">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="eyebrow text-gold">The Gift Edit</p>
              <h2 className="mt-3 font-display text-4xl md:text-5xl text-ink">A reason to give.</h2>
            </div>
            <Link href="/gifts" className="border-b border-ink pb-1 text-[10px] font-bold uppercase tracking-[.15em] hover:text-gold transition-colors">
              Open Gift Finder →
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            <Link
              href="/gifts?for=her"
              className="p-8 border border-line rounded-[2px] bg-white hover:border-gold transition-colors space-y-3 group"
            >
              <p className="eyebrow text-gold">For Her</p>
              <h3 className="font-display text-2xl text-ink group-hover:text-gold transition-colors">The art of choosing something she’ll keep.</h3>
              <p className="text-xs text-neutral-500">Delicate rings, luminous hoops and fine pendants.</p>
              <span className="text-[10px] font-bold uppercase tracking-widest text-ink group-hover:text-gold pt-2 inline-block">Explore →</span>
            </Link>

            <Link
              href="/gifts?for=him"
              className="p-8 border border-line rounded-[2px] bg-white hover:border-gold transition-colors space-y-3 group"
            >
              <p className="eyebrow text-gold">For Him</p>
              <h3 className="font-display text-2xl text-ink group-hover:text-gold transition-colors">Uncomplicated pieces with presence.</h3>
              <p className="text-xs text-neutral-500">Substantial link chains and architectural cuffs.</p>
              <span className="text-[10px] font-bold uppercase tracking-widest text-ink group-hover:text-gold pt-2 inline-block">Explore →</span>
            </Link>

            <Link
              href="/gifts?for=anyone"
              className="p-8 border border-line rounded-[2px] bg-white hover:border-gold transition-colors space-y-3 group"
            >
              <p className="eyebrow text-gold">For Anyone</p>
              <h3 className="font-display text-2xl text-ink group-hover:text-gold transition-colors">Little reminders of personal becoming.</h3>
              <p className="text-xs text-neutral-500">Everyday wearable objects crafted for anyone.</p>
              <span className="text-[10px] font-bold uppercase tracking-widest text-ink group-hover:text-gold pt-2 inline-block">Explore →</span>
            </Link>

            <Link
              href="/collections/gifts-under-3000"
              className="p-8 border border-gold/40 rounded-[2px] bg-[#f9f7f2] hover:border-gold transition-colors space-y-3 group"
            >
              <p className="eyebrow text-gold">Under ₹3,000</p>
              <h3 className="font-display text-2xl text-ink group-hover:text-gold transition-colors">Gifts under ₹3,000</h3>
              <p className="text-xs text-neutral-500">Pure 925 sterling silver without compromise.</p>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gold pt-2 inline-block">Browse pieces →</span>
            </Link>
          </div>
        </section>

        {/* 4.5 Heritage Teaser */}
        <section className="shell pb-16" aria-label="Heritage Teaser">
          <div className="liquid-glass-dark rounded-[2px] p-8 md:p-14 text-white border border-gold/30">
            <div className="max-w-2xl space-y-4">
              <p className="eyebrow text-gold">✦ House of Siddhi Jewellers</p>
              <h2 className="font-display text-3xl md:text-5xl text-white">
                A family of jewellers, <i className="font-serif italic font-normal text-gold">now in silver.</i>
              </h2>
              <p className="text-xs md:text-sm text-white/80 leading-relaxed font-light">
                Argyros comes from Siddhi Jewellers, a third-generation family jewellery house in Haldwani, Uttarakhand, working in gold, silver and gemstones. We grew up around the bench, the scale and the loupe. Argyros is where that knowledge becomes a new kind of silver: sculptural, wearable, made to order.
              </p>
              <div className="pt-2">
                <Link href="/heritage" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] text-gold hover:underline">
                  Read our heritage →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 4.6 Early-Access Capture */}
        <section className="shell pb-20">
          <EarlyAccessCapture source="home" />
        </section>
      </main>
      <Footer />
    </>
  );
}
