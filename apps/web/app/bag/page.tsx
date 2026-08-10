'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useCart } from '@/lib/cart-context';

export default function BagPage() {
  const { cart, loading, updateQuantity, removeItem, clearBag } = useCart();

  const items = cart?.items || [];
  const isEmpty = !loading && items.length === 0;
  const subtotalRupees = cart ? Math.round(cart.subtotalCents / 100) : 0;

  return (
    <>
      <Header />
      <main className="flex-1 shell py-12 md:py-20">
        <div className="flex items-baseline justify-between border-b border-line pb-6">
          <h1 className="font-display text-4xl md:text-5xl">Your Bag</h1>
          {items.length > 0 && (
            <button
              type="button"
              onClick={() => clearBag()}
              className="text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-red-700 transition"
            >
              Clear bag
            </button>
          )}
        </div>

        {loading && (
          <div className="py-24 text-center text-sm font-medium text-neutral-500">
            Loading your bag...
          </div>
        )}

        {isEmpty && (
          <div className="py-24 text-center">
            <p className="font-display text-3xl text-neutral-800">Your bag is empty.</p>
            <p className="mt-3 text-sm text-neutral-500">
              Discover our timeless 925 sterling silver collection.
            </p>
            <Link className="button mt-8 inline-flex" href="/shop">
              Explore collection →
            </Link>
          </div>
        )}

        {!loading && items.length > 0 && (
          <div className="mt-8 grid gap-12 lg:grid-cols-[1fr_360px]">
            {/* Items List */}
            <ul className="divide-y divide-line border-b border-line" aria-label="Cart Items">
              {items.map((item) => {
                const unitRupees = Math.round(item.unitPriceCents / 100);
                const lineRupees = Math.round(item.lineTotalCents / 100);
                const itemImg =
                  item.imageUrl ||
                  'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=85';

                return (
                  <li key={item.id} className="py-6 flex gap-6 sm:gap-8 items-start">
                    <div className="relative aspect-[4/5] w-24 shrink-0 bg-[#ebe9e4] overflow-hidden">
                      <Image
                        src={itemImg}
                        alt={item.productName}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col sm:flex-row justify-between gap-4">
                      <div>
                        <p className="eyebrow text-gold text-[8px]">{item.metalPurity}</p>
                        <Link
                          href={`/products/${item.productSlug}`}
                          className="font-display text-2xl hover:text-gold transition"
                        >
                          {item.productName}
                        </Link>
                        {item.title && (
                          <p className="mt-1 text-xs text-neutral-500">Option: {item.title}</p>
                        )}
                        <p className="mt-2 text-xs font-semibold">
                          ₹{unitRupees.toLocaleString('en-IN')}
                        </p>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-line rounded">
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center text-xs hover:bg-neutral-100 transition"
                          >
                            -
                          </button>
                          <span className="w-10 text-center text-xs font-bold">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            aria-label="Increase quantity"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.maxStock}
                            className="w-8 h-8 flex items-center justify-center text-xs hover:bg-neutral-100 disabled:opacity-30 transition"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-semibold">
                            ₹{lineRupees.toLocaleString('en-IN')}
                          </p>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="mt-1 text-[10px] uppercase font-bold text-neutral-400 hover:text-red-700 transition"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Order Summary */}
            <div className="bg-[#f3f0ea] p-8 border border-line flex flex-col justify-between self-start">
              <div>
                <h2 className="font-display text-2xl border-b border-line pb-4">
                  Summary
                </h2>
                <div className="mt-6 flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span className="font-semibold">
                    ₹{subtotalRupees.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="mt-3 flex justify-between text-xs text-neutral-500">
                  <span>Shipping</span>
                  <span>
                    {subtotalRupees >= 2999 ? (
                      <span className="text-emerald-700 font-semibold">COMPLIMENTARY</span>
                    ) : (
                      'Calculated at checkout'
                    )}
                  </span>
                </div>
                <p className="mt-6 text-[11px] leading-5 text-neutral-500 border-t border-line pt-4">
                  All taxes included. Complimentary gift-ready packaging with every order.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-line">
                <button
                  type="button"
                  disabled
                  className="button w-full opacity-70 cursor-not-allowed flex flex-col items-center py-3"
                >
                  <span>Proceed to Checkout</span>
                  <span className="text-[8px] font-normal tracking-normal text-gold uppercase">
                    Coming in M2 Phase 2
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
