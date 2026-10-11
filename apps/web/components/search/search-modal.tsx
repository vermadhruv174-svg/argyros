'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_SEARCHES = ['Rings', 'Earrings', 'Kada', 'Choker', 'Solid Silver', 'Pahadi'];

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = '';
      setQuery('');
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onClose();
    router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
  };

  const handleSelectQuick = (term: string) => {
    onClose();
    router.push(`/shop?q=${encodeURIComponent(term)}`);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-modal-title"
    >
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-2xl bg-paper border border-line rounded-[2px] shadow-2xl p-6 sm:p-8 animate-in slide-in-from-top-4 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-line">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-gold" />
            <span id="search-modal-title" className="text-[10px] uppercase font-bold tracking-[.2em] text-neutral-600">
              Argyros Search
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-neutral-500 hover:text-ink transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center -mr-2"
            aria-label="Close search overlay"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6">
          <div className="relative flex items-center">
            <Search size={20} className="absolute left-3.5 text-neutral-400 stroke-[1.5]" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search rings, cuffs, kadas, earrings, collars..."
              aria-label="Search catalogue"
              className="w-full bg-white border border-line rounded-[2px] py-3.5 pl-11 pr-24 text-sm text-ink outline-none focus:border-gold shadow-sm"
            />
            <button
              type="submit"
              className="absolute right-2 px-4 py-2 bg-ink text-white text-[10px] uppercase font-bold tracking-wider rounded-[2px] hover:bg-gold transition-colors flex items-center gap-1"
            >
              <span>Search</span>
              <ArrowRight size={12} />
            </button>
          </div>
        </form>

        <div className="mt-6 pt-4 border-t border-line/60">
          <p className="text-[10px] font-bold uppercase tracking-[.18em] text-neutral-500 mb-2.5">
            Popular Searches
          </p>
          <div className="flex flex-wrap gap-2">
            {POPULAR_SEARCHES.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => handleSelectQuick(term)}
                className="px-3 py-1.5 text-xs bg-white border border-line text-neutral-700 hover:border-gold hover:text-gold rounded-[2px] transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
