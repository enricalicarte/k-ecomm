'use client'

import { useLanguage } from '@/components/LanguageContext';
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import MediaRenderer from '@/components/MediaRenderer';
import PageRenderer from '@/components/PageRenderer';

export default function SobreClient() {
  const { t } = useLanguage();
  const [cms, setCms] = useState<any>({
    sobrePageImage1: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80',
  });

  useEffect(() => {
    const fetchCms = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'cms', 'homepage'));
        if (docSnap.exists()) {
          setCms((prev: any) => ({ ...prev, ...docSnap.data() }));
        }
      } catch (error) {
        console.error('Error fetching CMS', error);
      }
    };
    fetchCms();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="pt-32 pb-24 text-charcoal max-w-[1400px] mx-auto px-6 md:px-12 w-full">
        <div className="mb-24 text-left">
          <h1 className="font-sans font-bold text-[10vw] leading-[0.85] tracking-tighter text-charcoal uppercase mb-8 max-w-[100vw] break-words">
            Are Studio K
          </h1>
          <p className="text-xl font-sans max-w-2xl leading-relaxed">
            STUDIO K — HYBRID INTELLIGENCE AGENCY<br/><br/>
            No somos artificiales, somos híbridos. Un estudio de diseño donde la intuición humana dirige y la inteligencia generativa ejecuta. Exploramos la frontera entre el arte visual, el código y el mundo físico.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32 items-start mb-32">
          <div className="w-full aspect-[4/5] relative bg-bone">
             {cms.sobrePageImage1 && (
                <MediaRenderer src={cms.sobrePageImage1} fill className="object-cover" alt="Visión Kauai" />
             )}
          </div>
          <div className="flex flex-col gap-12 pt-12">
              <div>
                <h2 className="text-3xl font-sans tracking-tighter mb-4">Our Vision</h2>
                <p className="text-lg text-charcoal/70 leading-relaxed font-sans">
                   Produced by Studio K. Limited runs, carefully crafted materials. Experience the architectural approach to fashion. 
                </p>
              </div>
          </div>
        </div>
      </div>
      <PageRenderer pageId="sobre" />
    </div>
  );
}
