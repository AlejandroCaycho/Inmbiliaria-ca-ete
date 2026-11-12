import { Fragment } from 'react'
import SelectMenu from './SelectMenu'
import { useLanguage } from '../context/LanguageContext'
import { useSiteContent } from '../context/SiteContentContext'
import { presupuestos, superficies, tipologias, zonas } from '../data/catalogFilters'

const selectTriggerClassName =
  'min-h-[46px] rounded-lg border border-stone-800 bg-stone-950/60 px-2 py-1.5 transition-colors hover:border-stone-600 md:min-h-[48px] md:px-3'

const selectValueClassName =
  'mt-0.5 text-[10px] leading-4 font-sans font-medium text-stone-100 md:text-[11px]'

export default function Hero({ filters, onFilterChange, onSearch }) {
  const { lang, t } = useLanguage()
  const { properties } = useSiteContent()
  const titleWords = t('El mar te está esperando.', 'The sea is waiting for you.').split(' ')
  const publishedCount = String(
    properties.filter((property) => property.published !== false).length,
  ).padStart(2, '0')

  const localizeOptions = (options) =>
    options.map((option) => ({
      value: option.value,
      label: lang === 'en' ? option.labelEn : option.label,
    }))

  function handleSubmit(event) {
    event.preventDefault()
    onSearch?.()
  }

  return (
    <section
      id="hero"
      className="relative min-h-[100svh] w-full flex flex-col justify-between overflow-hidden px-4 pb-6 pt-28 md:px-12 md:pb-10 md:pt-32"
    >
      <div className="absolute inset-0 -z-10">
        <img
          src="/images/hero-propiedad.jpg"
          alt={t(
            'Casa con piscina y jardín en venta en San Vicente de Cañete',
            'House with pool and garden for sale in San Vicente, Cañete',
          )}
          className="hero-bg-image w-full h-full object-cover object-center filter brightness-[0.95] contrast-[1.01] saturate-[0.98]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/15 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/65 via-stone-950/5 to-transparent"></div>
        <div className="absolute inset-x-0 top-0 h-52 bg-gradient-to-b from-stone-950/60 to-transparent md:h-40 md:from-stone-950/30"></div>
      </div>

      <div
        data-hero="meta"
        className="mx-auto flex w-full max-w-[1440px] flex-wrap items-center justify-between gap-x-4 gap-y-1.5 rounded-lg border border-stone-100/10 bg-stone-950/45 px-3 py-2 backdrop-blur-md md:rounded-none md:border-0 md:border-t md:border-stone-100/15 md:bg-transparent md:px-0 md:pb-0 md:pt-6 md:backdrop-blur-none"
      >
        <div className="inline-flex items-center font-sans text-[9px] font-medium uppercase tracking-[0.14em] text-stone-50 md:text-[10px] md:tracking-widest">
          {t('Inmobiliaria en Cañete, Lima', 'Real estate in Cañete, Lima')}
        </div>
        <div className="font-sans text-[9px] uppercase tracking-[0.14em] text-stone-100 md:text-[10px] md:tracking-widest">
          {t(
            `${publishedCount} propiedades · Atención directa`,
            `${publishedCount} properties · Direct service`,
          )}
        </div>
      </div>

      <div className="mx-auto my-auto w-full max-w-[1440px] py-6 md:py-10">
        <div
          data-hero="label"
          className="editorial-label mb-3 flex items-center gap-2 text-stone-100 [text-shadow:0_1px_8px_rgba(0,0,0,0.9)] md:mb-4"
        >
          <span
            data-hero="label-line"
            className="inline-block h-px w-2 origin-left bg-terracotta"
          ></span>
          {t('Casas, terrenos y proyectos', 'Homes, land and projects')}
        </div>
        <h1 className="hero-title font-extrabold text-stone-100 max-w-4xl tracking-tightest">
          {titleWords.map((word, index) => (
            <Fragment key={`${word}-${index}`}>
              <span data-hero="title-word" className="inline-block">
                {word}
              </span>
              {index < titleWords.length - 1 ? ' ' : null}
            </Fragment>
          ))}
        </h1>
        <p
          data-hero="copy"
          className="mt-5 max-w-xl text-stone-100 text-sm md:text-base leading-relaxed font-light [text-shadow:0_1px_10px_rgba(0,0,0,0.8)]"
        >
          {t(
            'Casas, terrenos y proyectos en Cañete y Chincha. Propiedades reales, atención directa y visitas coordinadas.',
            'Homes, land and projects in Cañete and Chincha. Real listings, direct service and scheduled visits.',
          )}
        </p>
      </div>

      <div className="max-w-[1440px] w-full mx-auto">
        <div
          data-hero="filters"
          className="rounded-xl border border-stone-200/15 bg-stone-900/90 p-2 shadow-2xl backdrop-blur-xl md:p-3"
        >
          <form
            className="grid grid-cols-2 items-center gap-2 md:gap-3 xl:grid-cols-5"
            onSubmit={handleSubmit}
          >
            <div className="col-span-2 sm:col-span-1">
              <SelectMenu
                id="hero-tipologia"
                label={
                  <>
                    <span className="md:hidden">{t('TIPO', 'TYPE')}</span>
                    <span className="hidden md:inline">{t('TIPO DE PROPIEDAD', 'PROPERTY TYPE')}</span>
                  </>
                }
                options={localizeOptions(tipologias)}
                value={filters.tipo}
                onChange={(value) => onFilterChange({ tipo: value })}
                openUp
                triggerClassName={selectTriggerClassName}
                valueClassName={selectValueClassName}
              />
            </div>

            <SelectMenu
              id="hero-zona"
              label={t('ZONA', 'AREA')}
              options={localizeOptions(zonas)}
              value={filters.zona}
              onChange={(value) => onFilterChange({ zona: value })}
              openUp
              triggerClassName={selectTriggerClassName}
              valueClassName={selectValueClassName}
            />

            <SelectMenu
              id="hero-superficie"
              label={t('SUPERFICIE', 'SIZE')}
              options={localizeOptions(superficies)}
              value={filters.superficie}
              onChange={(value) => onFilterChange({ superficie: value })}
              openUp
              triggerClassName={selectTriggerClassName}
              valueClassName={selectValueClassName}
            />

            <SelectMenu
              id="hero-presupuesto"
              label={t('PRESUPUESTO', 'BUDGET')}
              options={localizeOptions(presupuestos)}
              value={filters.presupuesto}
              onChange={(value) => onFilterChange({ presupuesto: value })}
              openUp
              triggerClassName={selectTriggerClassName}
              valueClassName={selectValueClassName}
            />

            <div className="col-span-1 sm:col-span-2 xl:col-span-1">
              <button
                type="submit"
                className="flex h-[46px] w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-terracotta font-sans text-[10px] font-semibold uppercase tracking-wider text-stone-50 transition-colors hover:bg-terracotta-hover sm:gap-2 sm:text-[11px] md:h-[44px] md:text-xs"
              >
                <svg className="h-3 w-3 sm:h-3.5 sm:w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                {t('Ver propiedades', 'View properties')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
