import React from 'react';
import Image from 'next/image';
import { Sparkles, CircleDot, ShieldCheck } from 'lucide-react';

interface ProductImageProps {
  src?: string | null;
  alt: string;
  name: string;
  category?: string;
  className?: string;
  aspectRatio?: '4/5' | '1/1' | '16/9';
  priority?: boolean;
  showCaption?: boolean;
}

export function ProductImage({
  src,
  alt,
  name,
  category = 'Piece',
  className = '',
  aspectRatio = '4/5',
  priority = false,
  showCaption = false,
}: ProductImageProps) {
  const aspectClass =
    aspectRatio === '4/5'
      ? 'aspect-[4/5]'
      : aspectRatio === '1/1'
      ? 'aspect-square'
      : 'aspect-video';

  if (src && !src.includes('unsplash.com')) {
    return (
      <div className={`relative overflow-hidden bg-[#0a1628]/5 ${aspectClass} ${className}`}>
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </div>
    );
  }

  // Section 6.1 Branded Placeholder: navy glass panel, gold hairline, piece monogram/icon and piece name
  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-b from-[#0a1628] to-[#07101e] border border-gold/25 p-6 flex flex-col items-center justify-center text-center select-none ${aspectClass} ${className}`}
      role="img"
      aria-label={`${name} — Photography in progress`}
    >
      {/* Background radial accent */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(197,160,80,0.12),transparent_70%)] pointer-events-none" />

      {/* Gold hairline frame */}
      <div className="absolute inset-3 border border-gold/20 pointer-events-none" />

      {/* Central Monogram and Icon */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-16 h-16 rounded-full border border-gold/40 bg-[#0a1628]/80 flex items-center justify-center shadow-lg mb-3">
          <span className="font-display text-2xl text-gold font-light tracking-widest">
            A
          </span>
        </div>
        <p className="font-display text-base tracking-wide text-white font-medium max-w-[85%] truncate">
          {name}
        </p>
        <p className="text-[9px] uppercase tracking-[.22em] text-gold/80 mt-1">
          925 Sterling Silver
        </p>
      </div>

      {showCaption && (
        <div className="absolute bottom-5 left-0 right-0 z-10 text-center">
          <span className="text-[10px] tracking-wider text-white/50 uppercase">
            Photography in progress
          </span>
        </div>
      )}
    </div>
  );
}
