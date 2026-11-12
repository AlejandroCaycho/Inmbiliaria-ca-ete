import { useLanguage } from '../../context/LanguageContext'
import EditorDrawer from './EditorDrawer'
import { CheckIcon, MailIcon, ReplyIcon } from './dashboardIcons'
import { formatLeadDate, gestionLabels } from './dashboardUtils'
import { primaryButton, secondaryButton } from './fields'

export default function LeadDrawer({ lead, property, onClose, onStatusChange }) {
  const { lang, t } = useLanguage()

  if (!lead) return null

  const isNew = lead.status === 'nueva'
  const propertyName = property
    ? lang === 'en'
      ? property.nameEn
      : property.name
    : t('Consulta general', 'General inquiry')
  const propertyPrice = property
    ? lang === 'en'
      ? property.priceEn
      : property.price
    : '—'
  const message =
    (lead.demo && lang === 'en' && lead.messageEn) ||
    lead.message ||
    t('Sin mensaje.', 'No message.')
  const mailSubject = t(
    'Respuesta a su consulta — Impulso Inmobiliario',
    'Reply to your inquiry — Impulso Inmobiliario',
  )

  return (
    <EditorDrawer
      open
      onClose={onClose}
      eyebrow={t('CONSULTA RECIBIDA', 'RECEIVED INQUIRY')}
      title={lead.name}
      description={`${gestionLabels[lead.gestion]?.[lang] ?? lead.gestion} · ${formatLeadDate(lead.date, lang)}`}
      footer={
        <>
          <button type="button" onClick={onClose} className={secondaryButton}>
            {t('Cerrar', 'Close')}
          </button>
          <button
            type="button"
            onClick={() => onStatusChange(lead.id, isNew ? 'atendida' : 'nueva')}
            className={primaryButton}
          >
            {isNew ? <CheckIcon /> : <ReplyIcon />}
            {isNew ? t('Marcar como atendida', 'Mark as attended') : t('Reabrir consulta', 'Reopen inquiry')}
          </button>
        </>
      }
    >
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-stone-800 bg-stone-900/40 px-3 py-2.5">
          <span
            className={`inline-flex items-center gap-2 font-sans text-[11px] ${
              isNew ? 'text-terracotta' : 'text-stone-300'
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${isNew ? 'bg-terracotta' : 'bg-stone-500'}`}
            />
            {isNew
              ? t('Nueva, pendiente de atender', 'New, awaiting attention')
              : t('Atendida', 'Attended')}
          </span>
          {lead.demo && (
            <span className="font-sans text-[9px] uppercase tracking-[0.16em] text-stone-600">
              {t('Ejemplo demo', 'Demo example')}
            </span>
          )}
        </div>

        <section>
          <h3 className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-400">
            {t('Mensaje del cliente', 'Client message')}
          </h3>
          <blockquote className="mt-2 rounded-lg border border-l-2 border-stone-800 border-l-terracotta bg-stone-900/30 px-4 py-3 font-sans text-xs font-light leading-relaxed text-stone-300">
            {message}
          </blockquote>
        </section>

        <section>
          <h3 className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-400">
            {t('Datos de contacto', 'Contact details')}
          </h3>
          <dl className="mt-2 divide-y divide-stone-800/80 rounded-lg border border-stone-800 bg-stone-900/30 px-3">
            <div className="flex items-center justify-between gap-4 py-2.5">
              <dt className="font-sans text-[10px] text-stone-500">{t('CORREO', 'EMAIL')}</dt>
              <dd className="min-w-0 truncate font-sans text-[11px] text-stone-200">
                {lead.email ? (
                  <a href={`mailto:${lead.email}`} className="transition-colors hover:text-terracotta">
                    {lead.email}
                  </a>
                ) : (
                  t('Sin correo', 'No email')
                )}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4 py-2.5">
              <dt className="font-sans text-[10px] text-stone-500">{t('IDIOMA', 'LANGUAGE')}</dt>
              <dd className="font-sans text-[11px] uppercase text-stone-200">
                {lead.lang === 'en' ? 'English' : 'Español'}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4 py-2.5">
              <dt className="font-sans text-[10px] text-stone-500">{t('REGISTRADA', 'RECEIVED')}</dt>
              <dd className="text-right font-sans text-[11px] tabular-nums text-stone-200">
                {formatLeadDate(lead.date, lang)}
              </dd>
            </div>
          </dl>

          {lead.email && (
            <a
              href={`mailto:${lead.email}?subject=${encodeURIComponent(mailSubject)}`}
              className="mt-3 inline-flex items-center justify-center gap-2 rounded-lg border border-stone-700 px-4 py-2.5 font-sans text-xs font-medium text-stone-200 transition-colors hover:border-stone-500 hover:text-stone-50"
            >
              <MailIcon />
              {t('Responder por correo', 'Reply by email')}
            </a>
          )}
        </section>

        <section>
          <h3 className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-400">
            {t('Inmueble consultado', 'Property consulted')}
          </h3>
          <div className="mt-2 flex gap-3 rounded-lg border border-stone-800 bg-stone-900/30 p-3">
            {property && (
              <img
                src={property.image}
                alt=""
                loading="lazy"
                className="h-14 w-20 shrink-0 rounded-md object-cover"
              />
            )}
            <div className="min-w-0 flex-1">
              <div className="font-sans text-xs font-medium text-stone-100">{propertyName}</div>
              <div className="mt-0.5 font-sans text-[10px] text-stone-500">
                {property?.ref ?? lead.propertyId}
              </div>
              {property && (
                <div className="mt-1 font-sans text-[10px] tabular-nums text-stone-400">
                  {propertyPrice}
                </div>
              )}
            </div>
          </div>
        </section>

        <p className="border-t border-stone-800 pt-4 font-sans text-[10px] font-light leading-relaxed text-stone-600">
          {t(
            'El cambio de estado se guarda en este navegador y se refleja en el resumen y en la bandeja.',
            'The status change is saved in this browser and reflected in the overview and the inbox.',
          )}
        </p>
      </div>
    </EditorDrawer>
  )
}
