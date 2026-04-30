'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProductGallery({ images, brand, name }: { images: string[], brand: string, name: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-full bg-bone flex items-center justify-center relative">
         <span className="text-charcoal uppercase tracking-widest text-xs font-sans">No visual record</span>
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <div className="w-full h-full relative group">
         <Image src={images[0]} alt={name} fill className="object-cover transition-all duration-700" referrerPolicy="no-referrer" priority />
      </div>
    );
  }

  // Multiple images logic
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="w-full h-full relative group">
      <Image 
        src={images[currentIndex]} 
        alt={`${name} - Vista ${currentIndex + 1}`} 
        fill 
        className="object-cover transition-all duration-700" 
        referrerPolicy="no-referrer" 
        priority={currentIndex === 0} 
      />

      <button 
        onClick={handlePrev}
        className="absolute left-0 top-0 bottom-0 w-1/4 group flex items-center justify-start px-4 opacity-0 hover:opacity-100 transition-opacity"
        aria-label="Previous Frame"
      >
         <div className="bg-white/80 p-2 text-charcoal">
           <ChevronLeft size={20} />
         </div>
      </button>

      <button 
        onClick={handleNext}
        className="absolute right-0 top-0 bottom-0 w-1/4 group flex items-center justify-end px-4 opacity-0 hover:opacity-100 transition-opacity"
        aria-label="Next Frame"
      >
         <div className="bg-white/80 p-2 text-charcoal">
           <ChevronRight size={20} />
         </div>
      </button>

      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-10">
         {images.map((_, idx) => (
            <button
               key={idx}
               onClick={() => setCurrentIndex(idx)}
               className={`h-[2px] transition-all rounded-none ${currentIndex === idx ? 'bg-charcoal w-6' : 'bg-charcoal/20 hover:bg-charcoal/50 w-4'}`}
               aria-label={`Frame ${idx + 1}`}
            />
         ))}
      </div>
    </div>
  );
}
