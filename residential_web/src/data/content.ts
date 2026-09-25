import type { Content, ResponsiveImage } from '../types/content.ts'

const image = (name: string, alt: string): ResponsiveImage => ({
  desktop: `/images/desktop/${name}.webp`,
  mobile: `/images/mobile/${name}.webp`,
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
    skipContent: 'Skip to content',
    exploreResidences: { label: 'Explore residences', href: '#residences' },
    backTop: { label: 'Back to top', href: '#top' },
  },
  story: {
    title: 'A quieter way to live',
    scenes: [
      { id: 'arrival', label: 'A considered collection of homes', title: 'A quieter way to live.', description: 'A considered collection of homes. A little closer to nature.', image: image('luma-exterior', 'Limestone residences with deep planted balconies and a landscaped garden') },
      { id: 'lobby', label: 'The lobby', title: 'Space, considered.', description: 'An unhurried welcome, shaped by natural materials and open space.', image: image('luma-courtyard', 'Oak-lined residential entrance beside a reflecting pool and Japanese maple') },
      { id: 'residence', label: 'The residence', title: 'Designed for everyday light.', description: 'Open rooms, gentle textures and room for your own rhythm.', image: image('luma-living', 'A sunlit living room with linen seating, walnut furniture and views across trees') },
      { id: 'balcony', label: 'The view', title: 'Live with a wider view.', description: 'Step outside. Let the horizon become part of home.', image: image('luma-terrace', 'A planted rooftop terrace looking across wooded hills toward a distant city') },
    ],
  },
  residences: {
    title: 'Room to be yourself.',
    description: 'One, two and three-bedroom residences. Different ways to live, with the same attention to light, flow and feeling.',
    linkLabel: 'Enquire about this residence',
    items: [
      { id: 'one-bedroom', title: 'One-bedroom residences', description: 'A personal retreat. Open living spaces for the rituals that make a home.', image: image('luma-one-bedroom', 'An intimate bedroom with linen bedding, an oak desk and garden views') },
      { id: 'two-bedroom', title: 'Two-bedroom residences', description: 'Space to share, and space for yourself. A home that moves with your day.', image: image('luma-two-bedroom', 'A light-filled apartment dining room with an oak table and open kitchen') },
      { id: 'three-bedroom', title: 'Three-bedroom residences', description: 'Room for life to unfold. Generous gathering spaces connected to the outdoors.', image: image('luma-three-bedroom', 'A generous family living room and dining area opening onto planted balconies') },
    ],
  },
  architecture: {
    title: 'Quiet by design.',
    description: 'Architecture that makes room for what matters. The warmth of natural materials. The movement of light. A sense of belonging.',
    image: image('luma-materials', 'Close architectural study of limestone, oak joinery and soft daylight'),
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
      { id: 'rooftop', title: 'Above the everyday', description: 'A rooftop to enjoy the open sky.', image: image('luma-rooftop', 'Rooftop seating and planted beds beneath an open pergola at sunset') },
      { id: 'wellness', title: 'A moment for yourself', description: 'A quiet wellness space for a gentler rhythm.', image: image('luma-wellness', 'A calm indoor wellness pool lined with warm limestone and oak') },
      { id: 'garden', title: 'Closer to nature', description: 'A garden to pause, wander and breathe.', image: image('luma-garden', 'A winding garden path between native grasses and mature trees') },
      { id: 'lounge', title: 'In good company', description: 'A lounge for easy conversation.', image: image('luma-lounge', 'A shared lounge with sculptural armchairs, a walnut library and garden views') },
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
