'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useLanguage } from './LanguageContext';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useCart } from './CartContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuConfig, setMenuConfig] = useState({
    shop: 'K shop',
    lookbook: 'studio',
    gazette: 'editorial'
  });
  const pathname = usePathname();
  const { t } = useLanguage();
  const { cartCount, setIsCartOpen } = useCart();

  useEffect(() => {
    const fetchCms = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'cms', 'homepage'));
        if (docSnap.exists()) {
          const data = docSnap.data();
          setMenuConfig({
            shop: data.menuShopTitle || 'K shop',
            lookbook: data.menuLookbookTitle || 'studio',
            gazette: data.menuGazetteTitle || 'editorial'
          });
        }
      } catch (error) {
        console.error('Error fetching menu config', error);
      }
    };
    fetchCms();
  }, []);

  // Close the menu when the route changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMenuOpen(false);
  }, [pathname]);

  // Prevent scrolling when the menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[1000] glass-panel border-b border-glass-border w-full transition-all duration-300 h-20">
        <div className="absolute top-0 left-0 w-full px-6 md:px-12 py-6 flex justify-between items-center h-20">
          <Link href="/" className="font-sans font-bold text-lg tracking-tight text-charcoal shrink-0 z-[1001]" onClick={() => setIsMenuOpen(false)}>
            Studio K
          </Link>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-8 text-sm font-sans tracking-wide text-charcoal items-center">
            <Link href="/shop" className="hover:opacity-70 transition-colors flex items-center gap-1">{menuConfig.shop}
               <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
               </svg>
            </Link>
            <Link href="/lookbook" className="hover:opacity-70 transition-colors">{menuConfig.lookbook}</Link>
            <Link href="/blog" className="hover:opacity-70 transition-colors">{menuConfig.gazette}</Link>
            <Link href="/sobre" className="hover:opacity-70 transition-colors">are</Link>
            <button onClick={() => setIsCartOpen(true)} className="hover:opacity-70 transition-colors uppercase tracking-widest text-[10px] font-bold flex items-center gap-2">
               Cart <span className="bg-charcoal text-white w-4 h-4 flex items-center justify-center rounded-full text-[9px]">{cartCount}</span>
            </button>
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 z-[1001] relative w-10 h-10 flex flex-col justify-center items-center" 
            aria-label="Menú"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className={`w-8 h-[1px] bg-charcoal transition-all duration-300 absolute ${isMenuOpen ? 'rotate-45' : '-translate-y-2'}`}></div>
            <div className={`w-8 h-[1px] bg-charcoal transition-all duration-300 absolute ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></div>
            <div className={`w-8 h-[1px] bg-charcoal transition-all duration-300 absolute ${isMenuOpen ? '-rotate-45' : 'translate-y-2'}`}></div>
          </button>
        </div>
      </header>

      {/* Mobile Nav Overlay */}
      <div 
        className={`fixed inset-0 glass-panel z-[999] pt-32 px-8 flex flex-col overflow-y-auto transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] md:hidden pb-12 ${
          isMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'
        }`}
      >
        <nav className="flex flex-col gap-8 h-full">
          <div className="flex flex-col gap-8">
            <Link href="/shop" className="text-4xl md:text-5xl font-sans font-medium text-charcoal tracking-tight hover:opacity-70 transition-colors">{menuConfig.shop}</Link>
            <Link href="/lookbook" className="text-4xl md:text-5xl font-sans font-medium text-charcoal tracking-tight hover:opacity-70 transition-colors">{menuConfig.lookbook}</Link>
            <Link href="/blog" className="text-4xl md:text-5xl font-sans font-medium text-charcoal tracking-tight hover:opacity-70 transition-colors">{menuConfig.gazette}</Link>
            <Link href="/sobre" className="text-4xl md:text-5xl font-sans font-medium text-charcoal tracking-tight hover:opacity-70 transition-colors">are</Link>
            <button onClick={() => { setIsCartOpen(true); setIsMenuOpen(false); }} className="text-4xl md:text-5xl font-sans font-medium text-charcoal tracking-tight hover:opacity-70 transition-colors text-left flex items-center gap-4">
              Cart <span className="bg-charcoal text-white text-lg md:text-xl w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full">{cartCount}</span>
            </button>
          </div>
          <div className="mt-auto pt-8">
            <p className="text-sm font-sans tracking-wide text-charcoal/60">
              Studio K Theme
            </p>
          </div>
        </nav>
      </div>
    </>
  );
}
