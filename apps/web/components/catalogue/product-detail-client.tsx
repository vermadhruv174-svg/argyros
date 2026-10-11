'use client';

import React, { useState } from 'react';
import type { ProductDetailData } from '@/types/catalogue';
import { useCart } from '@/lib/cart-context';
import { ProductImage } from '@/components/media/product-image';
import { SizeGuideModal } from '@/components/catalogue/size-guide-modal';
import { siteConfig } from '@argyros/config';
import {
  Sparkles,
  RotateCcw,
  Gift,
  ShieldCheck,
  ChevronDown,
  Info,
  Package,
  Award,
  Sparkle
} from 'lucide-react';
import Link from 'next/link';

export function ProductDetailClient({ item }: { item: ProductDetailData }) {
  const [selectedVariantId, setSelectedVariantId] = useState(item.variants[0]?.id || '');
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [pincode, setPincode] = useState('');
  const [pincodeChecked, setPincodeChecked] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string>('specs');
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const { addToBag, error } = useCart();

  const activeVariant = item.variants.find((v) => v.id === selectedVariantId) || item.variants[0];
  const activePriceRupees = activeVariant ? Math.round(activeVariant.priceCents / 100) : 0;
  const isOutOfStock = !activeVariant || activeVariant.stock <= 0;

  const handleAdd = async () => {
    if (!activeVariant || isOutOfStock || adding) return;
    try {
      setAdding(true);
      await addToBag(activeVariant.id, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  const isRing = item.category.toLowerCase().includes('ring');
  const isCuff = item.category.toLowerCase().includes('bracelet') || item.category.toLowerCase().includes('cuff') || item.slug.includes('kada');
  const isChokerOrChain = item.category.toLowerCase().includes('necklace') || item.slug.includes('choker');

  return (
    <>
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        defaultTab={isRing ? 'ring' : 'wrist'}
      />

      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-start">
        {/* Left Gallery: Photo-ready Branded Placeholder */}
        <div className="relative aspect-[4/5] bg-[#0a1628] rounded-[2px] border border-gold/20 shadow-xl overflow-hidden">
          <ProductImage
            src={item.images[0]?.url}
            alt={item.images[0]?.alt || item.name}
            name={item.name}
            category={item.category}
            aspectRatio="4/5"
            priority
            showCaption
          />
          <div className="absolute top-4 left-4 liquid-glass-dark rounded-full px-3.5 py-1 text-[8px] font-bold tracking-[.18em] uppercase text-gold shadow-sm">
            925 Sterling Silver
          </div>
        </div>

        {/* Right (sticky on desktop): Details & Actions */}
        <div className="space-y-6 lg:sticky lg:top-28">
          <div>
            <nav className="text-[10px] uppercase tracking-[.16em] text-neutral-500 mb-2" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-gold">Home</Link>
              <span className="mx-2">/</span>
              <Link href={`/shop?category=${item.category.toLowerCase()}`} className="hover:text-gold">{item.category}</Link>
              <span className="mx-2">/</span>
              <span className="text-ink font-semibold">{item.name}</span>
            </nav>

            <h1 className="font-display text-4xl md:text-5xl text-ink tracking-tight leading-tight">
              {item.name}
            </h1>

            <div className="mt-3 flex items-baseline gap-3">
              <p className="text-2xl font-bold tracking-tight text-ink">
                ₹{activePriceRupees.toLocaleString('en-IN')}
              </p>
              <span className="text-xs text-neutral-500 font-medium">Inclusive of all taxes</span>
            </div>

            {/* Purity & Weight Calculator Badge */}
            <div className="mt-3.5 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-[#FAF8F5] px-3.5 py-1 text-[11px] font-semibold text-neutral-800">
              <span className="text-gold">✦</span>
              <span>92.5% Pure Sterling Silver</span>
              <span className="text-neutral-300">·</span>
              <span className="text-neutral-600">
                Approx. {activeVariant?.weightGrams ?? 4.2}g Fine Silver Weight
              </span>
            </div>
          </div>

          <div className="editorial-rule bg-gold/70" />

          <p className="text-sm leading-7 text-neutral-600 font-light">
            {item.description}
          </p>

          {/* BIS 925 Hallmarking Trust Bar */}
          {siteConfig.claims.hallmark.enabled && (
            <div className="p-4 rounded-[2px] bg-gradient-to-r from-[#FAF8F5] via-[#F5F1E8] to-[#FAF8F5] border border-gold/30 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-ink text-gold flex items-center justify-center shrink-0 border border-gold/40">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[.18em] text-ink">
                    BIS 925 Hallmarked & Certified
                  </p>
                  <p className="text-[11px] text-neutral-600 font-light">
                    Laser inscribed with unique 6-digit HUID for purity traceability.
                  </p>
                </div>
              </div>
              <span className="text-[9px] uppercase tracking-wider font-bold text-gold shrink-0 border border-gold/40 px-2 py-0.5 rounded">
                Govt. Verified
              </span>
            </div>
          )}

          {/* Ring Size or Variant Selector */}
          {item.variants.length > 0 && (
            <fieldset className="pt-2">
              <div className="flex items-center justify-between">
                <legend className="text-[10px] font-bold uppercase tracking-[.18em] text-neutral-700">
                  {isRing ? 'Select Indian Ring Size:' : isCuff ? 'Select Wrist / Size:' : 'Select Option:'}{' '}
                  <span className="text-ink font-extrabold">{activeVariant?.title}</span>
                </legend>
                {(isRing || isCuff) && (
                  <button
                    type="button"
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="text-[10px] uppercase tracking-wider text-gold font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Info size={12} /> Size Guide
                  </button>
                )}
              </div>

              <div className="mt-3.5 flex flex-wrap gap-2.5">
                {item.variants.map((v) => {
                  const isSelected = v.id === activeVariant?.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => setSelectedVariantId(v.id)}
                      className={`min-h-[46px] min-w-[54px] px-4 text-xs font-bold tracking-wider rounded-[2px] transition-all duration-200 ${
                        isSelected
                          ? 'bg-ink text-white shadow-md scale-[1.02]'
                          : 'bg-white border border-line text-ink hover:border-gold hover:text-gold'
                      }`}
                    >
                      {v.size ? `Size ${v.size}` : v.title}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          )}

          {/* Choker Length note if applicable */}
          {isChokerOrChain && item.slug.includes('celestine') && (
            <p className="text-xs text-neutral-500 italic bg-[#f9f7f2] p-3 rounded border border-line/60">
              ✦ The 14-inch sits close at the base of the neck; the 16-inch rests at the collarbone.
            </p>
          )}

          {/* 6-digit Pincode Delivery Estimate Check */}
          <div className="border border-line/70 p-4 rounded bg-[#fdfcf9] space-y-2">
            <label htmlFor="pincode-input" className="text-[10px] font-bold uppercase tracking-[.14em] text-neutral-700 block">
              Estimated Delivery
            </label>
            <div className="flex gap-2">
              <input
                id="pincode-input"
                type="text"
                maxLength={6}
                pattern="[0-9]{6}"
                placeholder="Enter 6-digit Pincode"
                value={pincode}
                onChange={(e) => {
                  setPincode(e.target.value.replace(/\D/g, ''));
                  setPincodeChecked(false);
                }}
                className="flex-1 px-3 py-2 text-xs border border-line rounded focus:outline-none focus:border-gold"
              />
              <button
                type="button"
                onClick={() => {
                  if (pincode.length === 6) setPincodeChecked(true);
                }}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-ink text-white rounded hover:bg-gold transition-colors"
              >
                Check
              </button>
            </div>
            {pincodeChecked && (
              <p className="text-xs text-neutral-600 mt-2">
                ✦ Estimated: Dispatches in {siteConfig.fulfilment.dispatchBusinessDays.min}–{siteConfig.fulfilment.dispatchBusinessDays.max} business days · Delivered {siteConfig.fulfilment.transitBusinessDays.min}–{siteConfig.fulfilment.transitBusinessDays.max} business days after dispatch.
              </p>
            )}
          </div>

          {/* Made-to-Order Craft Timeline Graphic */}
          <div className="p-4 rounded-[2px] bg-[#FAF8F5] border border-line/80 space-y-2.5">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-neutral-600">
              <span>Made-to-Order Craft Timeline</span>
              <span className="text-gold">✦ Handcrafted at Bench</span>
            </div>
            <div className="grid grid-cols-4 gap-2 pt-1 text-center">
              <div className="flex flex-col items-center">
                <div className="h-1.5 w-full bg-gold/90 rounded-full mb-1.5" />
                <span className="text-[10px] font-bold text-ink">Day 1</span>
                <span className="text-[9px] text-neutral-500">Lost-Wax Cast</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-1.5 w-full bg-gold/90 rounded-full mb-1.5" />
                <span className="text-[10px] font-bold text-ink">Day 3–4</span>
                <span className="text-[9px] text-neutral-500">Bench Finished</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-1.5 w-full bg-gold/90 rounded-full mb-1.5" />
                <span className="text-[10px] font-bold text-ink">Day 5</span>
                <span className="text-[9px] text-neutral-500">Laser Inscribed</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-1.5 w-full bg-emerald-600 rounded-full mb-1.5" />
                <span className="text-[10px] font-bold text-emerald-800">Day 6</span>
                <span className="text-[9px] text-neutral-500">Dispatched</span>
              </div>
            </div>
          </div>

          {error && (
            <p className="text-xs font-semibold text-red-600 bg-red-50 p-3 border border-red-200 rounded" role="alert">
              {error}
            </p>
          )}

          {/* Desktop Add to Bag */}
          <div className="pt-2">
            <button
              type="button"
              disabled={isOutOfStock || adding}
              onClick={handleAdd}
              className={`button w-full shadow-lg ${
                isOutOfStock
                  ? 'opacity-50 cursor-not-allowed bg-neutral-400'
                  : added
                  ? 'bg-emerald-800'
                  : ''
              }`}
            >
              {adding
                ? 'Securing Piece...'
                : added
                ? 'Added to Bag ✓'
                : isOutOfStock
                ? 'Out of Stock'
                : `Add to Bag • ₹${activePriceRupees.toLocaleString('en-IN')}`}
            </button>
          </div>

          {/* Trust Row */}
          <div className="grid grid-cols-3 gap-2 py-4 border-y border-line/70 text-center text-xs text-neutral-600">
            <div className="flex flex-col items-center gap-1.5 p-2">
              <Sparkles size={18} className="text-gold stroke-[1.5]" />
              <span className="font-semibold text-[11px]">Made to Order</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 p-2">
              <RotateCcw size={18} className="text-gold stroke-[1.5]" />
              <span className="font-semibold text-[11px]">{siteConfig.fulfilment.returnWindowDays}-Day Returns</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 p-2">
              <Gift size={18} className="text-gold stroke-[1.5]" />
              <span className="font-semibold text-[11px]">Gift Packaging</span>
            </div>
          </div>

          {/* Accordions */}
          <div className="space-y-2 pt-2">
            {/* Details & Specs */}
            <div className="border border-line/70 rounded">
              <button
                type="button"
                onClick={() => setOpenAccordion(openAccordion === 'specs' ? '' : 'specs')}
                className="w-full flex items-center justify-between p-4 text-xs font-bold uppercase tracking-wider text-ink hover:text-gold"
                aria-expanded={openAccordion === 'specs'}
              >
                <span>Details & Specifications</span>
                <ChevronDown size={14} className={`transition-transform ${openAccordion === 'specs' ? 'rotate-180' : ''}`} />
              </button>
              {openAccordion === 'specs' && (
                <div className="px-4 pb-4 text-xs text-neutral-600 space-y-2 border-t border-line/40 pt-3">
                  <p><strong>Metal:</strong> 925 sterling silver (92.5% pure)</p>
                  {activeVariant?.weightGrams && (
                    <p><strong>Weight:</strong> ~{Number(activeVariant.weightGrams)} grams solid silver</p>
                  )}
                  <p><strong>Purity:</strong> 92.5% fine silver alloyed for enduring strength</p>
                  <p><strong>Finishing:</strong> Hand-finished by master karigars</p>
                </div>
              )}
            </div>

            {/* Care Guide */}
            <div className="border border-line/70 rounded">
              <button
                type="button"
                onClick={() => setOpenAccordion(openAccordion === 'care' ? '' : 'care')}
                className="w-full flex items-center justify-between p-4 text-xs font-bold uppercase tracking-wider text-ink hover:text-gold"
                aria-expanded={openAccordion === 'care'}
              >
                <span>Care & Longevity</span>
                <ChevronDown size={14} className={`transition-transform ${openAccordion === 'care' ? 'rotate-180' : ''}`} />
              </button>
              {openAccordion === 'care' && (
                <div className="px-4 pb-4 text-xs leading-relaxed text-neutral-600 border-t border-line/40 pt-3">
                  Silver naturally deepens over time with air, moisture and perfume. It polishes back easily. Store each piece in its pouch, put jewellery on after perfume and lotion, and wipe with a soft polishing cloth. Avoid swimming pools and hot water.
                </div>
              )}
            </div>

            {/* Shipping & Returns */}
            <div className="border border-line/70 rounded">
              <button
                type="button"
                onClick={() => setOpenAccordion(openAccordion === 'shipping' ? '' : 'shipping')}
                className="w-full flex items-center justify-between p-4 text-xs font-bold uppercase tracking-wider text-ink hover:text-gold"
                aria-expanded={openAccordion === 'shipping'}
              >
                <span>Shipping & Returns</span>
                <ChevronDown size={14} className={`transition-transform ${openAccordion === 'shipping' ? 'rotate-180' : ''}`} />
              </button>
              {openAccordion === 'shipping' && (
                <div className="px-4 pb-4 text-xs leading-relaxed text-neutral-600 border-t border-line/40 pt-3 space-y-2">
                  <p>Complimentary shipping across India on orders above ₹{siteConfig.fulfilment.freeShippingAbove.toLocaleString('en-IN')}. For orders below, flat ₹{siteConfig.fulfilment.flatShippingBelow} fee applies.</p>
                  <p>{siteConfig.fulfilment.returnWindowDays}-day return window for unworn items in original packaging. One complimentary size exchange within {siteConfig.fulfilment.sizeExchange.windowDays} days for rings and cuffs.</p>
                  <div className="pt-1 flex gap-4 text-gold font-bold">
                    <Link href="/shipping-policy" className="hover:underline">Shipping Policy →</Link>
                    <Link href="/returns" className="hover:underline">Returns & Refunds →</Link>
                  </div>
                </div>
              )}
            </div>

            {/* Hallmark & Purity Accordion */}
            {siteConfig.claims.hallmark.enabled && (
              <div className="border border-line/70 rounded">
                <button
                  type="button"
                  onClick={() => setOpenAccordion(openAccordion === 'hallmark' ? '' : 'hallmark')}
                  className="w-full flex items-center justify-between p-4 text-xs font-bold uppercase tracking-wider text-ink hover:text-gold"
                  aria-expanded={openAccordion === 'hallmark'}
                >
                  <span>Hallmark & Purity</span>
                  <ChevronDown size={14} className={`transition-transform ${openAccordion === 'hallmark' ? 'rotate-180' : ''}`} />
                </button>
                {openAccordion === 'hallmark' && (
                  <div className="px-4 pb-4 text-xs leading-relaxed text-neutral-600 border-t border-line/40 pt-3 space-y-2">
                    <p>Every Argyros creation is stamped with the official 925 fineness mark and a 6-digit laser HUID (Hallmark Unique Identification Number).</p>
                    <p>You can verify the authentication of your hallmark anytime on the official BIS Care portal or mobile application.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* The Unboxing Experience Section */}
          <div className="pt-4 border-t border-line/80 space-y-4">
            <div className="flex items-center gap-2">
              <Package size={16} className="text-gold" />
              <h3 className="font-display text-xl text-ink">The Unboxing Experience</h3>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded bg-[#FAF8F5] border border-line/60 space-y-1">
                <p className="font-bold text-ink">Embossed Navy Box</p>
                <p className="text-[11px] text-neutral-600 font-light">Rigid keepsake box with gold foil Argyros crest.</p>
              </div>
              <div className="p-3 rounded bg-[#FAF8F5] border border-line/60 space-y-1">
                <p className="font-bold text-ink">Micro-Suede Pouch</p>
                <p className="text-[11px] text-neutral-600 font-light">Plush travel pouch to prevent scratches.</p>
              </div>
              <div className="p-3 rounded bg-[#FAF8F5] border border-line/60 space-y-1">
                <p className="font-bold text-ink">Authenticity Card</p>
                <p className="text-[11px] text-neutral-600 font-light">925 purity certificate and bench karigar mark.</p>
              </div>
              <div className="p-3 rounded bg-[#FAF8F5] border border-line/60 space-y-1">
                <p className="font-bold text-ink">Polishing Cloth</p>
                <p className="text-[11px] text-neutral-600 font-light">Lint-free silver cleaning cloth included.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Bottom Add to Bag Bar on Mobile */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-line p-3 px-4 flex items-center justify-between shadow-2xl">
          <div>
            <p className="text-xs font-bold text-ink truncate max-w-[180px]">{item.name}</p>
            <p className="text-sm font-extrabold text-gold">₹{activePriceRupees.toLocaleString('en-IN')}</p>
          </div>
          <button
            type="button"
            disabled={isOutOfStock || adding}
            onClick={handleAdd}
            className="button min-h-[44px] px-6 text-xs uppercase tracking-wider bg-ink text-white"
          >
            {adding ? 'Adding...' : added ? 'Added ✓' : 'Add to Bag'}
          </button>
        </div>
      </div>
    </>
  );
}
