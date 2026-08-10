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

export const metadata: Metadata = {
  title: {
    default: 'Argyros | 925 Sterling Silver',
    template: '%s | Argyros',
  },
  description: 'Timeless 925 sterling silver jewellery, crafted for every story.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://argyros.example'),
  openGraph: {
    type: 'website',
    siteName: 'Argyros',
    locale: 'en_IN',
  },
  robots: {
    index: true,
    follow: true,
  },
};

import { CartProvider } from '@/lib/cart-context';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="bg-paper text-ink font-sans antialiased min-h-screen flex flex-col">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
