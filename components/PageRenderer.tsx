'use client';

import { useState, useEffect, useRef } from 'react';
import { doc, getDoc, collection, query, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Image from 'next/image';
import Link from 'next/link';
import Marquee from 'react-fast-marquee';
import MediaRenderer from '@/components/MediaRenderer';
import { motion } from 'motion/react';

function AutoCarousel({ carousel, products }: { carousel: any, products: any[] }) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isPaused, setIsPaused] = useState(false);
    const direction = useRef<1 | -1>(1);

    useEffect(() => {
        if (!carousel.autoScroll || isPaused) return;
        let animationFrameId: number;
        
        const loop = () => {
            if (scrollRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
                
                if (scrollLeft + clientWidth >= scrollWidth - 1) {
                    direction.current = -1;
                } else if (scrollLeft <= 0) {
                    direction.current = 1;
                }
                
                scrollRef.current.scrollLeft += (1 * direction.current);
            }
            animationFrameId = requestAnimationFrame(loop);
        };
        
        animationFrameId = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(animationFrameId);
    }, [carousel.autoScroll, isPaused]);

    return (
        <div key={carousel.id} className="w-full py-16 border-b border-gray-100 last:border-b-0"
             onMouseEnter={() => setIsPaused(true)}
             onMouseLeave={() => setIsPaused(false)}
             onTouchStart={() => setIsPaused(true)}
             onTouchEnd={() => setIsPaused(false)}>
            <div className="px-6 md:px-12 max-w-[1400px] mx-auto mb-8">
                <div className="flex justify-between items-end">
                    <h3 className="font-sans text-3xl md:text-4xl tracking-tight text-charcoal">{carousel.title}</h3>
                </div>
            </div>
            {/* TODO: proper products fetching for the carousels would go here... we use 'products' slice for now as proxy */}
            <div 
                ref={scrollRef} 
                className="flex overflow-x-auto gap-6 px-6 md:px-12 pb-8 hide-scrollbar snap-x md:snap-none"
            >
                {products.map((p, index) => {
                    const isLarge = index % 3 === 0;
                    const widthClass = isLarge ? "w-[360px] md:w-[480px]" : "w-[240px] md:w-[320px]";
                    const ratioClass = isLarge ? "aspect-[4/5]" : "aspect-[3/4]";
                    return (
                        <Link key={p.id} href={`/producto/${p.slug || p.id}`} className={`flex-none ${widthClass} group snap-start`}>
                            <div className={`${ratioClass} relative bg-bone mb-4 overflow-hidden`}>
                                {p.images?.[0] && <MediaRenderer src={p.images[0]} fill className="object-cover group-hover:scale-105 transition-transform duration-700" alt={p.name} />}
                            </div>
                            <h4 className="font-sans font-medium text-sm text-charcoal">{p.name}</h4>
                            <p className="font-sans text-sm text-charcoal/60 mt-1">${p.price} USD</p>
                        </Link>
                    )
                })}
            </div>
        </div>
    );
}

