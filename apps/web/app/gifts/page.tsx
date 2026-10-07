'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ProductImage } from '@/components/media/product-image';




const OCCASIONS = ['Birthday', 'Anniversary', 'Wedding', 'Graduation', 'Just Because', 'Other'];
const RECIPIENTS = ['Her', 'Him', 'Them', 'Myself'];
const BUDGETS = [
  { label: '₹1,000 – 3,000', min: 1000, max: 3000 },
  { label: '₹3,000 – 6,000', min: 3000, max: 6000 },
  { label: '₹6,000 – 15,000', min: 6000, max: 15000 },
];
const STYLES = ['Minimalist', 'Statement', 'Traditional', 'Contemporary'];

export default function GiftFinderPage() {
  const [occasion, setOccasion] = useState(OCCASIONS[0]);
  const [recipient, setRecipient] = useState(RECIPIENTS[0]);
  const [budgetIdx, setBudgetIdx] = useState(0);
  const [style, setStyle] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResults(null);

    try {
      const budget = BUDGETS[budgetIdx];
      const payload = {
        occasion: occasion.toLowerCase(),
        recipient: recipient.toLowerCase(),
        budgetMinRupees: budget.min,
        budgetMaxRupees: budget.max,
        style: style?.toLowerCase(),
      };

      const res = await fetch(`/api/gifts/find`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error(err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="flex-1 bg-[#f1e8dc] text-[#50463c] min-h-screen pb-20">
        <div className="shell pt-16 md:pt-24 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-display text-5xl md:text-7xl leading-tight text-gold">
              Find the Perfect Gift
            </h1>
            <p className="mt-6 max-w-lg mx-auto text-sm leading-6">
              Tell us about the person and occasion. We&apos;ll find the right piece.
            </p>
          </div>

          <form onSubmit={handleSearch} className="bg-white p-8 md:p-12 shadow-sm border border-[#e4dccf] space-y-10">
            {/* Occasion */}
            <div>
              <label className="block text-xs font-bold tracking-widest uppercase mb-4 text-[#79532f]">Occasion</label>
              <div className="flex flex-wrap gap-3">
                {OCCASIONS.map((o) => (
                  <button
                    key={o}
                    type="button"
                    onClick={() => setOccasion(o)}
                    className={`px-4 py-2 border text-sm transition-colors ${
                      occasion === o ? 'border-gold bg-gold/5 text-gold' : 'border-[#e4dccf] hover:border-[#c8bbae]'
                    }`}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>

            {/* Recipient */}
            <div>
              <label className="block text-xs font-bold tracking-widest uppercase mb-4 text-[#79532f]">For</label>
              <div className="flex flex-wrap gap-3">
                {RECIPIENTS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRecipient(r)}
                    className={`px-4 py-2 border text-sm transition-colors ${
                      recipient === r ? 'border-gold bg-gold/5 text-gold' : 'border-[#e4dccf] hover:border-[#c8bbae]'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget */}
            <div>
              <label className="block text-xs font-bold tracking-widest uppercase mb-4 text-[#79532f]">Budget</label>
              <div className="flex flex-wrap gap-3">
                {BUDGETS.map((b, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setBudgetIdx(idx)}
                    className={`px-4 py-2 border text-sm transition-colors ${
                      budgetIdx === idx ? 'border-gold bg-gold/5 text-gold' : 'border-[#e4dccf] hover:border-[#c8bbae]'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Style */}
            <div>
              <label className="block text-xs font-bold tracking-widest uppercase mb-4 text-[#79532f]">Style (Optional)</label>
              <div className="flex flex-wrap gap-3">
                {STYLES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStyle(style === s ? null : s)}
                    className={`px-4 py-2 border text-sm transition-colors ${
                      style === s ? 'border-gold bg-gold/5 text-gold' : 'border-[#e4dccf] hover:border-[#c8bbae]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-[#e4dccf]">
              <button type="submit" disabled={loading} className="button w-full md:w-auto">
                {loading ? 'Searching our collection...' : 'Find Gifts →'}
              </button>
            </div>
          </form>

          {/* Results Section */}
          {results && (
            <div className="mt-20">
              <h2 className="font-display text-4xl mb-10 text-center">Our Recommendations</h2>
              {results.length > 0 ? (
                <div className="grid gap-8 md:grid-cols-2">
                  {results.map((r, i) => (
                    <div key={i} className="flex gap-6 p-6 bg-white border border-[#e4dccf] rounded-[2px]">
                      <div className="w-1/3 aspect-[3/4] relative shrink-0 overflow-hidden">
                        <ProductImage
                          src={r.imageUrl}
                          alt={r.productName}
                          name={r.productName}
                          aspectRatio="4/5"
                        />
                      </div>
                      <div className="flex flex-col justify-center">
                        <h3 className="font-display text-2xl">{r.productName}</h3>
                        <p className="text-sm mt-3 leading-relaxed text-[#776258] italic">&ldquo;{r.reason}&rdquo;</p>
                        <p className="mt-4 font-medium text-sm tracking-widest">₹{r.priceRupees.toLocaleString('en-IN')}</p>
                        <Link href={`/products/${r.productSlug}`} className="mt-6 text-xs font-bold uppercase tracking-widest border-b border-ink self-start pb-1 hover:text-gold transition-colors">
                          View Product →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-lg italic text-[#776258]">
                  No pieces match your criteria. Try adjusting your budget or style.
                </p>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
