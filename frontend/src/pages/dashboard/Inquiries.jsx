import { useEffect, useRef, useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { useSiteContent } from '../../context/SiteContentContext'
import ModuleHeader from './ModuleHeader'
import LeadDrawer from './LeadDrawer'
import { secondaryButton, smallButton, smallPrimaryButton } from './fields'
import {
  CalendarIcon,
  CheckIcon,
  ChevronDownIcon,
  EyeIcon,
  GlobeIcon,
  HomeIcon,
  MailIcon,
  RefreshIcon,
  ReplyIcon,
  TagIcon,
} from './dashboardIcons'
import { findProperty, formatLeadDate, gestionLabels, pad } from './dashboardUtils'

const PAGE_SIZE = 10

function FilterCombobox({ value, onChange, options, label }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const current = options.find((option) => option.id === value) ?? options[0]

  useEffect(() => {
    if (!open) return undefined

    function handlePointerDown(event) {
      if (rootRef.current && !rootRef.current.contains(event.target)) setOpen(false)
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  return (
    <div ref={rootRef} className="relative w-full sm:w-56">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-3 rounded-lg border border-stone-700 bg-stone-900/40 px-3 py-2 font-sans text-[11px] text-stone-200 transition-colors hover:border-stone-500"
      >
        <span className="inline-flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-terracotta" aria-hidden="true" />
          {current.label}
          <span className="tabular-nums text-stone-500">{pad(current.count)}</span>
        </span>
        <ChevronDownIcon
          className={`h-3.5 w-3.5 text-stone-500 transition-transform ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={label}
          className="absolute right-0 z-30 mt-1.5 w-full overflow-hidden rounded-lg border border-stone-700 bg-stone-900 py-1 shadow-2xl"
        >
          {options.map((option) => (
            <li key={option.id} role="option" aria-selected={option.id === value}>
              <button
                type="button"
                onClick={() => {
                  onChange(option.id)
                  setOpen(false)
                }}
                className={`flex w-full items-center justify-between gap-3 px-3 py-2 font-sans text-[11px] transition-colors ${
                  option.id === value
                    ? 'bg-stone-800 text-stone-50'
                    : 'text-stone-300 hover:bg-stone-800/60 hover:text-stone-50'
                }`}
              >
                <span className="inline-flex items-center gap-2">
                  {option.id === value ? (
                    <CheckIcon className="h-3 w-3 text-terracotta" />
                  ) : (
                    <span className="h-3 w-3" aria-hidden="true" />
                  )}
                  {option.label}
                </span>
                <span className="font-sans text-[10px] tabular-nums text-stone-500">
                  {pad(option.count)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function InquiryCard({ lead, property, onOpen, onToggleStatus }) {
  const { lang, t } = useLanguage()
  const isNew = lead.status === 'nueva'
  const initials = lead.name
    .split(' ')
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
  const propertyName = property
    ? lang === 'en'
      ? property.nameEn
      : property.name
    : t('Consulta general', 'General inquiry')
  const propertyPrice = property ? (lang === 'en' ? property.priceEn : property.price) : ''
  const message =
    (lead.demo && lang === 'en' && lead.messageEn) ||
    lead.message ||
    t('Sin mensaje.', 'No message.')

  return (
    <article
      className={`rounded-xl border transition-colors ${
        isNew ? 'border-terracotta/25 bg-stone-900/40' : 'border-stone-800 bg-stone-900/20'
      }`}
    >
      <div className="flex flex-col gap-2.5 px-3.5 py-2.5 xl:flex-row xl:items-center xl:gap-4 xl:py-2">
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border font-sans text-[10px] font-semibold tracking-wide ${
              isNew
                ? 'border-terracotta/30 bg-terracotta/10 text-terracotta'
                : 'border-stone-700 bg-stone-800/40 text-stone-400'
            }`}
          >
            {initials}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate font-sans text-xs font-semibold text-stone-50">{lead.name}</h3>
              {lead.demo && (
                <span className="shrink-0 font-sans text-[9px] uppercase tracking-[0.16em] text-stone-600">
                  Demo
                </span>
              )}
              <span
                className={`ml-auto inline-flex shrink-0 items-center gap-1.5 font-sans text-[9px] uppercase tracking-wider ${
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
            </div>
            <div className="mt-0.5 flex items-center gap-2 overflow-hidden font-sans text-[10px] text-stone-500">
              <span className="inline-flex shrink-0 items-center gap-1">
                <CalendarIcon className="h-3 w-3" />
                {formatLeadDate(lead.date, lang)}
              </span>
              <span className="shrink-0 text-stone-700" aria-hidden="true">
                ·
              </span>
              <span className="inline-flex shrink-0 items-center gap-1">
                <TagIcon className="h-3 w-3" />
                {gestionLabels[lead.gestion]?.[lang] ?? lead.gestion}
              </span>
              <span className="hidden shrink-0 text-stone-700 sm:inline" aria-hidden="true">
                ·
              </span>
              <span className="hidden shrink-0 items-center gap-1 sm:inline-flex">
                <GlobeIcon className="h-3 w-3" />
                {lead.lang === 'en' ? 'English' : 'Español'}
              </span>
              {lead.email && (
                <a
                  href={`mailto:${lead.email}`}
                  className="hidden min-w-0 items-center gap-1 transition-colors hover:text-stone-200 sm:inline-flex"
                >
                  <MailIcon className="h-3 w-3 shrink-0" />
                  <span className="truncate">{lead.email}</span>
                </a>
              )}
              <span className="hidden min-w-0 flex-1 truncate text-stone-400 xl:inline">
                — {message}
              </span>
            </div>
          </div>
        </div>

        <p className="line-clamp-1 font-sans text-[11px] font-light leading-relaxed text-stone-300 xl:hidden">
          {message}
        </p>

        <div className="flex shrink-0 items-center gap-2.5 border-t border-stone-800 pt-2.5 xl:w-[215px] xl:border-l xl:border-t-0 xl:pl-4 xl:pt-0">
          {property ? (
            <img
              src={property.image}
              alt=""
              loading="lazy"
              className="h-9 w-12 shrink-0 rounded-md object-cover"
            />
          ) : (
            <span className="flex h-9 w-12 shrink-0 items-center justify-center rounded-md border border-stone-800 bg-stone-900 text-stone-600">
              <HomeIcon className="h-4 w-4" />
            </span>
          )}
          <div className="min-w-0">
            <div className="truncate font-sans text-[11px] font-medium leading-snug text-stone-100">
              {propertyName}
            </div>
            <div className="mt-0.5 truncate font-sans text-[9px] text-stone-500">
              {property?.ref ?? lead.propertyId}
              {propertyPrice ? ` · ${propertyPrice}` : ''}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-1.5 border-t border-stone-800 pt-2.5 xl:border-l xl:border-t-0 xl:pl-4 xl:pt-0">
          <button type="button" onClick={onOpen} className={smallButton}>
            <EyeIcon className="h-3 w-3" />
            {t('Ver detalle', 'View details')}
          </button>
          <button
            type="button"
            onClick={onToggleStatus}
            className={isNew ? smallPrimaryButton : smallButton}
          >
            {isNew ? <CheckIcon className="h-3 w-3" /> : <ReplyIcon className="h-3 w-3" />}
            {isNew ? t('Marcar atendida', 'Mark attended') : t('Reabrir', 'Reopen')}
          </button>
        </div>
      </div>
    </article>
  )
}

export default function Inquiries() {
  const { t } = useLanguage()
  const { leads, markStatus, refreshLeads } = useOutletContext()
  const { properties } = useSiteContent()
  const [filter, setFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [selectedLeadId, setSelectedLeadId] = useState(null)

  const newCount = leads.filter((lead) => lead.status === 'nueva').length
  const attendedCount = leads.length - newCount
  const visibleLeads = filter === 'all' ? leads : leads.filter((lead) => lead.status === filter)
  const totalPages = Math.max(1, Math.ceil(visibleLeads.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paginatedLeads = visibleLeads.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)
  const rangeStart = visibleLeads.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1
  const rangeEnd = Math.min(safePage * PAGE_SIZE, visibleLeads.length)
  const pageWindowStart = Math.max(1, Math.min(safePage - 2, totalPages - 4))
  const pageNumbers = Array.from({ length: Math.min(5, totalPages) }, (_, index) => pageWindowStart + index)
  const selectedLead = leads.find((lead) => lead.id === selectedLeadId) ?? null
  const selectedProperty = selectedLead
    ? findProperty(properties, selectedLead.propertyId)
    : null

  const tabs = [
    { id: 'all', label: t('Todas', 'All'), count: leads.length },
    { id: 'nueva', label: t('Nuevas', 'New'), count: newCount },
    { id: 'atendida', label: t('Atendidas', 'Attended'), count: attendedCount },
  ]

  function selectFilter(nextFilter) {
    setFilter(nextFilter)
    setPage(1)
  }

  return (
    <>
      <ModuleHeader
        eyebrow={t('GESTIÓN', 'MANAGEMENT')}
        title={t('Consultas recibidas', 'Received inquiries')}
        description={t(
          'Solicitudes enviadas desde el formulario de contacto. Puedes marcarlas como atendidas y volver a abrirlas cuando quieras.',
          'Requests sent from the contact form. You can mark them as attended and reopen them at any time.',
        )}
        actions={
          <>
            <button
              type="button"
              onClick={refreshLeads}
              className="inline-flex items-center gap-1.5 rounded-md border border-stone-800 px-3 py-2 font-sans text-[11px] text-stone-400 transition-colors hover:border-stone-600 hover:text-stone-100"
            >
              <RefreshIcon />
              {t('Actualizar', 'Refresh')}
            </button>
            <Link
              to="/contacto"
              className={secondaryButton}
            >
              {t('Abrir formulario', 'Open form')}
              <span aria-hidden="true">↗</span>
            </Link>
          </>
        }
      />

      <div className="mt-4 flex flex-col gap-4 border-b border-stone-800 pb-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="editorial-label text-stone-500">{t('BANDEJA', 'INBOX')}</span>
          <h2 className="mt-1 text-lg font-bold tracking-tight text-stone-50">
            {filter === 'all'
              ? t('Todas las solicitudes', 'All requests')
              : filter === 'nueva'
                ? t('Solicitudes nuevas', 'New requests')
                : t('Solicitudes atendidas', 'Attended requests')}
          </h2>
          <p className="mt-1 font-sans text-[11px] text-stone-500">
            {pad(visibleLeads.length)}{' '}
            {visibleLeads.length === 1 ? t('solicitud', 'request') : t('solicitudes', 'requests')} ·{' '}
            {pad(newCount)} {t('por atender', 'pending')}
          </p>
        </div>
        <FilterCombobox
          value={filter}
          onChange={selectFilter}
          options={tabs}
          label={t('Filtrar consultas', 'Filter inquiries')}
        />
      </div>

      {visibleLeads.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-stone-700 py-14 text-center">
          <p className="font-sans text-sm text-stone-300">
            {t('No hay consultas en esta vista.', 'No inquiries in this view.')}
          </p>
          <p className="mx-auto mt-1 max-w-sm font-sans text-[11px] font-light leading-relaxed text-stone-500">
            {t(
              'Prueba con otro filtro o envía una consulta desde el formulario de contacto del sitio.',
              'Try another filter or send an inquiry from the site contact form.',
            )}
          </p>
          <Link to="/contacto" className={`${secondaryButton} mt-4`}>
            {t('Abrir formulario de contacto', 'Open contact form')}
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-3 space-y-1.5">
            {paginatedLeads.map((lead) => (
              <InquiryCard
                key={lead.id}
                lead={lead}
                property={findProperty(properties, lead.propertyId)}
                onOpen={() => setSelectedLeadId(lead.id)}
                onToggleStatus={() =>
                  markStatus(lead.id, lead.status === 'nueva' ? 'atendida' : 'nueva')
                }
              />
            ))}
          </div>

          <div className="mt-3 flex flex-col gap-3 border-t border-stone-800 pt-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-sans text-[10px] uppercase tracking-[0.14em] text-stone-500">
              {t('Mostrando', 'Showing')}{' '}
              <span className="tabular-nums text-stone-300">
                {pad(rangeStart)}–{pad(rangeEnd)}
              </span>{' '}
              {t('de', 'of')}{' '}
              <span className="tabular-nums text-stone-300">{pad(visibleLeads.length)}</span> ·{' '}
              {PAGE_SIZE} {t('por página', 'per page')}
            </p>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setPage((value) => Math.max(1, value - 1))}
                disabled={safePage <= 1}
                className={smallButton}
              >
                ← {t('Anterior', 'Previous')}
              </button>
              {pageNumbers.map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => setPage(pageNumber)}
                  aria-current={pageNumber === safePage ? 'page' : undefined}
                  className={`inline-flex h-7 min-w-7 items-center justify-center rounded-md px-2 font-sans text-[10px] font-medium tabular-nums transition-colors ${
                    pageNumber === safePage
                      ? 'bg-terracotta text-stone-50'
                      : 'border border-stone-700 bg-stone-900/40 text-stone-300 hover:border-stone-500 hover:text-stone-50'
                  }`}
                >
                  {pageNumber}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
                disabled={safePage >= totalPages}
                className={smallButton}
              >
                {t('Siguiente', 'Next')} →
              </button>
            </div>
          </div>
        </>
      )}

      <LeadDrawer
        lead={selectedLead}
        property={selectedProperty}
        onClose={() => setSelectedLeadId(null)}
        onStatusChange={markStatus}
      />
    </>
  )
}
