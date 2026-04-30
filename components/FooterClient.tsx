'use client'

import Link from 'next/link';
import { useLanguage } from './LanguageContext';

export default function FooterClient() {
  const { t } = useLanguage();

  return (
    <footer className="mt-32 px-6 md:px-12 py-24 bg-bone text-charcoal border-t border-charcoal/10 relative">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 relative z-20">
        <div className="md:col-span-2">
          <h3 className="font-sans text-xl font-bold tracking-tight mb-6">Studio K</h3>
          <p className="text-sm font-sans text-charcoal/70 leading-relaxed max-w-sm">
            This is a demonstration of the Studio K theme. Inspired by thoughtful and timeless womenswear. <br/><br/>
            kauai.es · consulting.kauai.es
          </p>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-widest font-bold mb-6 font-sans text-charcoal">Directory</h4>
          <ul className="space-y-4 text-sm font-sans text-charcoal/70">
            <li><Link href="/catalogo" className="hover:text-charcoal transition-colors">K shop</Link></li>
            <li><Link href="/catalogo" className="hover:text-charcoal transition-colors">studio</Link></li>
            <li><Link href="/blog" className="hover:text-charcoal transition-colors">editorial</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-widest font-bold mb-6 font-sans text-charcoal">Communicate</h4>
          <ul className="space-y-4 text-sm font-sans text-charcoal/70">
            <li><Link href="/sobre" className="hover:text-charcoal transition-colors">Search</Link></li>
            <li><Link href="/checkout" className="hover:text-charcoal transition-colors">Cart</Link></li>
            <li><Link href="/login" className="hover:text-charcoal transition-colors">{t('nav.login')}</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-[1400px] mx-auto mt-24 pt-8 border-t border-charcoal/10 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs font-sans text-charcoal/40">&copy; 2026 Studio K Theme Demo</p>
      </div>
    </footer>
  );
}
