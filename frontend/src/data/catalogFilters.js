export const tipologias = [
  { value: 'todas', label: 'Todas las propiedades', labelEn: 'All properties' },
  { value: 'casa-venta', label: 'Casa en venta', labelEn: 'Home for sale' },
  { value: 'casa-alquiler', label: 'Casa en alquiler', labelEn: 'Home for rent' },
  { value: 'terreno', label: 'Terreno', labelEn: 'Land' },
  { value: 'proyecto', label: 'Proyecto frente al mar', labelEn: 'Beachfront project' },
]

export const zonas = [
  { value: 'todas', label: 'Todas las zonas', labelEn: 'All areas' },
  { value: 'san-vicente', label: 'San Vicente', labelEn: 'San Vicente' },
  { value: 'cerro-azul', label: 'Cerro Azul', labelEn: 'Cerro Azul' },
  { value: 'san-luis', label: 'San Luis', labelEn: 'San Luis' },
  { value: 'chincha', label: 'Chincha', labelEn: 'Chincha' },
  { value: 'canete', label: 'Cañete', labelEn: 'Cañete' },
]

export const superficies = [
  { value: 'todas', label: 'Cualquier tamaño', labelEn: 'Any size' },
  { value: 'hasta-200', label: 'Hasta 200 m²', labelEn: 'Up to 200 m²' },
  { value: '200-500', label: '200 m² — 500 m²', labelEn: '200 m² — 500 m²' },
  { value: '500-1000', label: '500 m² — 1,000 m²', labelEn: '500 m² — 1,000 m²' },
  { value: '1000+', label: 'Más de 1,000 m²', labelEn: 'Over 1,000 m²' },
]

export const presupuestos = [
  { value: 'todos', label: 'Cualquier monto', labelEn: 'Any budget' },
  { value: 'hasta-50k', label: 'Hasta S/ 50,000', labelEn: 'Up to S/ 50,000' },
  { value: '50k-100k', label: 'S/ 50,000 — 100,000', labelEn: 'S/ 50,000 — 100,000' },
  { value: '100k-200k', label: 'US$ 100,000 — 200,000', labelEn: 'US$ 100,000 — 200,000' },
  { value: 'consultar', label: 'A consultar', labelEn: 'Price on request' },
]

export const emptyCatalogFilters = {
  tipo: 'todas',
  zona: 'todas',
  superficie: 'todas',
  presupuesto: 'todos',
}
