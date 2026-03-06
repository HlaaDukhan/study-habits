"use client";

import { Languages } from "lucide-react";
import { useLanguage } from "@/lib/language";

export function LanguageToggle() {
  const { lang, setLang, t } = useLanguage();

  return (
    <button
      onClick={() => setLang(lang === "en" ? "ar" : "en")}
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary w-full transition-colors"
      title={lang === "en" ? "Switch to Arabic" : "Switch to English"}
    >
      <Languages size={18} />
      <span className="text-sm font-medium">
        {lang === "en" ? t("arabic") : t("english")}
      </span>
    </button>
  );
}
