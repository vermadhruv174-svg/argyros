import Link from 'next/link';

const ANNOUNCEMENTS = [
  'COMPLIMENTARY SHIPPING ON ORDERS ABOVE ₹2,999',
  'HALLMARKED 925 STERLING SILVER',
  'GIFT-READY, ALWAYS',
];

export function Header() {
  return (
    <>
      <div className="overflow-hidden bg-ink py-2 text-[9px] font-bold tracking-[.2em] text-[#e7d5b8]" role="region" aria-label="Announcement">
        <div className="marquee-track flex whitespace-nowrap">
          <div className="flex items-center shrink-0">
            {ANNOUNCEMENTS.map((item, idx) => (
              <span key={`a1-${idx}`} className="flex items-center">
                <span>{item}</span>
                <span className="mx-6 text-gold/80 md:mx-10" aria-hidden="true">
                  •
                </span>
              </span>
            ))}
          </div>
          <div className="flex items-center shrink-0" aria-hidden="true">
            {ANNOUNCEMENTS.map((item, idx) => (
              <span key={`a2-${idx}`} className="flex items-center">
                <span>{item}</span>
                <span className="mx-6 text-gold/80 md:mx-10">
                  •
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
      <header className="shell flex h-[76px] items-center justify-between border-b border-line md:grid md:grid-cols-3">
        <nav className="hidden items-center gap-4 text-[10px] font-bold uppercase tracking-[.14em] md:flex lg:gap-6" aria-label="Main Navigation">
          <Link href="/shop" className="hover:text-gold transition-colors">
            Shop
          </Link>
          <Link href="/shop?category=rings" className="hover:text-gold transition-colors">
            Rings
          </Link>
          <Link href="/shop?category=earrings" className="hover:text-gold transition-colors">
            Earrings
          </Link>
        </nav>
        <div className="flex items-center md:justify-center">
          <Link href="/" className="font-display text-[2.1rem] tracking-[-.04em] whitespace-nowrap">
            Argyros<span className="text-gold">.</span>
          </Link>
        </div>
        <div className="flex items-center justify-end gap-4 text-[10px] font-bold uppercase tracking-[.13em] lg:gap-6">
          <Link className="hidden sm:block hover:text-gold transition-colors" href="/shop">
            Search
          </Link>
          <Link href="/shop" className="hover:text-gold transition-colors">
            Bag <span className="ml-1 inline-grid h-5 w-5 place-items-center rounded-full bg-ink text-[9px] text-white">0</span>
          </Link>
        </div>
      </header>
    </>
  );
}
