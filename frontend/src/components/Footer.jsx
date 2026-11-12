import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { useSiteContent } from '../context/SiteContentContext'

const linkClass = 'hover:text-terracotta transition-colors'

export default function Footer() {
  const { t } = useLanguage()
  const { contact } = useSiteContent()

  return (
    <footer className="pt-10 pb-7 bg-stone-950 border-t border-stone-800 text-stone-400 font-sans text-xs sm:pt-12 sm:pb-8">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12">
        <div className="grid grid-cols-2 gap-x-6 gap-y-7 pb-8 border-b border-stone-800/80 sm:gap-y-8 md:grid-cols-4 md:gap-8 md:pb-10">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-3">
              <img
                src="/logo.png"
                alt=""
                width="40"
                height="40"
                className="h-10 w-10 object-contain"
              />
              <div className="text-sm font-bold text-stone-100 tracking-wider">
                IMPULSO INMOBILIARIO
              </div>
            </div>
            <p className="font-sans text-xs text-stone-400 leading-relaxed font-light mb-4">
              {t(
                'Venta y alquiler de casas, terrenos y proyectos en Cañete y Chincha. Propiedades reales y atención directa.',
                'Sale and rental of homes, land and projects in Cañete and Chincha. Real listings and direct service.',
              )}
            </p>
            <div className="text-[10px] text-stone-400">
              CAÑETE · LIMA · PERÚ · {contact.phone}
            </div>
          </div>

          <div>
            <div className="editorial-label text-stone-400 mb-3">
              {t('PROPIEDADES', 'PROPERTIES')}
            </div>
            <ul className="space-y-2 text-stone-300">
              <li>
                <Link to="/#catalogo" className={linkClass}>
                  {t('Casas en venta', 'Homes for sale')}
                </Link>
              </li>
              <li>
                <Link to="/#catalogo" className={linkClass}>
                  {t('Casa en alquiler', 'Home for rent')}
                </Link>
              </li>
              <li>
                <Link to="/#catalogo" className={linkClass}>
                  {t('Terrenos', 'Land')}
                </Link>
              </li>
              <li>
                <Link to="/#catalogo" className={linkClass}>
                  {t('Proyectos frente al mar', 'Beachfront projects')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="editorial-label text-stone-400 mb-3">{t('ZONAS', 'AREAS')}</div>
            <ul className="space-y-2 text-stone-300">
              <li>
                <Link to="/#catalogo" className={linkClass}>
                  San Vicente
                </Link>
              </li>
              <li>
                <Link to="/#catalogo" className={linkClass}>
                  Cerro Azul
                </Link>
              </li>
              <li>
                <Link to="/#catalogo" className={linkClass}>
                  San Luis
                </Link>
              </li>
              <li>
                <Link to="/#catalogo" className={linkClass}>
                  Chincha
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1">
            <div className="editorial-label text-stone-400 mb-3">{t('CONTACTO', 'CONTACT')}</div>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-stone-300 md:block md:space-y-2">
              <li>
                <a
                  href={`https://wa.me/${contact.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className={linkClass}
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={contact.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={linkClass}
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href={contact.tiktokUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={linkClass}
                >
                  TikTok
                </a>
              </li>
              <li>
                <Link to="/contacto" className={linkClass}>
                  {t('Agendar visita', 'Schedule a visit')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-5 text-[10px] text-stone-400 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:pt-6 sm:text-[11px]">
          <div className="text-center sm:text-left">
            © 2026 IMPULSO INMOBILIARIO — CAÑETE, LIMA, PERÚ.
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-center sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-6 sm:gap-y-2 sm:text-left">
            <Link
              to="/acceso"
              className="inline-flex items-center gap-1.5 text-stone-300 transition-colors hover:text-terracotta"
            >
              {t('Acceso al panel', 'Panel access')}
            </Link>
            <a href="#" className="hover:text-stone-300 transition-colors">
              {t('Aviso Legal', 'Legal Notice')}
            </a>
            <a href="#" className="hover:text-stone-300 transition-colors">
              {t('Política de Privacidad', 'Privacy Policy')}
            </a>
            <a
              href={`https://wa.me/${contact.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="hover:text-stone-300 transition-colors"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
