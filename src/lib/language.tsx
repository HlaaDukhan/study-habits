"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Lang = "en" | "ar";

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
}

const translations: Record<Lang, Record<string, string>> = {
  en: {
    dashboard: "Dashboard",
    checkIn: "Check In",
    skills: "Skills",
    aiCoach: "AI Coach",
    events: "Events",
    history: "History",
    settings: "Settings",
    signOut: "Sign Out",
    lightMode: "Light Mode",
    darkMode: "Dark Mode",
    arabic: "العربية",
    english: "English",
  },
  ar: {
    dashboard: "لوحة التحكم",
    checkIn: "تسجيل اليوم",
    skills: "المهارات",
    aiCoach: "المدرب الذكي",
    events: "الأحداث",
    history: "السجل",
    settings: "الإعدادات",
    signOut: "تسجيل الخروج",
    lightMode: "الوضع الفاتح",
    darkMode: "الوضع الداكن",
    arabic: "العربية",
    english: "English",
  },
};

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  t: (key) => key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = localStorage.getItem("lang") as Lang | null;
    if (saved === "ar" || saved === "en") {
      applyLang(saved);
      setLangState(saved);
    }
  }, []);

  const applyLang = (l: Lang) => {
    document.documentElement.lang = l;
    document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
  };

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("lang", l);
    applyLang(l);
  };

  const t = (key: string) => translations[lang][key] ?? key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
