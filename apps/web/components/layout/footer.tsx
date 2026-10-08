import Link from 'next/link';
import { siteConfig } from '@argyros/config';

function InstagramIcon({ size = 18, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ size = 18, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function YoutubeIcon({ size = 18, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <polygon points="10 15 15 12 10 9 10 15" />
    </svg>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-line bg-[#0a1628] text-white">
      {/* 4 columns layout */}
      <div className="shell grid gap-10 py-16 md:grid-cols-4 lg:grid-cols-5">
        {/* Brand Column */}
        <div className="lg:col-span-1">
          <p className="font-display text-4xl tracking-[-.04em] text-white">
            Argyros<span className="text-gold">.</span>
          </p>
          <p className="mt-4 text-xs leading-6 text-white/70">
            Sculptural sterling silver, made to order. A House of Siddhi Jewellers creation.
          </p>
          {/* Social Links (only if set) */}
          <div className="mt-6 flex items-center gap-3">
            {siteConfig.social.instagram && (
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noreferrer"
                className="p-2 text-white/70 hover:text-gold transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon size={18} className="stroke-[1.5]" />
              </a>
            )}
            {siteConfig.social.facebook && (
              <a
                href={siteConfig.social.facebook}
                target="_blank"
                rel="noreferrer"
                className="p-2 text-white/70 hover:text-gold transition-colors"
                aria-label="Facebook"
              >
                <FacebookIcon size={18} className="stroke-[1.5]" />
              </a>
            )}
            {siteConfig.social.youtube && (
              <a
                href={siteConfig.social.youtube}
                target="_blank"
                rel="noreferrer"
                className="p-2 text-white/70 hover:text-gold transition-colors"
                aria-label="YouTube"
              >
                <YoutubeIcon size={18} className="stroke-[1.5]" />
              </a>
            )}
          </div>
        </div>

        {/* Column 1: Shop */}
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-[.18em] text-gold mb-4">Shop</h4>
          <ul className="space-y-2.5 text-xs text-white/80">
            <li><Link href="/shop?category=rings" className="hover:text-gold transition-colors">Rings</Link></li>
            <li><Link href="/shop?category=earrings" className="hover:text-gold transition-colors">Earrings</Link></li>
            <li><Link href="/shop?category=necklaces" className="hover:text-gold transition-colors">Necklaces</Link></li>
            <li><Link href="/shop?category=bracelets" className="hover:text-gold transition-colors">Bracelets & Cuffs</Link></li>
            <li><Link href="/gifts" className="hover:text-gold transition-colors">Gift Finder</Link></li>
          </ul>
        </div>

        {/* Column 2: Atelier */}
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-[.18em] text-gold mb-4">Atelier</h4>
          <ul className="space-y-2.5 text-xs text-white/80">
            <li><Link href="/bespoke" className="hover:text-gold transition-colors text-gold">Bespoke Atelier</Link></li>
            <li><Link href="/heritage" className="hover:text-gold transition-colors">Our Heritage</Link></li>
            <li><Link href="/support#care" className="hover:text-gold transition-colors">Care Guide</Link></li>
            <li><Link href="/size-guide" className="hover:text-gold transition-colors">Size Guide</Link></li>
          </ul>
        </div>

        {/* Column 3: Client Care */}
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-[.18em] text-gold mb-4">Client Care</h4>
          <ul className="space-y-2.5 text-xs text-white/80">
            <li><Link href="/support" className="hover:text-gold transition-colors">FAQ & Support</Link></li>
            <li><Link href="/track" className="hover:text-gold transition-colors">Track Your Order</Link></li>
            <li><Link href="/contact" className="hover:text-gold transition-colors">Contact Us</Link></li>
            <li><Link href="/size-guide" className="hover:text-gold transition-colors">Ring Size Guide</Link></li>
          </ul>
        </div>

        {/* Column 4: Legal & Policies */}
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-[.18em] text-gold mb-4">Legal & Policies</h4>
          <ul className="space-y-2.5 text-xs text-white/80">
            <li><Link href="/shipping-policy" className="hover:text-gold transition-colors">Shipping Policy</Link></li>
            <li><Link href="/returns" className="hover:text-gold transition-colors">Returns & Exchanges</Link></li>
            <li><Link href="/privacy" className="hover:text-gold transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-gold transition-colors">Terms of Service</Link></li>
            <li><Link href="/contact-and-grievance" className="hover:text-gold transition-colors">Grievance & Redressal</Link></li>
          </ul>
        </div>
      </div>

      {/* Base strip */}
      <div className="border-t border-white/10 bg-[#07101e] py-6 text-[10px] text-white/60">
        <div className="shell flex flex-col items-center justify-between gap-3 text-center md:flex-row md:text-left">
          <div>
            © {currentYear} {siteConfig.legal.entityName} · GSTIN {siteConfig.legal.gstin} · {siteConfig.legal.registeredAddress}
          </div>
          <div className="text-gold tracking-widest uppercase font-bold text-[9px]">
            Delivering across India
          </div>
        </div>
      </div>
    </footer>
  );
}
