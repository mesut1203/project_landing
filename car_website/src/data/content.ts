export interface LinkContent { label: string; href: string }
export interface ImageContent { src: string; alt: string; width: number; height: number }
export interface DetailContent {
  id: string
  label: string
  heading: string
  description: string
  image: ImageContent
}
export interface GalleryImage extends ImageContent { id: string; caption: string }

export const brand = {
  name: 'Apex Motors',
  logo: 'apex.',
  favicon: '/apex-mark.svg',
  model: 'Apex One',
  homeLabel: 'Apex Motors home',
  title: 'Apex Motors | Built for the long way.',
  description: 'Discover Apex One. A sports car concept shaped around the feeling of the open road.',
  colors: {
    charcoal: '#101211', surface: '#1b1e1b', ink: '#f0f2e9',
    muted: '#a8ada6', accent: '#d6fc46', chrome: '#d2d7cc',
  },
}

export const navigation = {
  label: 'Main navigation',
  breakpoint: '(max-width: 767px), (pointer: coarse) and (max-width: 1023px)',
  links: [
    { label: 'Models', href: '#model' },
    { label: 'Experience', href: '#experience' },
    { label: 'Gallery', href: '#gallery' },
  ] satisfies LinkContent[],
  menuLabel: 'Menu',
  openLabel: 'Open navigation menu',
  closeLabel: 'Close navigation menu',
  skipContent: { label: 'Skip to content', href: '#main-content' },
}

export const ctas = {
  explore: { label: 'Explore the model', href: '#model' },
  book: { label: 'Book a drive', href: '#drive' },
  detail: { label: 'Discover the details', href: '#experience' },
}

export const hero = {
  label: 'Apex One / Grand touring concept',
  lines: ['Built for', 'the long way.'],
  description: 'For the roads that ask a little more. And the moments that stay with you.',
  image: { src: '/media/apex-coast.webp', alt: 'A silver grand touring coupe overlooking a quiet coastal road at blue hour.', width: 1672, height: 941 } satisfies ImageContent,
}

export const model = {
  id: 'model', heading: 'Some roads change everything.',
  description: 'The first glance. The first corner. The road you choose to take. Meet a concept built around the connection between car and driver.',
  image: { src: '/media/apex-profile.webp', alt: 'A full side profile of the silver Apex One against a graphite architectural backdrop.', width: 1536, height: 1024 } satisfies ImageContent,
  caption: 'Apex One. An expression of intent.',
}

export const performance = {
  id: 'experience', heading: 'Nothing here by accident.',
  label: 'Explore the design',
  details: [
    {
      id: 'design', label: 'Design', heading: 'Form, with purpose.',
      description: 'A low silhouette. Sculpted surfaces. Light that follows every line. Nothing interrupts the shape.',
      image: { src: '/media/apex-detail.webp', alt: 'Sculpted silver bodywork and a black multi-spoke wheel beside the ocean.', width: 1448, height: 1086 },
    },
    {
      id: 'handling', label: 'Handling', heading: 'A closer connection.',
      description: 'The road is part of the conversation. A driver-focused concept, imagined for the pleasure of every turn.',
      image: { src: '/media/apex-handling.webp', alt: 'The silver grand tourer carrying speed through a sweeping road bend.', width: 1536, height: 1024 },
    },
    {
      id: 'interior', label: 'Interior', heading: 'Your place in the journey.',
      description: 'Tactile materials, considered details and a cockpit that brings the focus back to driving.',
      image: { src: '/media/apex-cockpit.webp', alt: 'Cognac leather, brushed metal and tactile controls inside a grand touring cockpit.', width: 1448, height: 1086 },
    },
  ] satisfies DetailContent[],
}

export const gallery = {
  id: 'gallery', heading: 'A different point of view.', label: 'Gallery',
  openLabel: 'View image:', closeLabel: 'Close image viewer',
  previousLabel: 'Previous image', nextLabel: 'Next image',
  images: [
    { id: 'pass', src: '/media/apex-pass.webp', alt: 'A distant rear view of Apex One following the curves of a mountain pass.', caption: 'Out where the road opens up.', width: 1536, height: 1024 },
    { id: 'rear', src: '/media/apex-rear.webp', alt: 'The sculpted rear of the silver grand tourer with slim illuminated taillights.', caption: 'A lasting impression.', width: 1448, height: 1086 },
    { id: 'light', src: '/media/apex-headlight.webp', alt: 'A close study of the Apex One front headlight and sculpted silver bodywork.', caption: 'Considered from every angle.', width: 1448, height: 1086 },
  ] satisfies GalleryImage[],
}

export const booking = {
  id: 'drive', heading: 'Take the long way.',
  description: 'Some things are better experienced.',
  dialogTitle: 'The journey starts here.',
  dialogDescription: 'Apex Motors is a fictional automotive concept. Test-drive bookings are not open yet.',
  closeLabel: 'Close booking information',
  // Replace with a real booking service URL to enable reservations.
  url: null as string | null,
  image: { src: '/media/apex-night.webp', alt: 'Apex One beside an illuminated modern pavilion after dark.', width: 1600, height: 900 } satisfies ImageContent,
}

export const footer = {
  note: 'A fictional automotive concept.',
  copyright: '© 2026 Apex Motors',
  socialLabel: 'Social channels',
  socialNotice: 'Our social channels are not open yet.',
  socialTitle: 'Stay close to the journey.',
  closeLabel: 'Close social information',
  // No fictional account URLs: these links open an honest availability notice until configured.
  socials: [
    { label: 'Instagram', href: null },
    { label: 'YouTube', href: null },
    { label: 'LinkedIn', href: null },
  ] as { label: string; href: string | null }[],
  top: { label: 'Back to top', href: '#top' },
}
