'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Sparkles, ArrowRight, RotateCcw, Share2, MessageSquare, Check } from 'lucide-react';
import { FOUNDATION_PRODUCTS, getProductSummary } from '@/lib/catalogue-data';
import { ProductCard } from '@/components/catalogue/product-card';

const QUESTIONS = [
  {
    id: 'purpose',
    title: '1. What are you shopping for?',
    subtitle: 'Clarifying the intention behind this silver acquisition.',
    options: [
      { id: 'myself', label: 'Myself', desc: 'A piece to wear and make your own' },
      { id: 'gift', label: 'A gift', desc: 'An intentional present for someone dear' },
      { id: 'milestone', label: 'A milestone', desc: 'Marking a personal or professional achievement' },
      { id: 'everyday', label: 'Something for every day', desc: 'Effortless morning ritual jewelry' },
    ],
  },
  {
    id: 'presence',
    title: '2. What kind of presence do you want?',
    subtitle: 'The visual weight and tactile signature of the piece.',
    options: [
      { id: 'minimal', label: 'Quiet and minimal', desc: 'Subtle light reflection, understated scale' },
      { id: 'sculptural', label: 'Sculptural and distinctive', desc: 'Fluid curves, organic contour geometry' },
      { id: 'architectural', label: 'Bold and architectural', desc: 'Substantial silver heft, sharp bevels' },
      { id: 'heritage', label: 'Heritage-inspired', desc: 'Rooted in ancestral Kumaon motifs and weight' },
    ],
  },
  {
    id: 'category',
    title: '3. What do you wear most?',
    subtitle: 'Your primary silhouette preference.',
    options: [
      { id: 'rings', label: 'Rings', desc: 'Tactile bands, signets, and sculptural halos' },
      { id: 'earrings', label: 'Earrings', desc: 'Luminous hoops and minimal dome studs' },
      { id: 'necklaces', label: 'Necklaces', desc: 'Fluid box chains, snake chains, and chokers' },
      { id: 'bracelets', label: 'Bracelets and cuffs', desc: 'Heavyweight torque cuffs and hinged kadas' },
    ],
  },
  {
    id: 'budget',
    title: '4. What price range feels right?',
    subtitle: 'Curated within pure 925 sterling silver.',
    options: [
      { id: 'under-3000', label: 'Under ₹3,000', desc: 'Accessible luxury essentials' },
      { id: '3000-5000', label: '₹3,000 – ₹5,000', desc: 'Core sculptural foundation pieces' },
      { id: '5000-8000', label: '₹5,000 – ₹8,000', desc: 'Heavyweight bands and torque cuffs' },
      { id: 'above-8000', label: 'Above ₹8,000', desc: 'Master heirloom kadas (over 24g silver)' },
    ],
  },
  {
    id: 'story',
    title: '5. Which story speaks to you?',
    subtitle: 'The conceptual foundation of your piece.',
    options: [
      { id: 'rituals', label: 'Daily rituals', desc: 'Pieces that blend seamlessly with routine' },
      { id: 'mountain', label: 'Mountain heritage', desc: 'Contours of Uttarakhand peaks and ancestral workshops' },
      { id: 'architecture', label: 'Modern architecture', desc: 'Crisp geometry, planar facets, and balance' },
      { id: 'memory', label: 'Gifting and memory', desc: 'Objects kept for decades and passed down' },
    ],
  },
];

