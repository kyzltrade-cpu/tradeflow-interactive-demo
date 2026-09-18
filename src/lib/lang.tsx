'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

type Lang = 'en' | 'zh';

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (en: string, zh: string) => string;
}

const LangContext = createContext<LangContextValue>({
  lang: 'en',
  setLang: () => {},
  t: (en) => en,
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');

  useEffect(() => {
    const saved = localStorage.getItem('tradeflow_lang') as Lang | null;
    if (saved === 'zh' || saved === 'en') setLangState(saved);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem('tradeflow_lang', l);
  }, []);

  const t = useCallback((en: string, zh: string) => (lang === 'zh' ? zh : en), [lang]);

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}

export function LangToggle() {
  const { lang, setLang } = useLang();
  return (
    <button
      onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
      className="text-[11px] font-medium px-2 py-1 rounded border"
      style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
    >
      {lang === 'en' ? 'EN' : '中文'}
    </button>
  );
}
