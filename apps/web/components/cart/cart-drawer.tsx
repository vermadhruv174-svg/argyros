'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/cart-context';
import { siteConfig } from '@argyros/config';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export function CartDrawer() {
  const {
    cart,
    loading,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeItem,
  } = useCart();

  const items = cart?.items || [];
  const subtotalRupees = cart ? Math.round(cart.subtotalCents / 100) : 0;
  const freeShippingThreshold = siteConfig.fulfilment.freeShippingAbove;
  const freeShippingDifference = Math.max(0, freeShippingThreshold - subtotalRupees);

  // Close on Escape key
  useEffect(() => {
    if (!isDrawerOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDrawer();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen, closeDrawer]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen]);

  if (!isDrawerOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* Slide-over panel */}
      <div className="relative z-10 flex h-full w-full max-w-md flex-col bg-paper shadow-2xl border-l border-line transform transition-transform duration-300 ease-out animate-in slide-in-from-right">
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-gold" />
            <h2 id="cart-drawer-title" className="font-display text-2xl text-ink">
              Your Bag ({cart?.totalQuantity || 0})
            </h2>
          </div>
          <button
            onClick={closeDrawer}
            className="p-1.5 text-neutral-500 hover:text-ink transition-colors"
            aria-label="Close bag drawer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-[#FAF8F5] border-b border-line/70 px-6 py-3 text-xs">
          {freeShippingDifference === 0 ? (
            <p className="font-semibold text-emerald-800 flex items-center gap-1.5">
              <span>✦</span> Complimentary insured shipping unlocked!
            </p>
          ) : (
            <p className="text-neutral-600 font-light">
              Add <strong className="text-ink font-semibold">₹{freeShippingDifference.toLocaleString('en-IN')}</strong> more for complimentary shipping.
            </p>
          )}
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-line/70">
          {items.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <p className="font-display text-2xl text-neutral-500">Your bag is empty.</p>
              <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                Discover our foundational collection of sculptural 925 sterling silver pieces.
              </p>
              <Link
                href="/shop"
                onClick={closeDrawer}
                className="button inline-flex text-xs py-2 px-5 mt-2"
              >
                Explore Collection →
              </Link>
            </div>
          ) : (
            items.map((item) => {
              const unitRupees = Math.round(item.unitPriceCents / 100);
              return (
                <div key={item.id} className="py-4 flex gap-4 items-start">
                  <div className="relative aspect-[4/5] w-20 shrink-0 bg-[#0a1628] rounded-[2px] overflow-hidden border border-gold/20 flex items-center justify-center">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.productName}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    ) : (
                      <span className="font-display text-sm text-gold">A</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] uppercase tracking-wider text-gold font-bold">
                      {item.metalPurity}
                    </p>
                    <Link
                      href={`/products/${item.productSlug}`}
                      onClick={closeDrawer}
                      className="font-display text-lg text-ink hover:text-gold transition line-clamp-1"
                    >
                      {item.productName}
                    </Link>
                    {item.title && (
                      <p className="text-[11px] text-neutral-500 line-clamp-1">{item.title}</p>
                    )}
                    <p className="text-xs font-semibold text-ink mt-1">
                      ₹{unitRupees.toLocaleString('en-IN')}
                    </p>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-line rounded">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-xs hover:bg-neutral-100 transition"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xs font-medium">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-xs hover:bg-neutral-100 transition"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="p-1.5 text-neutral-400 hover:text-red-700 transition"
                        aria-label="Remove item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer */}
        {items.length > 0 && (
          <div className="border-t border-line bg-[#FAF8F5] p-6 space-y-4">
            <div className="flex items-baseline justify-between">
              <span className="text-xs uppercase tracking-wider text-neutral-600 font-bold">Subtotal</span>
              <span className="font-display text-2xl font-bold text-ink">
                ₹{subtotalRupees.toLocaleString('en-IN')}
              </span>
            </div>
            <p className="text-[10px] text-neutral-500 leading-tight">
              Taxes included. Complimentary shipping calculated at checkout.
            </p>

            <div className="space-y-2">
              <Link
                href="/checkout"
                onClick={closeDrawer}
                className="button w-full flex items-center justify-center gap-2 text-xs py-3.5 shadow-lg"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/bag"
                onClick={closeDrawer}
                className="block text-center text-xs text-neutral-600 hover:text-gold uppercase tracking-wider font-bold py-1.5 transition-colors"
              >
                View Full Bag Details
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
