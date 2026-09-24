export interface LinkContent { label: string; href: string }
export interface MediaAsset { src: string; alt: string; width: number; height: number; position?: string }
export interface SceneContent { id: string; label: string; heading: string; text?: string; poster: MediaAsset; cta?: LinkContent }
export interface RoomContent { id: string; name: string; category: string; description: string; image: MediaAsset; cta: LinkContent }
export interface ExperienceContent { id: string; title: string; subtitle: string; description: string; image: MediaAsset }
export interface PhotoSource { file: string; url: string }

export const photoSources: PhotoSource[] = [
  { file: 'suite.jpg', url: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1600&q=85&fm=jpg' },
  { file: 'classic.jpg', url: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=85&fm=jpg' },
  { file: 'terrace.jpg', url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=85&fm=jpg' },
  { file: 'dining.jpg', url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1800&q=85&fm=jpg' },
  { file: 'city.jpg', url: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=85&fm=jpg' },
  { file: 'spa.jpg', url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=85&fm=jpg' },
  { file: 'rooftop.jpg', url: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=85&fm=jpg' },
]

const photo = (file: string, alt: string, position = 'center'): MediaAsset => ({ src: `/media/${file}.jpg`, alt, width: 1600, height: 1067, position })
const still = (name: string, alt: string): MediaAsset => ({ src: `/media/arrival-${name}.jpg`, alt, width: 1280, height: 720 })

export const content = {
  seo: { title: 'Aurelia Hotel | The art of a slower stay', description: 'Aurelia Hotel. A quieter kind of city stay. Thoughtful rooms, unhurried dining, and room to simply be.', favicon: '/favicon.svg' },
  brand: { name: 'Aurelia Hotel', logo: 'aurelia.', tagline: 'The art of a slower stay.', homeLabel: 'Aurelia Hotel, back to the beginning' },
  nav: {
    label: 'Main navigation', mobileLabel: 'Mobile navigation', open: 'Open menu', close: 'Close menu',
    links: [{ label: 'Rooms', href: '#rooms' }, { label: 'Dining', href: '#dining' }, { label: 'Experiences', href: '#experiences' }] as LinkContent[],
    reserve: { label: 'Reserve a stay', href: '#booking' }, skip: 'Skip to main content',
  },
  story: {
    label: 'An arrival at Aurelia', eyebrow: 'A place to simply be', skip: { label: 'Explore the rooms', href: '#rooms' },
    scenes: [
      { id: 'arrival', label: 'The arrival', heading: 'Arrive slowly.', text: 'A quieter kind of city stay.', poster: still('entrance', 'Hotel entrance with stone columns, glass doors and warm light inside') },
      { id: 'lobby', label: 'The welcome', heading: 'Step into stillness.', text: 'Designed for the moments between plans.', poster: still('lobby', 'Quiet lobby with natural stone, soft seating and green plants') },
      { id: 'suite', label: 'The retreat', heading: 'Make room for ease.', text: 'Thoughtful spaces, soft light, and time that feels like yours.', poster: still('suite', 'Sunlit suite with flowing curtains and doors opening to a balcony') },
      { id: 'view', label: 'The view', heading: 'Stay for the view.', poster: still('view', 'Open balcony facing a peaceful mountain landscape at golden hour'), cta: { label: 'Reserve your stay', href: '#booking' } },
    ] as SceneContent[],
  },
  rooms: {
    id: 'rooms', eyebrow: 'Considered spaces', heading: 'A room to exhale.',
    description: 'Less on your mind. More room to be. Find your own corner of quiet, with every detail thoughtfully in place.',
    items: [
      { id: 'aurelia-suite', name: 'The Aurelia Suite', category: 'A little more room to linger', description: 'Soft textures, a generous sitting area, and the simple pleasure of an unhurried morning.', image: photo('terrace', 'Elegant suite with a sofa, pale curtains and warm bedside lights'), cta: { label: 'Stay a little longer', href: '#booking' } },
      { id: 'classic-room', name: 'The Classic Room', category: 'Your everyday escape', description: 'Warm light, crisp linen, and everything you need to feel wonderfully at ease.', image: photo('classic', 'Inviting guest room with warm bedside lamps and crisp white linen'), cta: { label: 'Find your quiet', href: '#booking' } },
      { id: 'terrace-room', name: 'The Terrace Room', category: 'Let the outside in', description: 'An invitation to open the doors, take a deep breath, and let the day unfold.', image: photo('suite', 'Warm timber guest room opening towards a planted outdoor terrace'), cta: { label: 'Make yourself at home', href: '#booking' } },
    ] as RoomContent[],
    note: 'Every room, a different way to slow down.',
  },
  dining: {
    id: 'dining', eyebrow: 'Around the table', heading: 'Dinner, unhurried.',
    description: 'Seasonal ingredients. A table worth lingering at. Evenings that begin with something good and end whenever you are ready.',
    detail: 'From the first coffee to the last conversation, there is always a reason to stay a little longer.',
    image: photo('dining', 'Warm restaurant interior with wooden tables, pendant lights and leafy plants'),
    cta: { label: 'Make an evening of it', href: '#booking' },
  },
  experiences: {
    id: 'experiences', heading: 'The city, at your pace.',
    description: 'Follow your curiosity. Or follow no plans at all.', label: 'Choose an experience',
    items: [
      { id: 'wander', title: 'Take the scenic way.', subtitle: 'Out & about', description: 'Winding streets, a café you almost walked past, a new favourite view. Leave room for the unexpected.', image: photo('city', 'Colourful coastal village with winding streets above the Mediterranean') },
      { id: 'restore', title: 'Come back to yourself.', subtitle: 'A moment of calm', description: 'Make space for a slower ritual. Warmth, water, and a moment that belongs entirely to you.', image: photo('spa', 'Spa essentials with a rolled towel, lotion, a candle and fresh flowers') },
      { id: 'rooftop', title: 'Let the afternoon linger.', subtitle: 'In the open air', description: 'Find a quiet poolside perch, take in the fresh air, and let the rest of the world wait.', image: photo('rooftop', 'Calm outdoor pool with sun loungers and surrounding greenery') },
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
