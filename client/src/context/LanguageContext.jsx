import { createContext, useState, useContext } from 'react';
import translations from '../lib/translations';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('cafe_lang') || 'es';
  });

  const toggle = () => {
    setLang(prev => {
      const next = prev === 'es' ? 'en' : 'es';
      localStorage.setItem('cafe_lang', next);
      return next;
    });
  };

  const t = (key) => translations[lang]?.[key] || translations['es']?.[key] || key;

  return (
    <LanguageContext.Provider value={{ lang, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
