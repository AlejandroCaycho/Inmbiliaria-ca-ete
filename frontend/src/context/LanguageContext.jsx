import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      return window.localStorage.getItem('impulso-lang') === 'en' ? 'en' : 'es'
    } catch {
      return 'es'
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem('impulso-lang', lang)
    } catch {
      // Storage may be unavailable in restricted browser contexts.
    }
    document.documentElement.lang = lang
  }, [lang])

  const value = useMemo(
    () => ({
      lang,
      setLang,
      toggle: () => setLang((current) => (current === 'es' ? 'en' : 'es')),
      t: (es, en) => (lang === 'en' ? en : es),
    }),
    [lang],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used within LanguageProvider')
  return context
}
