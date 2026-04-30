'use client';

import { useLanguage } from '@/components/LanguageContext';

export default function CatalogoHeader({ count }: { count: number }) {
  const { t } = useLanguage();

  return (
    <div className="py-24 md:py-32 px-6 md:px-12 text-center border-b border-charcoal/10 relative">
      <h1 className="font-serif italic text-6xl md:text-8xl font-light mb-6 text-charcoal relative z-10 tracking-tighter">studio</h1>
      <p className="text-charcoal/70 max-w-2xl mx-auto text-sm tracking-wide font-sans relative z-10">
        A curated selection of our latest collection.
      </p>
    </div>
  );
}
