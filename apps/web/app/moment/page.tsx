'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Sparkles, Copy, Check, MessageSquare, Download, ShieldCheck, Heart } from 'lucide-react';

function MomentContent() {
  const searchParams = useSearchParams();
  const productName = searchParams.get('product') || 'Nova Halo Ring';
  const orderNumber = searchParams.get('order') || 'ARG-2026-LIVE';
  const [copiedCaption, setCopiedCaption] = useState(false);

  const captionText = `Quiet form, made to last. My ${productName} is crafted in solid 925 sterling silver by House of Siddhi Jewellers, Haldwani. #Argyros925 #SculpturalSilver`;

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(captionText);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(
      `Celebrating a silver moment with Argyros: ${captionText}`
    )}`;
    window.open(url, '_blank');
  };

  return (
    <div className="shell max-w-3xl py-12 md:py-20">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-[#FAF8F5] px-3.5 py-1 text-[9px] font-bold tracking-[.22em] text-gold uppercase shadow-sm mb-3">
          <Sparkles size={12} /> Post-Purchase Atelier Experience
        </div>
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-ink">
          Your Argyros Moment.
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-neutral-600 font-light max-w-md mx-auto">
          Every piece has a story. Here is everything you need to document, care for, and remember yours.
        </p>
      </div>

      {/* Shareable Story Card */}
      <div id="story-card" className="relative p-8 sm:p-12 rounded-[2px] bg-gradient-to-br from-[#0a1628] via-[#0e1d32] to-[#07101e] border border-gold/40 text-white shadow-2xl overflow-hidden mb-8">
        <div className="absolute top-0 right-0 p-8 font-display text-8xl text-white/[0.04] select-none pointer-events-none">
          A
        </div>

        <div className="relative z-10 flex items-center justify-between pb-6 border-b border-white/10 text-[9px] uppercase tracking-[.22em] text-gold font-bold">
          <span>Argyros 925 Atelier</span>
          <span>House of Siddhi Jewellers</span>
        </div>

        <div className="relative z-10 my-8 space-y-4">
          <p className="text-xs uppercase tracking-widest text-neutral-400 font-semibold">
            Piece Acquired · {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
          </p>
          <h2 className="font-display text-3xl sm:text-4xl text-white">
            {productName}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed max-w-lg">
            “Quiet form, made to last. Cast in virgin 925 sterling silver and hand-finished at the bench in Haldwani, Uttarakhand.”
          </p>
        </div>

        <div className="relative z-10 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-[10px] text-neutral-400 uppercase tracking-widest">
          <div>Solid 925 Silver · Made to Order</div>
          <div className="text-gold font-bold">@argyros925</div>
        </div>
      </div>

      {/* Actions Row */}
      <div className="p-6 rounded-[2px] bg-white border border-line shadow-sm space-y-4 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-xl text-ink font-semibold">Share Your Story</h3>
            <p className="text-xs text-neutral-500 font-light">
              Tasteful, non-promotional caption suggestions for your personal journal or social feed.
            </p>
          </div>
        </div>

        <div className="p-3 bg-[#FAF8F5] border border-line/80 rounded text-xs text-neutral-700 italic font-serif">
          “{captionText}”
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleCopyCaption}
            className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider bg-ink text-white rounded-[2px] hover:bg-gold transition-colors flex items-center gap-2 shadow-sm"
          >
            {copiedCaption ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            <span>{copiedCaption ? 'Caption Copied!' : 'Copy Caption'}</span>
          </button>
          <button
            type="button"
            onClick={handleWhatsAppShare}
            className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider bg-[#25D366] text-white rounded-[2px] hover:opacity-90 transition-opacity flex items-center gap-2 shadow-sm"
          >
            <MessageSquare size={14} />
            <span>Share on WhatsApp</span>
          </button>
        </div>
      </div>

      {/* Essential Care Reminders */}
      <div className="p-6 sm:p-8 rounded-[2px] bg-[#FAF8F5] border border-line space-y-4">
        <h3 className="font-display text-xl text-ink font-semibold">Lifelong Silver Care Reminders</h3>
        <div className="grid gap-4 sm:grid-cols-2 text-xs text-neutral-600 font-light">
          <div className="p-3.5 bg-white border border-line rounded">
            <strong className="text-ink font-semibold block text-[11px] mb-1">Store Dry & Enclosed:</strong>
            Keep inside your micro-suede travel pouch when not on your body to minimize atmospheric sulfur exposure.
          </div>
          <div className="p-3.5 bg-white border border-line rounded">
            <strong className="text-ink font-semibold block text-[11px] mb-1">Wear After Fragrances:</strong>
            Put your rings and necklaces on after lotions and perfumes have settled.
          </div>
          <div className="p-3.5 bg-white border border-line rounded">
            <strong className="text-ink font-semibold block text-[11px] mb-1">Polish with Cloth:</strong>
            Use your included lint-free polishing cloth in gentle straight strokes to lift patina instantly.
          </div>
          <div className="p-3.5 bg-white border border-line rounded">
            <strong className="text-ink font-semibold block text-[11px] mb-1">Size Guarantee:</strong>
            Eligible unworn pieces include one complimentary size exchange within 15 days of delivery.
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MomentPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="flex-1">
        <Suspense fallback={<div className="shell py-20 text-center">Loading your Argyros moment...</div>}>
          <MomentContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
