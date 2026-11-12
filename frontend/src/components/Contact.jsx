import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import SelectMenu from './SelectMenu'
import { useLanguage } from '../context/LanguageContext'
import { useSiteContent } from '../context/SiteContentContext'
import { saveLead } from '../lib/leads'

const inputClass =
  'w-full px-3 py-2.5 bg-stone-950 border border-stone-800 rounded-lg text-xs font-sans text-stone-100 placeholder-stone-600 focus:outline-none focus:border-terracotta transition-colors'

const gestiones = [
  {
    value: 'Visita a la propiedad',
    label: 'Visita a la propiedad',
    labelEn: 'Property visit',
    hint: 'Coordinamos día y hora',
    hintEn: 'We arrange a date and time',
  },
  {
    value: 'Precio y financiamiento',
    label: 'Precio y financiamiento',
    labelEn: 'Price and financing',
    hint: 'Revisamos las condiciones',
    hintEn: 'We review the terms',
  },
  {
    value: 'Quiero vender mi propiedad',
    label: 'Quiero vender mi propiedad',
    labelEn: 'I want to sell my property',
    hint: 'Evaluamos tu caso',
    hintEn: 'We review your case',
  },
  {
    value: 'Otra consulta',
    label: 'Otra consulta',
    labelEn: 'Other inquiry',
    hint: 'Escríbenos tu pregunta',
    hintEn: 'Send us your question',
  },
]

function WhatsAppIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.87 1.22 3.07c.15.2 2.1 3.2 5.08 4.49.7.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.42-.08-.12-.28-.2-.57-.35M12.05 21.78h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.88 9.88M20.46 3.49A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.69 1.45h.01c6.55 0 11.89-5.34 11.89-11.9 0-3.18-1.24-6.16-3.49-8.41" />
    </svg>
  )
}

function InstagramIcon({ className = 'h-4 w-4' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function TikTokIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  )
}

function HomeIcon({ className = 'h-4 w-4' }) {
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
        d="m3 10.5 9-7.5 9 7.5M5.25 9v10.5h13.5V9M9.75 19.5v-6h4.5v6"
      />
    </svg>
  )
}

function ChatIcon({ className = 'h-4 w-4' }) {
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
        d="M7.5 19.5h9a4.5 4.5 0 0 0 4.5-4.5v-4.5A4.5 4.5 0 0 0 16.5 6h-9A4.5 4.5 0 0 0 3 10.5V15a4.5 4.5 0 0 0 4.5 4.5ZM8 10.5h8M8 14h5"
      />
    </svg>
  )
}

