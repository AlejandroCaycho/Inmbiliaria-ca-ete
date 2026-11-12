import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { useSiteContent } from '../../context/SiteContentContext'
import ModuleHeader from './ModuleHeader'
import MethodEditor from './MethodEditor'
import { BriefcaseIcon, ClockIcon, UserIcon } from './dashboardIcons'
import { primaryButton, secondaryButton, smallButton } from './fields'
import { pad } from './dashboardUtils'

export default function Method() {
  const { lang, t } = useLanguage()
  const { methodPhases, updateMethodPhases } = useSiteContent()
  const [editorOpen, setEditorOpen] = useState(false)

  return (
    <>
      <ModuleHeader
        eyebrow={t('SECCIÓN DEL SITIO', 'SITE SECTION')}
        title={t('Cómo trabajamos', 'How we work')}
        description={t(
          'Los cuatro pasos que se explican en la landing, desde la primera conversación hasta la firma.',
          'The four steps explained on the landing, from the first conversation to signing.',
        )}
        actions={
          <>
            <Link
              to="/#metodo"
              className={secondaryButton}
            >
              {t('Ver en el sitio', 'View on site')}
              <span aria-hidden="true">↗</span>
            </Link>
            <button
              type="button"
              onClick={() => setEditorOpen(true)}
              className={primaryButton}
            >
              {t('Editar pasos', 'Edit steps')}
            </button>
          </>
        }
      />

      <div className="mt-5 overflow-hidden rounded-xl border border-stone-800">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-800 bg-stone-900/40 px-5 py-3.5">
          <div>
            <span className="editorial-label text-stone-500">
              {t('PASOS PUBLICADOS', 'PUBLISHED STEPS')}
            </span>
            <p className="mt-1 font-sans text-[11px] text-stone-500">
              {t(
                'Lo que el cliente ve en la sección “Cómo trabajamos” del sitio.',
                'What the client sees in the “How we work” section of the site.',
              )}
            </p>
          </div>
          <span className="font-sans text-[10px] uppercase tracking-[0.14em] text-stone-500">
            {pad(methodPhases.length)} {t('pasos', 'steps')}
          </span>
        </header>

        <ul className="divide-y divide-stone-800">
          {methodPhases.map((phase) => (
            <li
              key={phase.number}
              className="grid gap-3 px-5 py-4 transition-colors hover:bg-stone-900/30 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)_minmax(0,1.1fr)_auto] lg:items-center lg:gap-5"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-terracotta/30 bg-terracotta/10 font-sans text-xs font-semibold tabular-nums text-terracotta">
                  {phase.number}
                </span>
                <div className="min-w-0">
                  <h3 className="font-sans text-sm font-semibold tracking-tight text-stone-50">
                    {lang === 'en' ? phase.titleEn : phase.title}
                  </h3>
                  <span className="mt-1 inline-flex items-center gap-1.5 font-sans text-[10px] text-stone-500">
                    <ClockIcon className="h-3 w-3" />
                    {lang === 'en' ? phase.timeEn : phase.time}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-stone-800 bg-stone-900 text-stone-400">
                  <UserIcon className="h-3 w-3" />
                </span>
                <div className="min-w-0">
                  <span className="editorial-label text-[9px] text-stone-500">
                    {t('TÚ', 'YOU')}
                  </span>
                  <p className="mt-0.5 font-sans text-[11px] font-light leading-relaxed text-stone-300">
                    {lang === 'en' ? phase.youEn : phase.you}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-terracotta/25 bg-terracotta/10 text-terracotta">
                  <BriefcaseIcon className="h-3 w-3" />
                </span>
                <div className="min-w-0">
                  <span className="editorial-label text-[9px] text-terracotta">
                    {t('NOSOTROS', 'WE')}
                  </span>
                  <p className="mt-0.5 font-sans text-[11px] font-light leading-relaxed text-stone-300">
                    {lang === 'en' ? phase.usEn : phase.us}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setEditorOpen(true)}
                aria-label={`${t('Editar paso', 'Edit step')} ${phase.number}`}
                className={`${smallButton} w-fit lg:justify-self-end`}
              >
                {t('Editar', 'Edit')}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <MethodEditor
        open={editorOpen}
        methodPhases={methodPhases}
        onClose={() => setEditorOpen(false)}
        onSave={(phases) => {
          updateMethodPhases(phases)
          setEditorOpen(false)
        }}
      />
    </>
  )
}
