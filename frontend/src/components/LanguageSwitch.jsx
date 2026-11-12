import { useLanguage } from '../context/LanguageContext'

export default function LanguageSwitch() {
  const { lang, toggle, t } = useLanguage()

  return (
    <button
      type="button"
      role="switch"
      aria-checked={lang === 'en'}
      aria-label={t('Cambiar a inglés', 'Switch to Spanish')}
      onClick={toggle}
      className="flex items-center gap-2 rounded-full border border-stone-700/60 bg-stone-950/40 py-1 pl-2 pr-1.5 transition-colors hover:border-stone-600 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
    >
      <span
        className={`font-sans text-[10px] font-semibold transition-colors ${
          lang === 'es' ? 'text-stone-100' : 'text-stone-500'
        }`}
      >
        ES
      </span>
      <span
        className={`relative h-4 w-8 rounded-full transition-colors ${
          lang === 'en' ? 'bg-terracotta' : 'bg-stone-700'
        }`}
        aria-hidden="true"
      >
        <span
          className={`absolute left-0.5 top-0.5 h-3 w-3 rounded-full bg-stone-100 shadow-sm transition-transform duration-200 ${
            lang === 'en' ? 'translate-x-4' : ''
          }`}
        />
      </span>
      <span
        className={`font-sans text-[10px] font-semibold transition-colors ${
          lang === 'en' ? 'text-stone-100' : 'text-stone-500'
        }`}
      >
        EN
      </span>
    </button>
  )
}
