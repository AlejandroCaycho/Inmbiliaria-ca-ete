import { useEffect, useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import EditorDrawer from './EditorDrawer'
import { FormSection, TextField, primaryButton, secondaryButton } from './fields'

export default function ContactEditor({ open, contact, onClose, onSave }) {
  const { t } = useLanguage()
  const [draft, setDraft] = useState(null)

  useEffect(() => {
    if (!open) return
    setDraft({ ...contact })
  }, [open, contact])

  if (!open || !draft) return null

  const set = (key) => (value) => setDraft((current) => ({ ...current, [key]: value }))
  const whatsappDigits = draft.whatsapp.replace(/\D/g, '')
  const canSave = Boolean(draft.phone.trim() && whatsappDigits.length >= 6)

  function handleSave() {
    if (!canSave) return
    onSave({
      phone: draft.phone.trim(),
      whatsapp: whatsappDigits,
      instagramHandle: draft.instagramHandle.trim(),
      instagramUrl: draft.instagramUrl.trim(),
      tiktokHandle: draft.tiktokHandle.trim(),
      tiktokUrl: draft.tiktokUrl.trim(),
    })
  }

  return (
    <EditorDrawer
      open={open}
      onClose={onClose}
      eyebrow={t('ATENCIÓN', 'SERVICE')}
      title={t('Editar datos de contacto', 'Edit contact details')}
      description={t(
        'Estos datos aparecen en el pie del sitio, en la página de contacto y en los botones de WhatsApp.',
        'These details appear in the site footer, the contact page and the WhatsApp buttons.',
      )}
      footer={
        <>
          <button type="button" onClick={onClose} className={secondaryButton}>
            {t('Cancelar', 'Cancel')}
          </button>
          <button type="button" onClick={handleSave} disabled={!canSave} className={primaryButton}>
            {t('Guardar cambios', 'Save changes')}
          </button>
        </>
      }
    >
      <div className="space-y-6">
        <FormSection title={t('Teléfono y WhatsApp', 'Phone and WhatsApp')}>
          <TextField
            label={t('TELÉFONO VISIBLE', 'DISPLAYED PHONE')}
            value={draft.phone}
            onChange={set('phone')}
            placeholder="+51 991 372 212"
            hint={t('Se muestra tal como lo escribes.', 'Shown exactly as written.')}
          />
          <TextField
            label={t('NÚMERO DE WHATSAPP', 'WHATSAPP NUMBER')}
            value={draft.whatsapp}
            onChange={set('whatsapp')}
            placeholder="51991372212"
            hint={t(
              'Con código de país y sin espacios ni símbolos. Ejemplo: 51991372212.',
              'With country code and no spaces or symbols. Example: 51991372212.',
            )}
          />
        </FormSection>

        <FormSection title={t('Instagram', 'Instagram')}>
          <TextField
            label={t('USUARIO', 'HANDLE')}
            value={draft.instagramHandle}
            onChange={set('instagramHandle')}
            placeholder="@impulsoinmobiliariope"
          />
          <TextField
            label={t('ENLACE DEL PERFIL', 'PROFILE URL')}
            value={draft.instagramUrl}
            onChange={set('instagramUrl')}
            placeholder="https://www.instagram.com/impulsoinmobiliariope/"
          />
        </FormSection>

        <FormSection title={t('TikTok', 'TikTok')}>
          <TextField
            label={t('USUARIO', 'HANDLE')}
            value={draft.tiktokHandle}
            onChange={set('tiktokHandle')}
            placeholder="@impulsoinmobiliariope"
          />
          <TextField
            label={t('ENLACE DEL PERFIL', 'PROFILE URL')}
            value={draft.tiktokUrl}
            onChange={set('tiktokUrl')}
            placeholder="https://www.tiktok.com/@impulsoinmobiliariope"
          />
        </FormSection>
      </div>
    </EditorDrawer>
  )
}
