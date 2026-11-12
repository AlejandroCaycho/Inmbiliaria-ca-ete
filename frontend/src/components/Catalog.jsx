import { Link } from 'react-router-dom'
import SelectMenu from './SelectMenu'
import { useLanguage } from '../context/LanguageContext'
import { useSiteContent } from '../context/SiteContentContext'
import {
  emptyCatalogFilters,
  presupuestos,
  superficies,
  tipologias,
  zonas,
} from '../data/catalogFilters'

const zoneBySlug = {
  'san-vicente': 'San Vicente',
  'cerro-azul': 'Cerro Azul',
  'san-luis': 'San Luis',
  chincha: 'Chincha',
  canete: 'Cañete',
}

function parseAreas(property) {
  const text = `${property.meta ?? ''} ${property.metaEn ?? ''}`
  return [...text.matchAll(/(\d[\d.,]*)\s*m²/gi)]
    .map((match) => Number(match[1].replace(/[.,]/g, '')))
    .filter((value) => Number.isFinite(value) && value > 0)
}

function parsePrice(property) {
  const text = `${property.price ?? ''} ${property.priceEn ?? ''}`
  const match = text.match(/(\d[\d.,]*)/)
  if (!match) return null

  return {
    value: Number(match[1].replace(/[.,]/g, '')),
    currency: /US\$/i.test(text) ? 'USD' : /S\//i.test(text) ? 'PEN' : null,
  }
}

function matchesType(property, tipo) {
  if (tipo === 'todas') return true
  if (tipo === 'casa-venta') return property.group === 'casas' && property.operation === 'venta'
  if (tipo === 'casa-alquiler') return property.group === 'casas' && property.operation === 'alquiler'
  if (tipo === 'terreno') return property.group === 'terrenos'
  if (tipo === 'proyecto') {
    const text = `${property.name} ${property.nameEn ?? ''} ${property.description} ${property.descriptionEn ?? ''} ${property.meta} ${property.metaEn ?? ''}`
    return /frente al mar|beachfront|preventa|pre-sale/i.test(text)
  }
  return true
}

function matchesSurface(property, superficie) {
  if (superficie === 'todas') return true
  const areas = parseAreas(property)
  if (areas.length === 0) return false
  if (superficie === 'hasta-200') return areas.some((area) => area <= 200)
  if (superficie === '200-500') return areas.some((area) => area > 200 && area <= 500)
  if (superficie === '500-1000') return areas.some((area) => area > 500 && area <= 1000)
  if (superficie === '1000+') return areas.some((area) => area > 1000)
  return true
}

function matchesBudget(property, presupuesto) {
  if (presupuesto === 'todos') return true
  const price = parsePrice(property)
  if (presupuesto === 'consultar') return !price
  if (!price) return false
  if (presupuesto === 'hasta-50k') return price.currency === 'PEN' && price.value <= 50000
  if (presupuesto === '50k-100k') {
    return price.currency === 'PEN' && price.value > 50000 && price.value <= 100000
  }
  if (presupuesto === '100k-200k') {
    return price.currency === 'USD' && price.value >= 100000 && price.value <= 200000
  }
  return true
}

