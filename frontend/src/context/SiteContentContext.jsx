import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { featuredHome } from '../data/featured'
import { methodPhases as defaultMethodPhases } from '../data/method'
import { properties as defaultProperties } from '../data/properties'

const STORAGE_KEY = 'impulso-content'
const STORAGE_VERSION = 1

export const defaultContact = {
  phone: '+51 991 372 212',
  whatsapp: '51991372212',
  instagramHandle: '@impulsoinmobiliariope',
  instagramUrl: 'https://www.instagram.com/impulsoinmobiliariope/',
  tiktokHandle: '@impulsoinmobiliariope',
  tiktokUrl: 'https://www.tiktok.com/@impulsoinmobiliariope',
}

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

function createDefaults() {
  return {
    properties: clone(defaultProperties).map((property) => ({
      ...property,
      published: property.published !== false,
    })),
    featured: {
      propertyId: featuredHome.propertyId,
      image: featuredHome.image,
      highlights: clone(featuredHome.highlights),
    },
    methodPhases: clone(defaultMethodPhases),
    contact: { ...defaultContact },
  }
}

function readStoredContent() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return createDefaults()
    const parsed = JSON.parse(raw)
    if (parsed?.version !== STORAGE_VERSION || !parsed?.data) return createDefaults()

    const defaults = createDefaults()
    return {
      properties: Array.isArray(parsed.data.properties)
        ? parsed.data.properties
        : defaults.properties,
      featured: {
        ...defaults.featured,
        ...parsed.data.featured,
        highlights: Array.isArray(parsed.data.featured?.highlights)
          ? parsed.data.featured.highlights
          : defaults.featured.highlights,
      },
      methodPhases: Array.isArray(parsed.data.methodPhases)
        ? parsed.data.methodPhases
        : defaults.methodPhases,
      contact: { ...defaults.contact, ...parsed.data.contact },
    }
  } catch {
    return createDefaults()
  }
}

const SiteContentContext = createContext(null)

export function SiteContentProvider({ children }) {
  const [content, setContent] = useState(readStoredContent)

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ version: STORAGE_VERSION, data: content }),
      )
    } catch {
      // Content still works in memory when storage is unavailable.
    }
  }, [content])

  const updateFeatured = useCallback((featured) => {
    setContent((current) => ({ ...current, featured }))
  }, [])

  const updateProperty = useCallback((id, patch) => {
    setContent((current) => {
      const properties = current.properties.map((property) =>
        property.id === id ? { ...property, ...patch } : property,
      )
      let featured = current.featured

      if (current.featured.propertyId === id && patch.published === false) {
        const fallback = properties.find((property) => property.published && property.id !== id)
        if (fallback) {
          featured = {
            ...current.featured,
            propertyId: fallback.id,
            image: fallback.image,
            highlights: [],
          }
        }
      }

      return { ...current, properties, featured }
    })
  }, [])

  const addProperty = useCallback((property) => {
    const entry = {
      ...property,
      id: property.id ?? `PROP-${Date.now()}`,
      refEn: property.refEn ?? property.ref,
      nameEn: property.nameEn || property.name,
      descriptionEn: property.descriptionEn || property.description,
      metaEn: property.metaEn || property.meta,
      priceEn: property.priceEn || property.price,
      alt: property.alt || property.name,
      altEn: property.altEn || property.nameEn || property.name,
      locationEn: property.locationEn || property.location,
      published: property.published !== false,
    }
    setContent((current) => ({ ...current, properties: [...current.properties, entry] }))
    return entry
  }, [])

  const removeProperty = useCallback((id) => {
    setContent((current) => {
      const properties = current.properties.filter((property) => property.id !== id)
      let featured = current.featured
      if (current.featured.propertyId === id) {
        const fallback = properties.find((property) => property.published)
        if (fallback) {
          featured = {
            ...current.featured,
            propertyId: fallback.id,
            image: fallback.image,
            highlights: [],
          }
        }
      }
      return { ...current, properties, featured }
    })
  }, [])

  const updateMethodPhases = useCallback((methodPhases) => {
    setContent((current) => ({ ...current, methodPhases }))
  }, [])

  const updateContact = useCallback((contact) => {
    setContent((current) => ({ ...current, contact }))
  }, [])

  const resetContent = useCallback(() => {
    setContent(createDefaults())
  }, [])

  const value = useMemo(
    () => ({
      ...content,
      updateFeatured,
      updateProperty,
      addProperty,
      removeProperty,
      updateMethodPhases,
      updateContact,
      resetContent,
    }),
    [
      content,
      updateFeatured,
      updateProperty,
      addProperty,
      removeProperty,
      updateMethodPhases,
      updateContact,
      resetContent,
    ],
  )

  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>
}

export function useSiteContent() {
  const context = useContext(SiteContentContext)
  if (!context) throw new Error('useSiteContent must be used within SiteContentProvider')
  return context
}
