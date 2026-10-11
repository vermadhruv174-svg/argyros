'use client';

import React, { useEffect, useState } from 'react';
import { X, Ruler, HelpCircle } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'ring' | 'wrist';
}

const RING_SIZES = [
  { size: 'IN 10', diameter: '15.7 mm', circ: '49.3 mm' },
  { size: 'IN 11', diameter: '16.1 mm', circ: '50.6 mm' },
  { size: 'IN 12', diameter: '16.5 mm', circ: '51.9 mm' },
  { size: 'IN 13', diameter: '16.9 mm', circ: '53.1 mm' },
  { size: 'IN 14', diameter: '17.3 mm', circ: '54.4 mm' },
  { size: 'IN 15', diameter: '17.7 mm', circ: '55.6 mm' },
  { size: 'IN 16', diameter: '18.1 mm', circ: '56.9 mm' },
  { size: 'IN 17', diameter: '18.5 mm', circ: '58.2 mm' },
  { size: 'IN 18', diameter: '18.9 mm', circ: '59.5 mm' },
];

const WRIST_SIZES = [
  { size: 'Small (S)', wristInches: '5.5" – 6.0"', wristCm: '14.0 – 15.2 cm', fit: 'Snug everyday fit' },
  { size: 'Medium (M)', wristInches: '6.0" – 6.8"', wristCm: '15.2 – 17.3 cm', fit: 'Standard unisex fit' },
  { size: 'Large (L)', wristInches: '6.8" – 7.5"', wristCm: '17.3 – 19.0 cm', fit: 'Relaxed cuff / Kada fit' },
];

export function SizeGuideModal({ isOpen, onClose, defaultTab = 'ring' }: SizeGuideModalProps) {
  const [activeTab, setActiveTab] = useState<'ring' | 'wrist'>(defaultTab);

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="size-guide-title"
    >
      <div className="relative w-full max-w-2xl bg-paper border border-line rounded-[2px] shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-ink hover:text-gold transition-colors"
          aria-label="Close size guide"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-2 text-gold text-[10px] uppercase font-bold tracking-[.2em] mb-2">
          <Ruler size={14} />
          <span>Argyros Sizing Standard</span>
        </div>

        <h2 id="size-guide-title" className="font-display text-3xl sm:text-4xl text-ink">
          Interactive Sizing Guide
        </h2>
        <p className="mt-1 text-xs text-neutral-600 font-light">
          All our pieces are made to order according to authentic Indian bench dimensions.
        </p>

        {/* Tab Switcher */}
        <div className="flex border-b border-line mt-6">
          <button
            onClick={() => setActiveTab('ring')}
            className={`py-3 px-6 text-xs font-bold uppercase tracking-wider transition-colors relative ${
              activeTab === 'ring' ? 'text-ink font-extrabold' : 'text-neutral-500 hover:text-ink'
            }`}
          >
            Indian Ring Sizes (IN 10–18)
            {activeTab === 'ring' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('wrist')}
            className={`py-3 px-6 text-xs font-bold uppercase tracking-wider transition-colors relative ${
              activeTab === 'wrist' ? 'text-ink font-extrabold' : 'text-neutral-500 hover:text-ink'
            }`}
          >
            Wrist & Kada Sizes
            {activeTab === 'wrist' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold" />
            )}
          </button>
        </div>

        {/* Tab Content: Rings */}
        {activeTab === 'ring' && (
          <div className="mt-6 space-y-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-line text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                    <th className="py-2.5 px-3">Indian Size</th>
                    <th className="py-2.5 px-3">Inner Diameter (mm)</th>
                    <th className="py-2.5 px-3">Circumference (mm)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line/60">
                  {RING_SIZES.map((row) => (
                    <tr key={row.size} className="hover:bg-neutral-100/60">
                      <td className="py-2.5 px-3 font-bold text-ink">{row.size}</td>
                      <td className="py-2.5 px-3 text-neutral-700">{row.diameter}</td>
                      <td className="py-2.5 px-3 text-neutral-700">{row.circ}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 rounded bg-[#FAF8F5] border border-line text-xs space-y-3">
              <p className="font-bold text-ink flex items-center gap-1.5">
                <HelpCircle size={14} className="text-gold" /> Two reliable home measuring methods:
              </p>
              <div className="space-y-2 text-neutral-600">
                <p><strong>Method A (Measure a ring you already own):</strong> Place a ring that fits well flat over a millimeter ruler. Measure the inside diameter across the widest central point in millimeters (not including metal borders). Compare with the diameter column above.</p>
                <p><strong>Method B (Paper strip):</strong> Wrap a 5mm paper strip firmly around your knuckle and finger base. Mark the overlap point, measure length in mm (circumference), and match to the table.</p>
              </div>
              <p className="text-[11px] text-neutral-500 italic">
                ✦ When between sizes, order the larger size. For wider bands (like the Equinox Statement Ring), we recommend choosing one size up.
              </p>
            </div>
          </div>
        )}

        {/* Tab Content: Wrist */}
        {activeTab === 'wrist' && (
          <div className="mt-6 space-y-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-line text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                    <th className="py-2.5 px-3">Size</th>
                    <th className="py-2.5 px-3">Wrist Circumference</th>
                    <th className="py-2.5 px-3">Metric</th>
                    <th className="py-2.5 px-3">Fit Profile</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line/60">
                  {WRIST_SIZES.map((row) => (
                    <tr key={row.size} className="hover:bg-neutral-100/60">
                      <td className="py-2.5 px-3 font-bold text-ink">{row.size}</td>
                      <td className="py-2.5 px-3 text-neutral-700">{row.wristInches}</td>
                      <td className="py-2.5 px-3 text-neutral-700">{row.wristCm}</td>
                      <td className="py-2.5 px-3 text-neutral-600">{row.fit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 rounded bg-[#FAF8F5] border border-line text-xs space-y-2">
              <p className="font-bold text-ink flex items-center gap-1.5">
                <HelpCircle size={14} className="text-gold" /> Measuring your wrist:
              </p>
              <p className="text-neutral-600">
                Measure just above your wrist bone with a flexible tape measure. For solid open cuffs (Meridian Cuff), the 28–32mm opening allows comfortable sideways entry. For hinged kadas (Siddhi Heirloom Kada), choose your standard Indian bangle size (2.4, 2.6, or 2.8).
              </p>
            </div>
          </div>
        )}

        {/* Complimentary Exchange Policy & Concierge */}
        <div className="mt-6 pt-4 border-t border-line space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <p className="text-neutral-600">
              ✦ <strong>Size Guarantee:</strong> Not sure about your size? We offer one complimentary size exchange for eligible unworn pieces within 15 days.
            </p>
            <a
              href="https://wa.me/918077587784?text=Hello%20Argyros%2C%20I%20need%20help%20choosing%20my%20ring%2Fwrist%20size"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs uppercase tracking-wider font-bold text-gold hover:underline shrink-0"
            >
              Ask Advisor on WhatsApp →
            </a>
          </div>
          <div className="flex justify-end pt-2">
            <button
              onClick={onClose}
              className="px-6 py-2 text-xs font-bold uppercase tracking-wider bg-ink text-white rounded hover:bg-gold transition-colors"
            >
              Close Guide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
