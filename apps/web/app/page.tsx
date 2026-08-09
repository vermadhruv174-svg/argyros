import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ProductCard } from '@/components/catalogue/product-card';
import { fetchProducts } from '@/lib/api-client';

const moments = [
  [
    'For her',
    'The art of choosing something she’ll keep.',
    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=85',
  ],
  [
    'For him',
    'Uncomplicated pieces with presence.',
    'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=900&q=85',
  ],
  [
    'For you',
    'Little reminders of your own becoming.',
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=85',
  ],
];

export default async function HomePage() {
  const catalogue = await fetchProducts();
  const featuredProducts = catalogue.data.slice(0, 4);

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="shell py-4 md:py-6" aria-label="Hero">
          <div className="relative grid min-h-[690px] overflow-hidden bg-[#d3cdc3] md:grid-cols-[1fr_1.28fr]">
            <div className="relative z-10 flex flex-col justify-between p-7 md:p-12">
              <div>
                <p className="eyebrow text-[#79532f]">Est. 2026 · India</p>
                <div className="editorial-rule mt-6" />
              </div>
              <div className="max-w-lg pb-3">
                <p className="mb-5 text-xs tracking-[.15em] text-[#6e6255] uppercase font-semibold">
                  A study in silver
                </p>
                <h1 className="font-display text-[clamp(4rem,8vw,8.5rem)] leading-[.76] tracking-[-.065em]">
                  Made to
                  <br />
                  <i>become</i>
                  <br />
                  yours.
                </h1>
                <p className="mt-7 max-w-sm text-sm leading-6 text-[#50463c]">
                  A new language of everyday adornment, rendered in responsibly crafted 925 sterling silver.
                </p>
                <Link className="button mt-8" href="/shop">
                  Discover the collection <span className="ml-6 text-base" aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
            <div className="relative min-h-[430px]">
              <Image
                priority
                src="https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=1600&q=90"
                alt="Argyros sterling silver collection hero"
                fill
                sizes="(max-width:768px) 100vw, 60vw"
                className="object-cover object-center"
              />
              <div className="absolute bottom-5 left-5 rounded-full border border-white/50 bg-black/10 px-4 py-2 text-[9px] font-bold tracking-[.15em] text-white backdrop-blur">
                EXPLORE 925 SILVER
              </div>
            </div>
          </div>
        </section>

        {/* Featured Catalogue Grid */}
        <section className="shell py-20 md:py-28" aria-label="Featured Collection">
          <div className="grid gap-10 md:grid-cols-[.7fr_1.3fr] md:items-end">
            <div>
              <p className="eyebrow text-gold">The new chapter</p>
              <h2 className="mt-5 font-display text-5xl leading-[.9] md:text-7xl">
                Quiet pieces.
                <br />
                <i>Lasting impact.</i>
              </h2>
            </div>
            <p className="max-w-md pb-1 text-sm leading-7 text-neutral-600">
              Designed for the moments that don’t need an audience. Explore our first edition of sculptural rings, luminous hoops and close-to-the-heart pendants.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-7">
            {featuredProducts.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link className="inline-block border-b border-ink pb-2 text-[10px] font-bold tracking-[.16em] uppercase hover:text-gold transition-colors" href="/shop">
              View all pieces →
            </Link>
          </div>
        </section>

        {/* Brand Promise Banner */}
        <section className="bg-wine py-16 text-[#f1e8dc] md:py-24" aria-label="Brand Promise">
          <div className="shell grid gap-10 md:grid-cols-[.9fr_1.1fr]">
            <div className="flex flex-col justify-between">
              <div>
                <p className="eyebrow text-[#d4a969]">The Argyros promise</p>
                <h2 className="mt-5 max-w-md font-display text-5xl leading-[.88] md:text-7xl">
                  Nothing
                  <br />
                  ordinary
                  <br />
                  <i>lasts.</i>
                </h2>
              </div>
            </div>
            <div className="grid gap-px bg-[#776258] sm:grid-cols-2">
              <div className="bg-wine p-7 md:p-10">
                <span className="font-display text-5xl text-[#d4a969]">01</span>
                <h3 className="mt-12 font-display text-3xl">925, through and through.</h3>
                <p className="mt-4 text-sm leading-6 text-[#c8bbae]">
                  Pieces in certified sterling silver, chosen for their ability to live with you.
                </p>
              </div>
              <div className="bg-wine p-7 md:p-10">
                <span className="font-display text-5xl text-[#d4a969]">02</span>
                <h3 className="mt-12 font-display text-3xl">Gifted with intention.</h3>
                <p className="mt-4 text-sm leading-6 text-[#c8bbae]">
                  Every order arrives considered, ready to become part of a memory.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Gift Edit Grid */}
        <section className="shell py-20 md:py-28" aria-label="Gift Edit">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="eyebrow text-gold">The gift edit</p>
              <h2 className="mt-4 font-display text-5xl md:text-6xl">A reason to give.</h2>
            </div>
            <Link href="/shop" className="hidden border-b border-ink pb-2 text-[10px] font-bold uppercase tracking-[.15em] md:block hover:text-gold transition-colors">
              Shop gifts →
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {moments.map(([title, copy, image]) => (
              <Link href="/shop" key={title} className="group relative aspect-[4/5] overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-gold">
                <Image
                  src={image}
                  alt={title}
                  fill
                  sizes="(max-width:768px) 100vw, 33vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 p-6 text-white">
                  <p className="font-display text-4xl">{title}</p>
                  <p className="mt-2 max-w-[14rem] text-xs leading-5 text-white/80">{copy}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
