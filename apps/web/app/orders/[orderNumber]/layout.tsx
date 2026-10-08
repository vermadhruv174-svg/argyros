import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Order Status | Argyros',
  robots: { index: false, follow: false },
};

export default function OrderNumberLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
