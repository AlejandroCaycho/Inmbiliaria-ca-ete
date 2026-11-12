import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import LanguageSwitch from './LanguageSwitch'
import { useLanguage } from '../context/LanguageContext'

function LockIcon({ className = 'h-3.5 w-3.5' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <rect x="4.5" y="10" width="15" height="10.5" rx="2" />
      <path strokeLinecap="round" d="M8 10V7.5a4 4 0 0 1 8 0V10M12 14.2v2.6" />
    </svg>
  )
}

function MenuIcon({ className = 'h-4 w-4' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  )
}

function CloseIcon({ className = 'h-4 w-4' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path strokeLinecap="round" d="m6 6 12 12M18 6 6 18" />
    </svg>
  )
}

const navLinks = [
  { id: 'destacada', label: 'Propiedad destacada', labelEn: 'Featured property' },
  { id: 'catalogo', label: 'Propiedades', labelEn: 'Properties' },
  { id: 'metodo', label: 'Cómo trabajamos', labelEn: 'How we work' },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const { lang, t } = useLanguage()
  const onContactPage = pathname === '/contacto'
  const [activeSection, setActiveSection] = useState('')
  const [atTop, setAtTop] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRootRef = useRef(null)

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!menuOpen) return undefined

    function handlePointerDown(event) {
      if (menuRootRef.current && !menuRootRef.current.contains(event.target)) {
        setMenuOpen(false)
      }
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [menuOpen])

  useEffect(() => {
    const onScroll = () => setAtTop(window.scrollY <= 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (onContactPage) {
      setActiveSection('contacto')
      return
    }

    const sections = navLinks
      .map((link) => document.getElementById(link.id))
      .filter((section) => section !== null)
    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      { rootMargin: '-40% 0px -55% 0px' },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [onContactPage])

  return (
    <header
      ref={menuRootRef}
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-[width,max-width] duration-300 ease-out ${
        atTop ? 'w-[calc(100%-2rem)] max-w-[1800px]' : 'w-[92%] max-w-[1440px]'
      }`}
    >
      <nav className="h-16 px-3 sm:px-6 md:px-8 bg-stone-900/85 backdrop-blur-md border border-stone-200/10 rounded-2xl flex items-center justify-between gap-2 shadow-2xl transition-all">
        <Link to="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
          <img
            src="/logo.png"
            alt=""
            width="40"
            height="40"
            className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 object-contain"
          />
          <span className="flex flex-col gap-1 leading-none">
            <span className="font-sans text-[11px] sm:text-xs md:text-sm tracking-[0.18em] sm:tracking-widest text-stone-100 font-bold uppercase whitespace-nowrap group-hover:text-terracotta transition-colors">
              Impulso<span className="hidden sm:inline"> Inmobiliario</span>
            </span>
            <span className="sm:hidden font-sans text-[8px] text-stone-500 tracking-[0.18em] whitespace-nowrap">
              Inmobiliario
            </span>
            <span className="hidden sm:inline font-sans text-[10px] text-stone-500 tracking-wider whitespace-nowrap">
              CAÑETE / LIMA / PERÚ
            </span>
          </span>
        </Link>

        <div className="hidden xl:flex items-center gap-8 text-xs font-medium tracking-wide whitespace-nowrap">
          {navLinks.map((link) => (
            <Link
              key={link.id}
              to={`/#${link.id}`}
              aria-current={
                !onContactPage && activeSection === link.id ? 'true' : undefined
              }
              className={`transition-colors ${
                !onContactPage && activeSection === link.id
                  ? 'text-stone-50'
                  : 'text-stone-300 hover:text-stone-50'
              }`}
            >
              {lang === 'en' ? link.labelEn : link.label}
            </Link>
          ))}
          <Link
            to="/contacto"
            aria-current={onContactPage ? 'true' : undefined}
            className={`transition-colors ${
              onContactPage ? 'text-stone-50' : 'text-stone-300 hover:text-stone-50'
            }`}
          >
            {t('Contacto', 'Contact')}
          </Link>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-4 shrink-0">
          <div className="hidden sm:flex items-center border-r border-stone-700/60 pr-4">
            <LanguageSwitch />
          </div>

          <Link
            to="/acceso"
            aria-label={t('Acceso al panel', 'Panel access')}
            title={t('Acceso al panel', 'Panel access')}
            className="hidden sm:inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg border border-stone-700/60 text-stone-400 transition-colors hover:border-stone-500 hover:text-stone-50"
          >
            <LockIcon className="h-4 w-4" />
          </Link>

          <Link
            to="/contacto"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-lg bg-terracotta px-3 py-2 text-[11px] font-sans font-semibold tracking-wider text-stone-50 transition-colors duration-150 hover:bg-terracotta-hover sm:px-4 sm:py-2.5 sm:text-xs"
          >
            {t('Agendar Visita', 'Book a Visit')}
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? t('Cerrar menú', 'Close menu') : t('Abrir menú', 'Open menu')}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-stone-700/60 text-stone-300 transition-colors hover:border-stone-500 hover:text-stone-50 xl:hidden"
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div
          id="mobile-menu"
          className="menu-enter absolute inset-x-0 top-[calc(100%+0.6rem)] rounded-2xl border border-stone-200/10 bg-stone-950/95 p-2 shadow-2xl backdrop-blur-xl xl:hidden"
        >
          <nav
            aria-label={t('Menú de navegación', 'Navigation menu')}
            className="max-h-[calc(100vh-8rem)] overflow-y-auto overscroll-contain"
          >
            {navLinks.map((link) => {
              const isActive = !onContactPage && activeSection === link.id
              return (
                <Link
                  key={link.id}
                  to={`/#${link.id}`}
                  onClick={() => setMenuOpen(false)}
                  aria-current={isActive ? 'true' : undefined}
                  className={`flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 font-sans text-sm transition-colors ${
                    isActive
                      ? 'bg-stone-900 text-stone-50'
                      : 'text-stone-300 hover:bg-stone-900/60 hover:text-stone-50'
                  }`}
                >
                  {lang === 'en' ? link.labelEn : link.label}
                  <span
                    className="text-xs text-stone-600"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </Link>
              )
            })}
            <Link
              to="/contacto"
              onClick={() => setMenuOpen(false)}
              aria-current={onContactPage ? 'true' : undefined}
              className={`flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 font-sans text-sm transition-colors ${
                onContactPage
                  ? 'bg-stone-900 text-stone-50'
                  : 'text-stone-300 hover:bg-stone-900/60 hover:text-stone-50'
              }`}
            >
              {t('Contacto', 'Contact')}
              <span className="text-xs text-stone-600" aria-hidden="true">
                →
              </span>
            </Link>

            <div className="mt-1 flex items-center justify-between gap-3 border-t border-stone-800 px-3 pb-1 pt-3">
              <span className="font-sans text-[10px] uppercase tracking-[0.16em] text-stone-500">
                {t('Idioma', 'Language')}
              </span>
              <LanguageSwitch />
            </div>

            <Link
              to="/acceso"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 font-sans text-sm text-stone-300 transition-colors hover:bg-stone-900/60 hover:text-stone-50"
            >
              <span className="inline-flex items-center gap-2">
                <LockIcon className="h-3.5 w-3.5" />
                {t('Acceso al panel', 'Panel access')}
              </span>
              <span className="text-xs text-stone-600" aria-hidden="true">
                →
              </span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
