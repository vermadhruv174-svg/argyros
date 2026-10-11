'use client';

import React, { useState } from 'react';
import type { ProductDetailData } from '@/types/catalogue';
import { useCart } from '@/lib/cart-context';
import { ProductImage } from '@/components/media/product-image';
import { ProductGallery } from './product-gallery';
import { ProductMerchandising } from './product-merchandising';
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
import { trackEvent } from '@/lib/analytics';

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
      trackEvent('add_to_bag', {
        variantId: activeVariant.id,
        productName: item.name,
        priceRupees: activePriceRupees,
        size: activeVariant.size || 'default',
      });
      setTimeout(() => setAdded(false), 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  const handleOpenSizeGuide = () => {
    setIsSizeGuideOpen(true);
    trackEvent('size_guide_open', { productName: item.name });
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

      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-start pb-20 lg:pb-0">
        {/* Left: Interactive Multi-Asset Gallery */}
        <ProductGallery
          images={item.images}
          name={item.name}
          category={item.category}
        />

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

            {/* Compact Trust Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 text-center">
              <div className="p-2.5 rounded bg-[#FAF8F5] border border-line/70">
                <p className="text-[10px] font-bold text-ink uppercase tracking-wider">925 Solid Silver</p>
                <p className="text-[9px] text-neutral-500">92.5% Fine Purity</p>
              </div>
              <div className="p-2.5 rounded bg-[#FAF8F5] border border-line/70">
                <p className="text-[10px] font-bold text-ink uppercase tracking-wider">Made to Order</p>
                <p className="text-[9px] text-neutral-500">4–6 Day Bench Craft</p>
              </div>
              <div className="p-2.5 rounded bg-[#FAF8F5] border border-line/70">
                <p className="text-[10px] font-bold text-ink uppercase tracking-wider">Keepsake Box</p>
                <p className="text-[9px] text-neutral-500">Pouch & Cloth Included</p>
              </div>
              <div className="p-2.5 rounded bg-[#FAF8F5] border border-line/70">
                <p className="text-[10px] font-bold text-ink uppercase tracking-wider">Size Exchange</p>
                <p className="text-[9px] text-neutral-500">1 Free within 15 Days</p>
              </div>
            </div>
          </div>

          <div className="editorial-rule bg-gold/70" />

          <p className="text-sm leading-7 text-neutral-600 font-light">
            {item.description}
          </p>

          {/* Personal Product Storytelling (The feeling, form, making, moment) */}
          {item.story && (
            <div className="p-4 rounded-[2px] bg-[#FAF8F5] border border-gold/30 space-y-2.5">
              <p className="text-[9px] font-bold uppercase tracking-[.2em] text-gold">The Atelier Story</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <strong className="text-ink font-semibold block text-[11px]">The Feeling:</strong>
                  <span className="text-neutral-600 font-light">{item.story.feeling}</span>
                </div>
                <div>
                  <strong className="text-ink font-semibold block text-[11px]">The Form:</strong>
                  <span className="text-neutral-600 font-light">{item.story.form}</span>
                </div>
                <div>
                  <strong className="text-ink font-semibold block text-[11px]">The Making:</strong>
                  <span className="text-neutral-600 font-light">{item.story.making}</span>
                </div>
                <div>
                  <strong className="text-ink font-semibold block text-[11px]">The Moment:</strong>
                  <span className="text-neutral-600 font-light">{item.story.moment}</span>
                </div>
              </div>
            </div>
          )}

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
                Hallmark 925
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
                    onClick={handleOpenSizeGuide}
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

          {/* 6-digit Pincode Delivery Estimate Check with Dynamic Dates */}
          <div className="border border-line/70 p-4 rounded bg-[#fdfcf9] space-y-2.5">
            <div className="flex items-center justify-between">
              <label htmlFor="pincode-input" className="text-[10px] font-bold uppercase tracking-[.14em] text-neutral-700 block">
                Estimated Delivery & Pincode Checker
              </label>
              <span className="text-[9px] uppercase tracking-wider text-gold font-bold">
                Insured Air Express
              </span>
            </div>
            <div className="flex gap-2">
              <input
                id="pincode-input"
                type="text"
                maxLength={6}
                pattern="[0-9]{6}"
                placeholder="Enter 6-digit Indian PIN code"
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
            {pincodeChecked ? (
              <div className="p-3 bg-white border border-gold/40 rounded text-xs text-neutral-700 space-y-1">
                <p className="font-bold text-ink">
                  ✦ Available for Delivery to PIN {pincode}
                </p>
                <p className="text-[11px] text-neutral-600">
                  Estimated Dispatch: <strong>{new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</strong> (Made to order)
                </p>
                <p className="text-[11px] text-neutral-600">
                  Estimated Delivery: <strong>{new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} – {new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</strong> via Bluedart / Delhivery Air.
                </p>
              </div>
            ) : (
              <p className="text-[11px] text-neutral-500 font-light">
                ✦ Standard: Handcrafted in 4–6 business days · Delivered 2–4 business days after dispatch.
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
            {/* Precise Specifications */}
            <div className="border border-line/70 rounded">
              <button
                type="button"
                onClick={() => setOpenAccordion(openAccordion === 'specs' ? '' : 'specs')}
                className="w-full flex items-center justify-between p-4 text-xs font-bold uppercase tracking-wider text-ink hover:text-gold"
                aria-expanded={openAccordion === 'specs'}
              >
                <span>Precise Specifications</span>
                <ChevronDown size={14} className={`transition-transform ${openAccordion === 'specs' ? 'rotate-180' : ''}`} />
              </button>
              {openAccordion === 'specs' && (
                <div className="px-4 pb-4 text-xs text-neutral-600 border-t border-line/40 pt-3">
                  <table className="w-full text-left border-collapse">
                    <tbody className="divide-y divide-line/40">
                      <tr>
                        <td className="py-2 font-semibold text-ink w-1/3">Metal</td>
                        <td className="py-2">Solid 925 Sterling Silver</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-semibold text-ink">Purity</td>
                        <td className="py-2">92.5% pure silver alloyed with 7.5% copper for durability</td>
                      </tr>
                      {activeVariant?.weightGrams && (
                        <tr>
                          <td className="py-2 font-semibold text-ink">Approx. Weight</td>
                          <td className="py-2">~{Number(activeVariant.weightGrams)} grams solid silver</td>
                        </tr>
                      )}
                      <tr>
                        <td className="py-2 font-semibold text-ink">Finishing</td>
                        <td className="py-2">Hand-polished mirror bevels & satin brushed face</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-semibold text-ink">Sizing Standard</td>
                        <td className="py-2">{isRing ? 'Standard Indian Ring Sizes (IN 10–18)' : isCuff ? 'Wrist Circumference (XS–L)' : 'Standard Chain Length'}</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-semibold text-ink">Hallmarking</td>
                        <td className="py-2">Laser stamped 925 fineness mark on inner shank/post</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-semibold text-ink">Production Time</td>
                        <td className="py-2">4–6 business days lost-wax bench craft</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-semibold text-ink">Delivery Estimate</td>
                        <td className="py-2">2–4 business days via insured express transit after dispatch</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-semibold text-ink">Exchange Policy</td>
                        <td className="py-2">1 complimentary size exchange within 15 days on unworn pieces</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* What You Receive in the Box */}
            <div className="border border-line/70 rounded">
              <button
                type="button"
                onClick={() => setOpenAccordion(openAccordion === 'unboxing' ? '' : 'unboxing')}
                className="w-full flex items-center justify-between p-4 text-xs font-bold uppercase tracking-wider text-ink hover:text-gold"
                aria-expanded={openAccordion === 'unboxing'}
              >
                <span>What You Receive</span>
                <ChevronDown size={14} className={`transition-transform ${openAccordion === 'unboxing' ? 'rotate-180' : ''}`} />
              </button>
              {openAccordion === 'unboxing' && (
                <div className="px-4 pb-4 text-xs leading-relaxed text-neutral-600 border-t border-line/40 pt-3 space-y-2">
                  <p className="font-semibold text-ink">Every order arrives gift-ready and includes:</p>
                  <ul className="list-disc list-inside space-y-1.5 pl-1 text-neutral-700">
                    <li>1× Solid 925 Sterling Silver Jewellery Piece</li>
                    <li>1× Rigid Navy Keepsake Box with Gold Foil Crest</li>
                    <li>1× Plush Micro-Suede Protective Travel Pouch</li>
                    <li>1× 925 Purity & Authenticity Deed</li>
                    <li>1× Lint-Free Silver Polishing Cloth</li>
                    <li>1× Care & Longevity Instruction Card</li>
                    <li>Optional complimentary handwritten gift note (specified at checkout)</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Ethical Product Reassurance & Hallmarking */}
            <div className="border border-line/70 rounded">
              <button
                type="button"
                onClick={() => setOpenAccordion(openAccordion === 'authenticity' ? '' : 'authenticity')}
                className="w-full flex items-center justify-between p-4 text-xs font-bold uppercase tracking-wider text-ink hover:text-gold"
                aria-expanded={openAccordion === 'authenticity'}
              >
                <span>Ethical Reassurance & Authenticity</span>
                <ChevronDown size={14} className={`transition-transform ${openAccordion === 'authenticity' ? 'rotate-180' : ''}`} />
              </button>
              {openAccordion === 'authenticity' && (
                <div className="px-4 pb-4 text-xs leading-relaxed text-neutral-600 border-t border-line/40 pt-3 space-y-2.5">
                  <p>
                    <strong>What 925 Means:</strong> Solid 925 sterling silver is 92.5% pure silver alloyed with 7.5% copper. Pure fine silver is too malleable for daily rings and cuffs; the copper alloy gives enduring structural hardness while preserving silver's characteristic cool luster. We never use base metals, nickel or brass.
                  </p>
                  <p>
                    <strong>Authenticity Stamping:</strong> Each piece is laser-inscribed with the official 925 purity mark on the inner band, post, or tag.
                  </p>
                  <p>
                    <strong>Bench Quality Inspection:</strong> Prior to packaging in Haldwani, each piece undergoes a 3-point bench check: surface loupe examination, digital scale weight verification, and clasp tension testing.
                  </p>
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

      {/* Merchandising: Complete the stack, pairs well with, the edit, gifting, and recently viewed */}
      <ProductMerchandising currentProduct={item} />
    </>
  );
}
