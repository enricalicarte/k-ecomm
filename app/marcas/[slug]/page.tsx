import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ slug: string }>;
};

async function getBrandData(slug: string) {
  const q = query(collection(db, 'brands'), where('slug', '==', slug), limit(1));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) return null;
  const doc = querySnapshot.docs[0];
  return { id: doc.id, ...doc.data() } as any;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const brandSlug = resolvedParams.slug.toLowerCase();
  
  const brandData = await getBrandData(brandSlug);

  if (!brandData) return { title: 'Designer not found | kauai archive' };

  return {
    title: `${brandData.name} - Archives | kauai archive`,
    description: `Explore the archive of ${brandData.name}. ${brandData.description.slice(0, 100)}`,
  };
}

async function getBrandProducts(brandName: string) {
  const q = query(collection(db, 'products'), where('brand', '==', brandName));
  const querySnapshot = await getDocs(q);
  const products: any[] = [];
  querySnapshot.forEach((doc) => {
    products.push({ id: doc.id, ...doc.data() });
  });
  return products;
}

export default async function BrandPage({ params }: Props) {
  const resolvedParams = await params;
  const brandSlug = resolvedParams.slug.toLowerCase();
  
  const brandData = await getBrandData(brandSlug);

  if (!brandData) {
    notFound();
  }

  const products = await getBrandProducts(brandData.name);

  return (
    <main className="bg-bone text-charcoal min-h-screen">
      {/* Dynamic Cover Image Banner */}
      {brandData.coverImage && (
        <div className="w-full h-[40vh] min-h-[400px] bg-charcoal relative border-b border-charcoal/20 brutalist-border">
          <Image src={brandData.coverImage} alt={brandData.name} fill className="object-cover grayscale" priority />
          <div className="absolute inset-0 bg-charcoal/50 mix-blend-multiply"></div>
        </div>
      )}

      <section className={`px-6 md:px-12 ${brandData.coverImage ? '-mt-24 relative z-10' : 'py-16'} max-w-6xl mx-auto`}>
        <div className={`mb-12 text-center md:text-left ${brandData.coverImage ? 'text-bone' : ''}`}>
           <Link href="/marcas" className={`text-[10px] uppercase tracking-[0.2em] transition-colors ${brandData.coverImage ? 'text-bone/70 hover:text-bone' : 'text-charcoal/40 hover:text-dusty-rose'}`}>Designers</Link>
           <span className={`text-[10px] mx-4 ${brandData.coverImage ? 'text-bone/30' : 'text-charcoal/20'}`}>/</span>
           <span className={`text-[10px] uppercase tracking-[0.2em] font-bold ${brandData.coverImage ? 'text-bone' : 'text-sage-green'}`}>{brandData.name}</span>
        </div>

        <div className={`flex flex-col md:flex-row gap-12 items-start mt-8 bg-bone p-8 md:p-16 border border-charcoal/20 brutalist-border paper-shadow ${brandData.coverImage ? 'shadow-2xl' : ''}`}>
            <div className="text-center md:text-left w-full">
                <div className="flex flex-wrap gap-4 justify-center md:justify-start mb-8 pb-8 border-b border-charcoal/10">
                    <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-sage-green">{brandData.origin || 'International'}</span>
                </div>
                <h1 className="font-serif text-6xl md:text-8xl font-light text-charcoal mb-8 leading-none tracking-tighter uppercase">{brandData.name}</h1>
                <p className="text-charcoal/80 leading-relaxed text-sm md:text-lg max-w-3xl whitespace-pre-wrap font-mono uppercase tracking-widest">{brandData.description}</p>
            </div>
        </div>
      </section>

      <section className="px-6 md:px-12 py-24 max-w-7xl mx-auto">
        <div className="mb-16 text-center md:text-left border-b border-charcoal/20 pb-8">
            <h2 className="font-serif text-4xl md:text-5xl font-light italic text-charcoal">Archived Garments</h2>
        </div>

        {products.length === 0 ? (
            <p className="text-charcoal/50 text-center py-20 brutalist-border bg-white paper-shadow uppercase tracking-[0.2em] font-mono text-[10px]">Archive currently empty for this designer.</p>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
               {products.map((product) => (
                <Link href={`/${product.slug || product.id}`} key={product.id} className="group flex flex-col items-center cursor-pointer">
                  <div className="w-full aspect-[3/4] bg-white relative overflow-hidden brutalist-border paper-shadow p-2">
                    <div className="w-full h-full relative bg-[#EAE8E4]">
                      {product.image ? (
                         <Image src={product.image} alt={product.name} fill className="object-cover grayscale-[0.2] group-hover:scale-105 transition-transform duration-[1.5s]" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full">
                          <span className="text-charcoal/40 uppercase tracking-[0.5em] text-[10px] font-bold">kauai</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="pt-6 flex flex-col justify-between w-full text-center">
                    <div>
                        {product.category && <span className="text-[8px] font-bold tracking-[0.3em] uppercase text-charcoal/40 mb-2 block">{product.category}</span>}
                        <h3 className="text-sm font-serif italic text-charcoal font-normal mb-2 leading-tight line-clamp-2">{product.name}</h3>
                    </div>
                    <p className="text-charcoal/80 font-mono text-xs tracking-widest pt-2">{Number(product.price).toFixed(2)} €</p>
                  </div>
                </Link>
              ))}
            </div>
        )}
      </section>

      <section className="bg-charcoal text-bone px-6 md:px-12 py-24 text-center border-t border-charcoal/20">
          <p className="font-serif text-3xl font-light italic text-bone mb-12">Continue Exploring</p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
             <Link href="/marcas" className="inline-block px-10 py-5 bg-transparent text-bone border border-bone/20 text-[10px] font-medium tracking-[0.2em] uppercase hover:bg-bone hover:text-charcoal transition-all duration-500 ease-out">
                View All Designers
             </Link>
             <Link href="/catalogo" className="inline-block px-10 py-5 bg-bone text-charcoal text-[10px] font-medium tracking-[0.2em] uppercase hover:bg-sage-green transition-all duration-500 ease-out">
                View Collection 01
             </Link>
          </div>
      </section>
    </main>
  );
}
