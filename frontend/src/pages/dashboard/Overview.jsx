import { Link, useOutletContext } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import { useSiteContent } from '../../context/SiteContentContext'
import ModuleHeader from './ModuleHeader'
import { smallButton } from './fields'
import { CheckIcon, InboxIcon } from './dashboardIcons'
import {
  formatLeadDate,
  formatToday,
  gestionLabels,
  pad,
  propertyLabel,
} from './dashboardUtils'

function Sparkline({ values }) {
  const width = 104
  const height = 36
  const max = Math.max(...values, 1)
  const step = values.length > 1 ? width / (values.length - 1) : width
  const points = values.map((value, index) => {
    const x = index * step
    const y = height - 3 - (value / max) * (height - 9)
    return [Number(x.toFixed(1)), Number(y.toFixed(1))]
  })
  const line = points.map(([x, y]) => `${x},${y}`).join(' ')
  const area = `0,${height} ${line} ${width},${height}`
  const [lastX, lastY] = points[points.length - 1]

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-9 w-[104px] shrink-0 overflow-visible"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="overview-spark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b85d38" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#b85d38" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#overview-spark)" />
      <polyline
        points={line}
        fill="none"
        stroke="#b85d38"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={lastX} cy={lastY} r="2" fill="#b85d38" />
    </svg>
  )
}

function AttentionRing({ value }) {
  const radius = 26
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - Math.min(Math.max(value, 0), 100) / 100)

  return (
    <div className="relative h-16 w-16 shrink-0">
      <svg viewBox="0 0 64 64" className="h-16 w-16 -rotate-90" aria-hidden="true">
        <circle cx="32" cy="32" r={radius} fill="none" stroke="#2c2b28" strokeWidth="5" />
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke="#b85d38"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-sans text-sm font-semibold tabular-nums text-stone-100">
        {value}%
      </span>
    </div>
  )
}

