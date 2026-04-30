'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { useLanguage } from './LanguageContext';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number | string;
  category: string;
  Familia?: string;
  slug?: string;
  image?: string;
  images?: string[];
}

interface CatalogContentProps {
  initialProducts: Product[];
  initialBrands: string[];
  initialCategories: string[];
}

export default function CatalogContent({ initialProducts, initialBrands, initialCategories }: CatalogContentProps) {
  const { t } = useLanguage();
  const [products] = useState<Product[]>(initialProducts);
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [maxPrice, setMaxPrice] = useState(150);

  const filteredProducts = products.filter((p) => {
    const pCategory = p.category || p.Familia || '';
    if (selectedBrand !== 'All' && p.brand !== selectedBrand) return false;
    if (selectedCategory !== 'All' && pCategory !== selectedCategory) return false;
    if (Number(p.price || 0) > maxPrice) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 flex flex-col md:flex-row gap-16">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-64 shrink-0 font-mono">
        <div className="sticky top-32 space-y-4">
          {initialCategories.map(category => (
            <button 
              key={category} 
              onClick={() => setSelectedCategory(category)}
              className={`block w-full text-left font-sans text-sm tracking-wide transition-colors ${selectedCategory === category ? 'text-charcoal underline underline-offset-4' : 'text-charcoal/70 hover:text-charcoal'}`}
            >
              {category === 'All' ? 'Shop all' : category}
            </button>
          ))}
          
          <div className="pt-8">
            <button className="flex items-center gap-2 font-sans text-sm text-charcoal/70 hover:text-charcoal transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="21" x2="4" y2="14"></line>
                <line x1="4" y1="10" x2="4" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12" y2="3"></line>
                <line x1="20" y1="21" x2="20" y2="16"></line>
                <line x1="20" y1="12" x2="20" y2="3"></line>
                <line x1="1" y1="14" x2="7" y2="14"></line>
                <line x1="9" y1="8" x2="15" y2="8"></line>
                <line x1="17" y1="16" x2="23" y2="16"></line>
              </svg>
              Filter and sort
            </button>
          </div>
        </div>
      </aside>

      {/* Product Grid */}
      <div className="flex-1">
        {filteredProducts.length === 0 ? (
          <div className="py-32 text-center">
            <p className="text-charcoal/60 text-sm tracking-wide font-sans max-w-sm mx-auto">No products found.</p>
            <button 
              onClick={() => { setSelectedBrand('All'); setSelectedCategory('All'); setMaxPrice(150); }}
              className="mt-8 text-sm font-sans underline underline-offset-4"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-24">
            {filteredProducts.map((product, index) => {
              const isLeft = index % 2 === 0;
              const isLarge = index % 3 === 0;
              const widthClass = isLarge ? 'sm:w-[80%] xl:w-[70%]' : 'sm:w-[60%] xl:w-[50%]';
              const aspectClass = isLarge ? 'aspect-[4/5] sm:aspect-[3/4]' : 'aspect-square sm:aspect-[4/5]';
              
              return (
              <motion.div 
                key={product.id}
                initial={{ y: 80, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`w-full flex flex-col ${isLeft ? 'items-start' : 'items-end'}`}
              >
                  <Link href={`/producto/${product.slug || product.id}`} className={`group flex flex-col w-full ${widthClass}`}>
                    <div className={`w-full ${aspectClass} bg-bone relative overflow-hidden mb-6`}>
                       {(product.image || (product.images && product.images[0])) ? (
                            <Image src={product.image || product.images![0]} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" referrerPolicy="no-referrer" />
                        ) : (
                            <div className="flex items-center justify-center w-full h-full bg-bone border border-gray-200">
                              <span className="text-charcoal/40 uppercase tracking-[0.5em] text-[10px] font-bold">kauai</span>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end w-full gap-2 px-2">
                      <h3 className="text-xl sm:text-2xl font-sans text-charcoal font-medium">{product.name}</h3>
                      <span className="text-base sm:text-lg font-sans text-charcoal/70">€{Number(product.price || 0).toFixed(2)} EUR</span>
                    </div>
                  </Link>
              </motion.div>
            )})}
          </div>
        )}
      </div>
    </div>
  );
}
