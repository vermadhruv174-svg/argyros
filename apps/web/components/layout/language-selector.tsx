'use client';

import React from 'react';
import { useLanguage } from '@/lib/language-context';
import type { SupportedLanguage } from '@/lib/translations';

interface LanguageSelectorProps {
  className?: string;
  variant?: 'compact' | 'expanded';
}

export function LanguageSelector({ className = '', variant = 'compact' }: LanguageSelectorProps) {
  const { language, setLanguage, options } = useLanguage();

  if (variant === 'expanded') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">
          Language / भाषा:
        </span>
        <div className="inline-flex rounded border border-line bg-white/10 p-0.5">
          {options.map((opt) => (
            <button
              key={opt.code}
              type="button"
              onClick={() => setLanguage(opt.code)}
              className={`px-3 py-1 text-xs font-semibold rounded transition-all cursor-pointer ${
                language === opt.code
                  ? 'bg-ink text-white shadow-sm'
                  : 'text-neutral-600 hover:text-gold'
              }`}
              aria-label={`Switch to ${opt.label}`}
              aria-pressed={language === opt.code}
            >
              <span>{opt.nativeLabel}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center rounded-full border border-line/60 bg-white/40 backdrop-blur-sm px-1 py-0.5 text-[10px] font-bold tracking-widest transition-colors hover:border-gold/60 ${className}`}>
      {options.map((opt, idx) => (
        <React.Fragment key={opt.code}>
          <button
            type="button"
            onClick={() => setLanguage(opt.code)}
            className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
              language === opt.code
                ? 'bg-[#0a1628] text-gold shadow-sm font-extrabold'
                : 'text-neutral-500 hover:text-ink'
            }`}
            aria-label={`Switch language to ${opt.label}`}
            aria-pressed={language === opt.code}
          >
            {opt.flag}
          </button>
          {idx < options.length - 1 && (
            <span className="text-neutral-300 text-[9px] select-none">/</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
