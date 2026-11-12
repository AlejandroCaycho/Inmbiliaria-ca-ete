export const realImages = [
  {
    src: '/images/casa-lujo.jpg',
    label: 'Casa de Lujo en Cañete — piscina y parrilla',
    labelEn: 'Luxury home in Cañete — pool and grill',
  },
  {
    src: '/images/featured-casa-lujo.jpg',
    label: 'Casa de Lujo en Cañete — portada',
    labelEn: 'Luxury home in Cañete — homepage',
  },
  {
    src: '/images/casa-san-vicente.jpg',
    label: 'Casa en San Vicente — piscina y jardín',
    labelEn: 'Home in San Vicente — pool and garden',
  },
  {
    src: '/images/casa-alquiler.jpg',
    label: 'Casa en alquiler Los Cipreces — sala comedor',
    labelEn: 'Home for rent in Los Cipreces — living room',
  },
  {
    src: '/images/kusi-wasi-cerro-azul.jpg',
    label: 'Kusi Wasi Cerro Azul — áreas verdes',
    labelEn: 'Kusi Wasi Cerro Azul — green areas',
  },
  {
    src: '/images/kusi-wasi-del-mar.jpg',
    label: 'Kusi Wasi del Mar — lotes frente al mar',
    labelEn: 'Kusi Wasi del Mar — beachfront lots',
  },
  {
    src: '/images/terrenos-san-luis.jpg',
    label: 'Terrenos en San Luis de Cañete',
    labelEn: 'Land in San Luis de Cañete',
  },
  {
    src: '/images/hero-propiedad.jpg',
    label: 'Vista general de la propiedad — portada',
    labelEn: 'Property overview — homepage',
  },
]

const propertyImageSets = {
  'CAJ-01': ['/images/casa-lujo.jpg', '/images/featured-casa-lujo.jpg'],
  'SV-01': ['/images/casa-san-vicente.jpg'],
  'SV-02': ['/images/casa-alquiler.jpg'],
  'CA-01': ['/images/kusi-wasi-cerro-azul.jpg'],
  'CH-01': ['/images/kusi-wasi-del-mar.jpg'],
  'SL-01': ['/images/terrenos-san-luis.jpg'],
}

export function imagesForProperty(propertyId) {
  const allowed = propertyImageSets[propertyId]
  if (!allowed) return realImages
  return realImages.filter((image) => allowed.includes(image.src))
}
