'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Gift, Sparkles, ArrowRight, Check } from 'lucide-react';

export function InteractiveGiftTeaser() {
  const router = useRouter();
  const [recipient, setRecipient] = useState<string>('her');
  const [occasion, setOccasion] = useState<string>('birthday');
  const [budget, setBudget] = useState<string>('3000-6000');

  const handleLaunchFinder = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/gifts?recipient=${recipient}&occasion=${occasion}&budget=${budget}`);
  };

  return (
    <section className="shell py-16 md:py-24" aria-label="Interactive Gift Finder">
      <div className="rounded-[2px] bg-gradient-to-br from-[#0a1628] via-[#0d1e35] to-[#07101e] border border-gold/30 p-8 md:p-14 text-white shadow-2xl relative overflow-hidden">
        {/* Subtle decorative crest watermark */}
        <div className="absolute -right-12 -bottom-12 font-display text-[200px] text-white/[0.03] select-none pointer-events-none">
          A
        </div>

        <div className="max-w-2xl mb-10">
          <div className="flex items-center gap-2 text-gold text-[10px] font-bold uppercase tracking-[.22em] mb-2">
            <Sparkles size={14} />
            <span>Curated Gifting Flow</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl text-white">
            Find the Perfect Gift in 3 Clicks.
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 font-light mt-1">
            Answer three quick questions to reveal handpicked silver pieces tailored to their presence and your budget.
          </p>
        </div>

        <form onSubmit={handleLaunchFinder} className="space-y-6 max-w-3xl">
          {/* Question 1: Who is it for? */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-[.18em] text-neutral-400 block mb-2.5">
              1. Who are you gifting?
            </label>
            <div className="flex flex-wrap gap-2.5">
              {[
                { id: 'her', label: 'For Her' },
                { id: 'him', label: 'For Him' },
                { id: 'them', label: 'For Anyone' },
                { id: 'self', label: 'Myself' },
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRecipient(r.id)}
                  className={`min-h-[44px] px-5 text-xs font-bold uppercase tracking-wider rounded-[2px] transition-all duration-200 ${
                    recipient === r.id
                       ? 'bg-gold text-white shadow-md scale-[1.02]'
                      : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Question 2: Occasion */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-[.18em] text-neutral-400 block mb-2.5">
              2. What is the occasion?
            </label>
            <div className="flex flex-wrap gap-2.5">
              {[
                { id: 'birthday', label: 'Birthday' },
                { id: 'anniversary', label: 'Anniversary' },
                { id: 'milestone', label: 'Milestone' },
                { id: 'just-because', label: 'Just Because' },
              ].map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => setOccasion(o.id)}
                  className={`min-h-[44px] px-5 text-xs font-bold uppercase tracking-wider rounded-[2px] transition-all duration-200 ${
                    occasion === o.id
                       ? 'bg-gold text-white shadow-md scale-[1.02]'
                      : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          {/* Question 3: Budget */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-[.18em] text-neutral-400 block mb-2.5">
              3. Select your budget range:
            </label>
            <div className="flex flex-wrap gap-2.5">
              {[
                { id: 'under-3000', label: 'Under ₹3,000' },
                { id: '3000-6000', label: '₹3,000 – ₹6,000' },
                { id: 'above-6000', label: '₹6,000+' },
              ].map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setBudget(b.id)}
                  className={`min-h-[44px] px-5 text-xs font-bold uppercase tracking-wider rounded-[2px] transition-all duration-200 ${
                    budget === b.id
                       ? 'bg-gold text-white shadow-md scale-[1.02]'
                      : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 flex flex-col sm:flex-row sm:items-center gap-4">
            <button
              type="submit"
               className="button bg-gold text-white hover:bg-white hover:text-ink px-8 py-3.5 text-xs font-bold uppercase tracking-widest shadow-xl flex items-center justify-center gap-2"
            >
              <Gift size={16} />
              <span>Reveal Curated Gift Matches</span>
              <ArrowRight size={14} />
            </button>
            <Link
              href="/gifts"
              className="text-xs uppercase tracking-wider text-neutral-400 hover:text-gold text-center sm:text-left transition-colors"
            >
              Or open full AI Gift Finder →
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}
