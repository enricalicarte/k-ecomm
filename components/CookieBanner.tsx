'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  const updateGtmConsent = (status: 'granted' | 'denied') => {
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('consent', 'update', {
        'ad_storage': status,
        'analytics_storage': status
      });
    }
  };

  useEffect(() => {
    // Retrasar un poco la comprobación para evitar parpadeos si se carga muy rápido
    const checkConsent = () => {
      let consent;
      try {
        consent = localStorage.getItem('cookie_consent');
      } catch(e) {}
      if (!consent) {
        setIsVisible(true);
      } else if (consent === 'granted') {
        updateGtmConsent('granted');
      }
    };
    checkConsent();
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem('cookie_consent', 'granted');
    } catch(e) {}
    updateGtmConsent('granted');
    setIsVisible(false);
  };

  const handleReject = () => {
    try {
      localStorage.setItem('cookie_consent', 'denied');
    } catch(e) {}
    updateGtmConsent('denied');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50 animate-in slide-in-from-bottom flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="text-xs text-gray-600 max-w-4xl leading-relaxed">
        <p>
          Utilizamos cookies propias y de terceros para fines analíticos y para mejorar tu experiencia de usuario. 
          Puedes aceptar todas las cookies pulsando el botón &quot;Aceptar todas&quot;, o rechazarlas marcando &quot;Rechazar no esenciales&quot;.
        </p>
      </div>
      <div className="flex gap-2 w-full md:w-auto shrink-0 justify-end">
        <button 
          onClick={handleReject} 
          className="text-[10px] uppercase tracking-widest font-bold text-gray-500 hover:text-gray-800 transition py-3 px-4 border border-gray-200 shrink-0"
        >
          Rechazar no esenciales
        </button>
        <button 
          onClick={handleAccept} 
          className="text-[10px] uppercase tracking-widest font-bold bg-[#6B7A3D] text-white hover:bg-[#5a6733] transition py-3 px-6 shrink-0"
        >
          Aceptar todas
        </button>
      </div>
    </div>
  );
}
