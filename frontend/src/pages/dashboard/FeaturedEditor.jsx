import { useEffect, useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { imagesForProperty } from '../../data/images'
import EditorDrawer from './EditorDrawer'
import { FormSection, ImagePicker, TextField, primaryButton, secondaryButton } from './fields'

export default function FeaturedEditor({ open, featured, properties, onClose, onSave }) {
  const { t } = useLanguage()
  const [draft, setDraft] = useState(null)

  useEffect(() => {
    if (!open) return
    const published = properties.filter((property) => property.published !== false)
    const property = published.find((item) => item.id === featured.propertyId) ?? published[0]
    const options = imagesForProperty(property?.id ?? '')
    const image = options.some((option) => option.src === featured.image)
      ? featured.image
      : property?.image ?? ''
    const sameProperty = featured.propertyId === property?.id
    setDraft({
      propertyId: property?.id ?? '',
      image,
      highlights:
        sameProperty && featured.highlights?.length > 0
          ? featured.highlights.map((item) => ({ es: item.es, en: item.en }))
          : [{ es: '', en: '' }],
    })
  }, [open, featured, properties])

  if (!open || !draft) return null

  const publishedProperties = properties.filter((property) => property.published !== false)
  const selectedProperty = publishedProperties.find((property) => property.id === draft.propertyId)
  const canSave = Boolean(
    draft.propertyId && draft.image && draft.highlights.some((item) => item.es.trim()),
  )

  function selectProperty(id) {
    const property = publishedProperties.find((item) => item.id === id)
    setDraft((current) => {
      if (current.propertyId === id) return current
      return {
        ...current,
        propertyId: id,
        image: property?.image ?? current.image,
        highlights: [{ es: '', en: '' }],
      }
    })
  }

  function updateHighlight(index, key, value) {
    setDraft((current) => ({
      ...current,
      highlights: current.highlights.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item,
      ),
    }))
  }

  function addHighlight() {
    setDraft((current) => ({
      ...current,
      highlights: [...current.highlights, { es: '', en: '' }],
    }))
  }

  function removeHighlight(index) {
    setDraft((current) => ({
      ...current,
      highlights: current.highlights.filter((_, itemIndex) => itemIndex !== index),
    }))
  }

  function handleSave() {
    if (!canSave) return
    onSave({
      propertyId: draft.propertyId,
      image: draft.image,
      highlights: draft.highlights
        .map((item) => ({ es: item.es.trim(), en: item.en.trim() || item.es.trim() }))
        .filter((item) => item.es),
    })
  }

  return (
    <EditorDrawer
      open={open}
      onClose={onClose}
      eyebrow={t('PORTADA', 'HOMEPAGE')}
      title={t('Editar propiedad destacada', 'Edit featured property')}
      description={t(
        'Elige el inmueble y la fotografía que se muestran en la portada, y ajusta los puntos destacados.',
        'Choose the property and photo shown on the homepage, and adjust the highlights.',
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
        <FormSection
          title={t('Inmueble destacado', 'Featured property')}
          description={t(
            'Solo aparecen las propiedades publicadas en el catálogo.',
            'Only properties published in the catalog are listed.',
          )}
        >
          {publishedProperties.length === 0 ? (
            <p className="rounded-lg border border-stone-800 bg-stone-900/40 px-3 py-3 font-sans text-[11px] font-light leading-relaxed text-stone-400">
              {t(
                'No hay propiedades publicadas. Publica una en el módulo Propiedades para poder destacarla.',
                'There are no published properties. Publish one in the Properties module to feature it.',
              )}
            </p>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2">
              {publishedProperties.map((property) => {
                const selected = property.id === draft.propertyId
                const name = t(property.name, property.nameEn)
                return (
                  <button
                    key={property.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => selectProperty(property.id)}
                    className={`flex items-center gap-3 rounded-lg border p-2 text-left transition-colors ${
                      selected
                        ? 'border-terracotta bg-terracotta/5'
                        : 'border-stone-800 hover:border-stone-600'
                    }`}
                  >
                    <img
                      src={property.image}
                      alt=""
                      loading="lazy"
                      className="h-10 w-14 shrink-0 rounded-md object-cover"
                    />
                    <span className="min-w-0">
                      <span className="block truncate font-sans text-[11px] font-medium text-stone-100">
                        {name}
                      </span>
                      <span className="mt-0.5 block truncate font-sans text-[9px] text-stone-500">
                        {property.ref}
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>
          )}
        </FormSection>

        <FormSection
          title={t('Fotografía de portada', 'Homepage photo')}
          description={
            selectedProperty
              ? t(
                  `Foto principal actual del inmueble: ${selectedProperty.ref}. Puedes elegir otra foto real de la misma propiedad.`,
                  `Current main photo of ${selectedProperty.ref}. You may choose another real photo of the same property.`,
                )
              : undefined
          }
        >
          <ImagePicker
            label={t('FOTO MOSTRADA EN LA PORTADA', 'PHOTO SHOWN ON THE HOMEPAGE')}
            value={draft.image}
            onChange={(value) => setDraft((current) => ({ ...current, image: value }))}
            images={imagesForProperty(draft.propertyId)}
            hint={t(
              'Solo fotografías reales del cliente. No se permiten imágenes genéricas.',
              "Only the client's real photos. Generic images are not allowed.",
            )}
          />
        </FormSection>

        <FormSection
          title={t('Puntos destacados', 'Highlights')}
          description={t(
            'Aparecen junto a la foto principal. Entre uno y seis puntos. Si cambias de inmueble, vuelve a escribir los puntos del nuevo inmueble.',
            'Shown next to the main photo. Between one and six points. If you switch properties, rewrite the points for the new property.',
          )}
        >
          {draft.highlights.map((highlight, index) => (
            <div
              key={index}
              className="rounded-lg border border-stone-800 bg-stone-900/30 p-3"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-sans text-[9px] uppercase tracking-[0.14em] text-stone-500">
                  {t('Punto', 'Point')} {String(index + 1).padStart(2, '0')}
                </span>
                <button
                  type="button"
                  onClick={() => removeHighlight(index)}
                  disabled={draft.highlights.length === 1}
                  className="font-sans text-[10px] text-stone-500 transition-colors hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {t('Quitar', 'Remove')}
                </button>
              </div>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                <TextField
                  label={t('ESPAÑOL', 'SPANISH')}
                  value={highlight.es}
                  onChange={(value) => updateHighlight(index, 'es', value)}
                  placeholder="Piscina, terraza y parrilla"
                />
                <TextField
                  label={t('INGLÉS', 'ENGLISH')}
                  value={highlight.en}
                  onChange={(value) => updateHighlight(index, 'en', value)}
                  placeholder="Pool, terrace and grill"
                  hint={t('Si se deja vacío, se usa el español.', 'If empty, Spanish is used.')}
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addHighlight}
            disabled={draft.highlights.length >= 6}
            className="inline-flex items-center justify-center gap-1.5 rounded-md border border-dashed border-stone-700 px-2.5 py-1.5 font-sans text-[10px] font-medium text-stone-300 transition-colors hover:border-stone-500 hover:text-stone-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            + {t('Añadir punto', 'Add point')}
          </button>
        </FormSection>
      </div>
    </EditorDrawer>
  )
}