function PropertyCard({ property }) {
  const { lang, t } = useLanguage()
  const name = lang === 'en' ? property.nameEn : property.name
  const description = lang === 'en' ? property.descriptionEn : property.description
  const meta = lang === 'en' ? property.metaEn : property.meta
  const price = lang === 'en' ? property.priceEn : property.price
  const alt = lang === 'en' ? property.altEn : property.alt
  const ref = lang === 'en' ? property.refEn : property.ref

  return (
    <article
      data-reveal
      className="bg-stone-900/70 border border-stone-800/90 rounded-xl overflow-hidden hover:border-stone-700 transition-all flex flex-col justify-between"
    >
      <div className="relative w-full aspect-[16/10] max-h-[210px] overflow-hidden bg-stone-950">
        <img src={property.image} alt={alt} className="w-full h-full object-cover" />
        <div className="absolute top-2.5 left-2.5 bg-stone-950/80 px-2 py-0.5 rounded font-sans text-[10px] text-stone-300">
          {ref}
        </div>
        <div className="absolute bottom-2.5 right-2.5 bg-stone-950/85 px-2 py-0.5 rounded font-sans text-[11px] text-stone-100 font-semibold tabular-nums whitespace-nowrap">
          {price}
        </div>
      </div>
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-semibold text-stone-100 tracking-tight">{name}</h3>
          <p className="text-[11px] text-stone-400 line-clamp-2 mt-1 font-light leading-snug">
            {description}
          </p>
        </div>
        <div className="pt-3 mt-3 border-t border-stone-800/80 flex items-center justify-between gap-3 font-sans text-[11px]">
          <span className="text-stone-400 tabular-nums">{meta}</span>
          <Link
            to={`/contacto?inmueble=${property.id}`}
            className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md bg-terracotta px-2.5 py-1.5 font-semibold text-stone-50 transition-colors hover:bg-terracotta-hover"
          >
            {t('Solicitar información', 'Request information')}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </article>
  )
}

