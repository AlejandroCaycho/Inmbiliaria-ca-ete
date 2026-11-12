import { useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { useSiteContent } from '../../context/SiteContentContext'
import ModuleHeader from './ModuleHeader'
import FeaturedEditor from './FeaturedEditor'
import LeadDrawer from './LeadDrawer'
import { CheckIcon, EyeIcon, ReplyIcon } from './dashboardIcons'
import { primaryButton, secondaryButton, smallButton } from './fields'
import { formatLeadDate, gestionLabels, pad } from './dashboardUtils'

export default function Featured() {
  const { lang, t } = useLanguage()
  const { leads, markStatus } = useOutletContext()
  const { properties, featured, contact, updateFeatured } = useSiteContent()
  const [editorOpen, setEditorOpen] = useState(false)
  const [selectedLeadId, setSelectedLeadId] = useState(null)

  const publishedProperties = properties.filter((property) => property.published !== false)
  const property =
    publishedProperties.find((item) => item.id === featured.propertyId) ??
    publishedProperties[0] ??
    null

  if (!property) {
    return (
      <>
        <ModuleHeader
          eyebrow={t('SECCIÓN DEL SITIO', 'SITE SECTION')}
          title={t('Propiedad destacada', 'Featured property')}
          description={t(
            'La propiedad que se muestra en la portada del sitio y las consultas que ha recibido.',
            'The property shown on the site homepage and the inquiries it has received.',
          )}
          actions={
            <Link
              to="/dashboard/propiedades"
              className={secondaryButton}
            >
              {t('Ir a Propiedades', 'Go to Properties')}
              <span aria-hidden="true">→</span>
            </Link>
          }
        />
        <div className="mt-5 rounded-xl border border-dashed border-stone-700 px-5 py-14 text-center">
          <p className="font-sans text-sm text-stone-200">
            {t(
              'No hay una propiedad publicada para destacar.',
              'There is no published property to feature.',
            )}
          </p>
          <p className="mx-auto mt-1 max-w-md font-sans text-[11px] font-light leading-relaxed text-stone-500">
            {t(
              'Publica una propiedad en el módulo Propiedades y vuelve aquí para elegirla como portada.',
              'Publish a property in the Properties module and come back here to choose it as the homepage.',
            )}
          </p>
        </div>
      </>
    )
  }

  const relatedLeads = leads.filter((lead) => lead.propertyId === property.id)
  const pendingCount = relatedLeads.filter((lead) => lead.status === 'nueva').length
  const selectedLead = leads.find((lead) => lead.id === selectedLeadId) ?? null
  const selectedLeadProperty = selectedLead
    ? properties.find((item) => item.id === selectedLead.propertyId) ?? null
    : null
  const image =
    featured.propertyId === property.id && featured.image ? featured.image : property.image
  const highlights = featured.highlights.filter((item) => item.es || item.en)

  const name = lang === 'en' ? property.nameEn : property.name
  const description = lang === 'en' ? property.descriptionEn : property.description
  const price = lang === 'en' ? property.priceEn : property.price
  const whatsappText =
    lang === 'en'
      ? `Hello, I would like information about ${name} (${property.id}).`
      : `Hola, quiero información de ${name} (${property.id}).`

  return (
    <>
      <ModuleHeader
        eyebrow={t('SECCIÓN DEL SITIO', 'SITE SECTION')}
        title={t('Propiedad destacada', 'Featured property')}
        description={t(
          'La propiedad que se muestra en la portada del sitio y las consultas que ha recibido.',
          'The property shown on the site homepage and the inquiries it has received.',
        )}
        actions={
          <>
            <Link
              to="/#destacada"
              className={secondaryButton}
            >
              {t('Ver en el sitio', 'View on site')}
              <span aria-hidden="true">↗</span>
            </Link>
            <button
              type="button"
              onClick={() => setEditorOpen(true)}
              disabled={publishedProperties.length === 0}
              className={primaryButton}
            >
              {t('Editar destacada', 'Edit featured')}
            </button>
          </>
        }
      />

      <div className="mt-5 grid gap-4 xl:grid-cols-12">
        <figure className="overflow-hidden rounded-xl border border-stone-800 bg-stone-900/30 xl:col-span-7">
          <div className="aspect-[16/10] w-full overflow-hidden bg-stone-950">
            <img
              src={image}
              alt={
                lang === 'en'
                  ? property.altEn
                  : property.alt
              }
              className="h-full w-full object-cover object-center"
            />
          </div>
          <figcaption className="flex items-center justify-between gap-3 border-t border-stone-800 px-4 py-3 font-sans text-[10px] text-stone-500">
            <span>{t('Fotografía real · Impulso Inmobiliario', 'Real photo · Impulso Inmobiliario')}</span>
            <span className="tabular-nums">{property.ref}</span>
          </figcaption>
        </figure>

        <aside className="flex flex-col rounded-xl border border-stone-800 bg-stone-900/30 p-5 xl:col-span-5">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-terracotta" />
            <span className="font-sans text-[10px] uppercase tracking-wider text-stone-300">
              {t('Visible en la portada', 'Visible on the homepage')}
            </span>
          </div>

          <span className="mt-4 font-sans text-[10px] uppercase tracking-[0.16em] text-stone-500">
            REF: {property.ref}
          </span>
          <h2 className="mt-1 text-xl font-bold tracking-tight text-stone-50">{name}</h2>
          <p className="mt-3 font-sans text-[11px] font-light leading-relaxed text-stone-400">
            {description}
          </p>

          <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4 border-t border-stone-800 pt-4">
            <div>
              <dt className="editorial-label text-[9px] text-stone-500">
                {t('PRECIO', 'PRICE')}
              </dt>
              <dd className="mt-1 font-sans text-sm font-semibold tabular-nums text-stone-100">
                {price}
              </dd>
            </div>
            <div>
              <dt className="editorial-label text-[9px] text-stone-500">
                {t('TIPO', 'TYPE')}
              </dt>
              <dd className="mt-1 font-sans text-sm text-stone-200">
                {property.group === 'casas' ? t('Casa', 'Home') : t('Terreno', 'Land')}
              </dd>
            </div>
            <div>
              <dt className="editorial-label text-[9px] text-stone-500">
                {t('ZONA', 'AREA')}
              </dt>
              <dd className="mt-1 font-sans text-sm text-stone-200">{property.zone || '—'}</dd>
            </div>
            <div>
              <dt className="editorial-label text-[9px] text-stone-500">
                {t('MODALIDAD', 'MODE')}
              </dt>
              <dd className="mt-1 font-sans text-sm text-stone-200">
                {property.operation === 'alquiler'
                  ? t('Alquiler · con cita previa', 'Rent · by appointment')
                  : t('Venta · con cita previa', 'Sale · by appointment')}
              </dd>
            </div>
          </dl>

          <div className="mt-auto pt-6">
            <Link
              to={`/contacto?inmueble=${property.id}`}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-terracotta px-4 py-3 font-sans text-xs font-semibold uppercase tracking-wider text-stone-50 transition-colors hover:bg-terracotta-hover"
            >
              {t('Abrir consulta', 'Open inquiry')}
              <span aria-hidden="true">→</span>
            </Link>
            <a
              href={`https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(whatsappText)}`}
              target="_blank"
              rel="noreferrer"
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-stone-700 px-4 py-3 font-sans text-xs font-medium text-stone-200 transition-colors hover:border-stone-500 hover:text-stone-50"
            >
              {t('Consultar por WhatsApp', 'Ask on WhatsApp')}
            </a>
          </div>
        </aside>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-12">
        <section className="rounded-xl border border-stone-800 bg-stone-900/30 p-5 xl:col-span-5">
          <span className="editorial-label text-stone-500">
            {t('LO QUE OFRECE', 'WHAT IT OFFERS')}
          </span>
          {highlights.length === 0 ? (
            <p className="mt-4 font-sans text-[11px] font-light leading-relaxed text-stone-500">
              {t(
                'Todavía no hay puntos destacados. Añádelos desde “Editar destacada”.',
                'There are no highlights yet. Add them from “Edit featured”.',
              )}
            </p>
          ) : (
            <ul className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              {highlights.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2.5 font-sans text-[11px] leading-relaxed text-stone-300"
                >
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-terracotta" />
                  {lang === 'en' ? item.en || item.es : item.es || item.en}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="overflow-hidden rounded-xl border border-stone-800 bg-stone-900/30 xl:col-span-7">
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-800 px-5 py-4">
            <div>
              <span className="editorial-label text-stone-500">
                {t('CONSULTAS DE ESTA PROPIEDAD', 'INQUIRIES FOR THIS PROPERTY')}
              </span>
              <h2 className="mt-1 text-sm font-semibold tracking-tight text-stone-100">
                {pad(relatedLeads.length)}{' '}
                {relatedLeads.length === 1 ? t('registrada', 'registered') : t('registradas', 'registered')}
                {pendingCount > 0 && (
                  <span className="ml-2 font-sans text-[10px] font-normal uppercase tracking-wider text-terracotta">
                    {pad(pendingCount)} {pendingCount === 1 ? t('nueva', 'new') : t('nuevas', 'new')}
                  </span>
                )}
              </h2>
            </div>
            <Link
              to="/dashboard/consultas"
              className={smallButton}
            >
              {t('Ver todas', 'View all')}
              <span aria-hidden="true">→</span>
            </Link>
          </header>

          {relatedLeads.length === 0 ? (
            <p className="px-5 py-8 font-sans text-[11px] font-light leading-relaxed text-stone-500">
              {t(
                'Todavía no hay consultas registradas para esta propiedad.',
                'There are no inquiries registered for this property yet.',
              )}
            </p>
          ) : (
            <ul className="divide-y divide-stone-800/80">
              {relatedLeads.slice(0, 4).map((lead) => {
                const isNew = lead.status === 'nueva'
                return (
                  <li key={lead.id} className="flex flex-wrap items-start justify-between gap-3 px-5 py-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="truncate font-sans text-xs font-medium text-stone-100">
                          {lead.name}
                        </span>
                        {lead.demo && (
                          <span className="font-sans text-[9px] uppercase tracking-[0.16em] text-stone-600">
                            Demo
                          </span>
                        )}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 font-sans text-[10px] text-stone-500">
                        <span>{gestionLabels[lead.gestion]?.[lang] ?? lead.gestion}</span>
                        <span className="tabular-nums">{formatLeadDate(lead.date, lang)}</span>
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 font-sans text-[10px] uppercase tracking-wider ${
                          isNew ? 'text-terracotta' : 'text-stone-500'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            isNew ? 'bg-terracotta' : 'bg-stone-600'
                          }`}
                        />
                        {isNew ? t('Nueva', 'New') : t('Atendida', 'Attended')}
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectedLeadId(lead.id)}
                        className="inline-flex items-center gap-1 rounded-md border border-stone-700 px-2 py-1 font-sans text-[10px] font-medium text-stone-200 transition-colors hover:border-stone-500 hover:text-stone-50"
                      >
                        <EyeIcon className="h-3 w-3" />
                        {t('Ver detalle', 'View details')}
                      </button>
                      <button
                        type="button"
                        onClick={() => markStatus(lead.id, isNew ? 'atendida' : 'nueva')}
                        className={`inline-flex items-center gap-1 rounded-md px-2 py-1 font-sans text-[10px] font-semibold transition-colors ${
                          isNew
                            ? 'bg-terracotta text-stone-50 hover:bg-terracotta-hover'
                            : 'border border-stone-700 bg-stone-900/60 font-medium text-stone-300 hover:border-stone-500 hover:text-stone-50'
                        }`}
                      >
                        {isNew ? <CheckIcon className="h-3 w-3" /> : <ReplyIcon className="h-3 w-3" />}
                        {isNew ? t('Atender', 'Attend') : t('Reabrir', 'Reopen')}
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </div>

      <FeaturedEditor
        open={editorOpen}
        featured={featured}
        properties={properties}
        onClose={() => setEditorOpen(false)}
        onSave={(nextFeatured) => {
          updateFeatured(nextFeatured)
          setEditorOpen(false)
        }}
      />

      <LeadDrawer
        lead={selectedLead}
        property={selectedLeadProperty}
        onClose={() => setSelectedLeadId(null)}
        onStatusChange={markStatus}
      />
    </>
  )
}
