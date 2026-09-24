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
    charcoal: '#111214', surface: '#191a1d', ink: '#f3f1ed',
    muted: '#a7a9ad', accent: '#ec392e', chrome: '#d1d4d8',
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
  label: 'Introducing Apex One',
  lines: ['Built for', 'the long way.'],
  description: 'A new perspective on the open road.',
  image: { src: '/media/ignition-desktop.webp', alt: 'A close view of a silver sports coupe and its sculpted headlight in a dark studio.', width: 1280, height: 720 } satisfies ImageContent,
}

export const model = {
  id: 'model', heading: 'Engineered to be felt.',
  description: 'The first glance. The first corner. The road you choose to take. Meet a concept built around the connection between car and driver.',
  image: { src: '/media/model.webp', alt: 'A metallic sports coupe parked above the ocean at sunset.', width: 1280, height: 720 } satisfies ImageContent,
  caption: 'Apex One. An expression of intent.',
}

export const performance = {
  id: 'experience', heading: 'Every curve has a reason.',
  label: 'Explore the design',
  details: [
    {
      id: 'design', label: 'Design', heading: 'Form, with purpose.',
      description: 'A low silhouette. Sculpted surfaces. Light that follows every line. Nothing interrupts the shape.',
      image: { src: '/media/detail-body.webp', alt: 'A close view of the headlight and sculpted metallic bodywork of Apex One.', width: 1200, height: 900 },
    },
    {
      id: 'handling', label: 'Handling', heading: 'A closer connection.',
      description: 'The road is part of the conversation. A driver-focused concept, imagined for the pleasure of every turn.',
      image: { src: '/media/detail-wheel.webp', alt: 'A multi-spoke alloy wheel under directional studio light.', width: 1280, height: 720 },
    },
    {
      id: 'interior', label: 'Interior', heading: 'Your place in the journey.',
      description: 'Tactile materials, considered details and a cockpit that brings the focus back to driving.',
      image: { src: '/media/detail-interior.webp', alt: 'Dark leather, brushed metal and the driver seat inside the Apex One concept.', width: 1200, height: 900 },
    },
  ] satisfies DetailContent[],
}

export const gallery = {
  id: 'gallery', heading: 'A different point of view.', label: 'Gallery',
  openLabel: 'View image:', closeLabel: 'Close image viewer',
  previousLabel: 'Previous image', nextLabel: 'Next image',
  images: [
    { id: 'coast', src: '/media/gallery-coast.webp', alt: 'Apex One alongside a sweeping coastal road at first light.', caption: 'Out where the road opens up.', width: 1600, height: 1000 },
    { id: 'rear', src: '/media/gallery-rear.webp', alt: 'Rear three-quarter view of Apex One with a thin red taillight.', caption: 'A lasting impression.', width: 900, height: 1200 },
    { id: 'light', src: '/media/detail-body.webp', alt: 'Light tracing the silver front fender and headlight.', caption: 'Considered from every angle.', width: 1200, height: 900 },
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
  image: { src: '/media/arrival-desktop.webp', alt: 'Apex One parked above the coast at sunset.', width: 1600, height: 900 } satisfies ImageContent,
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