export default function DiscoverPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  const handleSelect = (questionId: string, optionId: string) => {
    const nextAnswers = { ...answers, [questionId]: optionId };
    setAnswers(nextAnswers);

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Reached the end
      setCurrentStep(QUESTIONS.length);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentStep(0);
  };

  // Determine recommendations based on answers
  const isFinished = currentStep >= QUESTIONS.length;

  const recommendedCollection = React.useMemo(() => {
    if (answers['presence'] === 'heritage' || answers['story'] === 'mountain') {
      return {
        name: 'The Pahadi Edit',
        slug: 'pahadi-edit',
        reason: 'Rooted in the ridge contours and generational silversmithing of Uttarakhand.',
      };
    }
    if (answers['budget'] === 'under-3000') {
      return {
        name: 'Gifts Under ₹3,000',
        slug: 'gifts-under-3000',
        reason: 'Uncompromised 925 sterling silver essentials crafted with daily wearability in mind.',
      };
    }
    if (answers['presence'] === 'architectural' || answers['budget'] === '5000-8000' || answers['budget'] === 'above-8000') {
      return {
        name: 'Premium Reserve',
        slug: 'premium-reserve',
        reason: 'Substantial silver heft, wide profiles, and heavy bench presence.',
      };
    }
    if (answers['presence'] === 'minimal' || answers['purpose'] === 'everyday') {
      return {
        name: 'Daily Luxe',
        slug: 'daily-luxe',
        reason: 'Lightweight, tactile objects engineered for quiet everyday elegance.',
      };
    }
    return {
      name: 'The First Edition',
      slug: 'the-first-edition',
      reason: 'Our 15 debut sculptural foundation silhouettes.',
    };
  }, [answers]);

  const recommendedProducts = React.useMemo(() => {
    if (!isFinished) return [];

    let pool = [...FOUNDATION_PRODUCTS];

    // Filter or score by category if chosen
    if (answers['category'] === 'rings') {
      pool = pool.filter((p) => p.category === 'Rings');
    } else if (answers['category'] === 'earrings') {
      pool = pool.filter((p) => p.category === 'Earrings');
    } else if (answers['category'] === 'necklaces') {
      pool = pool.filter((p) => p.category === 'Necklaces');
    } else if (answers['category'] === 'bracelets') {
      pool = pool.filter((p) => p.category === 'Bracelets');
    }

    // If pool is small, backfill from other foundation products
    if (pool.length < 3) {
      const rest = FOUNDATION_PRODUCTS.filter((p) => !pool.find((x) => x.id === p.id));
      pool = [...pool, ...rest];
    }

    return pool.slice(0, 3).map((p) => ({
      data: getProductSummary(p),
      full: p,
      suitability: p.story?.feeling || p.description.slice(0, 90) + '...',
    }));
  }, [isFinished, answers]);

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: 'My Argyros Recommendation',
        text: `I discovered my personal Argyros piece: ${recommendedCollection.name}`,
        url,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(
    `Hello! Argyros recommended the "${recommendedCollection.name}" collection for me: https://argyros.in/collections/${recommendedCollection.slug}`
  )}`;

  return (
    <>
      <Header />
      <main id="main-content" className="flex-1 py-12 md:py-20">
        <div className="shell max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-[#FAF8F5] px-3.5 py-1 text-[9px] font-bold tracking-[.22em] text-gold uppercase shadow-sm mb-3">
              <Sparkles size={12} /> Guided Atelier Discovery
            </div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-ink">
              Find the piece that feels like you.
            </h1>
            <p className="mt-3 text-xs sm:text-sm text-neutral-600 font-light max-w-lg mx-auto">
              Five quiet questions to reveal sculptural sterling silver calibrated to your personal presence and daily rituals.
            </p>
          </div>

          {!isFinished ? (
            /* Active Question Card */
            <div className="p-8 sm:p-12 rounded-[2px] bg-white border border-line shadow-lg space-y-8">
              {/* Progress Bar */}
              <div>
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2">
                  <span>Question {currentStep + 1} of {QUESTIONS.length}</span>
                  <span className="text-gold">{Math.round(((currentStep + 1) / QUESTIONS.length) * 100)}% Completed</span>
                </div>
                <div className="h-1 w-full bg-neutral-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gold transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / QUESTIONS.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question Details */}
              <div>
                <h2 className="font-display text-2xl sm:text-3xl text-ink">
                  {QUESTIONS[currentStep].title}
                </h2>
                <p className="text-xs sm:text-sm text-neutral-600 font-light mt-1">
                  {QUESTIONS[currentStep].subtitle}
                </p>
              </div>

              {/* Options Grid */}
              <div className="grid gap-3.5 sm:grid-cols-2">
                {QUESTIONS[currentStep].options.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelect(QUESTIONS[currentStep].id, opt.id)}
                    className="p-5 text-left rounded-[2px] border border-line hover:border-gold/80 hover:bg-[#FAF8F5] transition-all duration-200 group flex flex-col justify-between"
                  >
                    <div>
                      <p className="font-display text-xl text-ink group-hover:text-gold transition-colors font-semibold">
                        {opt.label}
                      </p>
                      <p className="text-xs text-neutral-500 font-light mt-1">
                        {opt.desc}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gold mt-4 inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Select <span>→</span>
                    </span>
                  </button>
                ))}
              </div>

              {/* Back button if past step 0 */}
              {currentStep > 0 && (
                <div className="pt-4 border-t border-line/60 flex justify-start">
                  <button
                    type="button"
                    onClick={() => setCurrentStep((prev) => prev - 1)}
                    className="text-xs uppercase tracking-wider font-bold text-neutral-500 hover:text-ink transition-colors"
                  >
                    ← Previous Question
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Results View */
            <div className="space-y-12">
              {/* Collection Recommendation Card */}
              <div className="p-8 sm:p-12 rounded-[2px] bg-gradient-to-br from-[#0a1628] to-[#16273f] border border-gold/30 text-white shadow-xl space-y-4">
                <div className="flex items-center gap-2 text-gold text-[10px] font-bold uppercase tracking-[.22em]">
                  <Sparkles size={14} /> Recommended Collection
                </div>
                <h2 className="font-display text-3xl sm:text-4xl text-white">
                  {recommendedCollection.name}
                </h2>
                <p className="text-xs sm:text-sm text-neutral-300 font-light max-w-xl leading-relaxed">
                  {recommendedCollection.reason}
                </p>
                <div className="pt-3">
                  <Link
                    href={`/collections/${recommendedCollection.slug}`}
                     className="button bg-gold text-white hover:bg-white hover:text-ink text-xs font-bold uppercase tracking-wider px-6 py-3 inline-flex items-center gap-2 shadow-lg"
                  >
                    <span>Explore Full {recommendedCollection.name}</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>

              {/* Three Recommended Products */}
              <div className="space-y-6">
                <div>
                  <p className="eyebrow text-gold">Three Pieces for You</p>
                  <h3 className="font-display text-2xl sm:text-3xl text-ink mt-1">
                    Why These Suit Your Presence
                  </h3>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                  {recommendedProducts.map(({ data, full, suitability }) => (
                    <div
                      key={data.id}
                      className="p-5 rounded-[2px] bg-white border border-line flex flex-col justify-between shadow-sm hover:border-gold/50 transition-colors"
                    >
                      <div>
                        <ProductCard product={data} />
                        <div className="mt-4 pt-4 border-t border-line/60">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-gold mb-1">
                            Why this may suit you:
                          </p>
                          <p className="text-xs text-neutral-600 font-light leading-relaxed">
                            {suitability}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions: Save/Share, WhatsApp, Start Again */}
              <div className="p-6 rounded-[2px] bg-[#FAF8F5] border border-line flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleShare}
                    className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider bg-white border border-line hover:border-gold rounded-[2px] text-ink flex items-center gap-2 shadow-sm"
                  >
                    {copied ? <Check size={14} className="text-emerald-600" /> : <Share2 size={14} />}
                    <span>{copied ? 'Link Copied!' : 'Save / Share Results'}</span>
                  </button>
                  <a
                    href={whatsappShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider bg-white border border-line hover:border-emerald-600 rounded-[2px] text-ink flex items-center gap-2 shadow-sm"
                  >
                    <MessageSquare size={14} className="text-emerald-600" />
                    <span>WhatsApp Recommendations</span>
                  </a>
                </div>

                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs uppercase tracking-wider font-bold text-neutral-500 hover:text-ink flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw size={14} />
                  <span>Start Again</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
