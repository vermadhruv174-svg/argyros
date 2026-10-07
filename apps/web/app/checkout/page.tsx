'use client';

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useCart } from '@/lib/cart-context';
import { createOrder } from '@/lib/api-client';
import type { CheckoutPayload } from '@/types/catalogue';

const API_BASE_URL =
  typeof window !== 'undefined'
    ? '/api'
    : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';


const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '',
);

// ─── Inner Stripe Payment Form ─────────────────────────────────────────────

interface PaymentFormProps {
  orderNumber: string;
  onSuccess: () => void;
  onError: (msg: string) => void;
}

function StripePaymentForm({ orderNumber, onSuccess, onError }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || submitting) return;

    setSubmitting(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${typeof window !== 'undefined' ? window.location.origin : ''}/orders/${encodeURIComponent(orderNumber)}`,
      },
    });

    if (error) {
      onError(error.message ?? 'Payment failed. Please try again.');
      setSubmitting(false);
    } else {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handlePay} className="space-y-6">
      <PaymentElement
        options={{
          layout: 'tabs',
        }}
      />
      <button
        type="submit"
        disabled={!stripe || submitting}
        className="button w-full flex items-center justify-center gap-2"
      >
        {submitting ? 'Processing Payment...' : 'Pay Now →'}
      </button>
    </form>
  );
}

// ─── Main Checkout Page ────────────────────────────────────────────────────

type CheckoutStep = 'details' | 'payment';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, loading: cartLoading, refreshCart } = useCart();

  const [step, setStep] = useState<CheckoutStep>('details');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Stripe state
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  // Form State
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');

  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('India');

  const items = cart?.items || [];
  const isEmpty = !cartLoading && items.length === 0;

  const subtotalRupees = cart ? Math.round(cart.subtotalCents / 100) : 0;
  const isFreeShipping = subtotalRupees >= 2999;
  const shippingRupees = isFreeShipping ? 0 : 150;
  const totalRupees = subtotalRupees + shippingRupees;

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cart || !cart.token || items.length === 0 || submitting) return;

    try {
      setSubmitting(true);
      setError(null);

      const payload: CheckoutPayload = {
        cartToken: cart.token,
        customer: {
          email: email.trim(),
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          phone: phone.trim() || undefined,
        },
        shippingAddress: {
          line1: line1.trim(),
          line2: line2.trim() || undefined,
          city: city.trim(),
          state: state.trim(),
          postalCode: postalCode.trim(),
          country: country.trim() || 'India',
        },
      };

      const order = await createOrder(payload);

      // Refresh cart (clears it)
      await refreshCart();

      // Create payment intent using Razorpay
      const intentRes = await fetch(
        `${API_BASE_URL}/payments/razorpay/order/${encodeURIComponent(order.number)}`,
        { method: 'POST' },
      );

      if (!intentRes.ok) {
        throw new Error('Failed to initialise payment. Please try again.');
      }

      const paymentData = await intentRes.json();
      const secret = `${paymentData.razorpayOrderId}:${paymentData.amount}:${paymentData.keyId}`;

      setClientSecret(secret);
      setOrderNumber(order.number);
      setStep('payment');
    } catch (err: unknown) {
      console.error('Checkout error:', err);
      const msg =
        err instanceof Error ? err.message : 'An unexpected error occurred during checkout.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePaymentSuccess = useCallback(() => {
    if (orderNumber) {
      router.push(`/orders/${encodeURIComponent(orderNumber)}`);
    }
  }, [orderNumber, router]);

  const handlePaymentError = useCallback((msg: string) => {
    setError(msg);
  }, []);

  return (
    <>
      <Header />
      <main id="main-content" className="flex-1 shell py-12 md:py-20">
        <div className="border-b border-line pb-6">
          <h1 className="font-display text-4xl md:text-5xl">Checkout</h1>
          {step === 'payment' && (
            <p className="mt-2 text-sm text-neutral-500">Step 2 of 2 — Payment</p>
          )}
        </div>

        {cartLoading && (
          <div className="py-24 text-center text-sm text-neutral-500 font-medium">
            Loading checkout details...
          </div>
        )}

        {isEmpty && step === 'details' && (
          <div className="py-24 text-center">
            <p className="font-display text-3xl text-neutral-800">Your bag is empty.</p>
            <p className="mt-3 text-sm text-neutral-500">
              Please add items to your bag before proceeding to checkout.
            </p>
            <Link className="button mt-8 inline-flex" href="/shop">
              Explore collection →
            </Link>
          </div>
        )}

        {/* ── Step 1: Details ─────────────────────────────────────── */}
        {!cartLoading && !isEmpty && step === 'details' && (
          <form onSubmit={handleDetailsSubmit} className="mt-10 grid gap-12 lg:grid-cols-[1fr_400px]">
            {/* Form Column */}
            <div className="space-y-10">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 p-4 text-xs font-semibold rounded" role="alert">
                  {error}
                </div>
              )}

              {/* Customer Information */}
              <section aria-labelledby="customer-info-heading">
                <h2 id="customer-info-heading" className="font-display text-2xl border-b border-line pb-3">
                  1. Customer Information
                </h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-neutral-700">
                      Email Address *
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="mt-2 w-full border border-line bg-white px-4 py-3 text-sm focus:border-gold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="firstName" className="block text-xs font-bold uppercase tracking-wider text-neutral-700">
                      First Name *
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Aarav"
                      className="mt-2 w-full border border-line bg-white px-4 py-3 text-sm focus:border-gold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-xs font-bold uppercase tracking-wider text-neutral-700">
                      Last Name *
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Sharma"
                      className="mt-2 w-full border border-line bg-white px-4 py-3 text-sm focus:border-gold focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-neutral-700">
                      Phone Number (Optional)
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="mt-2 w-full border border-line bg-white px-4 py-3 text-sm focus:border-gold focus:outline-none"
                    />
                  </div>
                </div>
              </section>

              {/* Shipping Address */}
              <section aria-labelledby="shipping-address-heading">
                <h2 id="shipping-address-heading" className="font-display text-2xl border-b border-line pb-3">
                  2. Shipping Address
                </h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label htmlFor="line1" className="block text-xs font-bold uppercase tracking-wider text-neutral-700">
                      Address Line 1 *
                    </label>
                    <input
                      id="line1"
                      type="text"
                      required
                      value={line1}
                      onChange={(e) => setLine1(e.target.value)}
                      placeholder="Street address, house/flat number"
                      className="mt-2 w-full border border-line bg-white px-4 py-3 text-sm focus:border-gold focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="line2" className="block text-xs font-bold uppercase tracking-wider text-neutral-700">
                      Address Line 2 (Optional)
                    </label>
                    <input
                      id="line2"
                      type="text"
                      value={line2}
                      onChange={(e) => setLine2(e.target.value)}
                      placeholder="Apartment, suite, unit, building"
                      className="mt-2 w-full border border-line bg-white px-4 py-3 text-sm focus:border-gold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="city" className="block text-xs font-bold uppercase tracking-wider text-neutral-700">
                      City *
                    </label>
                    <input
                      id="city"
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Bengaluru"
                      className="mt-2 w-full border border-line bg-white px-4 py-3 text-sm focus:border-gold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-xs font-bold uppercase tracking-wider text-neutral-700">
                      State *
                    </label>
                    <input
                      id="state"
                      type="text"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="Karnataka"
                      className="mt-2 w-full border border-line bg-white px-4 py-3 text-sm focus:border-gold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="postalCode" className="block text-xs font-bold uppercase tracking-wider text-neutral-700">
                      PIN / Postal Code *
                    </label>
                    <input
                      id="postalCode"
                      type="text"
                      required
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="560001"
                      className="mt-2 w-full border border-line bg-white px-4 py-3 text-sm focus:border-gold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="country" className="block text-xs font-bold uppercase tracking-wider text-neutral-700">
                      Country *
                    </label>
                    <input
                      id="country"
                      type="text"
                      required
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="India"
                      className="mt-2 w-full border border-line bg-white px-4 py-3 text-sm focus:border-gold focus:outline-none"
                    />
                  </div>
                </div>
              </section>
            </div>

            {/* Sidebar Column */}
            <OrderSummaryPanel
              items={items}
              subtotalRupees={subtotalRupees}
              isFreeShipping={isFreeShipping}
              shippingRupees={shippingRupees}
              totalRupees={totalRupees}
              submitting={submitting}
              submitLabel={submitting ? 'Processing Order...' : 'Continue to Payment →'}
            />
          </form>
        )}

        {/* ── Step 2: Razorpay Payment ───────────────────────────────── */}
        {step === 'payment' && orderNumber && clientSecret && (
          <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_400px]">
            <div className="space-y-6">
              <section aria-labelledby="payment-heading">
                <h2 id="payment-heading" className="font-display text-2xl border-b border-line pb-3">
                  3. Payment
                </h2>
                <div className="mt-6">
                  {error && (
                    <div className="mb-4 bg-red-50 border border-red-200 text-red-800 p-4 text-xs font-semibold rounded" role="alert">
                      {error}
                    </div>
                  )}
                  <button
                    onClick={() => {
                      // clientSecret contains razorpayOrderId when Razorpay is used
                      const [rzpOrderId, amount, keyId] = clientSecret.split(':');
                      if (!rzpOrderId) return;
                      
                      const script = document.createElement('script');
                      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                      document.body.appendChild(script);
                      script.onload = () => {
                        const rzp = new (window as any).Razorpay({
                          key: keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
                          amount: Number(amount) || totalRupees * 100,
                          currency: 'INR',
                          name: 'Argyros 925',
                          description: `Order ${orderNumber}`,
                          order_id: rzpOrderId,
                          handler: async (response: any) => {
                            try {
                              const res = await fetch(`${API_BASE_URL}/payments/razorpay/verify`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  razorpayOrderId: response.razorpay_order_id,
                                  razorpayPaymentId: response.razorpay_payment_id,
                                  razorpaySignature: response.razorpay_signature,
                                  orderNumber
                                }),
                              });
                              if (res.ok) {
                                handlePaymentSuccess();
                              } else {
                                handlePaymentError('Payment verification failed');
                              }
                            } catch (e) {
                              handlePaymentError('Payment verification failed');
                            }
                          },
                          prefill: { name: `${firstName} ${lastName}`, email: email, contact: phone },
                          theme: { color: '#b8996e' },
                        });
                        rzp.open();
                      };
                    }}
                    className="button w-full flex items-center justify-center gap-2"
                  >
                    Pay with Razorpay →
                  </button>
                </div>
              </section>
            </div>

            {/* Static order summary (no submit button on this side) */}
            <div className="bg-[#f3f0ea] p-8 border border-line self-start">
              <h2 className="font-display text-2xl border-b border-line pb-4">Order Summary</h2>
              <p className="mt-4 text-xs text-neutral-500">
                Order <span className="font-semibold text-ink">#{orderNumber}</span>
              </p>
              <div className="space-y-3 border-t border-line pt-4 mt-4 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold">₹{subtotalRupees.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-xs text-neutral-600">
                  <span>Shipping</span>
                  <span>
                    {isFreeShipping ? (
                      <span className="text-emerald-700 font-semibold">COMPLIMENTARY</span>
                    ) : (
                      `₹${shippingRupees.toLocaleString('en-IN')}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between font-display text-2xl border-t border-line pt-4 text-ink">
                  <span>Total</span>
                  <span>₹{totalRupees.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

// ─── Order Summary Panel ───────────────────────────────────────────────────

interface CartItem {
  id: string;
  imageUrl?: string | null;
  productName: string;
  title?: string;
  quantity: number;
  lineTotalCents: number;
}

interface OrderSummaryPanelProps {
  items: CartItem[];
  subtotalRupees: number;
  isFreeShipping: boolean;
  shippingRupees: number;
  totalRupees: number;
  submitting: boolean;
  submitLabel: string;
}

function OrderSummaryPanel({
  items,
  subtotalRupees,
  isFreeShipping,
  shippingRupees,
  totalRupees,
  submitting,
  submitLabel,
}: OrderSummaryPanelProps) {
  return (
    <div className="bg-[#f3f0ea] p-8 border border-line flex flex-col justify-between self-start">
      <div>
        <h2 className="font-display text-2xl border-b border-line pb-4">Order Summary</h2>

        <ul className="divide-y divide-line my-4 max-h-80 overflow-y-auto" aria-label="Summary Items">
          {items.map((item) => {
              <li key={item.id} className="py-3 flex gap-3 items-center text-xs">
                <div className="relative h-12 w-10 shrink-0 bg-[#0a1628] rounded-[2px] flex items-center justify-center border border-gold/20 overflow-hidden">
                  {item.imageUrl && !item.imageUrl.includes('unsplash.com') ? (
                    <Image src={item.imageUrl} alt={item.productName} fill sizes="40px" className="object-cover" />
                  ) : (
                    <span className="font-display text-xs text-gold">A</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{item.productName}</p>
                  <p className="text-neutral-500">
                    {item.title ? `${item.title} • ` : ''}Qty: {item.quantity}
                  </p>
                </div>
                <p className="font-semibold text-right">₹{lineRupees.toLocaleString('en-IN')}</p>
              </li>
            );
          })}
        </ul>

        <div className="space-y-3 border-t border-line pt-4 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-semibold">₹{subtotalRupees.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-xs text-neutral-600">
            <span>Shipping</span>
            <span>
              {isFreeShipping ? (
                <span className="text-emerald-700 font-semibold">COMPLIMENTARY</span>
              ) : (
                `₹${shippingRupees.toLocaleString('en-IN')}`
              )}
            </span>
          </div>
          <div className="flex justify-between font-display text-2xl border-t border-line pt-4 text-ink">
            <span>Total</span>
            <span>₹{totalRupees.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-line">
        <button
          type="submit"
          disabled={submitting}
          className="button w-full flex items-center justify-center gap-2"
        >
          {submitLabel}
        </button>
      </div>
    </div>
  );
}
