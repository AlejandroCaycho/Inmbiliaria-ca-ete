import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import LanguageSwitch from '../components/LanguageSwitch'
import { DEMO_CREDENTIALS, useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'

function LockIcon({ className = 'h-4 w-4' }) {
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

function MailIcon({ className = 'h-4 w-4' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m4 8 8 5.5L20 8" />
    </svg>
  )
}

function EyeIcon({ open }) {
  return open ? (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 3l18 18M10.6 10.7a2.2 2.2 0 0 0 3.1 3.1M9.5 5.6A10.6 10.6 0 0 1 12 5.3c4.6 0 8.2 3.1 9.5 6.7a11.4 11.4 0 0 1-2.7 3.8M6.2 7.1A11.7 11.7 0 0 0 2.5 12c1.3 3.6 4.9 6.7 9.5 6.7 1.5 0 2.9-.3 4.1-.9"
      />
    </svg>
  ) : (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 12C3.8 8.4 7.4 5.3 12 5.3s8.2 3.1 9.5 6.7c-1.3 3.6-4.9 6.7-9.5 6.7S3.8 15.6 2.5 12Z" />
      <circle cx="12" cy="12" r="2.6" />
    </svg>
  )
}

export default function Login() {
  const { t } = useLanguage()
  const { isAuthenticated, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [pending, setPending] = useState(false)
  const [hasError, setHasError] = useState(false)

  if (isAuthenticated) {
    const from = location.state?.from
    return <Navigate to={from?.startsWith('/dashboard') ? from : '/dashboard'} replace />
  }

  function fillDemo() {
    setEmail(DEMO_CREDENTIALS.email)
    setPassword(DEMO_CREDENTIALS.password)
    setHasError(false)
  }

  function updateEmail(value) {
    setEmail(value)
    if (hasError) setHasError(false)
  }

  function updatePassword(value) {
    setPassword(value)
    if (hasError) setHasError(false)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setHasError(false)
    setPending(true)
    try {
      await login(email, password)
      const from = location.state?.from
      navigate(from?.startsWith('/dashboard') ? from : '/dashboard', { replace: true })
    } catch {
      setHasError(true)
      setPending(false)
    }
  }

  return (
    <div className="min-h-screen bg-stone-950 font-sans text-stone-100 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.02fr)]">
      <div className="flex min-h-screen flex-col px-6 py-7 sm:px-10 lg:px-14 xl:px-20">
        <header className="flex items-center justify-between gap-4">
          <Link to="/" className="group flex items-center gap-3">
            <img
              src="/logo.png"
              alt=""
              width="40"
              height="40"
              className="h-9 w-9 object-contain md:h-10 md:w-10"
            />
            <span className="flex flex-col gap-1 leading-none">
              <span className="text-xs font-bold uppercase tracking-widest text-stone-100 transition-colors group-hover:text-terracotta md:text-sm">
                Impulso Inmobiliario
              </span>
              <span className="text-[9px] uppercase tracking-[0.22em] text-stone-500">
                {t('PANEL DE GESTIÓN', 'MANAGEMENT PANEL')}
              </span>
            </span>
          </Link>
          <LanguageSwitch />
        </header>

        <div className="flex flex-1 items-center py-10 sm:py-14">
          <div className="w-full max-w-[420px] lg:mx-auto">
            <div className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-terracotta" />
              <span className="editorial-label text-stone-400">
                {t('ACCESO PRIVADO', 'PRIVATE ACCESS')}
              </span>
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-stone-50 sm:text-4xl">
              {t('Ingresa a tu panel.', 'Sign in to your panel.')}
            </h1>
            <p className="mt-3 max-w-sm text-sm font-light leading-relaxed text-stone-400">
              {t(
                'Revisa la cartera de propiedades y las consultas recibidas de Impulso Inmobiliario.',
                'Review the Impulso Inmobiliario property portfolio and received inquiries.',
              )}
            </p>

            <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="acceso-correo"
                  className="editorial-label mb-1.5 block text-[10px] text-stone-400"
                >
                  {t('CORREO', 'EMAIL')}
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500">
                    <MailIcon />
                  </span>
                  <input
                    id="acceso-correo"
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(event) => updateEmail(event.target.value)}
                    placeholder="asesor@impulsoinmobiliario.pe"
                    className="h-12 w-full rounded-lg border border-stone-800 bg-stone-900/50 pl-11 pr-3 font-sans text-xs text-stone-100 placeholder-stone-600 transition-colors focus:border-terracotta focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="acceso-clave"
                  className="editorial-label mb-1.5 block text-[10px] text-stone-400"
                >
                  {t('CONTRASEÑA', 'PASSWORD')}
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500">
                    <LockIcon />
                  </span>
                  <input
                    id="acceso-clave"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(event) => updatePassword(event.target.value)}
                    placeholder={t('Tu contraseña', 'Your password')}
                    className="h-12 w-full rounded-lg border border-stone-800 bg-stone-900/50 pl-11 pr-12 font-sans text-xs text-stone-100 placeholder-stone-600 transition-colors focus:border-terracotta focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={
                      showPassword
                        ? t('Ocultar contraseña', 'Hide password')
                        : t('Mostrar contraseña', 'Show password')
                    }
                    className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-stone-500 transition-colors hover:bg-stone-800 hover:text-stone-200 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
                  >
                    <EyeIcon open={showPassword} />
                  </button>
                </div>
              </div>

              {hasError && (
                <p
                  role="alert"
                  className="flex items-start gap-2 rounded-lg border border-terracotta/40 bg-terracotta/10 px-3 py-2.5 font-sans text-[11px] leading-relaxed text-stone-100"
                >
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-terracotta" />
                  {t(
                    'El correo o la contraseña no son correctos. Revisa los datos o usa las credenciales de demostración.',
                    'The email or password is incorrect. Check your details or use the demo credentials.',
                  )}
                </p>
              )}

              <button
                type="submit"
                disabled={pending}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-terracotta px-5 font-sans text-xs font-semibold uppercase tracking-wider text-stone-50 transition-colors hover:bg-terracotta-hover disabled:cursor-wait disabled:opacity-80"
              >
                {pending ? (
                  <>
                    <svg
                      className="h-4 w-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="8"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeOpacity="0.3"
                      />
                      <path
                        d="M20 12a8 8 0 0 0-8-8"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                    </svg>
                    {t('Ingresando…', 'Signing in…')}
                  </>
                ) : (
                  <>
                    {t('Ingresar al panel', 'Enter panel')}
                    <span aria-hidden="true">→</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-7 rounded-xl border border-stone-800 bg-stone-900/50 p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="editorial-label text-stone-400">
                  {t('CREDENCIALES DE DEMOSTRACIÓN', 'DEMO CREDENTIALS')}
                </span>
                <span className="font-sans text-[10px] text-stone-500">DEMO</span>
              </div>
              <dl className="mt-3 space-y-2 font-sans text-[11px] sm:space-y-1.5">
                <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                  <dt className="text-stone-500">{t('Correo', 'Email')}</dt>
                  <dd className="break-all text-stone-200 sm:truncate">{DEMO_CREDENTIALS.email}</dd>
                </div>
                <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                  <dt className="text-stone-500">{t('Contraseña', 'Password')}</dt>
                  <dd className="tracking-wider text-stone-200">{DEMO_CREDENTIALS.password}</dd>
                </div>
              </dl>
              <button
                type="button"
                onClick={fillDemo}
                className="mt-3 inline-flex items-center gap-1.5 font-sans text-[11px] font-semibold text-terracotta transition-colors hover:text-stone-100"
              >
                {t('Completar credenciales', 'Fill credentials')}
                <span aria-hidden="true">→</span>
              </button>
            </div>

            <p className="mt-4 font-sans text-[10px] leading-relaxed text-stone-500">
              {t(
                'Acceso simulado con fines de demostración. No se envían datos a un servidor.',
                'Simulated access for demonstration purposes. No data is sent to a server.',
              )}
            </p>
          </div>
        </div>

        <footer className="flex items-center justify-between gap-4 border-t border-stone-800/80 pt-5">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 font-sans text-[11px] text-stone-400 transition-colors hover:text-terracotta"
          >
            <span aria-hidden="true">←</span> {t('Volver al sitio', 'Back to site')}
          </Link>
          <span className="font-sans text-[10px] text-stone-600">CAÑETE · LIMA · PERÚ</span>
        </footer>
      </div>

      <aside className="relative hidden min-h-screen overflow-hidden lg:block">
        <img
          src="/images/hero-propiedad.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-stone-950/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/50 to-transparent" />

        <div className="relative flex h-full flex-col justify-between p-10 xl:p-14">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-terracotta" />
            <span className="editorial-label text-stone-300">
              {t('GESTIÓN INMOBILIARIA', 'REAL ESTATE MANAGEMENT')}
            </span>
          </div>

          <div className="max-w-md">
            <p className="editorial-label text-stone-400">CAÑETE · LIMA · PERÚ</p>
            <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-stone-50 xl:text-4xl">
              {t(
                'Cada propiedad y cada consulta, en un solo lugar.',
                'Every property and every inquiry, in one place.',
              )}
            </h2>
            <p className="mt-3 max-w-sm text-sm font-light leading-relaxed text-stone-300">
              {t(
                'Seguimiento de la cartera publicada y de las solicitudes de visita recibidas desde el sitio.',
                'Track the published portfolio and the visit requests received from the site.',
              )}
            </p>
            <div className="mt-7 grid grid-cols-3 gap-4 border-t border-stone-100/15 pt-5">
              <div>
                <div className="text-xl font-semibold tabular-nums tracking-tight text-stone-50">06</div>
                <div className="mt-1 font-sans text-[10px] uppercase tracking-wider text-stone-400">
                  {t('Propiedades', 'Properties')}
                </div>
              </div>
              <div>
                <div className="text-xl font-semibold tabular-nums tracking-tight text-stone-50">05</div>
                <div className="mt-1 font-sans text-[10px] uppercase tracking-wider text-stone-400">
                  {t('Zonas', 'Areas')}
                </div>
              </div>
              <div>
                <div className="text-xl font-semibold tabular-nums tracking-tight text-stone-50">01</div>
                <div className="mt-1 font-sans text-[10px] uppercase tracking-wider text-stone-400">
                  {t('Bandeja única', 'Single inbox')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}
