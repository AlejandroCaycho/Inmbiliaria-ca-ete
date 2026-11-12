import { useEffect, useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import EditorDrawer from './EditorDrawer'
import {
  FormSection,
  ImagePicker,
  SegmentedField,
  TextField,
  ToggleField,
  dangerButton,
  primaryButton,
  secondaryButton,
} from './fields'

const emptyProperty = {
  id: '',
  ref: '',
  refEn: '',
  name: '',
  nameEn: '',
  description: '',
  descriptionEn: '',
  meta: '',
  metaEn: '',
  price: '',
  priceEn: '',
  image: '',
  alt: '',
  altEn: '',
  group: 'casas',
  zone: '',
  location: '',
  locationEn: '',
  operation: 'venta',
  published: true,
}

const zoneSuggestions = ['Cañete', 'San Vicente', 'Cerro Azul', 'San Luis', 'Chincha']

export default function PropertyEditor({ open, property, onClose, onSave, onDelete }) {
  const { t } = useLanguage()
  const [draft, setDraft] = useState(emptyProperty)
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    if (!open) return
    setDraft(property ? { ...emptyProperty, ...property } : { ...emptyProperty })
    setConfirmDelete(false)
  }, [open, property])

  const set = (key) => (value) => setDraft((current) => ({ ...current, [key]: value }))

  const canSave = Boolean(
    draft.name.trim() && draft.image && draft.zone.trim() && draft.price.trim(),
  )

  function handleSave() {
    if (!canSave) return
    const id = draft.id || `PROP-${Date.now()}`
    const ref = draft.ref.trim() || id
    const name = draft.name.trim()
    const nameEn = draft.nameEn.trim() || name

    onSave({
      ...draft,
      id,
      ref,
      refEn: draft.refEn.trim() || ref,
      name,
      nameEn,
      description: draft.description.trim(),
      descriptionEn: draft.descriptionEn.trim() || draft.description.trim(),
      meta: draft.meta.trim(),
      metaEn: draft.metaEn.trim() || draft.meta.trim(),
      price: draft.price.trim(),
      priceEn: draft.priceEn.trim() || draft.price.trim(),
      alt: draft.alt.trim() || name,
      altEn: draft.altEn.trim() || nameEn,
      zone: draft.zone.trim(),
      location: draft.location.trim(),
      locationEn: draft.locationEn.trim() || draft.location.trim(),
    })
  }

  return (
    <EditorDrawer
      open={open}
      onClose={onClose}
      eyebrow={t('CATÁLOGO', 'CATALOG')}
      title={property ? t('Editar propiedad', 'Edit property') : t('Añadir propiedad', 'Add property')}
      description={t(
        'Los cambios se ven al instante en el catálogo público y se guardan en este navegador.',
        'Changes appear instantly in the public catalog and are saved in this browser.',
      )}
      footer={
        <>
          {property && (
            <div className="mr-auto flex flex-wrap items-center gap-2">
              {confirmDelete ? (
                <>
                  <span className="font-sans text-[10px] text-stone-500">
                    {t('¿Eliminar esta propiedad?', 'Delete this property?')}
                  </span>
                  <button type="button" onClick={onDelete} className={dangerButton}>
                    {t('Sí, eliminar', 'Yes, delete')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="font-sans text-[10px] text-stone-400 transition-colors hover:text-stone-100"
                  >
                    {t('Cancelar', 'Cancel')}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className={dangerButton}
                >
                  {t('Eliminar', 'Delete')}
                </button>
              )}
            </div>
          )}
          <button type="button" onClick={onClose} className={secondaryButton}>
            {t('Cancelar', 'Cancel')}
          </button>
          <button type="button" onClick={handleSave} disabled={!canSave} className={primaryButton}>
            {property ? t('Guardar cambios', 'Save changes') : t('Añadir propiedad', 'Add property')}
          </button>
        </>
      }
    >
      <div className="space-y-6">
        <FormSection title={t('Identificación', 'Identification')}>
          <div className="grid gap-3 sm:grid-cols-2">
            <TextField
              label={t('REFERENCIA (ES)', 'REFERENCE (ES)')}
              value={draft.ref}
              onChange={set('ref')}
              placeholder="SV-03 · SAN VICENTE"
            />
            <TextField
              label={t('REFERENCIA (EN)', 'REFERENCE (EN)')}
              value={draft.refEn}
              onChange={set('refEn')}
              placeholder="SV-03 · SAN VICENTE"
              hint={t('Si se deja vacío, se usa la referencia en español.', 'If empty, the Spanish reference is used.')}
            />
          </div>

          <SegmentedField
            label={t('TIPO DE PROPIEDAD', 'PROPERTY TYPE')}
            value={draft.group}
            onChange={set('group')}
            options={[
              { value: 'casas', label: t('Casa', 'Home') },
              { value: 'terrenos', label: t('Terreno', 'Land') },
            ]}
          />

          <SegmentedField
            label={t('MODALIDAD', 'MODE')}
            value={draft.operation}
            onChange={set('operation')}
            options={[
              { value: 'venta', label: t('Venta', 'Sale') },
              { value: 'alquiler', label: t('Alquiler', 'Rent') },
            ]}
          />

          <TextField
            label={t('ZONA', 'AREA')}
            value={draft.zone}
            onChange={set('zone')}
            placeholder="San Vicente"
            list="property-zone-options"
            hint={t('Aparece en la tabla del panel y en el resumen.', 'Shown in the panel table and the overview.')}
          />
          <datalist id="property-zone-options">
            {zoneSuggestions.map((zone) => (
              <option key={zone} value={zone} />
            ))}
          </datalist>

          <div className="grid gap-3 sm:grid-cols-2">
            <TextField
              label={t('UBICACIÓN (ES)', 'LOCATION (ES)')}
              value={draft.location}
              onChange={set('location')}
              placeholder="San Vicente, Cañete"
            />
            <TextField
              label={t('UBICACIÓN (EN)', 'LOCATION (EN)')}
              value={draft.locationEn}
              onChange={set('locationEn')}
              placeholder="San Vicente, Cañete"
              hint={t('Si se deja vacío, se usa la ubicación en español.', 'If empty, the Spanish location is used.')}
            />
          </div>
        </FormSection>

        <FormSection title={t('Contenido del catálogo', 'Catalog content')}>
          <div className="grid gap-3 sm:grid-cols-2">
            <TextField
              label={t('NOMBRE (ES)', 'NAME (ES)')}
              value={draft.name}
              onChange={set('name')}
              placeholder="Casa en San Vicente — km 148.5"
            />
            <TextField
              label={t('NOMBRE (EN)', 'NAME (EN)')}
              value={draft.nameEn}
              onChange={set('nameEn')}
              placeholder="Home in San Vicente — km 148.5"
              hint={t('Si se deja vacío, se usa el nombre en español.', 'If empty, the Spanish name is used.')}
            />
          </div>

          <TextField
            label={t('DESCRIPCIÓN (ES)', 'DESCRIPTION (ES)')}
            value={draft.description}
            onChange={set('description')}
            rows={3}
            placeholder="Ambientes, metraje y características principales."
          />
          <TextField
            label={t('DESCRIPCIÓN (EN)', 'DESCRIPTION (EN)')}
            value={draft.descriptionEn}
            onChange={set('descriptionEn')}
            rows={3}
            placeholder="Rooms, size and main features."
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <TextField
              label={t('RESUMEN (ES)', 'SUMMARY (ES)')}
              value={draft.meta}
              onChange={set('meta')}
              placeholder="214 m² terreno · 2 hab"
              hint={t('Metraje y ambientes, separados por “·”.', 'Size and rooms, separated by “·”.')}
            />
            <TextField
              label={t('RESUMEN (EN)', 'SUMMARY (EN)')}
              value={draft.metaEn}
              onChange={set('metaEn')}
              placeholder="214 m² lot · 2 bed"
            />
          </div>
        </FormSection>

        <FormSection title={t('Precio', 'Price')}>
          <div className="grid gap-3 sm:grid-cols-2">
            <TextField
              label={t('PRECIO (ES)', 'PRICE (ES)')}
              value={draft.price}
              onChange={set('price')}
              placeholder="US$ 100,000"
              hint={t('Si el precio no está cerrado, escribe “A consultar”.', 'If the price is not set, write “Price on request”.')}
            />
            <TextField
              label={t('PRECIO (EN)', 'PRICE (EN)')}
              value={draft.priceEn}
              onChange={set('priceEn')}
              placeholder="US$ 100,000"
            />
          </div>
        </FormSection>

        <FormSection title={t('Fotografía', 'Photo')}>
          <ImagePicker
            label={t('FOTO DE LA PROPIEDAD', 'PROPERTY PHOTO')}
            value={draft.image}
            onChange={set('image')}
            hint={t(
              'Solo se ofrecen las fotografías reales del cliente. No se permiten imágenes genéricas.',
              "Only the client's real photos are offered. Generic images are not allowed.",
            )}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <TextField
              label={t('TEXTO ALTERNATIVO (ES)', 'ALT TEXT (ES)')}
              value={draft.alt}
              onChange={set('alt')}
              placeholder="Describe la foto en una frase."
              hint={t('Si se deja vacío, se usa el nombre.', 'If empty, the name is used.')}
            />
            <TextField
              label={t('TEXTO ALTERNATIVO (EN)', 'ALT TEXT (EN)')}
              value={draft.altEn}
              onChange={set('altEn')}
              placeholder="Describe the photo in one sentence."
            />
          </div>
        </FormSection>

        <FormSection title={t('Publicación', 'Publishing')}>
          <ToggleField
            label={t('Visible en el sitio', 'Visible on the site')}
            description={t(
              'Si se oculta, desaparece del catálogo, del buscador de la portada y del formulario de contacto.',
              'If hidden, it disappears from the catalog, the homepage search and the contact form.',
            )}
            checked={draft.published}
            onChange={set('published')}
          />
        </FormSection>
      </div>
    </EditorDrawer>
  )
}
