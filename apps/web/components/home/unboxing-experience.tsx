import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Package, Gift, Sparkles, Feather, Camera } from 'lucide-react';

export function UnboxingExperience() {
  const CONTENTS = [
    {
      title: 'Embossed Navy Keepsake Box',
      desc: 'Rigid heavyweight presentation box with gold foil Argyros crest, designed to protect fine jewellery for years.',
    },
    {
      title: 'Plush Micro-Suede Travel Pouch',
      desc: 'Soft protective pouch preventing surface friction when packing or storing individual pieces.',
    },
    {
      title: '925 Purity & Authenticity Deed',
      desc: 'Handcrafted certificate verifying solid 925 fineness, workshop batch details, and karigar bench mark.',
    },
    {
      title: 'Lint-Free Silver Polishing Cloth',
      desc: 'Specially treated micro-fibre cloth restoring mirror gleam and lifting natural oxidation effortlessly.',
    },
  ];

  return (
    <section className="shell py-16 md:py-24" aria-label="The Unboxing Experience">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
        {/* Left: Visual Unboxing Mockup */}
        <div className="relative aspect-[4/3] sm:aspect-square bg-[#0a1628] rounded-[2px] border border-gold/30 shadow-2xl overflow-hidden p-8 flex flex-col justify-between text-white group">
          <div className="relative z-10 flex items-center justify-between">
            <div className="liquid-glass-dark rounded-full px-3 py-1 text-[8px] font-bold tracking-[.2em] uppercase text-gold">
              Complimentary on Every Order
            </div>
            <div className="w-10 h-10 rounded-full border border-gold/40 bg-[#0a1628] flex items-center justify-center text-gold">
              <Gift size={18} />
            </div>
          </div>

          <div className="relative z-10 space-y-3 max-w-md my-auto">
            <span className="font-display text-4xl sm:text-5xl text-gold font-light">A</span>
            <h3 className="font-display text-2xl sm:text-3xl text-white">
              The Moment It Arrives.
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
              We believe opening jewellery should feel tactile, personal and memorable. Every order is prepared as if it were a commissioned gift.
            </p>
          </div>

          <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-[10px] uppercase tracking-widest text-neutral-400">
            <span>Rigid Keepsake Box</span>
            <span>·</span>
            <span>Micro-Suede Pouch</span>
            <span>·</span>
            <span>Care Cloth</span>
          </div>

          {/* Background subtle radial texture */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(197,160,80,0.15),transparent_70%)] pointer-events-none" />
          <div className="absolute inset-4 border border-gold/20 pointer-events-none" />
        </div>

        {/* Right: Explanatory Content */}
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-2 text-gold text-[10px] font-bold uppercase tracking-[.22em] mb-1.5">
              <Package size={14} />
              <span>Gift-Ready Architecture</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl text-ink">
              Crafted to Be Given.
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 font-light mt-2 leading-relaxed">
              Whether celebrating a personal milestone or surprising someone dear, an Argyros parcel requires zero additional wrapping.
            </p>
          </div>

          {/* 4 Items in the box */}
          <div className="grid gap-4 sm:grid-cols-2">
            {CONTENTS.map((item, idx) => (
              <div key={idx} className="p-4 rounded-[2px] bg-[#FAF8F5] border border-line space-y-1">
                <p className="font-display text-base text-ink font-semibold">{item.title}</p>
                <p className="text-xs text-neutral-600 font-light leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Personalization Options */}
          <div className="p-4 rounded-[2px] border border-gold/30 bg-gradient-to-r from-[#FAF8F5] via-[#F6F2E9] to-[#FAF8F5] space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink">
              <Feather size={14} className="text-gold" />
              <span>Complimentary Handwritten Gift Note</span>
            </div>
            <p className="text-xs text-neutral-600 font-light">
              Add your personal message at checkout. Our atelier hand-inscribes it onto an embossed heavy-card stock note slipped inside the box sleeve.
            </p>
          </div>

          {/* Social Tagging Callout */}
          <div className="pt-2 flex items-center justify-between text-xs text-neutral-500 font-light">
            <span className="italic font-serif text-sm text-neutral-700">
              “Your piece has a story. If you share it, tag <strong className="font-sans font-bold text-ink">@argyros925</strong>.”
            </span>
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-gold shrink-0">
              <Camera size={14} />
              <span>#ArgyrosSilver</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
