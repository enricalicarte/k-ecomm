'use client';

import Link from 'next/link';
import { useLanguage } from '@/components/LanguageContext';

export default function MarcasClient({ brands }: { brands: any[] }) {
  const { t } = useLanguage();

  return (
    <>
      <section className="px-6 md:px-12 max-w-4xl mx-auto text-center mb-24 border-b border-charcoal/20 pb-16">
        <div className="mb-8">
           <Link href="/" className="text-[10px] text-charcoal/40 uppercase tracking-[0.2em] hover:text-dusty-rose transition-colors">Archive</Link>
           <span className="text-[10px] text-charcoal/40 mx-4">/</span>
           <span className="text-[10px] text-sage-green uppercase tracking-[0.2em] font-bold">{t('nav.designers')}</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-light mb-8 leading-none tracking-tight font-serif uppercase">
          {t('marcas.title')}
        </h1>
        <p className="text-xl text-charcoal/60 font-light leading-relaxed max-w-2xl mx-auto">
          {t('marcas.desc')}
        </p>
      </section>

      <section className="px-6 md:px-12 max-w-3xl mx-auto text-center pt-8 mb-24">
        <p className="text-base text-charcoal/50 leading-relaxed font-light font-mono text-[10px] uppercase tracking-widest">
          {t('marcas.subtitle')}
        </p>
      </section>

      <section className="px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {brands.map((brand) => {
          return (
            <Link 
              key={brand.id} 
              href={`/marcas/${brand.slug}`}
              className="group bg-white border border-charcoal/10 flex flex-col hover:border-charcoal brutalist-border paper-shadow hover:-translate-y-2 transition-all duration-500 ease-out"
            >
              <div className="h-[200px] bg-[#EAE8E4] relative overflow-hidden flex flex-col items-center justify-center p-2"
                   style={brand.coverImage ? { backgroundImage: `url(${brand.coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
                  <div className={`absolute inset-0 ${brand.coverImage ? 'bg-charcoal/60 group-hover:bg-charcoal/40' : 'bg-charcoal/5 group-hover:bg-charcoal/10'} transition-colors duration-500`}></div>
                  <div className="relative z-10 w-full h-full border border-bone/20 flex flex-col items-center justify-center">
                    <span className={`text-[9px] ${brand.coverImage ? 'text-bone/80' : 'text-charcoal/40'} font-bold tracking-[0.3em] uppercase mb-4 block text-center`}>{brand.origin || 'International'}</span>
                    <h2 className={`font-serif text-4xl font-light tracking-tight ${brand.coverImage ? 'text-bone' : 'text-charcoal'}`}>
                        {brand.logoText || brand.name.toUpperCase()}
                    </h2>
                  </div>
              </div>
              
              <div className="p-8 flex-grow flex flex-col justify-between bg-bone">
                <div>
                   <h3 className="font-serif text-2xl border-b border-charcoal/20 pb-4 mb-4 text-charcoal italic">{brand.name}</h3>
                   <p className="text-sm text-charcoal/70 line-clamp-4 leading-relaxed">{brand.description || ''}</p>
                </div>
                <div className="mt-8 pt-6 border-t border-charcoal/10">
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-sage-green group-hover:text-dusty-rose transition-colors duration-300">
                    {t('marcas.explore')}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
        {brands.length === 0 && (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-32 text-charcoal/40 font-mono text-[10px] uppercase tracking-[0.2em] brutalist-border border border-charcoal/10 bg-white paper-shadow">
                {t('marcas.empty')}
            </div>
        )}
      </section>
    </>
  );
}