function BlogSlider({ props, posts }: { props: any, posts: any[] }) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const scroll = (offset: number) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
        }
    };
    return (
        <section className="w-full bg-bone pt-32 pb-24 px-0">
            <div className="w-full flex flex-col">
                <div className="px-6 md:px-12 max-w-[1400px] mx-auto w-full mb-12 flex justify-between items-end">
                    <div className="flex flex-col">
                        <h2 className="font-sans text-5xl md:text-6xl text-charcoal tracking-tight mb-4">{props.blogTitle}</h2>
                        <p className="font-sans text-xl text-charcoal/80 max-w-xl">{props.blogDesc}</p>
                    </div>
                    <div className="hidden md:flex gap-4">
                        <button onClick={() => scroll(-400)} className="w-16 h-16 flex items-center justify-center text-charcoal hover:opacity-50 transition-opacity">
                            <svg width="48" height="24" viewBox="0 0 48 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M48 12H1M10 3L1 12l9 9"/></svg>
                        </button>
                        <button onClick={() => scroll(400)} className="w-16 h-16 flex items-center justify-center text-charcoal hover:opacity-50 transition-opacity">
                            <svg width="48" height="24" viewBox="0 0 48 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M0 12h47M38 3l9 9-9 9"/></svg>
                        </button>
                    </div>
                </div>
                <div ref={scrollRef} className="flex overflow-x-auto gap-6 px-6 md:px-12 pb-8 hide-scrollbar snap-x md:snap-none">
                    {posts.map(post => (
                        <Link key={post.id} href={`/blog/${post.id}`} className="flex-none w-[300px] md:w-[400px] group snap-start block">
                            <div className="aspect-square relative bg-gray-100 mb-6 overflow-hidden flex items-center justify-center">
                                {post.image ? (
                                    <MediaRenderer src={post.image} fill className="object-cover group-hover:scale-105 transition-transform duration-700" alt={post.title} />
                                ) : (
                                    <div className="w-16 border border-gray-300 aspect-[4/3] rounded flex items-center justify-center opacity-30">
                                        <span className="text-[10px]">img</span>
                                    </div>
                                )}
                            </div>
                            <h4 className="font-sans text-lg text-charcoal pr-8">{post.title}</h4>
                        </Link>
                    ))}
                    {posts.length === 0 && (
                        [1,2,3].map(i => (
                            <div key={i} className="flex-none w-[300px] md:w-[400px] group snap-start block">
                                <div className="aspect-square relative bg-gray-100 mb-6 overflow-hidden flex items-center justify-center">
                                    <div className="w-16 border border-gray-300 aspect-[4/3] rounded flex items-center justify-center opacity-30">
                                        <span className="text-[10px]">img</span>
                                    </div>
                                </div>
                                <h4 className="font-sans text-lg text-charcoal pr-8">Your post&apos;s title</h4>
                            </div>
                        ))
                    )}
                </div>
                <div className="md:hidden flex gap-4 px-6 mt-4">
                    <button onClick={() => scroll(-300)} className="w-12 h-12 flex items-center justify-center text-charcoal hover:opacity-50 transition-opacity">
                        <svg width="32" height="16" viewBox="0 0 48 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M48 12H1M10 3L1 12l9 9"/></svg>
                    </button>
                    <button onClick={() => scroll(300)} className="w-12 h-12 flex items-center justify-center text-charcoal hover:opacity-50 transition-opacity">
                        <svg width="32" height="16" viewBox="0 0 48 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M0 12h47M38 3l9 9-9 9"/></svg>
                    </button>
                </div>
            </div>
        </section>
    );
}

