import { useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { useSiteContent } from '../../context/SiteContentContext'
import ModuleHeader from './ModuleHeader'
import ContactEditor from './ContactEditor'
import { InboxIcon, InstagramIcon, MailIcon, TikTokIcon, WhatsAppIcon } from './dashboardIcons'
import { primaryButton, secondaryButton, smallButton } from './fields'
import { pad } from './dashboardUtils'

export default function Contact() {
  const { t } = useLanguage()
  const { leads } = useOutletContext()
  const { contact, updateContact } = useSiteContent()
  const [editorOpen, setEditorOpen] = useState(false)

  const newCount = leads.filter((lead) => lead.status === 'nueva').length
  const attendedCount = leads.length - newCount

  const channels = [
    {
      name: 'WhatsApp',
      value: contact.phone,
      href: `https://wa.me/${contact.whatsapp}`,
      Icon: WhatsAppIcon,
    },
    {
      name: 'Instagram',
      value: contact.instagramHandle,
      href: contact.instagramUrl,
      Icon: InstagramIcon,
    },
    {
      name: 'TikTok',
      value: contact.tiktokHandle,
      href: contact.tiktokUrl,
      Icon: TikTokIcon,
    },
  ]

  const attentionRows = [
    { label: t('ATENCIÓN', 'SERVICE'), value: 'San Vicente de Cañete' },
    { label: t('TELÉFONO', 'PHONE'), value: contact.phone },
    { label: t('ZONA DE ATENCIÓN', 'SERVICE AREA'), value: t('Cañete y Chincha', 'Cañete and Chincha') },
    { label: t('VISITAS', 'VISITS'), value: t('Con cita previa', 'By appointment') },
    { label: t('RESPUESTA', 'REPLY'), value: t('Por WhatsApp', 'Via WhatsApp') },
  ]

  return (
    <>
      <ModuleHeader
        eyebrow={t('SECCIÓN DEL SITIO', 'SITE SECTION')}
        title={t('Contacto', 'Contact')}
        description={t(
          'Los canales y datos de atención que aparecen en el sitio, más el estado de las consultas recibidas.',
          'The contact channels and details shown on the site, plus the status of received inquiries.',
        )}
        actions={
          <>
            <Link
              to="/contacto"
              className={secondaryButton}
            >
              {t('Abrir formulario', 'Open form')}
              <span aria-hidden="true">↗</span>
            </Link>
            <button
              type="button"
              onClick={() => setEditorOpen(true)}
              className={primaryButton}
            >
              {t('Editar datos', 'Edit details')}
            </button>
          </>
        }
      />

      <div className="mt-5 grid gap-4 xl:grid-cols-12">
        <section className="overflow-hidden rounded-xl border border-stone-800 bg-stone-900/30 xl:col-span-7 xl:self-start">
          <header className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-800 px-5 py-4">
            <div>
              <span className="editorial-label text-stone-500">
                {t('ATENCIÓN DIRECTA', 'DIRECT SERVICE')}
              </span>
              <h2 className="mt-1 text-base font-semibold tracking-tight text-stone-50">
                {t('Canales de contacto', 'Contact channels')}
              </h2>
            </div>
            <span className="font-sans text-[10px] uppercase tracking-[0.14em] text-stone-500">
              {t('CAÑETE · CHINCHA', 'CAÑETE · CHINCHA')}
            </span>
          </header>

          <div className="p-5">
            <div className="grid gap-2 sm:grid-cols-3">
              {channels.map(({ Icon, ...channel }) => (
                <a
                  key={channel.name}
                  href={channel.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex flex-col gap-2.5 rounded-lg border border-stone-800 bg-stone-950/30 p-3.5 transition-colors hover:border-stone-600"
                >
                  <span className="flex items-center justify-between">
                    <Icon className="h-4 w-4 text-terracotta" />
                    <span
                      className="text-stone-600 transition-colors group-hover:text-terracotta"
                      aria-hidden="true"
                    >
                      ↗
                    </span>
                  </span>
                  <span className="min-w-0">
                    <span className="block font-sans text-xs font-medium text-stone-100">
                      {channel.name}
                    </span>
                    <span className="mt-0.5 block truncate font-sans text-[10px] text-stone-500">
                      {channel.value}
                    </span>
                  </span>
                </a>
              ))}
            </div>

            <div className="mt-5">
              <span className="editorial-label text-stone-500">
                {t('DATOS DE ATENCIÓN', 'SERVICE DETAILS')}
              </span>
              <dl className="mt-3 grid gap-2 sm:grid-cols-2">
                {attentionRows.map((row, index) => (
                  <div
                    key={row.label}
                    className={`rounded-lg border border-stone-800 bg-stone-950/30 px-3.5 py-3 ${
                      index === attentionRows.length - 1 && attentionRows.length % 2 === 1
                        ? 'sm:col-span-2'
                        : ''
                    }`}
                  >
                    <dt className="editorial-label text-[9px] text-stone-500">{row.label}</dt>
                    <dd className="mt-1 font-sans text-xs text-stone-100">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <p className="mt-5 font-sans text-[11px] font-light leading-relaxed text-stone-500">
              {t(
                'Atención directa, sin intermediarios. Coordinamos cada visita con cita previa.',
                'Direct service, no intermediaries. Every visit is arranged by appointment.',
              )}
            </p>
          </div>
        </section>

        <div className="flex flex-col gap-4 xl:col-span-5">
          <section className="rounded-xl border border-stone-800 bg-stone-900/30">
            <header className="flex items-start justify-between gap-3 border-b border-stone-800 px-5 py-4">
              <div>
                <span className="editorial-label text-stone-500">{t('CONSULTAS', 'INQUIRIES')}</span>
                <h2 className="mt-1 flex items-center gap-2 text-base font-semibold tracking-tight text-stone-50">
                  <InboxIcon className="h-4 w-4 text-terracotta" />
                  {t('Bandeja de entrada', 'Inbox')}
                </h2>
              </div>
              <Link to="/dashboard/consultas" className={`${smallButton} shrink-0`}>
                {t('Ver bandeja', 'View inbox')}
                <span aria-hidden="true">→</span>
              </Link>
            </header>

            <div className="p-5">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <div className="font-sans text-3xl font-semibold tabular-nums tracking-tight text-stone-50">
                    {pad(leads.length)}
                  </div>
                  <div className="mt-1 font-sans text-[10px] uppercase tracking-[0.14em] text-stone-500">
                    {t('solicitudes recibidas', 'requests received')}
                  </div>
                </div>
                <div className="text-right font-sans text-[10px]">
                  <div className="tabular-nums text-terracotta">
                    {pad(newCount)} {t('nuevas', 'new')}
                  </div>
                  <div className="mt-1 tabular-nums text-stone-500">
                    {pad(attendedCount)} {t('atendidas', 'attended')}
                  </div>
                </div>
              </div>

              <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-stone-800">
                <div
                  className="h-full rounded-full bg-terracotta transition-[width]"
                  style={{
                    width: `${
                      leads.length === 0 ? 0 : Math.round((newCount / leads.length) * 100)
                    }%`,
                  }}
                />
              </div>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-sans text-[10px] text-stone-500">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-terracotta" />
                  {t('Por atender', 'Pending')}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-stone-600" />
                  {t('Atendidas', 'Attended')}
                </span>
              </div>
            </div>
          </section>

          <section className="flex flex-1 flex-col rounded-xl border border-stone-800 bg-stone-900/30">
            <header className="border-b border-stone-800 px-5 py-4">
              <span className="editorial-label text-stone-500">{t('FORMULARIO', 'FORM')}</span>
              <h2 className="mt-1 flex items-center gap-2 text-base font-semibold tracking-tight text-stone-50">
                <MailIcon className="h-4 w-4 text-terracotta" />
                {t('Formulario del sitio', 'Site form')}
              </h2>
            </header>

            <div className="flex flex-1 flex-col p-5">
              <p className="font-sans text-[11px] font-light leading-relaxed text-stone-400">
                {t(
                  'Recibe las consultas del sitio en esta misma bandeja y responde por WhatsApp.',
                  'Receive site inquiries in this same inbox and reply via WhatsApp.',
                )}
              </p>

              <ul className="mt-4 space-y-2">
                {[
                  t(
                    'El visitante elige el inmueble y el tipo de consulta.',
                    'The visitor chooses the property and inquiry type.',
                  ),
                  t(
                    'Completa sus datos y envía la solicitud.',
                    'They complete their details and send the request.',
                  ),
                  t(
                    'La consulta llega a esta bandeja y se abre WhatsApp.',
                    'The inquiry arrives in this inbox and WhatsApp opens.',
                  ),
                ].map((step, index) => (
                  <li
                    key={step}
                    className="flex items-center gap-2.5 rounded-md border border-stone-800/70 bg-stone-950/30 px-3 py-2 font-sans text-[10px] font-light leading-relaxed text-stone-400"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-terracotta/10 font-sans text-[9px] font-semibold tabular-nums text-terracotta">
                      {pad(index + 1)}
                    </span>
                    {step}
                  </li>
                ))}
              </ul>

              <div className="mt-auto flex flex-col gap-2 pt-5">
                <Link to="/contacto" className={`${primaryButton} w-full`}>
                  {t('Abrir formulario', 'Open form')}
                  <span aria-hidden="true">→</span>
                </Link>
                <a
                  href={`https://wa.me/${contact.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className={`${secondaryButton} w-full`}
                >
                  <WhatsAppIcon className="h-3.5 w-3.5" />
                  {t('Escribir por WhatsApp', 'Message on WhatsApp')}
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>

      <ContactEditor
        open={editorOpen}
        contact={contact}
        onClose={() => setEditorOpen(false)}
        onSave={(nextContact) => {
          updateContact(nextContact)
          setEditorOpen(false)
        }}
      />
    </>
  )
}
