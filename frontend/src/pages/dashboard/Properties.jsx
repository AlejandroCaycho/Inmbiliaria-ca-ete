import { useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { useSiteContent } from '../../context/SiteContentContext'
import ModuleHeader from './ModuleHeader'
import PropertyEditor from './PropertyEditor'
import { InboxIcon } from './dashboardIcons'
import { primaryButton, secondaryButton, smallButton } from './fields'
import { pad } from './dashboardUtils'

export default function Properties() {
  const { lang, t } = useLanguage()
  const { leads } = useOutletContext()
  const { properties, updateProperty, addProperty, removeProperty } = useSiteContent()
  const [filter, setFilter] = useState('all')
  const [editor, setEditor] = useState(null)

  const homes = properties.filter((property) => property.group === 'casas').length
  const land = properties.filter((property) => property.group === 'terrenos').length
  const publishedCount = properties.filter((property) => property.published !== false).length
  const visibleProperties =
    filter === 'all' ? properties : properties.filter((property) => property.group === filter)
  const editingProperty =
    editor?.mode === 'edit'
      ? properties.find((property) => property.id === editor.propertyId) ?? null
      : null

  function handleSave(draft) {
    if (editor?.mode === 'edit') {
      updateProperty(editor.propertyId, draft)
    } else {
      addProperty(draft)
    }
    setEditor(null)
  }

  function handleDelete() {
    if (!editingProperty) return
    removeProperty(editingProperty.id)
    setEditor(null)
  }

  const filters = [
    { id: 'all', label: t('Todas', 'All'), count: properties.length },
    { id: 'casas', label: t('Casas', 'Homes'), count: homes },
    { id: 'terrenos', label: t('Terrenos', 'Land'), count: land },
  ]

  function inquiryCount(propertyId) {
    return leads.filter((lead) => lead.propertyId === propertyId).length
  }

  return (
    <>
      <ModuleHeader
        eyebrow={t('SECCIÓN DEL SITIO', 'SITE SECTION')}
        title={t('Propiedades', 'Properties')}
        description={t(
          'Gestiona el catálogo del sitio: añade inmuebles, edita sus datos y decide cuáles están publicados.',
          'Manage the site catalog: add listings, edit their details and decide which ones are published.',
        )}
        actions={
          <>
            <Link
              to="/#catalogo"
              className={secondaryButton}
            >
              {t('Ver catálogo', 'View catalog')}
              <span aria-hidden="true">↗</span>
            </Link>
            <button
              type="button"
              onClick={() => setEditor({ mode: 'add' })}
              className={primaryButton}
            >
              <span aria-hidden="true" className="text-sm leading-none">
                +
              </span>
              {t('Añadir propiedad', 'Add property')}
            </button>
          </>
        }
      />

      <div className="mt-5 flex flex-col gap-4 border-b border-stone-800 pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="editorial-label text-stone-500">{t('CATÁLOGO', 'CATALOG')}</span>
          <h2 className="mt-1 text-lg font-bold tracking-tight text-stone-50">
            {t('Portafolio publicado', 'Published portfolio')}
          </h2>
          <p className="mt-1 font-sans text-[11px] text-stone-500">
            {pad(visibleProperties.length)} {t('de', 'of')} {pad(properties.length)}{' '}
            {t('propiedades', 'properties')} · {pad(publishedCount)}{' '}
            {t('publicadas', 'published')}
          </p>
        </div>
        <div
          role="group"
          aria-label={t('Filtrar propiedades', 'Filter properties')}
          className="flex w-fit items-center gap-1 rounded-lg border border-stone-800 p-1"
        >
          {filters.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={filter === item.id}
              onClick={() => setFilter(item.id)}
              className={`rounded-md px-2.5 py-1.5 font-sans text-[11px] transition-colors ${
                filter === item.id
                  ? 'bg-terracotta font-semibold text-stone-50'
                  : 'text-stone-400 hover:bg-stone-900 hover:text-stone-100'
              }`}
            >
              {item.label}
              <span
                className={`ml-1.5 tabular-nums ${
                  filter === item.id ? 'text-stone-100/80' : 'text-stone-600'
                }`}
              >
                {pad(item.count)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {visibleProperties.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-stone-700 px-5 py-14 text-center">
          <p className="font-sans text-sm text-stone-200">
            {properties.length === 0
              ? t('Todavía no hay propiedades.', 'There are no properties yet.')
              : t('No hay propiedades en este filtro.', 'No properties in this filter.')}
          </p>
          <p className="mx-auto mt-1 max-w-sm font-sans text-[11px] font-light leading-relaxed text-stone-500">
            {properties.length === 0
              ? t(
                  'Añade la primera propiedad para que aparezca en el catálogo del sitio.',
                  'Add the first property so it appears in the site catalog.',
                )
              : t('Prueba con otro filtro.', 'Try another filter.')}
          </p>
          {properties.length === 0 && (
            <button
              type="button"
              onClick={() => setEditor({ mode: 'add' })}
              className={`${primaryButton} mt-5`}
            >
              {t('Añadir propiedad', 'Add property')}
            </button>
          )}
        </div>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visibleProperties.map((property) => {
            const name = lang === 'en' ? property.nameEn : property.name
            const price = lang === 'en' ? property.priceEn : property.price
            const alt = lang === 'en' ? property.altEn : property.alt
            const isPublished = property.published !== false
            const count = inquiryCount(property.id)
            return (
              <article
                key={property.id}
                className={`group flex flex-col overflow-hidden rounded-xl border bg-stone-900/30 transition-colors ${
                  isPublished
                    ? 'border-stone-800 hover:border-stone-700'
                    : 'border-stone-800/70 hover:border-stone-700/70'
                }`}
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-stone-950">
                  <img
                    src={property.image}
                    alt={alt ?? name}
                    loading="lazy"
                    className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] ${
                      isPublished ? '' : 'opacity-50 saturate-50'
                    }`}
                  />
                  <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-2 bg-gradient-to-b from-stone-950/70 to-transparent p-3">
                    <span className="rounded-md border border-stone-50/15 bg-stone-950/60 px-2 py-1 font-sans text-[9px] uppercase tracking-[0.16em] text-stone-100 backdrop-blur-sm">
                      {property.operation === 'alquiler' ? t('Alquiler', 'Rent') : t('Venta', 'Sale')}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      updateProperty(property.id, { published: property.published === false })
                    }
                    aria-pressed={isPublished}
                    aria-label={`${isPublished ? t('Ocultar', 'Hide') : t('Publicar', 'Publish')} ${name}`}
                    className={`absolute right-2.5 top-2.5 inline-flex items-center gap-1.5 rounded-md border px-2 py-1 font-sans text-[9px] uppercase tracking-[0.12em] backdrop-blur-sm transition-colors ${
                      isPublished
                        ? 'border-terracotta/40 bg-terracotta/20 text-stone-50 hover:bg-terracotta/35'
                        : 'border-stone-600/60 bg-stone-950/70 text-stone-400 hover:text-stone-100'
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        isPublished ? 'bg-terracotta' : 'bg-stone-600'
                      }`}
                    />
                    {isPublished ? t('Publicada', 'Published') : t('Oculta', 'Hidden')}
                  </button>
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-stone-950/85 to-transparent p-3">
                    <span className="font-sans text-[9px] uppercase tracking-[0.16em] text-stone-200">
                      {property.zone || '—'}
                    </span>
                    <span className="font-sans text-[9px] tabular-nums text-stone-400">
                      {property.ref}
                    </span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-4">
                  <h3 className="line-clamp-1 font-sans text-sm font-semibold text-stone-50">
                    {name}
                  </h3>
                  <div className="mt-1.5 font-sans text-base font-semibold tabular-nums text-stone-100">
                    {price}
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-stone-800 pt-3 font-sans text-[10px] text-stone-500">
                    <span>
                      {property.group === 'casas' ? t('Casa', 'Home') : t('Terreno', 'Land')}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <InboxIcon className="h-3 w-3" />
                      <span className="tabular-nums text-stone-400">{pad(count)}</span>
                      {count === 1 ? t('consulta', 'inquiry') : t('consultas', 'inquiries')}
                    </span>
                  </div>
                  <div className="mt-auto flex items-center gap-1.5 pt-4">
                    <button
                      type="button"
                      onClick={() => setEditor({ mode: 'edit', propertyId: property.id })}
                      className={`${smallButton} flex-1`}
                    >
                      {t('Editar', 'Edit')}
                    </button>
                    <Link
                      to={`/contacto?inmueble=${property.id}`}
                      aria-label={`${t('Abrir consulta de', 'Open inquiry for')} ${name}`}
                      className="inline-flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-md border border-stone-700 bg-stone-900/40 font-sans text-stone-400 transition-colors hover:border-stone-500 hover:text-stone-50"
                    >
                      <span aria-hidden="true">↗</span>
                    </Link>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}

      <PropertyEditor
        open={Boolean(editor)}
        property={editingProperty}
        onClose={() => setEditor(null)}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </>
  )
}