export default function Contact() {
  const { lang, t } = useLanguage()
  const { properties, contact } = useSiteContent()
  const [searchParams] = useSearchParams()
  const publishedProperties = properties.filter((property) => property.published !== false)
  const inmuebles = [
    ...publishedProperties.map((property) => ({
      value: property.id,
      label: lang === 'en' ? property.nameEn : property.name,
      hint: `${property.ref} · ${lang === 'en' ? property.priceEn : property.price}`,
    })),
    {
      value: 'Otra consulta',
      label: t('Otra consulta', 'Other inquiry'),
      hint: t('Cuéntanos qué estás buscando', "Tell us what you're looking for"),
    },
  ]
  const requested = searchParams.get('inmueble')
  const initialInmueble = inmuebles.some((option) => option.value === requested)
    ? requested
    : inmuebles[0].value

  const [inmueble, setInmueble] = useState(initialInmueble)
  const [gestion, setGestion] = useState(gestiones[0].value)
  const [sent, setSent] = useState(false)

  const socials = [
    {
      name: 'WhatsApp',
      handle: contact.phone,
      href: `https://wa.me/${contact.whatsapp}`,
      icon: WhatsAppIcon,
    },
    {
      name: 'Instagram',
      handle: contact.instagramHandle,
      href: contact.instagramUrl,
      icon: InstagramIcon,
    },
    {
      name: 'TikTok',
      handle: contact.tiktokHandle,
      href: contact.tiktokUrl,
      icon: TikTokIcon,
    },
  ]

  const localizedGestiones = gestiones.map((option) => ({
    value: option.value,
    label: lang === 'en' ? option.labelEn : option.label,
    hint: lang === 'en' ? option.hintEn : option.hint,
  }))

  function handleSubmit(event) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const nombre = data.get('nombre')
    const correo = data.get('correo')
    const mensaje = data.get('mensaje')
    const selectedInmueble = inmuebles.find((option) => option.value === inmueble) ?? inmuebles[0]
    const selectedGestion = gestiones.find((option) => option.value === gestion) ?? gestiones[0]
    const inmuebleLabel = lang === 'en' ? selectedInmueble.labelEn : selectedInmueble.label
    const inmuebleHint = lang === 'en' ? selectedInmueble.hintEn : selectedInmueble.hint
    const gestionLabel = lang === 'en' ? selectedGestion.labelEn : selectedGestion.label
    const useHint = selectedInmueble.value !== 'Otra consulta'

    const text =
      lang === 'en'
        ? [
            `Hello, I'm ${nombre}.`,
            `I'm interested in: ${inmuebleLabel}${useHint ? ` (${inmuebleHint})` : ''}.`,
            `Inquiry type: ${gestionLabel}.`,
            correo ? `Email: ${correo}.` : '',
            mensaje ? `Message: ${mensaje}` : '',
          ]
            .filter(Boolean)
            .join(' ')
        : [
            `Hola, soy ${nombre}.`,
            `Me interesa: ${inmuebleLabel}${useHint ? ` (${inmuebleHint})` : ''}.`,
            `Tipo de consulta: ${gestionLabel}.`,
            correo ? `Correo: ${correo}.` : '',
            mensaje ? `Mensaje: ${mensaje}` : '',
          ]
            .filter(Boolean)
            .join(' ')

    saveLead({
      propertyId: selectedInmueble.value,
      gestion: selectedGestion.value,
      name: nombre,
      email: correo || '',
      message: mensaje || '',
      lang,
    })
    window.open(
      `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(text)}`,
      '_blank',
      'noopener,noreferrer',
    )
    event.target.reset()
    setInmueble(inmuebles[0].value)
    setGestion(gestiones[0].value)
    setSent(true)
  }

  return (
    <div className="bg-stone-950">
      <section className="pt-32 pb-10 border-b border-stone-800">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12">
          <nav
            aria-label={t('Ruta de navegación', 'Breadcrumb')}
            className="flex items-center gap-2 font-sans text-[10px] uppercase tracking-[0.16em] text-stone-500"
          >
            <Link to="/" className="hover:text-stone-200 transition-colors">
              {t('Inicio', 'Home')}
            </Link>
            <span className="text-stone-700">/</span>
            <span className="text-stone-300">{t('Contacto', 'Contact')}</span>
          </nav>

          <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className="editorial-label text-stone-500">
                {t('ATENCIÓN DIRECTA', 'DIRECT SERVICE')}
              </span>
              <h1 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight text-stone-100">
                {t(
                  'Agenda una visita o solicita información.',
                  'Schedule a visit or request information.',
                )}
              </h1>
              <p className="mt-3 max-w-xl text-sm text-stone-400 leading-relaxed font-light">
                {t(
                  'Cuéntanos qué propiedad te interesa. Coordinamos la visita y te respondemos con la información disponible, sin intermediarios.',
                  'Tell us which property interests you. We arrange the visit and reply with the available information, directly with the owner.',
                )}
              </p>
            </div>
            <a
              href={`https://wa.me/${contact.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-fit items-center gap-2.5 rounded-lg border border-stone-700 bg-stone-900/60 px-4 py-3 font-sans text-xs font-semibold text-stone-100 transition-colors hover:border-terracotta/60 hover:text-terracotta"
            >
              <WhatsAppIcon className="h-4 w-4" />
              {contact.phone}
            </a>
          </div>
        </div>
      </section>

      <section id="visitas" className="py-12">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5">
              <span className="editorial-label text-stone-500">
                {t('DATOS DE CONTACTO', 'CONTACT DETAILS')}
              </span>
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-stone-100 mt-1 mb-3">
                {t('Prefieres hablar directo', 'Prefer to talk directly')}
              </h2>
              <p className="text-xs text-stone-400 leading-relaxed font-light mb-5">
                {t(
                  'Escríbenos por WhatsApp o por redes sociales. Coordinamos las visitas con cita previa.',
                  'Message us on WhatsApp or social media. Visits are arranged by appointment.',
                )}
              </p>

              <div className="space-y-3 font-sans text-xs border-t border-stone-800 pt-5">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-stone-500">{t('ATENCIÓN', 'SERVICE')}</span>
                  <span className="text-stone-200 text-right">San Vicente de Cañete</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-stone-500">{t('ZONA DE ATENCIÓN', 'SERVICE AREA')}</span>
                  <span className="text-stone-200 text-right">
                    {t('Cañete y Chincha', 'Cañete and Chincha')}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-stone-500">{t('VISITAS', 'VISITS')}</span>
                  <span className="text-stone-200 text-right">
                    {t('Con cita previa', 'By appointment')}
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <div className="editorial-label text-stone-500 mb-2">
                  {t('REDES SOCIALES', 'SOCIAL MEDIA')}
                </div>
                <div className="grid gap-2">
                  {socials.map(({ name, handle, href, icon: Icon }) => (
                    <a
                      key={name}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-center gap-3 rounded-xl border border-stone-800 bg-stone-900/40 px-3 py-2.5 transition-colors hover:border-terracotta/50 hover:bg-stone-900"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-stone-800 bg-stone-950 text-stone-300 transition-colors group-hover:border-terracotta/30 group-hover:text-terracotta">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[11px] font-semibold text-stone-100">
                          {name}
                        </span>
                        <span className="block truncate text-[10px] text-stone-500">{handle}</span>
                      </span>
                      <span
                        className="text-stone-600 transition-colors group-hover:text-terracotta"
                        aria-hidden="true"
                      >
                        ↗
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              <Link
                to="/"
                className="mt-6 inline-flex items-center gap-1.5 font-sans text-[11px] text-stone-400 hover:text-terracotta transition-colors"
              >
                <span aria-hidden="true">←</span> {t('Volver al inicio', 'Back to home')}
              </Link>
            </div>

            <div className="lg:col-span-7 rounded-2xl border border-stone-800 bg-stone-900/70 p-5 md:p-6">
              <div className="mb-5 flex items-center justify-between gap-3 border-b border-stone-800 pb-4">
                <div>
                  <span className="editorial-label text-stone-500">
                    {t('FORMULARIO', 'FORM')}
                  </span>
                  <h3 className="mt-1 text-base font-semibold text-stone-100">
                    {t('Cuéntanos qué necesitas', 'Tell us what you need')}
                  </h3>
                </div>
                <span className="hidden sm:inline-flex items-center gap-1.5 font-sans text-[10px] text-stone-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-terracotta" />
                  {t('Respuesta por WhatsApp', 'Reply via WhatsApp')}
                </span>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="contacto-nombre"
                      className="editorial-label text-[10px] text-stone-400 block mb-1.5"
                    >
                      {t('NOMBRE Y APELLIDOS', 'FULL NAME')}
                    </label>
                    <input
                      id="contacto-nombre"
                      type="text"
                      name="nombre"
                      autoComplete="name"
                      required
                      placeholder={t('Tu nombre', 'Your name')}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="contacto-correo"
                      className="editorial-label text-[10px] text-stone-400 block mb-1.5"
                    >
                      {t('CORREO (OPCIONAL)', 'EMAIL (OPTIONAL)')}
                    </label>
                    <input
                      id="contacto-correo"
                      type="email"
                      name="correo"
                      autoComplete="email"
                      placeholder={t('tu@correo.com', 'you@email.com')}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="contacto-inmueble"
                      className="editorial-label text-[10px] text-stone-400 block mb-1.5"
                    >
                      {t('INMUEBLE DE INTERÉS', 'PROPERTY OF INTEREST')}
                    </label>
                    <SelectMenu
                      id="contacto-inmueble"
                      ariaLabel={t('Inmueble de interés', 'Property of interest')}
                      options={inmuebles}
                      value={inmueble}
                      onChange={setInmueble}
                      openUp
                      leadingIcon={<HomeIcon className="h-4 w-4" />}
                      triggerClassName="min-h-[52px] rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 transition-colors hover:border-stone-600"
                      valueClassName="text-xs font-sans font-medium text-stone-100"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="contacto-gestion"
                      className="editorial-label text-[10px] text-stone-400 block mb-1.5"
                    >
                      {t('TIPO DE CONSULTA', 'INQUIRY TYPE')}
                    </label>
                    <SelectMenu
                      id="contacto-gestion"
                      ariaLabel={t('Tipo de consulta', 'Inquiry type')}
                      options={localizedGestiones}
                      value={gestion}
                      onChange={setGestion}
                      openUp
                      leadingIcon={<ChatIcon className="h-4 w-4" />}
                      triggerClassName="min-h-[52px] rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 transition-colors hover:border-stone-600"
                      valueClassName="text-xs font-sans font-medium text-stone-100"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contacto-mensaje"
                    className="editorial-label text-[10px] text-stone-400 block mb-1.5"
                  >
                    {t('MENSAJE', 'MESSAGE')}
                  </label>
                  <textarea
                    id="contacto-mensaje"
                    name="mensaje"
                    rows="3"
                    placeholder={t(
                      'Cuéntanos qué propiedad te interesa o qué estás buscando.',
                      'Tell us which property interests you or what you are looking for.',
                    )}
                    className={`${inputClass} resize-none`}
                  ></textarea>
                </div>

                <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                  <span className="font-sans text-[10px] text-stone-500 leading-relaxed">
                    {t(
                      'TUS DATOS SE USAN SOLO PARA RESPONDER TU CONSULTA.',
                      'YOUR DETAILS ARE ONLY USED TO REPLY TO YOUR INQUIRY.',
                    )}
                  </span>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-terracotta px-5 py-3 text-xs uppercase tracking-wider font-semibold text-stone-50 transition-colors hover:bg-terracotta-hover whitespace-nowrap"
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                    {t('Enviar por WhatsApp', 'Send via WhatsApp')}
                  </button>
                </div>

                {sent && (
                  <p className="text-[11px] font-sans text-terracotta border border-terracotta/30 bg-terracotta/5 rounded-lg px-3 py-2">
                    {t(
                      `Se abrió WhatsApp con tu consulta. Si no se abrió, escríbenos al ${contact.phone}.`,
                      `WhatsApp opened with your inquiry. If it did not open, message us at ${contact.phone}.`,
                    )}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
