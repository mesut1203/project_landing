import { MotionConfig } from 'motion/react'
import { content } from './data/content'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { Rooms } from './components/Rooms'
import { Dining } from './components/Dining'
import { Experiences } from './components/Experiences'
import { BookingForm } from './components/BookingForm'
import { Footer } from './components/Footer'

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Navbar data={content.nav} brand={content.brand} />
      <main id="top">
        <Hero data={content.story} />
        <Rooms data={content.rooms} />
        <Dining data={content.dining} />
        <Experiences data={content.experiences} />
        <BookingForm data={content.booking} />
      </main>
      <Footer data={content.footer} brand={content.brand} links={content.nav.links} />
    </MotionConfig>
  )
}
