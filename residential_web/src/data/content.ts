import type { Content, ResponsiveImage } from '../types/content.ts'

const image = (name: string, alt: string, mobileName = name): ResponsiveImage => ({
  desktop: `/images/desktop/${name}.webp`,
  mobile: `/images/mobile/${mobileName}.webp`,
  alt,
})

export const content: Content = {
  brand: { name: 'Luma Residences', wordmark: 'LUMA', descriptor: 'RESIDENCES', homeLabel: 'Luma Residences, home' },
  meta: {
    icon: '/favicon.svg',
    title: 'Luma Residences | A quieter way to live',
    description: 'Discover thoughtfully considered residences, natural materials and spaces for a slower rhythm. Book a private viewing at Luma Residences.',
  },
  navigation: {
    label: 'Main navigation',
    links: [
      { label: 'Residences', href: '#residences' },
      { label: 'Architecture', href: '#architecture' },
      { label: 'Amenities', href: '#amenities' },
      { label: 'Visit', href: '#visit' },
    ],
    cta: { label: 'Book a viewing', href: '#visit' },
    open: 'Open menu', close: 'Close menu', menuTitle: 'Explore Luma',
  },
  actions: {
    viewing: { label: 'Book a private viewing', href: '#visit' },
    skipContent: 'Skip to content', skipIntro: 'Skip intro',
    skipStory: { label: 'Skip story', href: '#residences' },
    backTop: { label: 'Back to top', href: '#top' },
  },
  intro: {
    title: 'A first look at Luma Residences', loading: 'Preparing your first look',
    desktopVideo: '/videos/real-estate-intro.mp4', mobileVideo: '/videos/real-estate-intro-portrait.mp4',
    timeoutMs: 4000, fadeMs: 700,
  },
  story: {
    title: 'A quieter way to live', loading: 'Loading the film', staticLabel: 'Explore at your own pace',
    navigationLabel: 'Explore the architectural story', desktopVideo: '/videos/real-estate-intro.mp4',
    duration: 14, heightVh: 430, timeoutMs: 25000,
    scenes: [
      { id: 'arrival', label: 'Arrival', title: 'A quieter way to arrive.', description: 'A considered collection of homes. A little closer to nature.', start: 0, end: 0.32, image: image('arrival', 'A contemporary residence framed by gardens in warm evening light') },
      { id: 'lobby', label: 'The lobby', title: 'Space, considered.', description: 'An unhurried welcome, shaped by natural materials and open space.', start: 0.32, end: 0.5, image: image('lobby', 'A light-filled entrance with stone floors, tall glazing and greenery') },
      { id: 'residence', label: 'The residence', title: 'Designed for everyday light.', description: 'Open rooms, gentle textures and room for your own rhythm.', start: 0.5, end: 0.75, image: image('residence', 'A softly furnished living room opening toward a sunlit balcony') },
      { id: 'balcony', label: 'The view', title: 'Live with a wider view.', description: 'Step outside. Let the horizon become part of home.', start: 0.75, end: 1, image: image('balcony', 'A private balcony looking out over the city at sunset') },
    ],
  },
  residences: {
    title: 'Room to be yourself.',
    description: 'One, two and three-bedroom residences. Different ways to live, with the same attention to light, flow and feeling.',
    linkLabel: 'Enquire about this residence',
    items: [
      { id: 'one-bedroom', title: 'One-bedroom residences', description: 'A personal retreat. Open living spaces for the rituals that make a home.', image: image('one-bedroom', 'A considered living space with natural finishes and soft furnishings', 'residence') },
      { id: 'two-bedroom', title: 'Two-bedroom residences', description: 'Space to share, and space for yourself. A home that moves with your day.', image: image('two-bedroom', 'A bright apartment interior with floor-to-ceiling glazing', 'lobby') },
      { id: 'three-bedroom', title: 'Three-bedroom residences', description: 'Room for life to unfold. Generous gathering spaces connected to the outdoors.', image: image('three-bedroom', 'Living and terrace spaces opening toward the evening skyline', 'balcony') },
    ],
  },
  architecture: {
    title: 'Quiet by design.',
    description: 'Architecture that makes room for what matters. The warmth of natural materials. The movement of light. A sense of belonging.',
    image: image('material', 'Stone, glass and warm timber at the entrance to the residence', 'arrival'),
    details: [
      { title: 'Honest materials', description: 'Stone, timber and glass, brought together with restraint.' },
      { title: 'Natural light', description: 'Framed views and open spaces follow the changing light.' },
      { title: 'Space to breathe', description: 'A gentle connection between interiors and the world outside.' },
    ],
  },
  amenities: {
    title: 'The art of slowing down.',
    description: 'Places to restore, reconnect and make a little more of the everyday.',
    items: [
      { id: 'rooftop', title: 'Above the everyday', description: 'A rooftop to enjoy the open sky.', image: image('rooftop', 'An open rooftop terrace in the evening light') },
      { id: 'wellness', title: 'A moment for yourself', description: 'A wellness space for a gentler rhythm.', image: image('wellness', 'A calm wellness interior with warm natural materials') },
      { id: 'garden', title: 'Closer to nature', description: 'A garden to pause, wander and breathe.', image: image('garden', 'Lush planting and a landscaped garden path') },
      { id: 'lounge', title: 'In good company', description: 'A lounge for easy conversation.', image: image('lounge', 'A quiet lounge with comfortable contemporary seating') },
    ],
  },
  visit: {
    eyebrow: 'YOUR NEXT CHAPTER', title: 'Some places need\nto be felt.',
    description: 'Experience the light, the spaces and the sense of calm. Let us show you around.',
    name: 'Name', email: 'Email', date: 'Preferred viewing date',
    namePlaceholder: 'Your full name', emailPlaceholder: 'you@example.com',
    note: 'Demo form. Connect a CRM or booking service to receive submissions.',
    privacy: 'This demo does not send or store your details.',
    success: 'Demo complete. Your details have not been sent and no viewing has been booked.',
    invalidName: 'Please enter your name.',
  },
  footer: {
    navigationLabel: 'Footer navigation',
    statement: 'A quieter way to live.', copyright: 'Luma Residences. All rights reserved.',
    disclosure: 'Concept presentation. Imagery is illustrative; residence layouts and amenities are subject to confirmation.',
  },
}