export default function Catalog({ filters, onFilterChange }) {
  const { lang, t } = useLanguage()
  const { properties } = useSiteContent()

  const publishedProperties = properties.filter((property) => property.published !== false)

  const localizedLabel = (options, value) => {
    const option = options.find((item) => item.value === value)
    if (!option) return value
    return lang === 'en' ? option.labelEn : option.label
  }

  const visibleProperties = publishedProperties.filter((property) => {
    const matchesZone =
      filters.zona === 'todas' || property.zone === zoneBySlug[filters.zona]
    return (
      matchesZone &&
      matchesType(property, filters.tipo) &&
      matchesSurface(property, filters.superficie) &&
      matchesBudget(property, filters.presupuesto)
    )
  })
  const countLabel = visibleProperties.length

  const activeChips = [
    filters.tipo !== 'todas' && {
      id: 'tipo',
      label: localizedLabel(tipologias, filters.tipo),
      clear: () => onFilterChange({ tipo: 'todas' }),
    },
    filters.zona !== 'todas' && {
      id: 'zona',
      label: localizedLabel(zonas, filters.zona),
      clear: () => onFilterChange({ zona: 'todas' }),
    },
    filters.superficie !== 'todas' && {
      id: 'superficie',
      label: localizedLabel(superficies, filters.superficie),
      clear: () => onFilterChange({ superficie: 'todas' }),
    },
    filters.presupuesto !== 'todos' && {
      id: 'presupuesto',
      label: localizedLabel(presupuestos, filters.presupuesto),
      clear: () => onFilterChange({ presupuesto: 'todos' }),
    },
  ].filter(Boolean)

  return (
    <section id="catalogo" className="py-10 bg-stone-950 border-b border-stone-800">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12">
        <div
          data-reveal
          className="flex flex-col md:flex-row md:items-end justify-between mb-6 pb-4 border-b border-stone-800 gap-4"
        >
          <div>
            <span className="editorial-label text-stone-500">
              {t('PROPIEDADES DISPONIBLES', 'AVAILABLE PROPERTIES')}
            </span>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-stone-100 mt-1">
              {t('Propiedades en Cañete y Chincha', 'Properties in Cañete and Chincha')}{' '}
              <span className="mt-1 block font-sans text-sm font-normal text-stone-400 sm:mt-0 sm:ml-2 sm:inline">
                {countLabel}{' '}
                {visibleProperties.length === 1
                  ? t('propiedad', 'property')
                  : t('propiedades', 'properties')}
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-2 font-sans text-xs sm:gap-3">
            <span className="whitespace-nowrap text-stone-400">
              {t('Filtrar por tipo:', 'Filter by type:')}
            </span>
            <div className="min-w-0 flex-1 sm:flex-none">
              <SelectMenu
                id="catalogo-filtro"
                ariaLabel={t(
                  'Filtrar catálogo por tipo de propiedad',
                  'Filter catalog by property type',
                )}
                options={tipologias.map((option) => ({
                  value: option.value,
                  label: lang === 'en' ? option.labelEn : option.label,
                }))}
                value={filters.tipo}
                onChange={(value) => onFilterChange({ tipo: value })}
                align="right"
                triggerClassName="min-w-0 rounded-lg border border-stone-700 bg-stone-800/80 px-3 py-2 transition-colors hover:border-stone-600 sm:min-w-[230px]"
                valueClassName="text-xs font-sans text-stone-200"
              />
            </div>
          </div>
        </div>

        {activeChips.length > 0 && (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="editorial-label text-stone-500">
              {t('FILTROS ACTIVOS', 'ACTIVE FILTERS')}
            </span>
            {activeChips.map((chip) => (
              <button
                key={chip.id}
                type="button"
                onClick={chip.clear}
                aria-label={`${t('Quitar filtro', 'Remove filter')} ${chip.label}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-terracotta/30 bg-terracotta/10 px-2.5 py-1 font-sans text-[10px] text-stone-100 transition-colors hover:border-terracotta/60 hover:bg-terracotta/15"
              >
                {chip.label}
                <span aria-hidden="true">×</span>
              </button>
            ))}
            <button
              type="button"
              onClick={() => onFilterChange(emptyCatalogFilters)}
              className="font-sans text-[10px] font-semibold text-stone-400 underline-offset-4 transition-colors hover:text-stone-100 hover:underline"
            >
              {t('Limpiar todo', 'Clear all')}
            </button>
          </div>
        )}

        {visibleProperties.length === 0 ? (
          <div
            data-reveal
            className="rounded-xl border border-stone-800 bg-stone-900/40 px-6 py-14 text-center"
          >
            <p className="font-sans text-sm text-stone-200">
              {t('No hay propiedades con estos filtros.', 'No properties match these filters.')}
            </p>
            <p className="mt-2 font-sans text-[11px] font-light leading-relaxed text-stone-500">
              {t(
                'Prueba con otra zona, otro tamaño u otro presupuesto. También puedes contarnos qué buscas y te avisamos cuando ingrese una propiedad que encaje.',
                'Try another area, size or budget. You can also tell us what you are looking for and we will let you know when a matching property arrives.',
              )}
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => onFilterChange(emptyCatalogFilters)}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-terracotta px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-wider text-stone-50 transition-colors hover:bg-terracotta-hover"
              >
                {t('Limpiar filtros', 'Clear filters')}
              </button>
              <Link
                to="/contacto"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-stone-700 px-4 py-2.5 font-sans text-xs font-medium text-stone-200 transition-colors hover:border-stone-500 hover:text-stone-50"
              >
                {t('Hablar con un asesor', 'Talk to an advisor')}
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {visibleProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}

        <div
          data-reveal
          className="mt-6 p-3 bg-stone-900/40 border border-stone-800 rounded-lg flex flex-col sm:flex-row items-center justify-between font-sans text-xs text-stone-400 gap-2"
        >
          <div>
            <span>{t('¿BUSCAS ALGO MÁS?', 'LOOKING FOR SOMETHING ELSE?')}</span>
            <span className="text-stone-200">
              {' '}
              {t(
                'Cuéntanos qué necesitas y te avisamos cuando entre una propiedad que encaje.',
                'Tell us what you need and we will let you know when a property that fits arrives.',
              )}
            </span>
          </div>
          <Link
            to="/contacto"
            className="inline-flex w-full shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-terracotta px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-wider text-stone-50 transition-colors hover:bg-terracotta-hover sm:w-auto"
          >
            {t('Hablar con un asesor', 'Talk to an advisor')}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