function leadInitials(name) {
  return name
    .split(' ')
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export default function Overview() {
  const { lang, t } = useLanguage()
  const { user } = useAuth()
  const { properties } = useSiteContent()
  const { leads, markStatus } = useOutletContext()

  const publishedProperties = properties.filter((property) => property.published !== false)
  const pendingLeads = leads.filter((lead) => lead.status === 'nueva')
  const pendingPreview = pendingLeads.slice(0, 2)
  const pendingOverflow = pendingLeads.length - pendingPreview.length
  const newCount = pendingLeads.length
  const attendedCount = leads.length - newCount
  const homes = publishedProperties.filter((property) => property.group === 'casas').length
  const land = publishedProperties.filter((property) => property.group === 'terrenos').length
  const zones = [...new Set(publishedProperties.map((property) => property.zone).filter(Boolean))]
  const attendedRate = leads.length ? Math.round((attendedCount / leads.length) * 100) : 0
  const forSale = publishedProperties.filter((property) => property.operation !== 'alquiler').length
  const forRent = publishedProperties.filter((property) => property.operation === 'alquiler').length

  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const last7Counts = Array.from({ length: 7 }, (_, index) => {
    const start = new Date(todayStart)
    start.setDate(todayStart.getDate() - (6 - index))
    const end = new Date(start)
    end.setDate(start.getDate() + 1)
    return leads.filter((lead) => {
      const date = new Date(lead.date)
      return date >= start && date < end
    }).length
  })
  const last7Total = last7Counts.reduce((total, count) => total + count, 0)
  const last7Start = new Date(todayStart)
  last7Start.setDate(todayStart.getDate() - 6)
  const last7New = leads.filter(
    (lead) => lead.status === 'nueva' && new Date(lead.date) >= last7Start,
  ).length
  const last7Labels = last7Counts.map((_, index) => {
    const date = new Date(todayStart)
    date.setDate(todayStart.getDate() - (6 - index))
    return new Intl.DateTimeFormat(lang === 'en' ? 'en-US' : 'es-PE', { weekday: 'short' })
      .format(date)
      .replace('.', '')
      .slice(0, 3)
      .toUpperCase()
  })
  const maxWeek = Math.max(1, ...last7Counts)

  const zonePortfolio = Object.entries(
    publishedProperties.reduce((totals, property) => {
      if (!property.zone) return totals
      totals[property.zone] = (totals[property.zone] ?? 0) + 1
      return totals
    }, {}),
  ).sort((a, b) => b[1] - a[1])
  const maxZonePortfolio = Math.max(1, ...zonePortfolio.map(([, count]) => count))

  const zoneDemand = Object.entries(
    leads.reduce((totals, lead) => {
      const property = properties.find((item) => item.id === lead.propertyId)
      const zone = property?.zone
      if (!zone) return totals
      totals[zone] = (totals[zone] ?? 0) + 1
      return totals
    }, {}),
  ).sort((a, b) => b[1] - a[1])
  const topDemand = zoneDemand.slice(0, 3)
  const maxDemand = Math.max(1, ...zoneDemand.map(([, count]) => count))
  const preferredIds = ['CAJ-01', 'CA-01', 'CH-01']
  const portfolioPreview = [
    ...preferredIds
      .map((id) => publishedProperties.find((property) => property.id === id))
      .filter(Boolean),
    ...publishedProperties.filter((property) => !preferredIds.includes(property.id)),
  ].slice(0, 3)
  const inquiryTypes = Object.entries(
    leads.reduce((totals, lead) => {
      totals[lead.gestion] = (totals[lead.gestion] ?? 0) + 1
      return totals
    }, {}),
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
  const firstName = user?.name?.split(' ')[0] ?? ''

  return (
    <>
      <ModuleHeader
        notification
        eyebrow={t('RESUMEN GENERAL', 'OVERVIEW')}
        title={t(`Hola, ${firstName}.`, `Hello, ${firstName}.`)}
        description={t(
          'Esta es la cartera publicada y el estado de las consultas recibidas.',
          'This is the published portfolio and the status of received inquiries.',
        )}
        actions={
          <div className="text-right">
            <div className="editorial-label text-[9px] text-stone-50/80">
              {t('HOY', 'TODAY')}
            </div>
            <div className="mt-1 font-sans text-xs text-stone-50">{formatToday(lang)}</div>
          </div>
        }
      />

      <section className="pt-4" aria-label={t('Pulso del negocio', 'Business pulse')}>
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-stone-800 pb-2.5">
          <div>
            <span className="editorial-label text-stone-500">
              {t('PULSO DEL NEGOCIO', 'BUSINESS PULSE')}
            </span>
            <h2 className="mt-0.5 text-base font-bold tracking-tight text-stone-50">
              {t('Métricas del negocio', 'Business metrics')}
            </h2>
          </div>
          <span className="font-sans text-[10px] uppercase tracking-wider text-stone-500">
            {t('ACTUALIZADO HOY', 'UPDATED TODAY')}
          </span>
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <article className="flex flex-col rounded-xl border border-stone-800 bg-stone-900/30 p-3.5 transition-colors hover:border-stone-700">
            <div className="flex items-baseline justify-between gap-3">
              <span className="editorial-label text-[9px] text-stone-500">
                {t('CONSULTAS · 7 DÍAS', 'INQUIRIES · 7 DAYS')}
              </span>
              <span className="font-sans text-[9px] uppercase tracking-wider text-stone-600">
                {t('HOY', 'TODAY')} {pad(last7Counts[6])}
              </span>
            </div>
            <div className="mt-2.5 flex items-end justify-between gap-3">
              <div className="min-w-0">
                <div className="font-sans text-3xl font-semibold leading-none tracking-tight tabular-nums text-stone-50">
                  {pad(last7Total)}
                </div>
                <p className="mt-1 font-sans text-[10px] font-light leading-relaxed text-stone-500">
                  {last7New === 0
                    ? t('Sin nuevas por atender', 'No new inquiries')
                    : last7New === 1
                      ? t('01 nueva por atender', '01 new awaiting attention')
                      : t(
                          `${pad(last7New)} nuevas por atender`,
                          `${pad(last7New)} new awaiting attention`,
                        )}
                </p>
              </div>
              <Sparkline values={last7Counts} />
            </div>
          </article>

          <article className="flex flex-col rounded-xl border border-stone-800 bg-stone-900/30 p-3.5 transition-colors hover:border-stone-700">
            <span className="editorial-label text-[9px] text-stone-500">
              {t('TASA DE ATENCIÓN', 'ATTENTION RATE')}
            </span>
            <div className="mt-2.5 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="font-sans text-3xl font-semibold leading-none tracking-tight tabular-nums text-stone-50">
                  {attendedRate}%
                </div>
                <p className="mt-1 font-sans text-[10px] font-light leading-relaxed text-stone-500">
                  {`${pad(attendedCount)} ${attendedCount === 1 ? t('atendida', 'attended') : t('atendidas', 'attended')} ${t('de', 'of')} ${pad(leads.length)}`}
                </p>
              </div>
              <AttentionRing value={attendedRate} />
            </div>
          </article>

          <article className="flex flex-col rounded-xl border border-stone-800 bg-stone-900/30 p-3.5 transition-colors hover:border-stone-700">
            <div className="flex items-baseline justify-between gap-3">
              <span className="editorial-label text-[9px] text-stone-500">
                {t('DEMANDA POR ZONA', 'DEMAND BY AREA')}
              </span>
              <span className="font-sans text-[10px] tabular-nums text-stone-500">
                {pad(zoneDemand.length)}
                <span className="text-stone-600">
                  {' '}
                  {t('de', 'of')} {pad(zones.length)}
                </span>
              </span>
            </div>

            {topDemand.length === 0 ? (
              <p className="mt-2.5 font-sans text-[10px] font-light leading-relaxed text-stone-500">
                {t(
                  'Aún no hay consultas asociadas a un inmueble.',
                  'There are no inquiries linked to a property yet.',
                )}
              </p>
            ) : (
              <div className="mt-2.5 space-y-1.5">
                {topDemand.map(([zone, count]) => (
                  <div key={zone}>
                    <div className="flex items-baseline justify-between gap-3 font-sans text-[10px]">
                      <span className="truncate text-stone-300">{zone}</span>
                      <span className="tabular-nums text-stone-500">{pad(count)}</span>
                    </div>
                    <div className="mt-0.5 h-1 w-full rounded-full bg-stone-800" aria-hidden="true">
                      <span
                        className="block h-1 rounded-full bg-terracotta/80"
                        style={{ width: `${(count / maxDemand) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </article>

          <article className="flex flex-col rounded-xl border border-stone-800 bg-stone-900/30 p-3.5 transition-colors hover:border-stone-700">
            <span className="editorial-label text-[9px] text-stone-500">
              {t('CARTERA PUBLICADA', 'PUBLISHED PORTFOLIO')}
            </span>
            <div className="mt-2.5 flex items-end justify-between gap-3">
              <div className="font-sans text-3xl font-semibold leading-none tracking-tight tabular-nums text-stone-50">
                {pad(publishedProperties.length)}
              </div>
              <div className="text-right">
                <p className="font-sans text-[10px] text-stone-500">
                  {t('propiedades', 'properties')}
                </p>
                <p className="mt-0.5 font-sans text-[9px] text-stone-600">
                  {`${pad(homes)} ${homes === 1 ? t('casa', 'home') : t('casas', 'homes')} · ${pad(land)} ${land === 1 ? t('terreno', 'land') : t('terrenos', 'land')}`}
                </p>
              </div>
            </div>

            <div className="mt-2.5">
              <div
                className="flex h-1.5 overflow-hidden rounded-full bg-stone-800"
                aria-hidden="true"
              >
                <span
                  className="bg-stone-400"
                  style={{
                    width: `${publishedProperties.length ? (forSale / publishedProperties.length) * 100 : 0}%`,
                  }}
                />
                <span
                  className="bg-terracotta"
                  style={{
                    width: `${publishedProperties.length ? (forRent / publishedProperties.length) * 100 : 0}%`,
                  }}
                />
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 font-sans text-[10px]">
                <span className="inline-flex items-center gap-1.5 text-stone-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-stone-400" />
                  {pad(forSale)} {t('en venta', 'for sale')}
                </span>
                <span className="inline-flex items-center gap-1.5 text-stone-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-terracotta" />
                  {pad(forRent)} {t('en alquiler', 'for rent')}
                </span>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="pt-4" aria-label={t('Resumen', 'Overview')}>
        <div className="grid gap-4 xl:grid-cols-12">
          <article className="flex flex-col overflow-hidden rounded-xl border border-stone-800 bg-stone-900/30 xl:col-span-7">
            <header className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-800 px-5 py-3.5">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-terracotta/25 bg-terracotta/10 text-terracotta">
                  <InboxIcon className="h-4 w-4" />
                </span>
                <div>
                  <span className="editorial-label text-stone-500">
                    {t('PENDIENTES', 'PENDING')}
                  </span>
                  <h2 className="mt-0.5 text-base font-semibold tracking-tight text-stone-50">
                    {t('Consultas por atender', 'Inquiries awaiting attention')}
                  </h2>
                </div>
              </div>
              <Link to="/dashboard/consultas" className={smallButton}>
                {t('Ver bandeja', 'View inbox')}
                <span aria-hidden="true">→</span>
              </Link>
            </header>

            <div className="border-b border-stone-800 bg-terracotta/5 px-5 py-3.5">
              <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
                <div className="flex items-end gap-3">
                  <span
                    className={`font-sans text-4xl font-semibold leading-none tracking-tight tabular-nums ${
                      newCount > 0 ? 'text-terracotta' : 'text-stone-100'
                    }`}
                  >
                    {pad(newCount)}
                  </span>
                  <p className="pb-0.5 font-sans text-[11px] font-medium leading-snug text-stone-200">
                    {t('nuevas por atender', 'new awaiting attention')}
                  </p>
                </div>
                <div className="flex items-center gap-5">
                  <div>
                    <div className="font-sans text-base font-semibold tabular-nums text-stone-200">
                      {pad(attendedCount)}
                    </div>
                    <div className="editorial-label mt-0.5 text-[9px] text-stone-500">
                      {t('ATENDIDAS', 'ATTENDED')}
                    </div>
                  </div>
                  <span className="h-7 w-px bg-stone-800" aria-hidden="true" />
                  <div>
                    <div className="font-sans text-base font-semibold tabular-nums text-stone-200">
                      {pad(leads.length)}
                    </div>
                    <div className="editorial-label mt-0.5 text-[9px] text-stone-500">
                      {t('EN TOTAL', 'TOTAL')}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-1 flex-col">
              <div className="flex flex-1 flex-col px-5 py-3.5">
                <span className="editorial-label text-stone-500">
                  {t('NUEVAS CONSULTAS', 'NEW INQUIRIES')}
                </span>

                {pendingPreview.length > 0 ? (
                  <>
                    <ul className="mt-1 divide-y divide-stone-800/80">
                      {pendingPreview.map((lead) => (
                        <li
                          key={lead.id}
                          className="flex items-center gap-3 py-2.5 first:pt-1.5 last:pb-0"
                        >
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-stone-700/80 bg-stone-900 font-sans text-[10px] font-semibold tracking-wider text-stone-300">
                            {leadInitials(lead.name)}
                          </span>
                          <div className="min-w-0 flex-1">
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
                            <div className="mt-0.5 flex items-center gap-1.5 font-sans text-[10px] text-stone-500">
                              <span className="truncate">
                                {propertyLabel(properties, lead.propertyId, lang, t)}
                              </span>
                              <span className="shrink-0 text-stone-700" aria-hidden="true">
                                ·
                              </span>
                              <span className="shrink-0 tabular-nums">
                                {formatLeadDate(lead.date, lang)}
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => markStatus(lead.id, 'atendida')}
                            className="inline-flex shrink-0 items-center gap-1 rounded-md bg-terracotta px-2.5 py-1.5 font-sans text-[10px] font-semibold text-stone-50 transition-colors hover:bg-terracotta-hover"
                          >
                            <CheckIcon className="h-2.5 w-2.5" />
                            {t('Atender', 'Attend')}
                          </button>
                        </li>
                      ))}
                    </ul>
                    {pendingOverflow > 0 && (
                      <div className="mt-2.5">
                        <Link to="/dashboard/consultas" className={smallButton}>
                          {t(
                            `+${pendingOverflow} más en la bandeja`,
                            `+${pendingOverflow} more in the inbox`,
                          )}
                          <span aria-hidden="true">→</span>
                        </Link>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-1 flex-col justify-center py-6">
                    <p className="font-sans text-xs text-stone-300">
                      {t('No hay consultas pendientes.', 'No pending inquiries.')}
                    </p>
                    <p className="mt-1 font-sans text-[10px] font-light leading-relaxed text-stone-500">
                      {t(
                        'Todas las consultas recibidas están atendidas.',
                        'All received inquiries have been attended.',
                      )}
                    </p>
                  </div>
                )}

                {inquiryTypes.length > 0 && (
                  <div className="mt-auto border-t border-stone-800 pt-3">
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
                      <span className="editorial-label text-[9px] text-stone-500">
                        {t('MOTIVOS DE CONSULTA', 'INQUIRY TYPES')}
                      </span>
                      {inquiryTypes.map(([gestion, count]) => (
                        <span
                          key={gestion}
                          className="inline-flex items-center gap-1.5 font-sans text-[10px] text-stone-400"
                        >
                          <span
                            className="h-1 w-1 rounded-full bg-terracotta/70"
                            aria-hidden="true"
                          />
                          {gestionLabels[gestion]?.[lang] ?? gestion}
                          <span className="font-semibold tabular-nums text-stone-200">
                            {pad(count)}
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </article>

          <article className="flex flex-col overflow-hidden rounded-xl border border-stone-800 bg-stone-900/30 sm:flex-row xl:col-span-5">
            <div className="flex min-w-0 flex-1 flex-col p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="editorial-label text-stone-500">
                    {t('CARTERA', 'PORTFOLIO')}
                  </span>
                  <h2 className="mt-1 text-base font-semibold tracking-tight text-stone-50">
                    {t('Estado del portafolio', 'Portfolio status')}
                  </h2>
                </div>
                <Link to="/dashboard/propiedades" className={`${smallButton} shrink-0 whitespace-nowrap`}>
                  {t('Ver tabla', 'View table')}
                  <span aria-hidden="true">→</span>
                </Link>
              </div>

              <div className="mt-4 flex items-end gap-2.5">
                <span className="font-sans text-4xl font-semibold leading-none tracking-tight tabular-nums text-stone-50">
                  {pad(publishedProperties.length)}
                </span>
                <div className="pb-0.5">
                  <p className="font-sans text-[11px] font-medium text-stone-200">
                    {t('propiedades publicadas', 'published properties')}
                  </p>
                  <p className="mt-0.5 font-sans text-[10px] text-stone-500">
                    {`${pad(homes)} ${t('casas', 'homes')} · ${pad(land)} ${t('terrenos', 'land')}`}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
                  <span className="editorial-label text-[9px] text-stone-500">
                    {t('OPERACIÓN', 'OPERATION')}
                  </span>
                  <span className="inline-flex items-center gap-3 font-sans text-[10px]">
                    <span className="inline-flex items-center gap-1.5 text-stone-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-stone-400" />
                      {pad(forSale)} {t('en venta', 'for sale')}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-stone-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-terracotta" />
                      {pad(forRent)} {t('en alquiler', 'for rent')}
                    </span>
                  </span>
                </div>
                <div
                  className="mt-2 flex h-1.5 overflow-hidden rounded-full bg-stone-800"
                  aria-hidden="true"
                >
                  <span
                    className="bg-stone-400"
                    style={{
                      width: `${publishedProperties.length ? (forSale / publishedProperties.length) * 100 : 0}%`,
                    }}
                  />
                  <span
                    className="bg-terracotta"
                    style={{
                      width: `${publishedProperties.length ? (forRent / publishedProperties.length) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>

              <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2.5 border-t border-stone-800 pt-3">
                <div>
                  <dt className="editorial-label text-[9px] text-stone-500">
                    {t('CASAS', 'HOMES')}
                  </dt>
                  <dd className="mt-1 font-sans text-base font-semibold tabular-nums text-stone-100">
                    {pad(homes)}
                  </dd>
                </div>
                <div>
                  <dt className="editorial-label text-[9px] text-stone-500">
                    {t('TERRENOS', 'LAND')}
                  </dt>
                  <dd className="mt-1 font-sans text-base font-semibold tabular-nums text-stone-100">
                    {pad(land)}
                  </dd>
                </div>
                <div>
                  <dt className="editorial-label text-[9px] text-stone-500">
                    {t('ZONAS', 'AREAS')}
                  </dt>
                  <dd className="mt-1 font-sans text-base font-semibold tabular-nums text-stone-100">
                    {pad(zones.length)}
                  </dd>
                </div>
                <div>
                  <dt className="editorial-label text-[9px] text-stone-500">
                    {t('CONSULTAS', 'INQUIRIES')}
                  </dt>
                  <dd className="mt-1 font-sans text-base font-semibold tabular-nums text-stone-100">
                    {pad(leads.length)}
                  </dd>
                </div>
              </dl>

              <div className="mt-auto pt-3">
                <div className="flex items-start gap-2 border-t border-stone-800 pt-2.5">
                  <span
                    className="mt-[5px] h-1 w-1 shrink-0 rounded-full bg-stone-600"
                    aria-hidden="true"
                  />
                  <p className="font-sans text-[10px] font-light leading-relaxed text-stone-500">
                    {zones.join(' · ')}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid h-24 shrink-0 grid-cols-3 gap-px border-t border-stone-800 bg-stone-800 sm:h-auto sm:w-28 sm:grid-cols-1 sm:grid-rows-3 sm:border-l sm:border-t-0">
              {portfolioPreview.map((property) => (
                <img
                  key={property.id}
                  src={property.image}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="pt-5" aria-label={t('Análisis', 'Analytics')}>
        <div className="grid gap-4 lg:grid-cols-2">
          <article className="rounded-xl border border-stone-800 bg-stone-900/30 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="editorial-label text-stone-500">
                  {t('ACTIVIDAD RECIENTE', 'RECENT ACTIVITY')}
                </span>
                <h2 className="mt-1 text-base font-semibold tracking-tight text-stone-50">
                  {t('Consultas · últimos 7 días', 'Inquiries · last 7 days')}
                </h2>
              </div>
              <div className="text-right">
                <div className="font-sans text-2xl font-semibold leading-none tabular-nums text-stone-50">
                  {pad(last7Total)}
                </div>
                <div className="mt-1 font-sans text-[9px] uppercase tracking-wider text-stone-500">
                  {t('TOTAL', 'TOTAL')}
                </div>
              </div>
            </div>

            <div className="mt-3 flex h-16 items-end gap-2">
              {last7Counts.map((count, index) => (
                <div key={`bar-${index}`} className="flex h-full flex-1 items-end">
                  <span
                    className={`block w-full rounded-t ${
                      index === 6 ? 'bg-terracotta' : 'bg-terracotta/55'
                    }`}
                    style={{ height: `${Math.max((count / maxWeek) * 100, 4)}%` }}
                  />
                </div>
              ))}
            </div>
            <div className="mt-1.5 flex gap-2">
              {last7Counts.map((count, index) => (
                <span
                  key={`tick-${index}`}
                  className="flex flex-1 flex-col items-center gap-0.5 text-center font-sans tabular-nums"
                >
                  <span className="text-[10px] text-stone-400">{pad(count)}</span>
                  <span className="text-[9px] uppercase tracking-wider text-stone-600">
                    {last7Labels[index]}
                  </span>
                </span>
              ))}
            </div>
          </article>

          <article className="rounded-xl border border-stone-800 bg-stone-900/30 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="editorial-label text-stone-500">
                  {t('DISTRIBUCIÓN', 'DISTRIBUTION')}
                </span>
                <h2 className="mt-1 text-base font-semibold tracking-tight text-stone-50">
                  {t('Propiedades por zona', 'Properties by area')}
                </h2>
              </div>
              <div className="text-right">
                <div className="font-sans text-2xl font-semibold leading-none tabular-nums text-stone-50">
                  {pad(zonePortfolio.length)}
                </div>
                <div className="mt-1 font-sans text-[9px] uppercase tracking-wider text-stone-500">
                  {t('ZONAS', 'AREAS')}
                </div>
              </div>
            </div>

            {zonePortfolio.length === 0 ? (
              <p className="mt-4 font-sans text-[10px] font-light leading-relaxed text-stone-500">
                {t(
                  'Aún no hay propiedades publicadas por zona.',
                  'There are no published properties by area yet.',
                )}
              </p>
            ) : (
              <div className="mt-4 grid gap-x-5 gap-y-2 sm:grid-cols-2">
                {zonePortfolio.map(([zone, count]) => (
                  <div key={zone}>
                    <div className="flex items-center justify-between gap-3 font-sans text-[10px]">
                      <span className="truncate text-stone-300">{zone}</span>
                      <span className="tabular-nums text-stone-500">{pad(count)}</span>
                    </div>
                    <div
                      className="mt-0.5 h-1 w-full rounded-full bg-stone-800"
                      aria-hidden="true"
                    >
                      <span
                        className="block h-1 rounded-full bg-terracotta/70"
                        style={{ width: `${(count / maxZonePortfolio) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </article>
        </div>
      </section>
    </>
  )
}
