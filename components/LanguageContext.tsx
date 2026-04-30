'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'es' | 'ca' | 'en';

const dictionaries = {
  es: {
    nav: {
      catalog: 'Catálogo',
      designers: 'Tecnología',
      editorial: 'Insights',
      about: 'Agencia',
      login: 'Acceso',
      pos: 'TPV'
    },
    marcas: {
      title: 'Directorio de Tecnología',
      desc: 'Una exploración de la estructura y la función. Cada ecosistema está seleccionado por su impacto y escalabilidad.',
      subtitle: 'Arquitectura de la información estructurada por kauai consulting.',
      explore: 'Explorar',
      empty: 'El directorio está siendo compilado.'
    },
    home: {
      awaiting_input: 'ESPERANDO_ENTRADA',
      sys_process: 'SYS.PROCESSO',
      enter_archive: 'Acceder al Archivo',
      latest_acquisitions: 'Últimos Proyectos',
      view_all: 'Ver Todo',
      footer_desc: 'Desarrollo digital y diseño funcional.\nProducido por kauai consulting.',
      footer_rights: '© 2026 kauai archive',
      footer_neural: 'Infraestructura Web Avanzada',
      avant_garde: 'Ingeniería y diseño vanguardista.'
    },
    about: {
      title: 'Sobre kauai',
      sys_origin: 'SYS.ORIGEN',
      para1: 'kauai archive es la expresión física y digital de kauai consulting. Creemos que la tecnología y el diseño forman un ecosistema indivisible. Nuestro código no solo ejecuta, comunica.',
      para2: 'Exploramos la intersección entre la ingeniería de software y la estética brutalista. Reducimos el ruido, optimizamos el rendimiento y entregamos productos que perduran en entornos complejos.',
      para3: 'Esta plataforma funciona como nuestro repositorio. Cada proyecto, componente o prenda representa un algoritmo resuelto. Diseñamos sistemas para ser estructurados, escalables y eficientes.',
      philosophy: 'Filosofía Técnica',
      philosophy_desc: 'Rechazamos la redundancia. Cada línea de código y cada píxel en kauai archive obedece a un propósito funcional. Nos enfocamos en stacks modernos, rendimiento puro y arquitecturas sólidas.',
      vision: 'Perspectiva',
      vision_desc: 'Fusionar la lógica de sistemas con el impacto visual, transformando requerimientos complejos en interfaces humanas e intuitivas.'
    },
    catalog: {
      title: 'Archivo de Proyectos',
      desc: 'Explora nuestra colección de soluciones tecnológicas y merchandising.',
      collection: 'Colección',
      search: 'Buscar...',
      filter: 'Filtrar por tecnología',
      all: 'Todo'
    },
    product: {
      buy_now: 'Adquirir / Implementar',
      request: 'Solicitar Información',
      sizes: 'Especificaciones',
      details: 'Detalles Técnicos'
    }
  },
  ca: {
    nav: {
      catalog: 'Catàleg',
      designers: 'Tecnologia',
      editorial: 'Insights',
      about: 'Agència',
      login: 'Accés',
      pos: 'TPV'
    },
    marcas: {
      title: 'Directori de Tecnologia',
      desc: 'Una exploració de l\'estructura i la funció. Cada ecosistema està seleccionat pel seu impacte i escalabilitat.',
      subtitle: 'Arquitectura de la informació estructurada per kauai consulting.',
      explore: 'Explorar',
      empty: 'El directori està sent compilat.'
    },
    home: {
      awaiting_input: 'ESPERANT_ENTRADA',
      sys_process: 'SYS.PROCÉS',
      enter_archive: 'Accedir a l\'Arxiu',
      latest_acquisitions: 'Últims Projectes',
      view_all: 'Veure Tot',
      footer_desc: 'Desenvolupament digital i disseny funcional.\nProduït per kauai consulting.',
      footer_rights: '© 2026 kauai archive',
      footer_neural: 'Infraestructura Web Avançada',
      avant_garde: 'Enginyeria i disseny d\'avantguarda.'
    },
    about: {
      title: 'Sobre kauai',
      sys_origin: 'SYS.ORIGEN',
      para1: 'kauai archive és l\'expressió física i digital de kauai consulting. Creiem que la tecnologia i el disseny formen un ecosistema indivisible. El nostre codi no només executa, comunica.',
      para2: 'Explorem la intersecció entre l\'enginyeria de programari i l\'estètica brutalista. Reduïm el soroll, optimitzem el rendiment i entreguem productes que perduren en entorns complexos.',
      para3: 'Aquesta plataforma funciona com el nostre repositori. Cada projecte, component o peça representa un algorisme resolt. Dissenyem sistemes per ser estructurats, escalables i eficients.',
      philosophy: 'Filosofia Tècnica',
      philosophy_desc: 'Rebutgem la redundància. Cada línia de codi i cada píxel a kauai archive obeeix a un propòsit funcional. Ens enfoquem en stacks moderns, rendiment pur i arquitectures sòlides.',
      vision: 'Perspectiva',
      vision_desc: 'Fusionar la lògica de sistemes amb l\'impacte visual, transformant requeriments complexos en interfícies humanes i intuïtives.'
    },
    catalog: {
      title: 'Arxiu de Projectes',
      desc: 'Explora la nostra col·lecció de solucions tecnològiques i marxandatge.',
      collection: 'Col·lecció',
      search: 'Cercar...',
      filter: 'Filtrar per tecnologia',
      all: 'Tot'
    },
    product: {
      buy_now: 'Adquirir / Implementar',
      request: 'Sol·licitar Informació',
      sizes: 'Especificacions',
      details: 'Detalls Tècnics'
    }
  },
  en: {
    nav: {
      catalog: 'Catalog',
      designers: 'Technology',
      editorial: 'Insights',
      about: 'Agency',
      login: 'Login',
      pos: 'POS'
    },
    marcas: {
      title: 'Technology Roster',
      desc: 'An exploration of structure and function. Each technological ecosystem is selected for its impact and scalability.',
      subtitle: 'Information architecture structured by kauai consulting.',
      explore: 'Explore',
      empty: 'The roster is currently being compiled.'
    },
    home: {
      awaiting_input: 'AWAITING_INPUT',
      sys_process: 'SYS.PROCESS',
      enter_archive: 'Access Archive',
      latest_acquisitions: 'Latest Projects',
      view_all: 'View All',
      footer_desc: 'Digital development and functional design.\nProduced by kauai consulting.',
      footer_rights: '© 2026 kauai archive',
      footer_neural: 'Advanced Web Infrastructure',
      avant_garde: 'Avant-garde engineering and design.'
    },
    about: {
      title: 'About kauai',
      sys_origin: 'SYS.ORIGIN',
      para1: 'kauai archive is the physical and digital expression of kauai consulting. We believe that technology and design form an indivisible ecosystem. Our code doesn\'t just execute, it communicates.',
      para2: 'We explore the intersection of software engineering and brutalist aesthetics. We reduce noise, optimize performance, and deliver products built to endure in complex environments.',
      para3: 'This platform serves as our repository. Every project, component, or garment represents a resolved algorithm. We design systems to be structured, scalable, and efficient.',
      philosophy: 'Technical Philosophy',
      philosophy_desc: 'We reject redundancy. Every line of code and every pixel in kauai archive serves a functional purpose. We focus on modern stacks, pure performance, and solid architectures.',
      vision: 'Perspective',
      vision_desc: 'Merging system logic with visual impact, transforming complex requirements into humane and intuitive interfaces.'
    },
    catalog: {
      title: 'Project Archive',
      desc: 'Explore our collection of technological solutions and merchandising.',
      collection: 'Collection',
      search: 'Search...',
      filter: 'Filter by technology',
      all: 'All'
    },
    product: {
      buy_now: 'Acquire / Implement',
      request: 'Request Information',
      sizes: 'Specifications',
      details: 'Technical Details'
    }
  }
};

interface LanguageContextProps {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextProps>({
  lang: 'es',
  setLang: () => {},
  t: () => '',
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLangState] = useState<Language>('es');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    let saved;
    try {
      saved = localStorage.getItem('kauai_lang') as Language;
    } catch(e) {}
    if (saved && (saved === 'es' || saved === 'ca' || saved === 'en')) {
      setLangState(saved);
    } else {
      const browserLang = navigator.language;
      if (browserLang.startsWith('ca')) setLangState('ca');
      else if (browserLang.startsWith('es')) setLangState('es');
      else setLangState('en');
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem('kauai_lang', newLang);
    } catch(e) {}
  };

  const t = (path: string) => {
    // If not mounted yet to avoid hydration mismatch we can return a safe fallback or just current lang
    // But returning correct string is usually fine if we only use it in client components
    const keys = path.split('.');
    let current: any = dictionaries[lang];
    for (const key of keys) {
      if (!current || current[key] === undefined) {
        let fallback: any = dictionaries['en'];
        let foundFallback = true;
        for (const k of keys) {
            if(!fallback || fallback[k] === undefined) { foundFallback = false; break; }
            fallback = fallback[k];
        }
        return foundFallback ? fallback : path;
      }
      current = current[key];
    }
    return current as string;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
