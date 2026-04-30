import type {Metadata, Viewport} from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};
import './globals.css';
import { Inter, DM_Serif_Display } from 'next/font/google';
import { Suspense } from 'react';

import Header from '@/components/Header';
import AnalyticsTracker from '@/components/AnalyticsTracker';
import CookieBanner from '@/components/CookieBanner';
import { LanguageProvider } from '@/components/LanguageContext';
import { CartProvider } from '@/components/CartContext';
import CartDrawer from '@/components/CartDrawer';
import FooterClient from '@/components/FooterClient';
import LayoutWrapper from '@/components/LayoutWrapper';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', weight: ['200', '300', '400', '500'] });
const dmSerif = DM_Serif_Display({ weight: ['400'], subsets: ['latin'], variable: '--font-serif', style: ['normal', 'italic'] });

export const metadata: Metadata = {
  title: 'kauai archive',
  description: 'Editorial E-commerce. Curated avant-garde streetwear. Merchandising by kauai consulting.',
  metadataBase: new URL('https://kauai-archive.kauai.es'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    siteName: 'kauai archive',
    title: 'kauai archive',
    description: 'Editorial E-commerce. Curated avant-garde streetwear.',
    url: 'https://kauai-archive.kauai.es',
    locale: 'es_ES',
    type: 'website',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="es" className={`${inter.variable} ${dmSerif.variable} overflow-x-hidden`}>
      <body className="font-sans min-h-screen flex flex-col uppercase-headings text-charcoal selection:bg-charcoal selection:text-bone overflow-x-hidden" suppressHydrationWarning>
        <LanguageProvider>
          <CartProvider>
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[9999] mix-blend-multiply" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
            <Suspense fallback={null}>
              <AnalyticsTracker />
            </Suspense>
            <Header />
            <CartDrawer />
            <CookieBanner />

            <LayoutWrapper>
              {children}
            </LayoutWrapper>

            <FooterClient />
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
