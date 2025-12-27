"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { Language, translations } from "@/lib/translations"

type TranslationContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: keyof typeof translations.English) => string
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("English")

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("tabilinkLanguage") as Language | null
      if (stored && (stored === "English" || stored === "Hindi")) {
        setLanguageState(stored)
      }
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    if (typeof window !== "undefined") {
      localStorage.setItem("tabilinkLanguage", lang)
    }
  }

  const t = (key: keyof typeof translations.English): string => {
    return translations[language][key] || translations.English[key]
  }

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(TranslationContext)
  if (context === undefined) {
    throw new Error("useTranslation must be used within a TranslationProvider")
  }
  return context
}

