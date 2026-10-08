'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Search, CheckCircle2, Clock, Truck, Package, ShieldCheck } from 'lucide-react';

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber || !email) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`/api/orders/track?orderNumber=${encodeURIComponent(orderNumber.trim())}&email=${encodeURIComponent(email.trim())}`);
      if (res.ok) {
        const data = await res.json();
        setResult(data);
      } else {
        // Generic error on mismatch as requested by 9.2
        setError('No order found matching this order number and email address. Please verify both and try again.');
      }
    } catch {
      setError('Unable to reach order tracking service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { key: 'CONFIRMED', label: 'Confirmed', desc: 'Order verified and queued for atelier craft.' },
    { key: 'PROCESSING', label: 'In Production', desc: 'Hand-crafted and cast in solid 925 sterling silver.' },
    { key: 'QC', label: 'Quality Check', desc: 'Inspected for purity, weight and mirror finish.' },
    { key: 'SHIPPED', label: 'Dispatched', desc: 'Packed in gift presentation box and shipped insured.' },
    { key: 'DELIVERED', label: 'Delivered', desc: 'Safely delivered to your address.' },
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'PENDING':
      case 'CONFIRMED':
      case 'PAID':
        return 0;
      case 'PROCESSING':
        return 1;
      case 'QC':
        return 2;
      case 'SHIPPED':
        return 3;
      case 'DELIVERED':
        return 4;
      default:
        return 0;
    }
  };

  const currentStep = result ? getStepIndex(result.status) : 0;

  return (
    <>
      <Header />
      <main id="main-content" className="flex-1 shell py-14 md:py-20">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <p className="eyebrow text-gold mb-2">✦ Atelier Tracking</p>
          <h1 className="font-display text-4xl md:text-5xl text-ink">Track Your Order</h1>
          <p className="mt-3 text-xs md:text-sm text-neutral-600 font-light">
            Enter your order reference and the email address used during checkout to view production and transit status.
          </p>
        </div>

        {/* 9.2 Form: order number + email */}
        <div className="max-w-xl mx-auto bg-white border border-line p-8 rounded-[2px] shadow-sm">
          <form onSubmit={handleTrack} className="space-y-4">
            <div>
              <label htmlFor="orderNum" className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                Order Number *
              </label>
              <input
                id="orderNum"
                type="text"
                required
                placeholder="e.g. ARG-2026-ABCD"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className="w-full border border-line p-3 text-xs focus:border-gold focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="trackEmail" className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                Email Address *
              </label>
              <input
                id="trackEmail"
                type="email"
                required
                placeholder="The email provided at checkout"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-line p-3 text-xs focus:border-gold focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="button w-full text-xs font-bold uppercase tracking-widest mt-2"
            >
              {loading ? 'Searching Production Logs...' : 'Track Order Status →'}
            </button>
          </form>

          {error && (
            <p className="mt-6 text-xs text-red-600 bg-red-50 p-4 border border-red-200 rounded font-medium">
              {error}
            </p>
          )}
        </div>

        {/* 9.2 Timeline Display */}
        {result && (
          <div className="max-w-2xl mx-auto mt-12 bg-[#fdfcf9] border border-line p-8 rounded-[2px] space-y-8 animate-in fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-line pb-4 gap-2">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-neutral-500">Order Reference</p>
                <p className="font-mono text-base font-bold text-ink">{result.number}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-widest text-neutral-500">Current Phase</p>
                <p className="font-display text-lg font-bold text-gold uppercase tracking-wider">{result.status}</p>
              </div>
            </div>

            {/* 5-step production timeline */}
            <div className="space-y-6">
              {steps.map((st, idx) => {
                const isCompleted = idx < currentStep;
                const isCurrent = idx === currentStep;

                return (
                  <div key={st.key} className="flex gap-4 items-start">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          isCompleted
                            ? 'bg-emerald-800 text-white'
                            : isCurrent
                            ? 'bg-gold text-white ring-4 ring-gold/20'
                            : 'bg-neutral-200 text-neutral-500'
                        }`}
                      >
                        {isCompleted ? '✓' : idx + 1}
                      </div>
                      {idx < steps.length - 1 && (
                        <div
                          className={`w-0.5 h-12 my-1 ${
                            isCompleted ? 'bg-emerald-800' : 'bg-neutral-200'
                          }`}
                        />
                      )}
                    </div>
                    <div>
                      <h4
                        className={`text-sm font-bold tracking-tight ${
                          isCurrent ? 'text-gold' : isCompleted ? 'text-ink' : 'text-neutral-400'
                        }`}
                      >
                        {st.label}
                      </h4>
                      <p className="text-xs text-neutral-600 mt-0.5 leading-relaxed">
                        {st.desc}
                      </p>
                      {st.key === 'SHIPPED' && (isCurrent || isCompleted) && (result.courier || result.awb) && (
                        <div className="mt-2 text-xs bg-white border border-line p-2 rounded inline-block">
                          <span className="font-semibold text-ink">Courier:</span> {result.courier || 'Insured Express'}{' '}
                          {result.awb && (
                            <>
                              · <span className="font-semibold text-ink">AWB:</span>{' '}
                              {result.trackingUrl ? (
                                <a
                                  href={result.trackingUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-gold underline font-mono"
                                >
                                  {result.awb}
                                </a>
                              ) : (
                                <span className="font-mono text-neutral-700">{result.awb}</span>
                              )}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
