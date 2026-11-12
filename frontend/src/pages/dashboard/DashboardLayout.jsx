import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import LanguageSwitch from '../../components/LanguageSwitch'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import { useSiteContent } from '../../context/SiteContentContext'
import { getLeads, updateLeadStatus } from '../../lib/leads'
import {
  CheckIcon,
  GridIcon,
  HomeIcon,
  InboxIcon,
  LogOutIcon,
  PhoneIcon,
  StarIcon,
  StepsIcon,
} from './dashboardIcons'
import { smallButton } from './fields'
import { pad } from './dashboardUtils'

function ChevronLeftIcon({ className = 'h-4 w-4' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m14.5 6-6 6 6 6" />
    </svg>
  )
}

function ChevronRightIcon({ className = 'h-4 w-4' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m9.5 6 6 6-6 6" />
    </svg>
  )
}

function SidebarLink({ to, end, label, count, Icon, collapsed }) {
  return (
    <NavLink
      to={to}
      end={end}
      title={collapsed ? label : undefined}
      className={({ isActive }) =>
        `group flex items-center rounded-lg font-sans text-xs transition-colors ${
          collapsed ? 'justify-center px-0 py-2.5' : 'justify-between gap-3 px-3 py-2.5'
        } ${
          isActive
            ? 'bg-stone-900 text-stone-50'
            : 'text-stone-400 hover:bg-stone-900/60 hover:text-stone-100'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span className={`flex min-w-0 items-center ${collapsed ? '' : 'gap-2.5'}`}>
            <Icon
              className={`h-4 w-4 shrink-0 ${
                isActive ? 'text-terracotta' : 'text-stone-500 group-hover:text-stone-300'
              }`}
            />
            {!collapsed && <span className="truncate">{label}</span>}
          </span>
          {!collapsed && typeof count === 'number' && (
            <span className="shrink-0 font-sans text-[10px] tabular-nums text-stone-500">
              {pad(count)}
            </span>
          )}
        </>
      )}
    </NavLink>
  )
}

function MobileLink({ to, end, label, count }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `shrink-0 rounded-md px-3 py-1.5 font-sans text-[11px] transition-colors ${
          isActive ? 'bg-stone-900 text-stone-50' : 'text-stone-400 hover:text-stone-100'
        }`
      }
    >
      {label}
      {typeof count === 'number' && (
        <span className="ml-1.5 text-[10px] tabular-nums text-stone-500">{pad(count)}</span>
      )}
    </NavLink>
  )
}

export default function DashboardLayout() {
  const { lang, t } = useLanguage()
  const { user, logout } = useAuth()
  const { properties } = useSiteContent()
  const [leads, setLeads] = useState(() => getLeads())
  const [notice, setNotice] = useState(null)
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return window.localStorage.getItem('impulso-sidebar') === 'collapsed'
    } catch {
      return false
    }
  })
  const noticeTimer = useRef(null)

  useEffect(() => () => window.clearTimeout(noticeTimer.current), [])

  useEffect(() => {
    try {
      window.localStorage.setItem('impulso-sidebar', collapsed ? 'collapsed' : 'expanded')
    } catch {
      /* storage unavailable */
    }
  }, [collapsed])

  const newCount = leads.filter((lead) => lead.status === 'nueva').length
  const publishedCount = properties.filter((property) => property.published !== false).length
  const initials = (user?.name ?? 'AI')
    .split(' ')
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const primaryModules = [
    { to: '/dashboard', end: true, label: t('Resumen', 'Overview'), Icon: GridIcon },
    { to: '/dashboard/consultas', label: t('Consultas', 'Inquiries'), count: newCount, Icon: InboxIcon },
  ]

  const siteModules = [
    {
      to: '/dashboard/destacada',
      label: t('Propiedad destacada', 'Featured property'),
      Icon: StarIcon,
    },
    {
      to: '/dashboard/propiedades',
      label: t('Propiedades', 'Properties'),
      count: publishedCount,
      Icon: HomeIcon,
    },
    { to: '/dashboard/metodo', label: t('Cómo trabajamos', 'How we work'), Icon: StepsIcon },
    { to: '/dashboard/contacto', label: t('Contacto', 'Contact'), Icon: PhoneIcon },
  ]

  const groups = [
    { label: t('GESTIÓN', 'MANAGEMENT'), modules: primaryModules },
    { label: t('SECCIONES DEL SITIO', 'SITE SECTIONS'), modules: siteModules },
  ]

  function markStatus(id, status) {
    setLeads(updateLeadStatus(id, status))
    setNotice({ status })
    window.clearTimeout(noticeTimer.current)
    noticeTimer.current = window.setTimeout(() => setNotice(null), 3200)
  }

  function refreshLeads() {
    setLeads(getLeads())
  }

  return (
    <div className="min-h-screen bg-stone-950 font-sans text-stone-100">
      <div className="flex w-full">
        <aside
          className={`sticky top-0 hidden h-screen shrink-0 flex-col overflow-hidden border-r border-stone-800/80 py-5 transition-[width,padding] duration-300 ease-out lg:flex ${
            collapsed ? 'w-[76px] px-3' : 'w-[264px] px-5'
          }`}
        >
          <div className={`flex items-center ${collapsed ? 'flex-col gap-3' : 'gap-3'}`}>
            <Link
              to="/"
              title={collapsed ? t('Ir al sitio', 'Go to site') : undefined}
              className="group flex min-w-0 items-center gap-3"
            >
              <img
                src="/logo.png"
                alt=""
                width="40"
                height="40"
                className="h-9 w-9 shrink-0 object-contain"
              />
              {!collapsed && (
                <span className="flex flex-col gap-1 leading-none">
                  <span className="text-xs font-bold uppercase tracking-widest text-stone-100 transition-colors group-hover:text-terracotta">
                    Impulso
                  </span>
                  <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-stone-500">
                    {t('PANEL DE GESTIÓN', 'MANAGEMENT PANEL')}
                  </span>
                </span>
              )}
            </Link>
            <button
              type="button"
              onClick={() => setCollapsed((value) => !value)}
              aria-expanded={!collapsed}
              aria-label={collapsed ? t('Expandir menú', 'Expand menu') : t('Contraer menú', 'Collapse menu')}
              title={collapsed ? t('Expandir menú', 'Expand menu') : t('Contraer menú', 'Collapse menu')}
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-stone-800 text-stone-500 transition-colors hover:border-stone-600 hover:text-stone-100 ${
                collapsed ? '' : 'ml-auto'
              }`}
            >
              {collapsed ? (
                <ChevronRightIcon className="h-3.5 w-3.5" />
              ) : (
                <ChevronLeftIcon className="h-3.5 w-3.5" />
              )}
            </button>
          </div>

          <nav className="mt-7 space-y-5" aria-label={t('Módulos del panel', 'Panel modules')}>
            {groups.map((group, index) => (
              <div key={group.label}>
                {collapsed ? (
                  index > 0 && (
                    <div className="mx-2 mb-3 border-t border-stone-800/70" aria-hidden="true" />
                  )
                ) : (
                  <div className="editorial-label px-3 text-[9px] text-stone-500">
                    {group.label}
                  </div>
                )}
                <div className={`space-y-1 ${collapsed ? '' : 'mt-2'}`}>
                  {group.modules.map((module) => (
                    <SidebarLink key={module.to} {...module} collapsed={collapsed} />
                  ))}
                </div>
              </div>
            ))}
          </nav>

          <div className={`mt-auto ${collapsed ? 'flex flex-col items-center gap-3' : 'space-y-4'}`}>
            {collapsed ? (
              <>
                <Link
                  to="/"
                  aria-label={t('Ver sitio', 'View site')}
                  title={t('Ver sitio', 'View site')}
                  className="flex h-9 w-9 items-center justify-center rounded-md text-stone-400 transition-colors hover:bg-stone-900 hover:text-stone-100"
                >
                  <span aria-hidden="true" className="text-sm">
                    ↗
                  </span>
                </Link>
                <div className="flex w-full flex-col items-center gap-2 border-t border-stone-800 pt-3">
                  <span
                    title={user?.name}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-stone-700/80 bg-stone-900 font-sans text-[11px] font-semibold tracking-widest text-stone-200"
                  >
                    {initials}
                  </span>
                  <button
                    type="button"
                    onClick={logout}
                    aria-label={t('Cerrar sesión', 'Sign out')}
                    title={t('Cerrar sesión', 'Sign out')}
                    className="flex h-8 w-8 items-center justify-center rounded-md text-stone-500 transition-colors hover:bg-stone-900 hover:text-terracotta"
                  >
                    <LogOutIcon />
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between gap-2">
                  <LanguageSwitch />
                  <Link to="/" className={smallButton}>
                    {t('Ver sitio', 'View site')} <span aria-hidden="true">↗</span>
                  </Link>
                </div>

                <div className="border-t border-stone-800 pt-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-stone-700/80 bg-stone-900 font-sans text-[11px] font-semibold tracking-widest text-stone-200">
                      {initials}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-sans text-xs font-semibold text-stone-100">
                        {user?.name}
                      </div>
                      <div className="truncate font-sans text-[10px] text-stone-500">{user?.email}</div>
                    </div>
                    <button
                      type="button"
                      onClick={logout}
                      aria-label={t('Cerrar sesión', 'Sign out')}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-stone-500 transition-colors hover:bg-stone-900 hover:text-terracotta"
                    >
                      <LogOutIcon />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-4 border-b border-stone-800 px-5 py-4 lg:hidden">
            <Link to="/" className="flex items-center gap-2.5">
              <img src="/logo.png" alt="" width="32" height="32" className="h-8 w-8 object-contain" />
              <span className="flex flex-col gap-0.5 leading-none">
                <span className="text-[11px] font-bold uppercase tracking-widest text-stone-100">
                  Impulso
                </span>
                <span className="font-sans text-[8px] uppercase tracking-[0.2em] text-stone-500">
                  {t('PANEL DE GESTIÓN', 'MANAGEMENT PANEL')}
                </span>
              </span>
            </Link>
            <div className="flex items-center gap-3">
              <LanguageSwitch />
              <button
                type="button"
                onClick={logout}
                aria-label={t('Cerrar sesión', 'Sign out')}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-stone-800 text-stone-400 transition-colors hover:border-stone-600 hover:text-terracotta"
              >
                <LogOutIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          <nav
            className="flex gap-1 overflow-x-auto border-b border-stone-800 px-4 py-2 lg:hidden"
            aria-label={t('Módulos del panel', 'Panel modules')}
          >
            {primaryModules.map((module) => (
              <MobileLink key={module.to} {...module} />
            ))}
            <span className="mx-1 w-px shrink-0 self-stretch bg-stone-800" aria-hidden="true" />
            {siteModules.map((module) => (
              <MobileLink key={module.to} {...module} />
            ))}
          </nav>

          <main className="relative w-full max-w-[1720px] px-5 pb-6 sm:px-8 lg:px-10 lg:pb-7">
            <Outlet context={{ leads, markStatus, refreshLeads }} />
          </main>
        </div>
      </div>

      {notice && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-2.5 rounded-lg border border-stone-700 bg-stone-900 px-4 py-2.5 shadow-2xl lg:left-auto lg:right-6 lg:translate-x-0"
        >
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-terracotta/15 text-terracotta">
            <CheckIcon className="h-3 w-3" />
          </span>
          <span className="whitespace-nowrap font-sans text-[11px] text-stone-200">
            {notice.status === 'atendida'
              ? t('Consulta marcada como atendida.', 'Inquiry marked as attended.')
              : t('Consulta reabierta.', 'Inquiry reopened.')}
          </span>
        </div>
      )}
    </div>
  )
}
