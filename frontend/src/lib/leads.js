const STORAGE_KEY = 'impulso-leads'

const demoLeads = [
  {
    id: 'demo-ch-01',
    name: 'María Quispe',
    email: 'maria.quispe@gmail.com',
    propertyId: 'CH-01',
    gestion: 'Visita a la propiedad',
    message:
      'Quisiera coordinar una visita el sábado por la mañana para conocer los lotes frente al mar.',
    messageEn:
      'I would like to arrange a visit on Saturday morning to see the beachfront lots.',
    date: '2026-11-10T09:20:00-05:00',
    status: 'nueva',
    lang: 'es',
    demo: true,
  },
  {
    id: 'demo-sv-01',
    name: 'Carlos Ruiz',
    email: 'carlos.ruiz@outlook.com',
    propertyId: 'SV-01',
    gestion: 'Precio y financiamiento',
    message:
      'Me interesa la casa del km 148.5. Quisiera saber si el precio es negociable y qué opciones de financiamiento hay.',
    messageEn:
      "I'm interested in the home at km 148.5. I'd like to know if the price is negotiable and what financing options are available.",
    date: '2026-11-09T16:45:00-05:00',
    status: 'atendida',
    lang: 'es',
    demo: true,
  },
  {
    id: 'demo-caj-01',
    name: 'Lucía Fernández',
    email: 'lucia.fernandez@gmail.com',
    propertyId: 'CAJ-01',
    gestion: 'Visita a la propiedad',
    message:
      'Buenas tardes, quisiera ver la casa de lujo en Cañete. Estamos disponibles los fines de semana.',
    messageEn:
      'Good afternoon, I would like to see the luxury home in Cañete. We are available on weekends.',
    date: '2026-11-08T11:05:00-05:00',
    status: 'nueva',
    lang: 'es',
    demo: true,
  },
]

function sortByDate(leads) {
  return [...leads].sort((a, b) => new Date(b.date) - new Date(a.date))
}

function writeLeads(leads) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(leads))
  } catch {
    // The dashboard falls back to the in-memory list when storage is unavailable.
  }
}

export function getLeads() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const stored = JSON.parse(raw)
      if (Array.isArray(stored)) return sortByDate(stored)
    }
  } catch {
    // Corrupted storage is replaced with the demo list below.
  }

  writeLeads(demoLeads)
  return sortByDate(demoLeads)
}

export function saveLead(lead) {
  const entry = {
    id: `lead-${Date.now()}`,
    date: new Date().toISOString(),
    status: 'nueva',
    demo: false,
    ...lead,
  }
  const next = sortByDate([entry, ...getLeads()])
  writeLeads(next)
  return entry
}

export function updateLeadStatus(id, status) {
  const next = getLeads().map((lead) => (lead.id === id ? { ...lead, status } : lead))
  writeLeads(next)
  return sortByDate(next)
}
