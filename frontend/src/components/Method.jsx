import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { useSiteContent } from '../context/SiteContentContext'

const phaseIcons = [ChatIcon, SearchIcon, CalendarIcon, DocumentIcon]

function ChatIcon({ className = 'h-4 w-4' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 11.25v3a4.5 4.5 0 0 1-4.5 4.5H8.25L3 21v-9.75a4.5 4.5 0 0 1 4.5-4.5h9a4.5 4.5 0 0 1 4.5 4.5Z"
      />
      <path strokeLinecap="round" d="M8 9.75h8M8 13.5h5" />
    </svg>
  )
}

function SearchIcon({ className = 'h-4 w-4' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path strokeLinecap="round" d="m15.5 15.5 4.5 4.5" />
    </svg>
  )
}

function CalendarIcon({ className = 'h-4 w-4' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <rect x="3.5" y="5" width="17" height="15" rx="2" />
      <path strokeLinecap="round" d="M3.5 9.5h17M8 3v4M16 3v4M8.5 14h2M13.5 14h2" />
    </svg>
  )
}

function DocumentIcon({ className = 'h-4 w-4' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 3.5h7l4.5 4.5v12.5H7zM14 3.5V8h4.5M9.5 13h5M9.5 16.5h3.5"
      />
    </svg>
  )
}

function ClockIcon({ className = 'h-3 w-3' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="8.5" />
      <path strokeLinecap="round" d="M12 7.5V12l3 2" />
    </svg>
  )
}

function ArrowIcon({ className = 'h-3.5 w-3.5' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-5-5 5 5-5 5" />
    </svg>
  )
}

export default function Method() {
  const { lang, t } = useLanguage()
  const { methodPhases } = useSiteContent()

  return (
    <section id="metodo" className="py-12 bg-stone-950 border-b border-stone-800">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12">
        <div
          data-reveal
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6"
        >
          <div className="max-w-2xl">
            <span className="editorial-label text-stone-500">
              {t('CÓMO TRABAJAMOS', 'HOW WE WORK')}
            </span>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-stone-100 mt-1">
              {t('Cuatro pasos, sin letra chica', 'Four steps, no fine print')}
            </h2>
            <p className="text-xs text-stone-400 mt-1 font-light leading-relaxed">
              {t(
                'Así avanzas desde la primera conversación hasta la firma. Siempre sabes qué viene después y qué necesitas en cada etapa.',
                'This is how you move from the first conversation to signing. You always know what comes next and what you need at each step.',
              )}
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 font-sans text-[10px] uppercase tracking-wider text-stone-500">
            <span className="h-px w-4 bg-terracotta/70" />
            {t('Acompañamiento directo', 'Direct support')}
          </div>
        </div>

        <div className="relative">
          <div
            data-method-line
            className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-10 hidden h-px origin-left bg-gradient-to-r from-terracotta/50 via-stone-700 to-stone-700 xl:block"
            aria-hidden="true"
          />
          <div className="relative grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {methodPhases.map((phase, index) => {
              const Icon = phaseIcons[index]
              return (
                <article
                  key={phase.number}
                  data-reveal
                  className="flex flex-col rounded-xl border border-stone-800 bg-stone-900/60 p-5 transition-colors hover:border-stone-700"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-terracotta/30 bg-stone-950 text-terracotta">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="font-sans text-[10px] tracking-[0.18em] text-stone-500">
                      {t('PASO', 'STEP')} {phase.number}
                    </span>
                  </div>
                  <h3 className="mt-4 font-sans text-sm font-semibold text-stone-100">
                    {lang === 'en' ? phase.titleEn : phase.title}
                  </h3>
                  <div className="mb-4 mt-3 space-y-2 text-[11px] leading-relaxed">
                    <p>
                      <span className="font-sans font-semibold text-stone-200">
                        {t('Tú:', 'You:')}
                      </span>{' '}
                      <span className="text-stone-400">
                        {lang === 'en' ? phase.youEn : phase.you}
                      </span>
                    </p>
                    <p>
                      <span className="font-sans font-semibold text-terracotta">
                        {t('Nosotros:', 'We:')}
                      </span>{' '}
                      <span className="text-stone-400">
                        {lang === 'en' ? phase.usEn : phase.us}
                      </span>
                    </p>
                  </div>
                  <div className="mt-auto flex items-center gap-1.5 border-t border-stone-800 pt-3 font-sans text-[10px] text-stone-400">
                    <ClockIcon />
                    {lang === 'en' ? phase.timeEn : phase.time}
                  </div>
                </article>
              )
            })}
          </div>
        </div>

        <div
          data-reveal
          className="mt-5 flex flex-col gap-3 rounded-xl border border-stone-800 bg-stone-900/40 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="font-sans text-xs text-stone-400">
            <span className="font-semibold text-stone-200">
              {t('¿Listo para empezar?', 'Ready to start?')}
            </span>{' '}
            {t(
              'Cuéntanos qué buscas y coordinamos la primera conversación.',
              "Tell us what you're looking for and we'll schedule the first conversation.",
            )}
          </p>
          <Link
            to="/contacto"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-terracotta px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-wider text-stone-50 transition-colors hover:bg-terracotta-hover"
          >
            {t('Hablar con un asesor', 'Talk to an advisor')}
            <ArrowIcon />
          </Link>
        </div>
      </div>
    </section>
  )
}
