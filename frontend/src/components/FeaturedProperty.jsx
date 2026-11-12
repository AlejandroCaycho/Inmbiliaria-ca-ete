import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { useSiteContent } from '../context/SiteContentContext'

function PinIcon({ className = 'h-3.5 w-3.5' }) {
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
        d="M12 21s7-5.25 7-11a7 7 0 1 0-14 0c0 5.75 7 11 7 11Z"
      />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  )
}

function CameraIcon({ className = 'h-3 w-3' }) {
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
        d="M4 8.5h2.5L8 6h8l1.5 2.5H20v10H4v-10ZM12 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
      />
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

function CheckIcon({ className = 'h-3 w-3' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m5 10.5 3 3 7-7" />
    </svg>
  )
}

export default function FeaturedProperty() {
  const { lang, t } = useLanguage()
  const { properties, featured, contact } = useSiteContent()
  const publishedProperties = properties.filter((property) => property.published !== false)
  const property =
    publishedProperties.find((item) => item.id === featured.propertyId) ??
    publishedProperties[0]

  if (!property) return null

  const image =
    featured.propertyId === property.id && featured.image ? featured.image : property.image

  const name = lang === 'en' ? property.nameEn : property.name
  const price = lang === 'en' ? property.priceEn : property.price
  const meta = lang === 'en' ? property.metaEn : property.meta
  const alt = lang === 'en' ? property.altEn : property.alt
  const location = lang === 'en' ? property.locationEn : property.location
  const chips = (meta || '')
    .split('·')
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 3)
  const highlights = featured.highlights
    .map((item) => (lang === 'en' ? item.en || item.es : item.es || item.en))
    .filter(Boolean)
  const whatsappText =
    lang === 'en'
      ? `Hello, I would like information about ${name} (${property.id}).`
      : `Hola, quiero información de ${name} (${property.id}).`
  const whatsappHref = `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(whatsappText)}`

  return (
    <section id="destacada" className="py-12 border-b border-stone-800/80 bg-stone-950">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12">
        <div
          data-reveal
          className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-stone-800"
        >
          <div className="flex items-center gap-3">
            <span className="editorial-label text-stone-500">
              {t('PROPIEDAD DESTACADA', 'FEATURED PROPERTY')}
            </span>
            <span className="h-3 w-px bg-stone-700" aria-hidden="true" />
            <span className="font-sans text-[11px] text-stone-400">REF: {property.ref}</span>
          </div>
          <span className="inline-flex items-center gap-2 font-sans text-[10px] uppercase tracking-wider text-stone-300">
            <span className="h-1.5 w-1.5 rounded-full bg-terracotta" />
            {t('Disponible para visita', 'Available to visit')}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          <div
            data-reveal
            className="group relative min-h-[320px] overflow-hidden rounded-2xl border border-stone-800 bg-stone-900 sm:min-h-[380px] lg:col-span-8 lg:min-h-[540px]"
          >
            <img
              src={image}
              alt={alt}
              className="absolute inset-0 h-full w-full object-cover object-center brightness-[0.94] saturate-[1.05] transition-transform duration-700 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/25 to-stone-950/10" />
            <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4 md:p-5">
              <span className="inline-flex items-center gap-2 rounded-full border border-stone-50/15 bg-stone-950/60 px-3 py-1.5 font-sans text-[10px] uppercase tracking-[0.16em] text-stone-100 backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-terracotta" />
                {property.operation === 'alquiler'
                  ? t('En alquiler', 'For rent')
                  : t('En venta', 'For sale')}
              </span>
              <span className="rounded-full border border-stone-50/15 bg-stone-950/60 px-3 py-1.5 font-sans text-[10px] tracking-wider text-stone-200 backdrop-blur tabular-nums">
                {property.ref}
              </span>
            </div>

            <div className="absolute inset-x-0 bottom-0 p-5 md:p-7">
              <div className="flex items-center gap-1.5 font-sans text-[10px] uppercase tracking-[0.18em] text-stone-300">
                <PinIcon className="h-3.5 w-3.5 text-terracotta" />
                {location}
              </div>
              <h3 className="mt-2 max-w-xl font-sans text-3xl md:text-4xl font-bold tracking-tight text-stone-50">
                {name}
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {chips.map((item) => (
                  <span
                    key={item}
                    className="rounded-md border border-stone-50/10 bg-stone-950/55 px-2.5 py-1 font-sans text-[10px] text-stone-200 backdrop-blur tabular-nums"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-1.5 font-sans text-[9px] uppercase tracking-wider text-stone-400">
                <CameraIcon className="h-3 w-3" />
                {t('Fotografía real · Impulso Inmobiliario', 'Real photo · Impulso Inmobiliario')}
              </div>
            </div>
          </div>

          <aside
            data-reveal
            className="lg:col-span-4 flex flex-col rounded-2xl border border-stone-800 bg-stone-900/50 p-5 md:p-6"
          >
            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="editorial-label text-stone-500">
                    {property.operation === 'alquiler'
                      ? t('Precio de alquiler', 'Rental price')
                      : t('Precio de venta', 'Sale price')}
                  </span>
                  <div className="mt-1 font-sans text-3xl font-bold tracking-tight text-stone-50">
                    {price}
                  </div>
                </div>
                <span className="rounded-md border border-stone-700/70 bg-stone-950/50 px-2 py-1 font-sans text-[9px] uppercase tracking-wider text-stone-400">
                  {property.group === 'casas' ? t('Casa', 'House') : t('Terreno', 'Land')}
                </span>
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-stone-400">
                {t(
                  'Precio y financiamiento se coordinan directamente con el asesor.',
                  'Price and financing are coordinated directly with the advisor.',
                )}
              </p>
            </div>

            <div className="my-5 h-px bg-stone-800" />

            <span className="editorial-label text-stone-500">
              {t('Lo que ofrece', 'What it offers')}
            </span>
            <ul className="mt-3 space-y-2.5">
              {highlights.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 font-sans text-xs text-stone-300"
                >
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-terracotta/30 bg-terracotta/10 text-terracotta">
                    <CheckIcon className="h-2.5 w-2.5" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-6">
              <Link
                to={`/contacto?inmueble=${property.id}`}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-terracotta px-4 py-3 font-sans text-xs font-semibold uppercase tracking-wider text-stone-50 transition-colors hover:bg-terracotta-hover"
              >
                {t('Agendar una visita', 'Schedule a visit')}
                <ArrowIcon />
              </Link>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-stone-700 px-4 py-3 font-sans text-xs font-medium text-stone-200 transition-colors hover:border-stone-500 hover:text-stone-50"
              >
                {t('Consultar por WhatsApp', 'Ask on WhatsApp')}
              </a>
              <p className="mt-3 text-center font-sans text-[10px] text-stone-500">
                {t('Visita coordinada con el asesor.', 'Visit coordinated with the advisor.')}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
