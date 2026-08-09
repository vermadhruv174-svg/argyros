'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { ProductDetailData } from '@/types/catalogue';

export function ProductDetailClient({ item }: { item: ProductDetailData }) {
  const [selectedVariantId, setSelectedVariantId] = useState(item.variants[0]?.id || '');

  const activeVariant = item.variants.find((v) => v.id === selectedVariantId) || item.variants[0];
  const activePriceRupees = activeVariant ? Math.round(activeVariant.priceCents / 100) : 0;
  const primaryImage = item.images[0]?.url || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=85';

  return (
    <div className="grid gap-8 md:grid-cols-2 md:gap-14">
      <div className="relative aspect-[4/5] bg-[#ebe9e4]">
        <Image
          src={primaryImage}
          alt={item.images[0]?.alt || item.name}
          fill
          priority
          sizes="(max-width:768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
      <div className="md:pt-6">
        <p className="eyebrow text-gold">{item.metalPurity}</p>
        <h1 className="mt-3 font-display text-5xl">{item.name}</h1>
        <p className="mt-4 text-xl font-semibold">₹{activePriceRupees.toLocaleString('en-IN')}</p>
        <p className="mt-6 text-sm leading-6 text-neutral-600">{item.description}</p>

        {item.variants.length > 0 && (
          <fieldset className="mt-8">
            <legend className="text-xs font-bold uppercase tracking-wider">
              Select option: {activeVariant?.title}
            </legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {item.variants.map((v) => {
                const isSelected = v.id === activeVariant?.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setSelectedVariantId(v.id)}
                    className={`min-h-[44px] min-w-[44px] px-4 border text-xs font-bold tracking-wider transition ${
                      isSelected
                        ? 'border-ink bg-ink text-white'
                        : 'border-line bg-transparent hover:border-gold'
                    }`}
                  >
                    {v.size || v.title}
                  </button>
                );
              })}
            </div>
          </fieldset>
        )}

        <button
          type="button"
          onClick={() => alert(`Added ${item.name} (${activeVariant?.title}) to bag`)}
          className="button mt-8 w-full"
        >
          Add to bag • ₹{activePriceRupees.toLocaleString('en-IN')}
        </button>

        <div className="mt-8 divide-y divide-line border-y border-line text-sm">
          <p className="py-4 flex items-center gap-2">
            <span aria-hidden="true">✦</span> Certified 925 sterling silver
          </p>
          <p className="py-4 flex items-center gap-2">
            <span aria-hidden="true">↗</span> Complimentary shipping over ₹2,999
          </p>
          <p className="py-4 flex items-center gap-2">
            <span aria-hidden="true">♡</span> Complimentary gift-ready packaging
          </p>
        </div>
      </div>
    </div>
  );
}
