import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import FeaturedProperty from './components/FeaturedProperty'
import Catalog from './components/Catalog'
import Method from './components/Method'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ScrollManager from './components/ScrollManager'
import Login from './pages/Login'
import DashboardLayout from './pages/dashboard/DashboardLayout'
import DashboardOverview from './pages/dashboard/Overview'
import DashboardFeatured from './pages/dashboard/Featured'
import DashboardProperties from './pages/dashboard/Properties'
import DashboardMethod from './pages/dashboard/Method'
import DashboardInquiries from './pages/dashboard/Inquiries'
import DashboardContact from './pages/dashboard/Contact'
import { AuthProvider, useAuth } from './context/AuthContext'
import { LanguageProvider, useLanguage } from './context/LanguageContext'
import { SiteContentProvider } from './context/SiteContentContext'
import { emptyCatalogFilters } from './data/catalogFilters'
import useLandingAnimations from './hooks/useLandingAnimations'

function LandingPage() {
  const [catalogFilters, setCatalogFilters] = useState(emptyCatalogFilters)
  const landingRef = useRef(null)

  useLandingAnimations(landingRef)

  useLayoutEffect(() => {
    window.dispatchEvent(new Event('impulso:refresh-animations'))
  }, [catalogFilters])

  function updateFilters(patch) {
    setCatalogFilters((current) => ({ ...current, ...patch }))
  }

  function searchCatalog() {
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <main ref={landingRef}>
      <Hero filters={catalogFilters} onFilterChange={updateFilters} onSearch={searchCatalog} />
      <FeaturedProperty />
      <Catalog filters={catalogFilters} onFilterChange={updateFilters} />
      <Method />
    </main>
  )
}

function ContactPage() {
  return (
    <main>
      <Contact />
    </main>
  )
}

function SiteLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  )
}

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/acceso" replace state={{ from: location.pathname }} />
  }
  return children
}

function DocumentMeta() {
  const { pathname } = useLocation()
  const { lang } = useLanguage()

  useEffect(() => {
    if (pathname === '/contacto') {
      document.title =
        lang === 'en' ? 'Contact — Impulso Inmobiliario' : 'Contacto — Impulso Inmobiliario'
      return
    }

    if (pathname === '/acceso') {
      document.title =
        lang === 'en' ? 'Sign in — Impulso Inmobiliario' : 'Acceso — Impulso Inmobiliario'
      return
    }

    if (pathname.startsWith('/dashboard')) {
      const dashboardTitles = {
        '/dashboard': ['Panel de gestión', 'Management panel'],
        '/dashboard/destacada': ['Propiedad destacada', 'Featured property'],
        '/dashboard/propiedades': ['Propiedades', 'Properties'],
        '/dashboard/metodo': ['Cómo trabajamos', 'How we work'],
        '/dashboard/consultas': ['Consultas', 'Inquiries'],
        '/dashboard/contacto': ['Contacto', 'Contact'],
      }
      const entry = dashboardTitles[pathname]
      document.title = entry
        ? pathname === '/dashboard'
          ? `${lang === 'en' ? entry[1] : entry[0]} — Impulso Inmobiliario`
          : `${lang === 'en' ? entry[1] : entry[0]} — Panel — Impulso Inmobiliario`
        : lang === 'en'
          ? 'Management panel — Impulso Inmobiliario'
          : 'Panel de gestión — Impulso Inmobiliario'
      return
    }

    document.title =
      lang === 'en'
        ? 'Impulso Inmobiliario — Properties in Cañete and Chincha'
        : 'Impulso Inmobiliario — Propiedades en Cañete y Chincha'
  }, [pathname, lang])

  return null
}

export default function App() {
  return (
    <LanguageProvider>
      <SiteContentProvider>
        <AuthProvider>
          <BrowserRouter>
            <ScrollManager />
            <DocumentMeta />
            <Routes>
              <Route element={<SiteLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/contacto" element={<ContactPage />} />
              </Route>
              <Route path="/acceso" element={<Login />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<DashboardOverview />} />
                <Route path="destacada" element={<DashboardFeatured />} />
                <Route path="propiedades" element={<DashboardProperties />} />
                <Route path="metodo" element={<DashboardMethod />} />
                <Route path="consultas" element={<DashboardInquiries />} />
                <Route path="contacto" element={<DashboardContact />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </SiteContentProvider>
    </LanguageProvider>
  )
}
