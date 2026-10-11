import React from 'react';
import Link from 'next/link';
import { Compass, Flame, Hammer, Sparkles, CheckCircle2 } from 'lucide-react';

const CRAFT_STEPS = [
  {
    step: '01',
    icon: Compass,
    title: 'Sketch & Wax',
    description: 'Initial architectural sketches translated into hand-carved wax prototypes to calibrate hand feel, inner comfort bevels, and metal distribution.',
  },
  {
    step: '02',
    icon: Flame,
    title: 'Vacuum Casting',
    description: 'Virgin 925 sterling silver ingots (92.5% pure silver alloyed with copper) cast in vacuum-assisted chambers to ensure dense, non-porous structure.',
  },
  {
    step: '03',
    icon: Hammer,
    title: 'Bench Finishing',
    description: 'Master karigars at the Haldwani bench file sprues, true ring mandrels, and contour edges with jeweller saws and fine hand needle-files.',
  },
  {
    step: '04',
    icon: Sparkles,
    title: 'Precision Polishing',
    description: 'Multi-grit compound polishing creating razor-sharp mirror bevels contrasted against soft satin faces, avoiding softened edges.',
  },
  {
    step: '05',
    icon: CheckCircle2,
    title: 'Final Inspection',
    description: 'Every piece is verified under high-magnification loupes, checked for weight precision, stamped with 925 authentication, and serial-logged.',
  },
];

export function CraftStory() {
  return (
    <section className="bg-[#FAF8F5] border-y border-line/80 py-16 md:py-24" aria-label="Craft Story">
      <div className="shell">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14">
          <div>
            <p className="eyebrow text-gold">The Goldsmith's Bench</p>
            <h2 className="mt-2 font-display text-3xl md:text-5xl text-ink">
              From Raw Silver to Personal Object.
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 font-light mt-1 max-w-xl">
              Five continuous stages of traditional benchcraft practiced by the House of Siddhi Jewellers in Haldwani.
            </p>
          </div>
          <Link
            href="/bespoke"
            className="text-xs uppercase tracking-wider font-bold text-gold hover:underline shrink-0"
          >
            Commission a Bespoke Piece →
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {CRAFT_STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.step}
                className="relative flex flex-col justify-between p-6 bg-white rounded-[2px] border border-line shadow-sm hover:border-gold/60 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-display text-2xl text-gold font-light">
                      {step.step}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-[#FAF8F5] text-ink flex items-center justify-center border border-line">
                      <Icon size={14} />
                    </div>
                  </div>
                  <h3 className="font-display text-xl text-ink mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-neutral-600 font-light">
                    {step.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-line/40 text-[9px] uppercase tracking-widest text-neutral-500 font-semibold">
                  Haldwani Atelier
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
