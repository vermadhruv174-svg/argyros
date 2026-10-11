import React from 'react';
import Link from 'next/link';
import { Sparkles, Hammer, Gift, ArrowUpRight } from 'lucide-react';

export function WhyArgyros() {
  const PROOFS = [
    {
      icon: Sparkles,
      title: '925 Sterling Silver',
      subtitle: '92.5% Fine Silver Purity',
      description: 'Solid silver alloyed strictly for structural longevity. Never brass, base metals, or flash plating that wears thin. Stamped with official 925 fineness marks.',
      href: '/support',
      linkText: 'Understand 925 Purity',
    },
    {
      icon: Hammer,
      title: 'Made by Master Karigars',
      subtitle: 'House of Siddhi Jewellers, Haldwani',
      description: 'Hand-finished at the silversmith bench by generational artisans from the Kumaon foothills. Each curve is filed, balanced, and polished by hand.',
      href: '/heritage',
      linkText: 'Explore Our Heritage',
    },
    {
      icon: Gift,
      title: 'Made to Order & Gift-Ready',
      subtitle: 'Conscious Craft · Luxury Unboxing',
      description: 'We cast and finish pieces specifically for you, preventing dead inventory. Every order arrives in our embossed keepsake box, micro-suede pouch, and polishing cloth.',
      href: '/support',
      linkText: 'The Unboxing Experience',
    },
  ];

  return (
    <section className="bg-[#0a1628] py-16 md:py-20 text-white" aria-label="Why Argyros">
      <div className="shell">
        <div className="text-center max-w-xl mx-auto mb-12">
          <p className="eyebrow text-gold">The Standard</p>
          <h2 className="mt-2 font-display text-3xl md:text-5xl text-white">
            Why Argyros.
          </h2>
          <div className="editorial-rule mx-auto mt-4 bg-gold" />
          <p className="mt-4 text-xs sm:text-sm text-neutral-300 font-light">
            Three principles behind every ring, cuff, hoop and chain leaving our Haldwani atelier.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {PROOFS.map((proof) => {
            const Icon = proof.icon;
            return (
              <div
                key={proof.title}
                className="group relative flex flex-col justify-between border border-white/10 p-8 rounded-[2px] bg-white/5 hover:bg-white/[0.08] hover:border-gold/40 transition-all duration-300"
              >
                <div>
                  <div className="w-12 h-12 rounded-full border border-gold/40 bg-[#0a1628] text-gold flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                    <Icon size={22} className="stroke-[1.5]" />
                  </div>
                  <h3 className="font-display text-2xl text-white">
                    {proof.title}
                  </h3>
                  <p className="text-[10px] uppercase tracking-widest text-gold font-bold mt-1 mb-3">
                    {proof.subtitle}
                  </p>
                  <p className="text-xs leading-relaxed text-neutral-300 font-light">
                    {proof.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-white/10">
                  <Link
                    href={proof.href}
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gold hover:text-white transition-colors"
                  >
                    <span>{proof.linkText}</span>
                    <ArrowUpRight size={14} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
