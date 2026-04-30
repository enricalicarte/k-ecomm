'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageContext';
import { useState, useEffect } from 'react';
import { doc, getDoc, collection, query, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Marquee from 'react-fast-marquee';
import MediaRenderer from '@/components/MediaRenderer';

export default function HomeClient() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<any[]>([]);
  const [cms, setCms] = useState({
    heroLogoText: 'STUDIO K',
    heroTitle: 'Archive 01.',
    heroSubtitle: 'A curated selection of avant-garde garments and accessories. Structured form meets brutalist aesthetic.',
    heroVisible: true,
    manifestoSuper: 'STUDIO K — HYBRID INTELLIGENCE AGENCY',
    manifestoTitle: 'Aloha State of Mind. Diseño, Inteligencia Artificial y Buenas Vibras.',
    manifestoDesc: 'No somos artificiales, somos híbridos. Un estudio de diseño donde la intuición humana dirige y la inteligencia generativa ejecuta. Exploramos la frontera entre el arte visual, el código y el mundo físico.',
    manifestoVisible: true,
    storeTitle: 'Exclusive Merchandising',
    storeDesc: 'Produced by Studio K. Limited runs, carefully crafted materials. Experience the architectural approach to fashion.',
    storeSchedule: 'Showroom by request only.',
    storeImage: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&q=80',
    storeVisible: true,
    featuredTitle: 'New Acquisitions',
    featuredSubtitle: 'Current Season',
    featuredVisible: true,
    blogTitle: 'Editorials',
    blogSubtitle: 'Essays on form, function, and aesthetics',
    blogVisible: true,
    ctaVisible: false,
    ctaTitle: 'Request Lookbook',
    ctaDesc: 'A comprehensive archive of Collection 01.',
    ctaBtnText: 'Download PDF',
    ctaBtnLink: '#',
    ctaImage: 'https://images.unsplash.com/photo-1552674605-171ff5fa44ce?w=800&q=80',
    marqueeText: 'STUDIO K — HYBRID INTELLIGENCE AGENCY — ALOHA STATE OF MIND — ',
    marqueeVisible: true,
    splitTitle: 'S/S 2026',
    splitBtnText: 'View Lookbook',
    splitBtnLink: '/lookbook',
    splitImage1: 'https://images.unsplash.com/photo-1550639525-c97d455acf70?q=80&w=1200',
    splitImage2: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1200',
    splitVisible: true,
    collectionTitle: 'S/S 2026',
    collectionMainImage: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1400',
    collectionVisible: true,
  });

  useEffect(() => {
    const fetchCms = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'cms', 'homepage'));
        if (docSnap.exists()) {
          setCms(prev => ({ ...prev, ...docSnap.data() as any }));
        }
      } catch (error) {
        console.error('Error fetching CMS', error);
      }
    };
    const fetchProducts = async () => {
      try {
        const q = query(collection(db, 'products'), limit(6));
        const snapshot = await getDocs(q);
        const prods = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(prods);
      } catch (error) {
        console.error('Error fetching products', error);
      }
    };
    fetchCms();
    fetchProducts();
  }, []);

  const featuredGroup = products.slice(0, 3);
  const collectionGroup = products.slice(3, 6);

  return (
    <>
      {/* Top Section with Large Title */}
      {cms.heroVisible && (
        <section className="relative w-full min-h-[40vh] md:min-h-[70vh] flex flex-col justify-center items-center overflow-hidden py-12 md:py-24">
           <h1 className="font-sans font-bold text-[11vw] md:text-[14vw] leading-[0.85] tracking-tighter text-charcoal uppercase select-none z-0 relative md:ml-[-2vw] text-center max-w-[100vw] break-words px-2">
               {cms.heroLogoText}
           </h1>
           <div className="mt-8 text-center px-6">
             <h2 className="text-3xl md:text-5xl font-mono tracking-tighter uppercase mb-4">{cms.heroTitle}</h2>
             <p className="text-sm md:text-base font-sans max-w-xl mx-auto text-charcoal/80 uppercase tracking-widest">{cms.heroSubtitle}</p>
           </div>
        </section>
      )}

      {/* Manifesto */}
      {cms.manifestoVisible && (
        <section className="px-6 md:px-12 py-24 md:py-32 max-w-[1400px] mx-auto relative z-20 w-full bg-white">
          <div className="flex flex-col items-center text-center">
             <span className="font-mono text-xs uppercase tracking-widest text-charcoal/60 mb-8 font-bold">{cms.manifestoSuper}</span>
             <h2 className="font-sans text-4xl md:text-5xl lg:text-7xl text-charcoal tracking-tighter leading-[1] mb-10 mx-auto max-w-4xl">
               {cms.manifestoTitle}
             </h2>
             <p className="font-sans text-lg md:text-2xl text-charcoal/70 max-w-4xl mx-auto leading-relaxed mb-4">
               {cms.manifestoDesc}
             </p>
          </div>
        </section>
      )}

      {/* Info Module / Showroom */}
      {cms.storeVisible && (
        <section className="px-6 md:px-12 pb-24 md:pb-32 max-w-[1400px] mx-auto w-full flex flex-col md:flex-row gap-16 items-center">
          <div className="w-full md:w-1/2">
             <h2 className="font-sans text-4xl md:text-5xl tracking-tighter text-charcoal mb-6">
                {cms.storeTitle}
             </h2>
             <p className="font-sans text-lg text-charcoal/70 leading-relaxed max-w-md mb-8">
                {cms.storeDesc}
             </p>
             <p className="font-sans text-sm font-medium uppercase tracking-widest text-charcoal">
                {cms.storeSchedule}
             </p>
          </div>
          <div className="w-full md:w-1/2 aspect-[4/3] relative overflow-hidden">
             {cms.storeImage && (
               <MediaRenderer src={cms.storeImage} fill className="object-cover" alt="Showroom" />
             )}
          </div>
        </section>
      )}

      {/* Split Videos / Images Section */}
      {cms.splitVisible && (
        <section className="w-full relative h-[60vh] md:h-[80vh] min-h-[500px] flex overflow-hidden">
           <div className="w-1/2 h-full relative overflow-hidden">
              <MediaRenderer src={cms.splitImage1} fill className="object-cover object-center" alt="Split Left" />
           </div>
           <div className="w-1/2 h-full relative overflow-hidden">
              <MediaRenderer src={cms.splitImage2} fill className="object-cover object-center" alt="Split Right" />
           </div>
           
           <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center select-none pointer-events-none z-10 mix-blend-difference">
              <h2 className="font-sans text-[11vw] md:text-[10vw] leading-none text-white font-medium tracking-tighter mb-4 md:mb-8 text-center drop-shadow-md max-w-[100vw] break-words px-2">
                 {cms.splitTitle}
              </h2>
           </div>
           <div className="absolute inset-0 flex flex-col items-center justify-center p-6 mt-32 md:mt-48 z-20 pointer-events-none">
              <Link href={cms.splitBtnLink} className="pointer-events-auto bg-white text-charcoal px-6 md:px-8 py-3 md:py-4 rounded-full font-sans text-sm md:text-base font-medium hover:bg-black hover:text-white transition-colors shadow-lg uppercase tracking-widest">
                 {cms.splitBtnText}
              </Link>
           </div>
        </section>
      )}

      {/* Prompter / Marquee */}
      {cms.marqueeVisible && (
        <div className="w-full overflow-hidden bg-white py-4 md:py-6 border-b-2 border-black/10">
           <Marquee autoFill speed={50} className="overflow-hidden">
              <span className="font-sans text-3xl md:text-5xl text-charcoal pr-8 tracking-tight whitespace-nowrap">
                 {cms.marqueeText}
              </span>
           </Marquee>
        </div>
      )}

      {/* Asymmetrical Product Grid */}
      {(cms.featuredVisible && featuredGroup.length > 0) && (
        <section className="px-6 md:px-12 pb-32 max-w-[1400px] mx-auto relative z-10 w-full">
        <div className="flex flex-col md:flex-row gap-16 justify-between items-end w-full">
          {featuredGroup[0] && (
            <Link href={`/producto/${featuredGroup[0].slug}`} className="group flex flex-col items-start w-full md:w-1/3">
              <div className="w-full aspect-[2/3] relative overflow-hidden bg-[#f0f0f0] mb-4">
                <Image 
                  src={featuredGroup[0].image || ''}
                  alt={featuredGroup[0].name || ''}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col items-start">
                <h2 className="font-sans text-sm mt-2 text-charcoal font-medium">{featuredGroup[0].name}</h2>
                <span className="text-sm font-sans text-charcoal/70 mt-1">${featuredGroup[0].price} USD</span>
              </div>
            </Link>
          )}
          
          <div className="flex flex-col gap-16 w-full md:w-1/2">
             <div className="flex flex-col gap-4 text-center md:text-left">
               <h2 className="font-sans text-6xl md:text-8xl tracking-tight leading-none">
                   {cms.featuredTitle}
               </h2>
               <p className="text-xl font-sans text-charcoal/60 uppercase tracking-widest">{cms.featuredSubtitle}</p>
             </div>
             
             <div className="flex flex-col md:flex-row gap-16">
                 {featuredGroup[1] && (
                   <Link href={`/producto/${featuredGroup[1].slug}`} className="group flex flex-col items-start w-full md:w-1/2">
                      <div className="w-full aspect-[3/4] relative overflow-hidden bg-[#f0f0f0] mb-4">
                        <Image 
                          src={featuredGroup[1].image || ''}
                          alt={featuredGroup[1].name || ''}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex flex-col items-start">
                        <h2 className="font-sans text-sm mt-2 text-charcoal font-medium">{featuredGroup[1].name}</h2>
                        <span className="text-sm font-sans text-charcoal/70 mt-1">${featuredGroup[1].price} USD</span>
                      </div>
                    </Link>
                 )}

                 {featuredGroup[2] && (
                    <Link href={`/producto/${featuredGroup[2].slug}`} className="group flex flex-col items-start w-full md:w-1/2 mt-0 md:mt-24">
                      <div className="w-full aspect-[3/4] relative overflow-hidden bg-[#f0f0f0] mb-4">
                        <Image 
                          src={featuredGroup[2].image || ''}
                          alt={featuredGroup[2].name || ''}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex flex-col items-start">
                        <h2 className="font-sans text-sm mt-2 text-charcoal font-medium">{featuredGroup[2].name}</h2>
                        <span className="text-sm font-sans text-charcoal/70 mt-1">${featuredGroup[2].price} USD</span>
                      </div>
                    </Link>
                 )}
             </div>
          </div>
        </div>
      </section>
      )}

      {/* S/S Banner */}
      {(cms.collectionVisible && collectionGroup.length > 0) && (
        <section className="px-6 md:px-12 py-24 max-w-[1400px] mx-auto border-t border-charcoal/10 flex flex-col justify-start items-start gap-12">
          <h2 className="font-sans text-6xl md:text-9xl tracking-tighter text-charcoal mb-4">{cms.collectionTitle}</h2>
          
          <div className="w-full flex flex-col md:flex-row gap-8 items-start">
               <div className="w-full md:w-1/2 aspect-[4/5] relative">
                 <Image 
                   src={cms.collectionMainImage || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1400'} 
                   alt={cms.collectionTitle} 
                   fill 
                   className="object-cover" 
                   referrerPolicy="no-referrer" />
               </div>
               
               <div className="w-full md:w-1/2 grid grid-cols-2 gap-8 pl-0 md:pl-12">
                   {collectionGroup[0] && (
                     <Link href={`/producto/${collectionGroup[0].slug}`} className="group flex flex-col items-start">
                        <div className="w-full aspect-[2/3] relative overflow-hidden bg-[#f0f0f0] mb-4">
                          <Image 
                            src={collectionGroup[0].image || ''}
                            alt={collectionGroup[0].name || ''}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="flex flex-col items-start">
                          <h2 className="font-sans text-sm mt-2 text-charcoal font-medium">{collectionGroup[0].name}</h2>
                          <span className="text-sm font-sans text-charcoal/70 mt-1">${collectionGroup[0].price} USD</span>
                        </div>
                      </Link>
                   )}
                    
                   {collectionGroup[1] && (
                     <Link href={`/producto/${collectionGroup[1].slug}`} className="group flex flex-col items-start mt-24">
                        <div className="w-full aspect-[2/3] relative overflow-hidden bg-[#f0f0f0] mb-4">
                          <Image 
                            src={collectionGroup[1].image || ''}
                            alt={collectionGroup[1].name || ''}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="flex flex-col items-start">
                          <h2 className="font-sans text-sm mt-2 text-charcoal font-medium">{collectionGroup[1].name}</h2>
                          <span className="text-sm font-sans text-charcoal/70 mt-1">${collectionGroup[1].price} USD</span>
                        </div>
                      </Link>
                   )}
                    
                   {collectionGroup[2] && (
                     <Link href={`/producto/${collectionGroup[2].slug}`} className="group flex flex-col items-start mt-12">
                        <div className="w-full aspect-square relative overflow-hidden bg-[#f0f0f0] mb-4">
                          <Image 
                            src={collectionGroup[2].image || ''}
                            alt={collectionGroup[2].name || ''}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="flex flex-col items-start">
                          <h2 className="font-sans text-sm mt-2 text-charcoal font-medium">{collectionGroup[2].name}</h2>
                          <span className="text-sm font-sans text-charcoal/70 mt-1">${collectionGroup[2].price} USD</span>
                        </div>
                      </Link>
                   )}
               </div>
          </div>
        </section>
      )}

      {/* Gazette Section */}
      {cms.blogVisible && (
        <section className="px-6 md:px-12 py-32 max-w-[1400px] mx-auto flex flex-col md:flex-row gap-16 justify-between items-start border-t border-charcoal/10">
           <div className="w-full md:w-1/4">
              <h2 className="font-sans text-5xl tracking-tight text-charcoal mb-4">{cms.blogTitle}</h2>
              <p className="text-sm text-charcoal/70 mb-8 w-full md:max-w-[200px] leading-relaxed">{cms.blogSubtitle}</p>
              <Link href="/blog" className="inline-block px-6 py-3 border border-charcoal text-sm uppercase tracking-widest font-bold hover:bg-charcoal hover:text-white transition-colors rounded-full">
                More Gazette
              </Link>
           </div>
           <div className="w-full md:w-3/4 grid grid-cols-1 md:grid-cols-3 gap-8">
               <Link href="/blog/how-we-approach-sustainability" className="group flex flex-col items-start">
                  <div className="w-full aspect-[4/3] relative overflow-hidden mb-4 bg-bone">
                    <Image src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=600" fill alt="Sustainability" className="object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                  </div>
                  <h3 className="text-sm font-sans text-charcoal">How we approach sustainability</h3>
               </Link>
               <Link href="/blog/designing-with-ai-collaboration" className="group flex flex-col items-start mt-0 md:mt-12">
                  <div className="w-full aspect-[4/3] relative overflow-hidden mb-4 bg-bone">
                    <Image src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600" fill alt="Interview" className="object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                  </div>
                  <h3 className="text-sm font-sans text-charcoal">Un nuevo paradigma: Diseño con IA</h3>
               </Link>
               <Link href="/blog/winter-campaign-ai-ethics" className="group flex flex-col items-start">
                  <div className="w-full aspect-[4/3] relative overflow-hidden mb-4 bg-bone">
                    <Image src="https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=600" fill alt="Winter Campaign" className="object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                  </div>
                  <h3 className="text-sm font-sans text-charcoal">La Ética de crear con IA</h3>
               </Link>
           </div>
        </section>
      )}
      
      {cms.ctaVisible && (
        <section className="w-full relative py-32 flex flex-col items-center justify-center text-center overflow-hidden">
           {cms.ctaImage && (
             <div className="absolute inset-0 z-0">
               <MediaRenderer src={cms.ctaImage} fill className="object-cover opacity-60" alt="CTA Background" />
               <div className="absolute inset-0 bg-white/40 mix-blend-overlay"></div>
             </div>
           )}
           <div className="relative z-10 max-w-2xl px-6">
              <h2 className="font-sans text-5xl md:text-7xl tracking-tighter text-charcoal mb-6">{cms.ctaTitle}</h2>
              <p className="font-sans text-lg md:text-xl text-charcoal/80 mb-10">{cms.ctaDesc}</p>
              <Link href={cms.ctaBtnLink} className="inline-block bg-charcoal text-white px-8 py-4 rounded-full font-sans text-sm uppercase tracking-widest font-medium hover:bg-black transition-colors">
                 {cms.ctaBtnText}
              </Link>
           </div>
        </section>
      )}

      {/* Huge Kauai Studio Logo at the bottom like the screenshot */}
      <section className="w-full overflow-hidden flex justify-center items-center py-24 md:py-32 bg-white">
         <h2 className="font-sans font-bold text-[clamp(4rem,22vw,20rem)] leading-[0.8] tracking-tighter text-charcoal uppercase select-none text-center break-words max-w-[100vw] px-4 md:px-8">
             STUDIO K
         </h2>
      </section>
    </>
  );
}
