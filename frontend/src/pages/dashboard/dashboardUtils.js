export const gestionLabels = {
  'Visita a la propiedad': { es: 'Visita a la propiedad', en: 'Property visit' },
  'Precio y financiamiento': { es: 'Precio y financiamiento', en: 'Price and financing' },
  'Quiero vender mi propiedad': { es: 'Quiero vender mi propiedad', en: 'I want to sell my property' },
  'Otra consulta': { es: 'Otra consulta', en: 'Other inquiry' },
}

export function formatLeadDate(iso, lang) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat(lang === 'en' ? 'en-US' : 'es-PE', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function formatToday(lang) {
  const label = new Intl.DateTimeFormat(lang === 'en' ? 'en-US' : 'es-PE', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  }).format(new Date())
  return label.charAt(0).toUpperCase() + label.slice(1)
}

export function pad(value) {
  return String(value).padStart(2, '0')
}

export function findProperty(properties, id) {
  return properties.find((property) => property.id === id) ?? null
}

export function propertyLabel(properties, id, lang, t) {
  const property = findProperty(properties, id)
  if (!property) return t('Consulta general', 'General inquiry')
  return lang === 'en' ? property.nameEn : property.name
}
