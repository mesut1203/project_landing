export interface LinkContent { label: string; href: string }
export interface MediaAsset { src: string; alt: string; width: number; height: number; position?: string }
export interface SceneContent { id: string; label: string; heading: string; text?: string; poster: MediaAsset; cta?: LinkContent }
export interface RoomContent { id: string; name: string; category: string; description: string; image: MediaAsset; cta: LinkContent }
export interface ExperienceContent { id: string; title: string; subtitle: string; description: string; image: MediaAsset }
const photo = (file: string, alt: string, position = 'center'): MediaAsset => ({ src: `/media/${file}.webp`, alt, width: 1536, height: 1024, position })

export const content = {
  seo: { title: 'Aurelia Hotel | The art of a slower stay', description: 'Aurelia Hotel. Sun-warmed stone. Salt in the air. Time to call your own. Thoughtful rooms, unhurried dining, and room to simply be.', favicon: '/favicon.svg' },
  brand: { name: 'Aurelia Hotel', logo: 'aurelia.', tagline: 'The art of a slower stay.', homeLabel: 'Aurelia Hotel, back to the beginning' },
  nav: {
    label: 'Main navigation', mobileLabel: 'Mobile navigation', open: 'Open menu', close: 'Close menu',
    links: [{ label: 'Rooms', href: '#rooms' }, { label: 'Dining', href: '#dining' }, { label: 'Experiences', href: '#experiences' }] as LinkContent[],
    reserve: { label: 'Reserve a stay', href: '#booking' }, skip: 'Skip to main content',
  },
  story: {
    label: 'An arrival at Aurelia', eyebrow: 'A small hotel. A slower world.', skip: { label: 'Explore the rooms', href: '#rooms' },
    scenes: [
      { id: 'arrival', label: 'The arrival', heading: 'Arrive slowly.', text: 'Sun-warmed stone. Salt in the air. Time to call your own.', poster: photo('aurelia-coast', 'Sunlit limestone arch and olive tree overlooking the Mediterranean Sea') },
      { id: 'lobby', label: 'The welcome', heading: 'Step into stillness.', text: 'Designed for the moments between plans.', poster: photo('aurelia-pool', 'A quiet stone courtyard pool framed by olive trees') },
      { id: 'suite', label: 'The retreat', heading: 'Make room for ease.', text: 'Thoughtful spaces, soft light, and time that feels like yours.', poster: photo('aurelia-retreat', 'A sunlit reading alcove with a linen chaise, timber shelves and ceramic objects') },
      { id: 'view', label: 'The view', heading: 'Stay for the view.', poster: photo('aurelia-balcony', 'Open timber doors and linen curtains framing a private balcony above the sea'), cta: { label: 'Reserve your stay', href: '#booking' } },
    ] as SceneContent[],
  },
  rooms: {
    id: 'rooms', eyebrow: 'Considered spaces', heading: 'A room to exhale.',
    description: 'Less on your mind. More room to be. Find your own corner of quiet, with every detail thoughtfully in place.',
    items: [
      { id: 'aurelia-suite', name: 'The Aurelia Suite', category: 'A little more room to linger', description: 'Soft textures, a generous sitting area, and the simple pleasure of an unhurried morning.', image: photo('aurelia-suite', 'A pale linen suite with arched doors opening to a sea view'), cta: { label: 'Stay a little longer', href: '#booking' } },
      { id: 'classic-room', name: 'The Classic Room', category: 'Your everyday escape', description: 'Warm light, crisp linen, and everything you need to feel wonderfully at ease.', image: photo('aurelia-classic', 'A warm plaster guest room with a timber desk and crisp linen bed'), cta: { label: 'Find your quiet', href: '#booking' } },
      { id: 'terrace-room', name: 'The Terrace Room', category: 'Let the outside in', description: 'An invitation to open the doors, take a deep breath, and let the day unfold.', image: photo('aurelia-terrace-room', 'A generous guest room opening to a private terrace with a daybed and sea views'), cta: { label: 'Make yourself at home', href: '#booking' } },
    ] as RoomContent[],
    note: 'Every room, a different way to slow down.',
  },
  dining: {
    id: 'dining', eyebrow: 'Around the table', heading: 'Dinner, unhurried.',
    description: 'Seasonal ingredients. A table worth lingering at. Evenings that begin with something good and end whenever you are ready.',
    detail: 'From the first coffee to the last conversation, there is always a reason to stay a little longer.',
    image: photo('aurelia-table', 'A linen-dressed table beneath a grapevine pergola with a coastal view'),
    cta: { label: 'Make an evening of it', href: '#booking' },
  },
  experiences: {
    id: 'experiences', heading: 'The coast, at your pace.',
    description: 'Follow your curiosity. Or follow no plans at all.', label: 'Choose an experience',
    items: [
      { id: 'wander', title: 'Take the scenic way.', subtitle: 'Out & about', description: 'A path along the headland, a café you almost walked past, a new favourite view. Leave room for the unexpected.', image: photo('aurelia-headland', 'A coastal walking path through cypress and rosemary above a turquoise bay') },
      { id: 'restore', title: 'Come back to yourself.', subtitle: 'A moment of calm', description: 'Make space for a slower ritual. Warmth, water, and a moment that belongs entirely to you.', image: photo('aurelia-spa', 'A quiet limestone bathing room with warm reflected light and folded towels') },
      { id: 'rooftop', title: 'Let the afternoon linger.', subtitle: 'In the open air', description: 'Find a quiet poolside perch, take in the fresh air, and let the rest of the world wait.', image: photo('aurelia-rooftop', 'A rooftop pool with cream loungers looking toward the sea in late afternoon') },
    ] as ExperienceContent[],
  },
  booking: {
    id: 'booking', eyebrow: 'Something to look forward to', heading: 'Your stay begins here.',
    description: 'A change of scenery. A little breathing room. A stay that feels like you.',
    labels: { checkIn: 'Check-in', checkOut: 'Check-out', guests: 'Guests', submit: 'Check availability' },
    guests: [{ value: '1', label: '1 guest' }, { value: '2', label: '2 guests' }, { value: '3', label: '3 guests' }, { value: '4', label: '4 guests' }],
    note: 'Demo form. Connect a booking service to receive submissions.',
    errors: { required: 'Please choose your arrival and departure dates.', past: 'Check-in must be today or later.', order: 'Check-out must be after check-in.' },
    success: 'Your dates look good. This is a demo; no booking has been made and no details have been sent.',
  },
  footer: { navigation: 'Footer navigation', back: 'Back to the beginning', note: 'An imagined destination. A real invitation to slow down.', copyright: '© Aurelia Hotel. A concept in hospitality.' },
  media: { error: 'Image unavailable', retry: 'Try again' },
}
