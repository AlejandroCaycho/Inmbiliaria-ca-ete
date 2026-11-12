import { useEffect, useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import EditorDrawer from './EditorDrawer'
import { TextField, primaryButton, secondaryButton } from './fields'

export default function MethodEditor({ open, methodPhases, onClose, onSave }) {
  const { t } = useLanguage()
  const [draft, setDraft] = useState(null)

  useEffect(() => {
    if (!open) return
    setDraft(methodPhases.map((phase) => ({ ...phase })))
  }, [open, methodPhases])

  if (!open || !draft) return null

  function updatePhase(index, key, value) {
    setDraft((current) =>
      current.map((phase, phaseIndex) =>
        phaseIndex === index ? { ...phase, [key]: value } : phase,
      ),
    )
  }

  const canSave = draft.every((phase) => phase.title.trim() && phase.you.trim() && phase.us.trim())

  function handleSave() {
    if (!canSave) return
    onSave(
      draft.map((phase) => ({
        ...phase,
        title: phase.title.trim(),
        titleEn: phase.titleEn.trim() || phase.title.trim(),
        you: phase.you.trim(),
        youEn: phase.youEn.trim() || phase.you.trim(),
        us: phase.us.trim(),
        usEn: phase.usEn.trim() || phase.us.trim(),
        time: phase.time.trim(),
        timeEn: phase.timeEn.trim() || phase.time.trim(),
      })),
    )
  }

  return (
    <EditorDrawer
      open={open}
      onClose={onClose}
      eyebrow={t('PROCESO', 'PROCESS')}
      title={t('Editar cómo trabajamos', 'Edit how we work')}
      description={t(
        'Los cuatro pasos que se muestran en la landing. Cada paso tiene lo que hace el cliente y lo que hacemos nosotros.',
        'The four steps shown on the landing. Each step lists what the client does and what we do.',
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
      <div className="space-y-4">
        {draft.map((phase, index) => (
          <section
            key={phase.number}
            className="rounded-xl border border-stone-800 bg-stone-900/30 p-4"
          >
            <header className="flex items-center justify-between gap-3 border-b border-stone-800 pb-3">
              <span className="editorial-label text-stone-500">
                {t('PASO', 'STEP')} {phase.number}
              </span>
              <span className="font-sans text-[10px] text-stone-600">
                {t('Lo que ve el visitante', 'What the visitor sees')}
              </span>
            </header>

            <div className="mt-4 space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <TextField
                  label={t('TÍTULO (ES)', 'TITLE (ES)')}
                  value={phase.title}
                  onChange={(value) => updatePhase(index, 'title', value)}
                  placeholder="Cuéntanos qué buscas"
                />
                <TextField
                  label={t('TÍTULO (EN)', 'TITLE (EN)')}
                  value={phase.titleEn}
                  onChange={(value) => updatePhase(index, 'titleEn', value)}
                  placeholder="Tell us what you're looking for"
                  hint={t('Si se deja vacío, se usa el español.', 'If empty, Spanish is used.')}
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <TextField
                  label={t('TÚ (ES)', 'YOU (ES)')}
                  value={phase.you}
                  onChange={(value) => updatePhase(index, 'you', value)}
                  rows={2}
                  placeholder="Zona, presupuesto y tipo de propiedad."
                />
                <TextField
                  label={t('TÚ (EN)', 'YOU (EN)')}
                  value={phase.youEn}
                  onChange={(value) => updatePhase(index, 'youEn', value)}
                  rows={2}
                  placeholder="Area, budget and property type."
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <TextField
                  label={t('NOSOTROS (ES)', 'WE (ES)')}
                  value={phase.us}
                  onChange={(value) => updatePhase(index, 'us', value)}
                  rows={2}
                  placeholder="Te damos un panorama real y opciones que encajan."
                />
                <TextField
                  label={t('NOSOTROS (EN)', 'WE (EN)')}
                  value={phase.usEn}
                  onChange={(value) => updatePhase(index, 'usEn', value)}
                  rows={2}
                  placeholder="We give you a realistic overview and options that fit."
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <TextField
                  label={t('TIEMPO (ES)', 'TIME (ES)')}
                  value={phase.time}
                  onChange={(value) => updatePhase(index, 'time', value)}
                  placeholder="Con cita previa"
                />
                <TextField
                  label={t('TIEMPO (EN)', 'TIME (EN)')}
                  value={phase.timeEn}
                  onChange={(value) => updatePhase(index, 'timeEn', value)}
                  placeholder="By appointment"
                />
              </div>
            </div>
          </section>
        ))}
      </div>
    </EditorDrawer>
  )
}
