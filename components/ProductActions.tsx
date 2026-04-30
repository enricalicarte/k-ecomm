'use client';

import { useState } from 'react';
import { trackEvent } from '@/lib/analytics';
import { useLanguage } from './LanguageContext';
import { useCart } from './CartContext';

type ProductActionsProps = {
  sizes: (string | number)[];
  product: {
    brand: string;
    name: string;
    codigoProducto?: string;
    slug?: string;
    sku?: string;
    price: number;
    images?: string[];
    [key: string]: any;
  }
};

export default function ProductActions({ sizes, product }: ProductActionsProps) {
  const [selectedSize, setSelectedSize] = useState<string | number | null>(null);
  const { t } = useLanguage();
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (sizes && sizes.length > 0 && !selectedSize) {
      alert('A size selection is required.');
      return;
    }

    trackEvent({
      type: 'add_to_cart',
      path: window.location.pathname,
      source: `product_archive`,
      metadata: {
        product: product.name,
        brand: product.brand,
        size_selected: selectedSize
      }
    });

    addToCart({
      id: `${product.slug}-${selectedSize || 'nosize'}`,
      productId: product.slug || product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || 'https://images.unsplash.com/photo-1550639525-c97d455acf70?w=800&q=80',
      size: selectedSize,
      quantity: 1,
      brand: product.brand
    });
  };

  const handleArchive = () => {
    if (sizes && sizes.length > 0 && !selectedSize) {
      alert('A size selection is required.');
      return;
    }

    trackEvent({
      type: 'email_click',
      path: window.location.pathname,
      source: `product_archive`,
      metadata: {
        product: product.name,
        brand: product.brand,
        size_selected: selectedSize
      }
    });

    const email = 'contact@studiok.com'; 
    let subject = `Studio K Request: ${product.brand} - ${product.name}`;
    let body = `Hello,\n\nI would like to request the following archive item:\n\nBrand: ${product.brand}\nName: ${product.name}`;
    
    // Add reference code if available
    const code = product.codigoProducto || product.sku;
    if (code) {
      body += `\nReference: ${code}`;
    }
    
    // Add size if selected
    if (selectedSize) {
      body += `\nSize: ${selectedSize}`;
    }

    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      {sizes && sizes.length > 0 && (
        <div className="mb-10">
          <span className="block text-xs uppercase font-bold tracking-widest mb-4 font-sans text-charcoal">{t('product.sizes')}</span>
          <div className="grid grid-cols-4 gap-3 max-w-sm">
            {sizes.map((size: number | string, index: number) => (
              <button 
                key={index} 
                onClick={() => setSelectedSize(size)}
                className={`border py-3 text-xs font-sans transition-all duration-300 p-1 relative ${
                  selectedSize === size 
                    ? 'border-charcoal bg-charcoal text-bone' 
                    : 'border-charcoal/20 bg-transparent hover:border-charcoal'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4 w-full">
        <button 
            onClick={handleAddToCart}
            className="w-full bg-charcoal text-bone py-4 uppercase tracking-widest text-xs font-bold hover:bg-charcoal/90 transition-colors flex items-center justify-center">
          Add To Cart
        </button>
        
        <button 
            onClick={handleArchive}
            className="w-full bg-transparent border border-charcoal/20 text-charcoal py-4 uppercase tracking-widest text-xs font-bold hover:border-charcoal transition-colors flex items-center justify-center">
          {t('product.request')}
        </button>

        <div className="mt-8 space-y-4 py-8 border-t border-charcoal/10 flex flex-col">
          <div className="text-sm font-sans flex justify-between w-full">
            <span className="text-charcoal/60">Shipping</span>
            <span className="text-charcoal cursor-pointer underline">Calculate</span>
          </div>
          <div className="text-sm font-sans flex justify-between w-full">
            <span className="text-charcoal/60">Returns</span>
            <span className="text-charcoal cursor-pointer underline">Free 30-day</span>
          </div>
        </div>
      </div>
    </>
  );
}
