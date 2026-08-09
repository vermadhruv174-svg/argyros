import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-[#eeebe4]">
      <div className="shell grid gap-10 py-12 md:grid-cols-[1fr_auto]">
        <div>
          <p className="font-display text-5xl tracking-[-.06em]">
            Argyros<span className="text-gold">.</span>
          </p>
          <p className="mt-4 max-w-xs text-xs leading-5 text-neutral-600">
            Sterling silver objects for a life well adorned. Hallmarked 925 purity.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-x-12 gap-y-3 text-[10px] font-bold uppercase tracking-[.12em] text-neutral-700">
          <Link href="/shop" className="hover:text-gold transition-colors">
            Shop All
          </Link>
          <Link href="/shop?category=rings" className="hover:text-gold transition-colors">
            Rings
          </Link>
          <Link href="/shop?category=earrings" className="hover:text-gold transition-colors">
            Earrings
          </Link>
          <Link href="/shop?category=necklaces" className="hover:text-gold transition-colors">
            Necklaces
          </Link>
        </div>
      </div>
      <div className="shell border-t border-line py-5 text-[9px] font-bold tracking-[.12em] text-neutral-500">
        © 2026 ARGYROS · 925 STERLING SILVER · MADE TO BECOME YOURS
      </div>
    </footer>
  );
}