function FeaturedCategory({ props, initialProducts }: { props: any, initialProducts: any[] }) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [products, setProducts] = useState<any[]>(initialProducts);

    useEffect(() => {
        if (!props.sourceCategory) return;
        const fetchCat = async () => {
             const { query, collection, where, limit, getDocs } = await import('firebase/firestore');
             const { db } = await import('@/lib/firebase');
             const q = query(collection(db, 'products'), where('category', '==', props.sourceCategory), limit(8));
             const snap = await getDocs(q);
             if (!snap.empty) {
                 setProducts(snap.docs.map(d => ({id: d.id, ...d.data()})));
             }
        };
        fetchCat();
    }, [props.sourceCategory]);

    const scroll = (offset: number) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
        }
    };
    return (
        <section className="w-full px-6 flex flex-col md:flex-row md:items-center pt-32 pb-20 bg-white gap-12 overflow-hidden mx-auto">
            <div className="md:w-1/3 flex flex-col items-start pl-0 md:pl-12 shrink-0 z-10 w-full mb-8 md:mb-0">
                <h2 className="font-sans text-5xl md:text-6xl text-charcoal tracking-tight mb-6">{props.categoryTitle}</h2>
                <p className="font-sans text-xl text-charcoal/80 mb-6 max-w-md">{props.categoryDesc}</p>
                <Link href={props.categoryBtnLink || '#'} className="inline-block border border-charcoal text-charcoal px-8 py-3 rounded-full font-sans text-base font-medium hover:bg-charcoal hover:text-white transition-colors mb-10">
                    {props.categoryBtnText}
                </Link>
                <div className="flex gap-4">
                    <button onClick={() => scroll(-320)} className="w-16 h-16 flex items-center justify-center text-charcoal hover:opacity-50 transition-opacity">
                        <svg width="48" height="24" viewBox="0 0 48 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M48 12H1M10 3L1 12l9 9"/></svg>
                    </button>
                    <button onClick={() => scroll(320)} className="w-16 h-16 flex items-center justify-center text-charcoal hover:opacity-50 transition-opacity">
                        <svg width="48" height="24" viewBox="0 0 48 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M0 12h47M38 3l9 9-9 9"/></svg>
                    </button>
                </div>
            </div>
            <div ref={scrollRef} className="flex-grow flex overflow-x-auto gap-6 hide-scrollbar snap-x md:snap-none relative pr-6 pb-4">
                {products.map(p => (
                    <Link key={p.id} href={`/producto/${p.slug || p.id}`} className="flex-none w-[260px] md:w-[320px] group snap-start">
                        <div className="aspect-[4/5] relative bg-gray-100 mb-6 overflow-hidden flex items-center justify-center">
                            {p.images?.[0] ? (
                                <MediaRenderer src={p.images[0]} fill className="object-cover group-hover:scale-105 transition-transform duration-700" alt={p.name} />
                            ) : (
                                <div className="w-16 border border-gray-300 aspect-[4/3] rounded flex items-center justify-center opacity-30">
                                    <span className="text-[10px]">backpack</span>
                                </div>
                            )}
                        </div>
                        <h4 className="font-sans font-medium text-lg text-charcoal mb-1">{p.name}</h4>
                    </Link>
                ))}
                {products.length === 0 && (
                    [1,2,3].map(i => (
                        <div key={i} className="flex-none w-[260px] md:w-[320px] group snap-start">
                            <div className="aspect-[4/5] relative bg-gray-100 mb-6 overflow-hidden flex items-center justify-center">
                                <div className="w-16 border border-gray-300 aspect-[4/3] rounded flex items-center justify-center opacity-30">
                                    <span className="text-[10px]">img</span>
                                </div>
                            </div>
                            <h4 className="font-sans font-medium text-lg text-charcoal mb-1">Example Product Title</h4>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}

function LookbookGrid({ props, initialProducts }: { props: any, initialProducts: any[] }) {
    const layoutStyle = props.layoutStyle || 'staggered';
    const [products, setProducts] = useState<any[]>(initialProducts);

    useEffect(() => {
        if (!props.sourceCategory) return;
        const fetchCat = async () => {
             const { query, collection, where, limit, getDocs } = await import('firebase/firestore');
             const { db } = await import('@/lib/firebase');
             const q = query(collection(db, 'products'), where('category', '==', props.sourceCategory), limit(8));
             const snap = await getDocs(q);
             if (!snap.empty) {
                 setProducts(snap.docs.map(d => ({id: d.id, ...d.data()})));
             }
        };
        fetchCat();
    }, [props.sourceCategory]);

    if (layoutStyle === 'editorial') {
        return (
            <section className="w-full flex flex-col bg-white overflow-hidden">
                <div className="pt-32 pb-24 px-6 md:px-12 max-w-[1400px] mx-auto w-full">
                    {props.lookbookTitle && (
                        <h2 className="font-sans text-[clamp(4rem,10vw,8rem)] text-charcoal tracking-tighter leading-none mb-12 max-w-[100vw] break-words shrink-0">
                            {props.lookbookTitle}
                        </h2>
                    )}
                    {props.lookbookSubtitle && (
                        <p className="font-sans text-xl text-charcoal/80 mb-10 max-w-md">
                            {props.lookbookSubtitle}
                        </p>
                    )}
                    <div className="flex flex-col gap-24">
                        {products.map((p, i) => {
                            const isLeft = i % 2 === 0;
                            // Alternate sizes, sometimes very large (w-3/4), sometimes smaller (w-1/2 or 2/5)
                            const widthClass = i % 3 === 0 ? 'md:w-3/4 lg:w-2/3' : 'md:w-1/2';
                            const aspectClass = i % 3 === 0 ? 'aspect-[4/3] md:aspect-[16/9]' : 'aspect-[3/4] md:aspect-square';
                            
                            return (
                                <motion.div 
                                    key={p.id}
                                    initial={{ y: 80, opacity: 0 }}
                                    whileInView={{ y: 0, opacity: 1 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                    className={`w-full flex flex-col ${isLeft ? 'items-start' : 'items-end'}`}
                                >
                                    <Link href={`/producto/${p.slug || p.id}`} className={`group flex flex-col ${widthClass}`}>
                                        <div className={`relative ${aspectClass} w-full overflow-hidden bg-gray-100 mb-6`}>
                                            {p.images?.[0] ? (
                                                <MediaRenderer src={p.images[0]} fill className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" alt={p.name} />
                                            ) : (
                                                <div className="w-full h-full border border-gray-300 flex items-center justify-center opacity-30">
                                                    <span className="text-[10px]">img</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end w-full gap-2">
                                            <h3 className="font-sans text-2xl lg:text-3xl font-medium text-charcoal">{p.name}</h3>
                                            <p className="font-sans text-lg text-charcoal/70">${p.price} USD</p>
                                        </div>
                                    </Link>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </section>
        );
    }

    if (layoutStyle === 'mixed') {
        return (
            <section className="w-full flex flex-col bg-white overflow-hidden">
              <div className="pt-32 pb-24 px-6 md:px-12 max-w-[1400px] mx-auto w-full">
                {props.lookbookTitle && (
                    <h2 className="font-sans text-[clamp(4rem,10vw,8rem)] text-charcoal tracking-tighter leading-none mb-12 max-w-[100vw] break-words shrink-0">
                      {props.lookbookTitle}
                    </h2>
                )}
                {props.lookbookSubtitle && (
                    <p className="font-sans text-xl text-charcoal/80 mb-10 max-w-md">
                        {props.lookbookSubtitle}
                    </p>
                )}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-y-16 md:gap-x-8 md:gap-y-32 items-center">
                    {products.map((p, i) => {
                        // Pattern that repeats every 6 items for maximum variety
                        const patternIndex = i % 6;
                        let colClasses = '';
                        let aspect = '';
                        let sizeLabel = ''; // Just to guide the thought process

                        switch(patternIndex) {
                            case 0:
                                // Large, centered-ish, slightly off to left
                                colClasses = 'md:col-span-8 md:col-start-2';
                                aspect = 'aspect-[4/5]';
                                break;
                            case 1:
                                // Small, right aligned
                                colClasses = 'md:col-span-3 md:col-start-9 md:mt-32';
                                aspect = 'aspect-square md:aspect-[3/4]';
                                break;
                            case 2:
                                // Mini, far left, down
                                colClasses = 'md:col-span-2 md:col-start-2 md:mt-48';
                                aspect = 'aspect-[4/5]';
                                break;
                            case 3:
                                // Medium, right aligned
                                colClasses = 'md:col-span-5 md:col-start-8 md:-mt-24';
                                aspect = 'aspect-[3/4]';
                                break;
                            case 4:
                                // Large, centered
                                colClasses = 'md:col-span-6 md:col-start-4 md:mt-24';
                                aspect = 'aspect-[2/3]';
                                break;
                            case 5:
                                // Wide, full width
                                colClasses = 'md:col-span-12 md:mt-16';
                                aspect = 'aspect-[21/9] md:aspect-[16/6]';
                                break;
                            default:
                                colClasses = 'md:col-span-4';
                                aspect = 'aspect-[3/4]';
                        }
                        return (
                            <motion.div 
                                key={p.id}
                                initial={{ y: 50, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className={`w-full flex flex-col ${colClasses}`}
                            >
                                <Link href={`/producto/${p.slug || p.id}`} className="group flex flex-col w-full">
                                    <div className={`relative ${aspect} w-full overflow-hidden bg-gray-100 mb-6`}>
                                       {p.images?.[0] ? (
                                          <MediaRenderer src={p.images[0]} fill className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" alt={p.name} />
                                       ) : (
                                          <div className="w-full h-full border border-gray-300 flex items-center justify-center opacity-30">
                                              <span className="text-[10px]">img</span>
                                          </div>
                                       )}
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <h3 className="font-sans text-xl font-medium text-charcoal">{p.name}</h3>
                                        <p className="font-sans text-base text-charcoal/70">${p.price} USD</p>
                                    </div>
                                </Link>
                            </motion.div>
                        )
                    })}
                </div>
              </div>
            </section>
        );
    } else if (layoutStyle === 'masonry') {
        return (
            <section className="w-full flex flex-col bg-white">
              <div className="pt-32 pb-24 px-6 md:px-12 max-w-[1400px] mx-auto w-full">
                {props.lookbookTitle && (
                    <h2 className="font-sans text-[clamp(4rem,10vw,8rem)] text-charcoal tracking-tighter leading-none mb-12 max-w-[100vw] break-words shrink-0">
                      {props.lookbookTitle}
                    </h2>
                )}
                {props.lookbookSubtitle && (
                    <p className="font-sans text-xl text-charcoal/80 mb-10 max-w-md">
                        {props.lookbookSubtitle}
                    </p>
                )}
                <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                    {products.map((p, i) => {
                        // Pseudo-random aspects for masonry feel
                        const aspects = ['aspect-[3/4]', 'aspect-[4/5]', 'aspect-square', 'aspect-[4/3]'];
                        const aspect = aspects[i % aspects.length];
                        return (
                            <Link href={`/producto/${p.slug || p.id}`} key={p.id} className="group flex flex-col break-inside-avoid">
                                <div className={`relative ${aspect} w-full overflow-hidden bg-gray-100 mb-4`}>
                                   {p.images?.[0] ? (
                                      <MediaRenderer src={p.images[0]} fill className="object-cover group-hover:scale-105 transition-transform duration-700" alt={p.name} />
                                   ) : (
                                      <div className="w-full h-full border border-gray-300 flex items-center justify-center opacity-30">
                                          <span className="text-[10px]">img</span>
                                      </div>
                                   )}
                                </div>
                                <h3 className="font-sans text-lg font-medium text-charcoal">{p.name}</h3>
                                <p className="font-sans text-sm text-charcoal/70">${p.price} USD</p>
                            </Link>
                        )
                    })}
                </div>
              </div>
            </section>
        );
    }

    // Default: 'staggered'
    const heroProduct = products.length > 0 ? products[products.length - 1] : null;
    const otherProducts = products.length > 1 ? products.slice(0, products.length - 1) : [];

    return (
        <section className="w-full flex flex-col bg-white">
          <div className="pt-32 pb-24 px-6 md:px-12 max-w-[1400px] mx-auto w-full">
            {props.lookbookTitle && (
                <h2 className="font-sans text-[clamp(4rem,10vw,8rem)] text-charcoal tracking-tighter leading-none mb-12 max-w-[100vw] break-words shrink-0">
                  {props.lookbookTitle}
                </h2>
            )}
            {props.lookbookSubtitle && (
                <p className="font-sans text-xl text-charcoal/80 mb-10 max-w-md">
                    {props.lookbookSubtitle}
                </p>
            )}

            <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
              {/* Left Column - Large Image */}
              <div className="w-full lg:w-1/2 flex flex-col">
                {heroProduct && (
                  <Link href={`/producto/${heroProduct.slug || heroProduct.id}`} className="group relative aspect-[3/4] w-full overflow-hidden bg-gray-100 flex-shrink-0">
                     {heroProduct.images?.[0] ? (
                         <MediaRenderer src={heroProduct.images[0]} fill className="object-cover group-hover:scale-105 transition-transform duration-700" alt={heroProduct.name} />
                     ) : (
                        <div className="w-full h-full border border-gray-300 flex items-center justify-center opacity-30">
                            <span className="text-[10px]">img</span>
                        </div>
                     )}
                  </Link>
                )}
              </div>

              {/* Right Column - Staggered Smaller Images */}
              <div className="w-full lg:w-1/2 grid grid-cols-2 gap-x-8 gap-y-16 items-start">
                 {otherProducts.map((product, index) => {
                   const mt = index % 2 !== 0 ? 'mt-24' : '';
                   return (
                     <Link href={`/producto/${product.slug || product.id}`} key={product.id} className={`group flex flex-col ${mt}`}>
                       <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100 mb-4">
                         {product.images?.[0] ? (
                            <MediaRenderer src={product.images[0]} fill className="object-cover group-hover:scale-105 transition-transform duration-700" alt={product.name} />
                         ) : (
                            <div className="w-full h-full border border-gray-300 flex items-center justify-center opacity-30">
                                <span className="text-[10px]">img</span>
                            </div>
                         )}
                       </div>
                       <h3 className="font-sans text-sm text-charcoal">{product.name}</h3>
                       <p className="font-sans text-sm text-charcoal/70">${product.price} USD</p>
                     </Link>
                   )
                 })}
              </div>
            </div>
          </div>
        </section>
    );
}

export default function PageRenderer({ pageId }: { pageId: string }) {
    const [layouts, setLayouts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Some modules need side effects like products or carousels
    const [products, setProducts] = useState<any[]>([]);
    const [carousels, setCarousels] = useState<any[]>([]);
    const [posts, setPosts] = useState<any[]>([]);

    useEffect(() => {
        let isM = true;
        
        const load = async () => {
            try {
                const docSnap = await getDoc(doc(db, 'page_layouts', pageId));
                if (docSnap.exists() && isM) {
                    setLayouts(docSnap.data().modules || []);
                } else if (pageId === 'home' && isM) {
                    // fallback to old cms if possible or empty
                    const oldCms = await getDoc(doc(db, 'cms', 'homepage'));
                    if (oldCms.exists()) {
                        const cms = oldCms.data();
                        setLayouts([
                            { type: 'hero', props: { heroLogoText: cms.heroLogoText, heroTitle: cms.heroTitle, heroSubtitle: cms.heroSubtitle } },
                            { type: 'manifesto', props: { manifestoSuper: cms.manifestoSuper, manifestoTitle: cms.manifestoTitle, manifestoDesc: cms.manifestoDesc } },
                            { type: 'carousels', props: {} }
                        ]);
                    }
                }
            } catch(e){}
            if(isM) setLoading(false);
        };
        
        const loadExtras = async () => {
            try {
                const q = query(collection(db, 'products'), limit(6));
                const snap = await getDocs(q);
                if(isM) setProducts(snap.docs.map(d => ({id: d.id, ...d.data()})));
                
                const cSnap = await getDocs(collection(db, 'carousels'));
                const allCarousels = cSnap.docs.map(d => ({id: d.id, ...d.data()})).sort((a:any,b:any) => a.order - b.order);
                if(isM) setCarousels(allCarousels);

                const postsSnap = await getDocs(query(collection(db, 'posts'), limit(6)));
                if(isM) setPosts(postsSnap.docs.map(d => ({id: d.id, ...d.data()})));
            } catch(e){}
        };
        
        load();
        loadExtras();
        
        return () => { isM = false; };
    }, [pageId]);

    if (loading) return null; // No loader to prevent layout shifts
    
    const pageCarousels = carousels.filter(c => c.placement === pageId);

    return (
        <div className="flex flex-col w-full">
            {layouts.map((mod, i) => {
                const { type, props, id } = mod;
                const key = id || i;
                
                switch(type) {
                    case 'hero':
                        return (
                            <section key={key} className="relative w-full min-h-[40vh] md:min-h-[70vh] flex flex-col justify-center items-center overflow-hidden py-8 md:py-24">
                              {props.heroLogoText && (
                                <h1 className="font-sans font-bold text-[11vw] md:text-[14vw] leading-[0.85] tracking-tighter text-charcoal uppercase select-none z-0 relative md:ml-[-2vw] text-center max-w-[100vw] break-words px-2">
                                  {props.heroLogoText}
                                </h1>
                              )}
                              <div className="mt-8 text-center px-6">
                                <h2 className="text-3xl md:text-5xl font-mono tracking-tighter uppercase mb-4">{props.heroTitle}</h2>
                                <p className="text-sm md:text-base font-sans max-w-xl mx-auto text-charcoal/80 uppercase tracking-widest">{props.heroSubtitle}</p>
                              </div>
                            </section>
                        );
                    case 'manifesto':
                        return (
                            <section key={key} className="px-6 md:px-12 pt-32 pb-20 md:pt-40 md:pb-32 max-w-[1400px] mx-auto w-full bg-white text-center">
                               {props.manifestoSuper && <span className="block font-mono text-xs uppercase tracking-widest text-charcoal/60 mb-8 font-bold">{props.manifestoSuper}</span>}
                               <h2 className="font-sans text-4xl md:text-5xl lg:text-7xl text-charcoal tracking-tighter leading-[1] mb-10 mx-auto max-w-4xl">
                                 {props.manifestoTitle}
                               </h2>
                               <p className="font-sans text-lg md:text-2xl text-charcoal/70 max-w-4xl mx-auto leading-relaxed mb-4">
                                 {props.manifestoDesc}
                               </p>
                            </section>
                        );
                    case 'showroom':
                        return (
                            <section key={key} className="px-6 md:px-12 pt-32 pb-20 md:pt-40 md:pb-32 bg-white max-w-[1400px] mx-auto w-full flex flex-col md:flex-row gap-16 items-center">
                              <div className="w-full md:w-1/2">
                                 <h2 className="font-sans text-4xl md:text-5xl tracking-tighter text-charcoal mb-6">{props.storeTitle}</h2>
                                 <p className="font-sans text-lg text-charcoal/70 leading-relaxed max-w-md mb-8">{props.storeDesc}</p>
                                 <p className="font-sans text-sm font-medium uppercase tracking-widest text-charcoal">{props.storeSchedule}</p>
                              </div>
                              <div className="w-full md:w-1/2 aspect-[4/3] relative overflow-hidden bg-gray-100">
                                 {props.storeImage && <MediaRenderer src={props.storeImage} fill className="object-cover" alt="Showroom" />}
                              </div>
                            </section>
                        );
                    case 'split':
                        return (
                            <section key={key} className="w-full relative h-[60vh] md:h-[80vh] min-h-[500px] flex overflow-hidden">
                               <div className="w-1/2 h-full relative overflow-hidden bg-gray-100">
                                  {props.splitImage1 && <MediaRenderer src={props.splitImage1} fill className="object-cover object-center" alt="Split Left" />}
                               </div>
                               <div className="w-1/2 h-full relative overflow-hidden bg-gray-200">
                                  {props.splitImage2 && <MediaRenderer src={props.splitImage2} fill className="object-cover object-center" alt="Split Right" />}
                               </div>
                               <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">
                                  <h2 className="font-sans font-bold text-[8vw] md:text-[10vw] text-white tracking-tighter mix-blend-difference mb-8 uppercase leading-none">{props.splitTitle}</h2>
                                  <Link href={props.splitBtnLink || '#'} className="pointer-events-auto bg-white text-charcoal px-8 py-4 rounded-full font-sans text-sm uppercase tracking-widest font-medium hover:bg-charcoal hover:text-white transition-colors">{props.splitBtnText}</Link>
                               </div>
                            </section>
                        );
                    case 'marquee':
                        const marqueeSpeed = parseInt(props.marqueeSpeed, 10) || 40;
                        const marqueeSizeClass = props.marqueeSize === 'vw-huge' ? 'text-[12vw] tracking-tighter' : (props.marqueeSize || 'font-mono text-sm uppercase tracking-[0.2em]');

                        return (
                            <section key={key} className="w-full border-t border-b border-charcoal/10 py-4 overflow-hidden bg-bone">
                               <Marquee speed={marqueeSpeed} gradient={false} className="overflow-hidden">
                                 <span className={`${marqueeSizeClass} px-8 whitespace-nowrap`}>{props.marqueeText}</span>
                                 <span className={`${marqueeSizeClass} px-8 whitespace-nowrap`}>{props.marqueeText}</span>
                                 <span className={`${marqueeSizeClass} px-8 whitespace-nowrap text-transparent`} style={{ WebkitTextStroke: '2px currentColor'}}>{props.marqueeText}</span>
                               </Marquee>
                            </section>
                        );
                    case 'huge_logo':
                        return (
                            <section key={key} className="w-full overflow-hidden flex justify-center items-center py-24 md:py-32 bg-white">
                  <h2 className="font-sans font-bold text-[clamp(4rem,22vw,20rem)] leading-[0.8] tracking-tighter text-charcoal uppercase select-none text-center break-words max-w-[100vw] px-4 md:px-8">STUDIO K</h2>
                            </section>
                        );
                    case 'cta':
                        return (
                            <section key={key} className="w-full relative py-32 flex flex-col items-center justify-center text-center overflow-hidden bg-gray-100">
                               {props.ctaImage && (
                                 <div className="absolute inset-0 z-0">
                                   <MediaRenderer src={props.ctaImage} fill className="object-cover opacity-60" alt="CTA Background" />
                                   <div className="absolute inset-0 bg-white/40 mix-blend-overlay"></div>
                                 </div>
                               )}
                               <div className="relative z-10 max-w-2xl px-6">
                                  <h2 className="font-sans text-5xl md:text-7xl tracking-tighter text-charcoal mb-6">{props.ctaTitle}</h2>
                                  <p className="font-sans text-lg md:text-xl text-charcoal/80 mb-10">{props.ctaDesc}</p>
                                  <Link href={props.ctaBtnLink || '#'} className="inline-block bg-charcoal text-white px-8 py-4 rounded-full font-sans text-sm uppercase tracking-widest font-medium hover:bg-black transition-colors">
                                     {props.ctaBtnText}
                                  </Link>
                               </div>
                            </section>
                        );
                    case 'collection':
                        return (
                            <section key={key} className="w-full px-6 md:px-12 pt-32 pb-24 md:pt-40 md:pb-32 max-w-[1400px] mx-auto flex flex-col md:flex-row gap-8 md:gap-16 items-start">
                                <div className="w-full md:w-1/2 aspect-[3/4] relative">
                                  {props.collectionMainImage && <MediaRenderer src={props.collectionMainImage} fill className="object-cover" alt="Collection Main" />}
                                </div>
                                <div className="w-full md:w-1/2 flex flex-col">
                                   <h2 className="font-sans text-4xl md:text-6xl tracking-tighter text-charcoal mb-12">{props.collectionTitle}</h2>
                                   <div className="flex flex-col gap-12">
                                       {products.slice(0,3).map(p => (
                                          <Link key={p.id} href={`/producto/${p.slug || p.id}`} className="group flex gap-6 items-center">
                                            <div className="w-24 h-32 relative bg-bone shrink-0">
                                              {p.images?.[0] && <MediaRenderer src={p.images[0]} fill className="object-cover group-hover:scale-105 transition-transform" alt={p.name} />}
                                            </div>
                                            <div className="flex flex-col">
                                              <span className="font-sans text-lg font-medium text-charcoal">{p.name}</span>
                                              <span className="font-sans text-charcoal/60 mt-1">${p.price} USD</span>
                                            </div>
                                          </Link>
                                       ))}
                                   </div>
                                </div>
                            </section>
                        );
                    case 'carousels':
                        return (
                            <section key={key} className="w-full flex flex-col bg-white">
                                {pageCarousels.map((carousel: any) => (
                                    <AutoCarousel key={carousel.id} carousel={carousel} products={products} />
                                ))}
                            </section>
                        );
                    case 'newsletter':
                        return (
                            <section key={key} className="px-6 md:px-12 py-24 md:py-32 max-w-[1400px] mx-auto w-full bg-bone text-left flex flex-col items-start rounded-xl my-12">
                                <h2 className="font-sans text-4xl md:text-5xl text-charcoal tracking-tight leading-tight mb-6 max-w-2xl">
                                    {props.newsletterTitle}
                                </h2>
                                <p className="font-sans text-lg md:text-xl text-charcoal/80 max-w-xl mb-10">
                                    {props.newsletterDesc}
                                </p>
                                <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row w-full max-w-lg gap-4">
                                    <input 
                                        type="email" 
                                        placeholder="email@ejemplo.com" 
                                        className="flex-grow px-6 py-4 bg-transparent border border-charcoal/30 rounded-full font-sans text-charcoal focus:outline-none focus:border-charcoal placeholder:text-charcoal/50" 
                                        required 
                                    />
                                    <button type="submit" className="bg-black text-white px-8 py-4 rounded-full font-sans font-medium text-lg hover:bg-black/80 transition-colors">
                                        {props.newsletterBtnText}
                                    </button>
                                </form>
                            </section>
                        );
                    case 'our_story':
                        return (
                            <section key={key} className="px-6 md:px-12 flex flex-col items-start my-16 max-w-[1400px] mx-auto w-full">
                                <div className="w-full aspect-[21/9] md:aspect-[3/1] bg-gray-100 flex items-center justify-center relative overflow-hidden mb-12 rounded-lg">
                                    {props.storyImage ? (
                                        <MediaRenderer src={props.storyImage} fill className="object-cover" alt={props.storyTitle} />
                                    ) : (
                                        <div className="w-24 border border-gray-300 aspect-[4/3] rounded flex items-center justify-center opacity-30">
                                            <span className="text-xs">img</span>
                                        </div>
                                    )}
                                </div>
                                <h2 className="font-sans text-4xl md:text-5xl text-charcoal tracking-tight mb-4">
                                    {props.storyTitle}
                                </h2>
                                <p className="font-sans text-xl md:text-2xl text-charcoal/80">
                                    {props.storyDesc}
                                </p>
                            </section>
                        );
                    case 'blog_slider':
                        return <BlogSlider key={key} props={props} posts={posts} />;
                    case 'featured_category':
                        return <FeaturedCategory key={key} props={props} initialProducts={products} />;
                    case 'lookbook_grid':
                        return <LookbookGrid key={key} props={props} initialProducts={products} />;
                    default: return null;
                }
            })}
        </div>
    );
}
