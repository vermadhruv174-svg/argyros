import Image from 'next/image';
import Link from 'next/link';
import type { ProductSummary } from '@/types/catalogue';

export function ProductCard({ product }: { product: ProductSummary }) {
  const imageUrl = product.primaryImage?.url || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=85';
  const imageAlt = product.primaryImage?.alt || product.name;
  const priceRupees = Math.round(product.minPriceCents / 100);

  return (
    <Link href={`/products/${product.slug}`} className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-gold">
      <div className="relative aspect-[4/5] overflow-hidden bg-[#e7e2da]">
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition duration-700 group-hover:scale-[1.06]"
        />
        {product.compareAtCents && (
          <span className="absolute left-3 top-3 bg-[#f5f2ec]/90 px-2.5 py-1 text-[8px] font-bold tracking-[.14em]">
            SPECIAL EDITION
          </span>
        )}
        <span className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-white opacity-0 transition group-hover:opacity-100" aria-hidden="true">
          ↗
        </span>
      </div>
      <div className="flex items-start justify-between gap-3 pt-4">
        <div>
          <p className="eyebrow text-[8px] text-[#8f6b3e]">{product.metalPurity}</p>
          <h3 className="mt-1 font-display text-xl leading-none">{product.name}</h3>
        </div>
        <p className="pt-3 text-xs font-semibold">₹{priceRupees.toLocaleString('en-IN')}</p>
      </div>
    </Link>
  );
}
