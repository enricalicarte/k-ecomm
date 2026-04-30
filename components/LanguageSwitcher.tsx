'use client'

import { useLanguage } from './LanguageContext';

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex gap-2 items-center">
      {(['es', 'ca', 'en'] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`text-[9px] uppercase tracking-widest font-mono transition-colors ${
            lang === l ? 'text-charcoal font-bold' : 'text-charcoal/40 hover:text-charcoal'
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
