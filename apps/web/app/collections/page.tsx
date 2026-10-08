import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { EarlyAccessCapture } from '@/components/ui/early-access-capture';

export const metadata: Metadata = {
  title: 'Collections',
  description: 'Explore curated editions of 925 sterling silver jewellery — sculpted for daily wear and heirloom permanence.',
};

async function getCollections() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
    const res = await fetch(`${apiUrl}/collections`, { next: { revalidate: 60 } });
    if (res.ok) return await res.json();
  } catch {
    console.error('Failed to fetch collections');
  }
  return [];
}

export default async function CollectionsPage() {
  const all: any[] = await getCollections();
  
  // Section 5.1: A collection page and its tile render only if isPublished && productCount > 0
  const published = all.filter((c: any) => c.isPublished && (c._count?.products || 0) > 0);
  
  // Editorial collections ("Pahadi Edit", "Oxidised") with 0 products show in "Coming Soon" row
  const comingSoon = all.filter((c: any) => !c.isPublished && c.kind === 'editorial');

  return (
    <>
      <Header />
      <main id="main-content" className="flex-1">
        {/* Page Hero with smooth dissolving collections display background */}
        <section className="relative overflow-hidden border-b border-line bg-[#FAF8F5] py-20 md:py-28">
          {/* Smooth Dissolving Collections Background */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <div className="relative w-full h-full animate-[fade_1.4s_ease-out]">
              <Image
                src="/images/collections-hero.jpg"
                alt="Sculpted sterling silver collection display on natural sandstone and linen"
                fill
                priority
                sizes="100vw"
                className="object-cover object-[center_45%] opacity-35 filter contrast-105 scale-105 animate-[pulse_12s_ease-in-out_infinite]"
              />
              {/* Soft Dissolving Mask down to the page & paper gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#FAF8F5]/65 via-[#FAF8F5]/85 to-[#FAF8F5]" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#FAF8F5] via-[#FAF8F5]/90 to-transparent" />
            </div>
          </div>

          <div className="shell relative z-10 max-w-3xl">
            <p className="eyebrow text-gold mb-3">✦ The Argyros Universe</p>
            <h1 className="font-display text-5xl md:text-7xl leading-none tracking-tight text-ink">
              Collections
            </h1>
            <p className="mt-4 text-base md:text-lg text-neutral-700 max-w-lg leading-relaxed font-light">
              Each collection represents a distinct exploration in 925 sterling silver. Made to order with master karigar finishing.
            </p>
          </div>
        </section>

        {/* Published Active Collections */}
        <section className="shell py-12 md:py-16">
          <p className="eyebrow mb-8 text-neutral-600">Active Editions</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {published.map((c: any) => (
              <Link
                key={c.id}
                href={`/collections/${c.slug}`}
                className="group relative aspect-[4/3] rounded-[2px] bg-gradient-to-br from-[#0a1628] to-[#07101e] border border-gold/25 p-7 flex flex-col justify-between text-white hover:border-gold shadow-lg transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] uppercase tracking-[.22em] text-gold font-bold">
                    {c.kind === 'editorial' ? 'Editorial Edition' : 'Curated Edit'}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-white/60 bg-white/10 px-2.5 py-0.5 rounded-full">
                    {c._count?.products || 0} pieces
                  </span>
                </div>

                <div>
                  <h2 className="font-display text-3xl md:text-4xl leading-tight group-hover:text-gold transition-colors">
                    {c.name}
                  </h2>
                  <p className="mt-2 text-xs text-white/70 line-clamp-2 font-light">
                    {c.description}
                  </p>
                  <div className="mt-4 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.2em] text-gold">
                    <span>Explore Collection</span>
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 5.1 Editorial "Coming Soon" Row with Notify Me */}
        {comingSoon.length > 0 && (
          <section className="shell pb-20">
            <div className="border-t border-line pt-12">
              <p className="eyebrow mb-8 text-gold">✦ In Craft — Coming Soon</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {comingSoon.map((c: any) => (
                  <div
                    key={c.id}
                    className="liquid-glass-dark rounded-[2px] p-8 border border-white/10 text-white space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] uppercase tracking-widest text-gold font-bold">
                        Editorial Preview
                      </span>
                      <span className="text-[9px] uppercase tracking-wider text-white/50 bg-white/5 px-2 py-0.5 rounded-full">
                        In Atelier
                      </span>
                    </div>

                    <h3 className="font-display text-3xl text-white">
                      {c.name}
                    </h3>
                    <p className="text-xs text-white/70 leading-relaxed font-light">
                      {c.description}
                    </p>

                    <div className="pt-2">
                      <EarlyAccessCapture
                        source={`collection:${c.slug}`}
                        className="!p-6 !bg-transparent !border-white/10 !shadow-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
