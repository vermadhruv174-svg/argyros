import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

const isProd = process.env.APP_ENV === 'production';

export const metadata: Metadata = {
  title: {
    default: 'Argyros | Sculptural 925 Sterling Silver, Made to Order',
    template: '%s | Argyros',
  },
  description: 'Sculptural everyday silver, made to order in 925 sterling. Designed to be worn daily and kept for years.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://argyros.in'),
  openGraph: {
    type: 'website',
    siteName: 'Argyros',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: isProd
    ? { index: true, follow: true }
    : { index: false, follow: false, nocache: true },
};

import { CartProvider } from '@/lib/cart-context';
import { AuthProvider } from '@/lib/auth-context';

import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="bg-paper text-ink font-sans antialiased min-h-screen flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-ink focus:text-paper focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
        >
          Skip to main content
        </a>
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
        <GoogleAnalytics />
      </body>
    </html>
  );
}
