import { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { siteConfig } from '@argyros/config';
import { Ruler, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Ring Size Guide | Argyros',
  description: 'Find your precise Indian ring size with diameter and circumference millimeter measurements.',
};

// Section 9.3:
// inner diameter (mm) = 16.5 + 0.4 × (Indian size − 12)
// inner circumference (mm) = π × diameter
const SIZES = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((size) => {
  const diameter = 16.5 + 0.4 * (size - 12);
  const circumference = Math.PI * diameter;
  return {
    size,
    diameter: diameter.toFixed(1),
    circumference: circumference.toFixed(1),
  };
});

export default function SizeGuidePage() {
  return (
    <>
      <Header />
      <main id="main-content" className="flex-1 shell py-14 md:py-20">
        <div className="max-w-3xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center">
            <p className="eyebrow text-gold mb-3">✦ Precision Sizing</p>
            <h1 className="font-display text-4xl md:text-5xl text-ink">Ring Size Guide</h1>
            <p className="mt-3 text-xs md:text-sm text-neutral-600 leading-relaxed font-light max-w-lg mx-auto">
              We follow the Indian Standard Ring Size scale. Because our rings are hand-finished by master karigars, choosing the right size ensures everyday weightless comfort.
            </p>
          </div>

          {/* Sizing Table */}
          <div className="bg-white border border-line rounded-[2px] overflow-hidden shadow-sm">
            <div className="p-4 bg-[#fdfcf9] border-b border-line flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-ink">
                Indian Standard Sizing Scale
              </span>
              <span className="text-[10px] text-neutral-500 uppercase tracking-widest">
                All measurements in mm
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#f7f5ef] border-b border-line text-[10px] font-bold uppercase tracking-wider text-neutral-700">
                    <th className="p-3.5 pl-6">Indian Size</th>
                    <th className="p-3.5">Inner Diameter (mm)</th>
                    <th className="p-3.5 pr-6">Inner Circumference (mm)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line/60">
                  {SIZES.map((s) => (
                    <tr key={s.size} className="hover:bg-[#fcfbf7] transition-colors">
                      <td className="p-3.5 pl-6 font-bold text-ink">Size {s.size}</td>
                      <td className="p-3.5 text-neutral-600">{s.diameter} mm</td>
                      <td className="p-3.5 pr-6 text-neutral-600">{s.circumference} mm</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* How to Measure & Notes */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 border border-line bg-white rounded space-y-3">
              <h3 className="font-display text-xl text-ink">Method 1: Measure an Existing Ring</h3>
              <p className="text-xs text-neutral-600 leading-relaxed font-light">
                Take a ring that fits the intended finger comfortably. Measure the internal diameter (across the inside edge only) using a millimeter ruler. Match with the diameter column above.
              </p>
            </div>

            <div className="p-6 border border-line bg-white rounded space-y-3">
              <h3 className="font-display text-xl text-ink">Method 2: Paper Strip Measurement</h3>
              <p className="text-xs text-neutral-600 leading-relaxed font-light">
                Wrap a narrow strip of paper snugly around the base of your finger. Mark where the strip overlaps and measure the length in millimeters to find your inner circumference.
              </p>
            </div>
          </div>

          {/* Important Advice & Exchange Policy */}
          <div className="p-6 bg-[#0a1628] text-white rounded-[2px] space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gold">Important Notes on Fit</h4>
            <ul className="text-xs text-white/80 space-y-2 list-disc pl-5 font-light leading-relaxed">
              <li><strong>Wide bands fit tighter:</strong> If you are choosing a wide-band statement piece (like the Equinox Statement Ring), we recommend choosing one size larger.</li>
              <li><strong>Complimentary exchange:</strong> We offer one complimentary size exchange within {siteConfig.fulfilment.sizeExchange.windowDays} days of delivery for unworn rings.</li>
              <li>Fingers swell slightly in warmer weather or in the evening. Measure at room temperature for the most accurate fit.</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
