export interface LinkContent { label: string; href: string }
export interface ImageContent { src: string; alt: string; width: number; height: number }
export interface ScenePacing {
  start: number
  end: number
  frameStart: number
  frameEnd: number
  openingHold: number
  finalHold: number
}
export interface SceneContent {
  id: string
  label: string
  headline: string
  lines: string[]
  desktop: ScenePacing
  mobile: ScenePacing
}
export interface SequenceConfig {
  id: 'desktop' | 'mobile'
  enabled: boolean
  basePath: string
  frameCount: number
  padding: number
  fps: number
  width: number
  height: number
  poster: string
  finalPoster: string
  fallback: string
  alt: string
  maxDecoded: number
  ahead: number
  behind: number
  concurrency: number
  scrollVh: number
}
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
  links: [
    { label: 'Models', href: '#model' },
    { label: 'Experience', href: '#experience' },
    { label: 'Gallery', href: '#gallery' },
  ] satisfies LinkContent[],
  menuLabel: 'Menu',
  openLabel: 'Open navigation menu',
  closeLabel: 'Close navigation menu',
  skipContent: { label: 'Skip to content', href: '#model' },
}

export const ctas = {
  explore: { label: 'Explore the model', href: '#model' },
  book: { label: 'Book a drive', href: '#drive' },
  detail: { label: 'Discover the details', href: '#experience' },
}

// Media paths are relative to public/. Turn enabled on only after importing and validating both chains.
export const media: Record<'desktop' | 'mobile', SequenceConfig> = {
  desktop: {
    id: 'desktop', enabled: true, basePath: '/media/sequence/desktop/frame-',
    frameCount: 160, padding: 4, fps: 16, width: 1280, height: 720,
    poster: '/media/ignition-desktop.webp', finalPoster: '/media/arrival-desktop.webp',
    fallback: '/media/model.webp', alt: 'Apex One, a silver sports coupe in a dark studio.',
    maxDecoded: 20, ahead: 10, behind: 4, concurrency: 3, scrollVh: 560,
  },
  mobile: {
    id: 'mobile', enabled: false, basePath: '/media/sequence/mobile/frame-',
    frameCount: 324, padding: 4, fps: 18, width: 720, height: 405,
    poster: '/media/mobile-static.webp', finalPoster: '/media/mobile-static.webp',
    fallback: '/media/mobile-static.webp', alt: 'A sports coupe above the coast at sunset, shown in full.',
    maxDecoded: 9, ahead: 4, behind: 2, concurrency: 2, scrollVh: 430,
  },
}

export const story = {
  id: 'story', label: 'The Apex journey',
  introduction: 'A new perspective on the open road.',
  scrollCue: 'Scroll to discover',
  skip: { label: 'Skip story', href: '#model' },
  loading: 'Loading the journey',
  failure: 'The film is unavailable. Explore the model below.',
  retry: 'Retry film',
  unavailableImage: 'Apex One',
  breakpoint: '(max-width: 767px), (pointer: coarse) and (max-width: 1023px)',
  scenes: [
    {
      id: 'ignition', label: 'Ignition', headline: 'Built for the long way.',
      lines: ['Built for', 'the long way.'],
      desktop: { start: 0, end: 0.38, frameStart: 0, frameEnd: 63, openingHold: 0.12, finalHold: 0.04 },
      mobile: { start: 0, end: 0.29, frameStart: 0, frameEnd: 107, openingHold: 0.12, finalHold: 0.02 },
    },
    {
      id: 'motion', label: 'Motion', headline: 'Precision in every line. Confidence in every mile.',
      lines: ['Precision in every line.', 'Confidence in every mile.'],
      desktop: { start: 0.38, end: 0.76, frameStart: 63, frameEnd: 127, openingHold: 0, finalHold: 0 },
      mobile: { start: 0.29, end: 0.76, frameStart: 107, frameEnd: 215, openingHold: 0, finalHold: 0 },
    },
    {
      id: 'arrival', label: 'Arrival', headline: 'See where it takes you.',
      lines: ['See where', 'it takes you.'],
      desktop: { start: 0.76, end: 1, frameStart: 127, frameEnd: 159, openingHold: 0, finalHold: 0.12 },
      mobile: { start: 0.76, end: 1, frameStart: 215, frameEnd: 323, openingHold: 0, finalHold: 0.17 },
    },
  ] satisfies SceneContent[],
  stills: {
    desktop: ['/media/ignition-desktop.webp', '/media/motion-desktop.webp', '/media/arrival-desktop.webp'],
    mobile: ['/media/ignition-mobile.webp', '/media/motion-mobile.webp', '/media/arrival-mobile.webp'],
  },
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

export const layout = {
  // Layer scale: content 0, story overlays 10, skip 30, navbar 40, native dialogs top layer.
  layers: { content: 0, story: 10, skip: 30, nav: 40 },
}
