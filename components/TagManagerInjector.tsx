'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function TagManagerInjector() {
  const injectGtm = (input: string) => {
    // Evitar inyección múltiple
    if (document.getElementById('injected-gtm-script')) return;

    const isJustId = /^GTM-[A-Z0-9]+$/.test(input.trim());

    if (isJustId) {
      const script = document.createElement('script');
      script.id = 'injected-gtm-script';
      script.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('consent', 'default', {
          'ad_storage': 'denied',
          'analytics_storage': 'denied'
        });
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${input.trim()}');
      `;
      document.head.appendChild(script);

      const noscript = document.createElement('noscript');
      noscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${input.trim()}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
      document.body.insertBefore(noscript, document.body.firstChild);
    } else {
      // Intenta extraer y ejecutar la etiqueta script o inserta en un div
      // Si el input trae <script>...</script>, el navegador no ejecuta innerHTML directamente.
      // Creamos un context de document fragment.
      try {
        const container = document.createElement('div');
        // extraemos los tags de script y los recreamos
        const htmlWithoutScripts = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, (match) => {
          const divWrapper = document.createElement('div');
          divWrapper.innerHTML = match;
          const oldScript = divWrapper.querySelector('script');
          if (oldScript) {
             const newScript = document.createElement('script');
             Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
             newScript.text = oldScript.text;
             document.head.appendChild(newScript);
          }
          return '';
        });
        
        container.innerHTML = htmlWithoutScripts;
        document.body.appendChild(container);
      } catch (e) {
        console.error('Error inyectando script custom', e);
      }
    }
  };

  useEffect(() => {
    const fetchGtm = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'cms', 'settings'));
        if (docSnap.exists() && docSnap.data().gtmScript) {
          const scriptContent = docSnap.data().gtmScript as string;
          injectGtm(scriptContent);
        } else {
            // Fallback for migrated data
            const homeSnap = await getDoc(doc(db, 'cms', 'homepage'));
            if (homeSnap.exists() && homeSnap.data().gtmScript) {
                const scriptContent = homeSnap.data().gtmScript as string;
                injectGtm(scriptContent);
            }
        }
      } catch (e) {
        console.error('Error fetching Tag Manager config', e);
      }
    };
    fetchGtm();
  }, []);

  return null;
}

