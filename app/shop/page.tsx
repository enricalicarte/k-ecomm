import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Metadata } from 'next';
import CatalogContent from '@/components/CatalogContent';
import PageRenderer from '@/components/PageRenderer';

export const metadata: Metadata = {
  title: 'Collection 01 | kauai studio',
  description: 'Explore the complete Collection 01 of kauai studio.',
  openGraph: {
    title: 'Collection 01 | kauai studio',
    description: 'Explore the complete Collection 01 of kauai studio.',
  }
};

export const dynamic = 'force-dynamic';

export default async function CatalogoPage() {
  const q = query(collection(db, 'products'), orderBy('name'));
  const qs = await getDocs(q);
  
  const products: any[] = [];
  const uniqueBrands = new Set<string>();
  const uniqueCategories = new Set<string>();

  qs.forEach((doc) => {
    const product = { id: doc.id, ...doc.data() } as any;
    products.push(product);
    if (product.brand) uniqueBrands.add(product.brand);
    if (product.category) uniqueCategories.add(product.category);
    if (product.Familia) uniqueCategories.add(product.Familia);
  });

  const brands = ['All', ...Array.from(uniqueBrands).sort()];
  const categories = ['All', ...Array.from(uniqueCategories).sort()];

  return (
    <main className="bg-bone min-h-screen text-charcoal flex flex-col">
      <div className="pt-32 pb-4 px-6 md:px-12 max-w-[1400px] mx-auto w-full">
         <h1 className="font-sans text-[clamp(4rem,8vw,6rem)] text-charcoal tracking-tighter leading-none max-w-[100vw] break-words">
           All
         </h1>
      </div>
      <CatalogContent 
        initialProducts={products} 
        initialBrands={brands} 
        initialCategories={categories} 
      />
      <PageRenderer pageId="shop" />
    </main>
  );
}
