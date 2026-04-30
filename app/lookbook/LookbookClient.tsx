'use client';

import Link from 'next/link';
import Image from 'next/image';
import PageRenderer from '@/components/PageRenderer';

interface Product {
  id: string;
  name: string;
  price: string;
  slug: string;
  image: string;
}

export default function LookbookClient({ products }: { products: Product[] }) {
  // Let's divide products into a hero product and other products to mimic the layout.
  const heroProduct = products.length > 0 ? products[products.length - 1] : null;
  const otherProducts = products.length > 1 ? products.slice(0, products.length - 1) : [];

  return (
    <div className="flex flex-col min-h-screen">
      <div className="pt-32 pb-24 px-6 md:px-12 max-w-[1400px] mx-auto w-full">
        <h1 className="font-sans text-[clamp(4rem,10vw,8rem)] text-charcoal tracking-tighter leading-none mb-12 max-w-[100vw] break-words shrink-0">
          S/S 2026
        </h1>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
          {/* Left Column - Large Image */}
          <div className="w-full lg:w-1/2 flex flex-col">
            {heroProduct && (
              <Link href={`/producto/${heroProduct.slug || heroProduct.id}`} className="group relative aspect-[3/4] w-full overflow-hidden bg-gray-100 flex-shrink-0">
                 {heroProduct.image && (
                   <Image 
                     src={heroProduct.image} 
                     alt={heroProduct.name} 
                     fill 
                     className="object-cover" 
                     referrerPolicy="no-referrer"
                   />
                 )}
              </Link>
            )}
          </div>

          {/* Right Column - Staggered Smaller Images */}
          <div className="w-full lg:w-1/2 grid grid-cols-2 gap-x-8 gap-y-16 items-start">
             {otherProducts.map((product, index) => {
               // Create a staggered look
               const mt = index % 2 !== 0 ? 'mt-24' : '';
               return (
                 <Link href={`/producto/${product.slug || product.id}`} key={product.id} className={`group flex flex-col ${mt}`}>
                   <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100 mb-4">
                     {product.image && (
                       <Image 
                         src={product.image} 
                         alt={product.name} 
                         fill 
                         className="object-cover" 
                         referrerPolicy="no-referrer"
                       />
                     )}
                   </div>
                   <h3 className="font-sans text-sm text-charcoal">{product.name}</h3>
                   <p className="font-sans text-sm text-charcoal/70">€{product.price} EUR</p>
                 </Link>
               )
             })}
          </div>
        </div>
      </div>
      <PageRenderer pageId="lookbook" />
    </div>
  );
}
