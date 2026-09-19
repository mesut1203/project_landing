import { useEffect, useState } from 'react'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { ScrollStory } from './components/ScrollStory'
import { Destinations } from './components/Destinations'
import { TripForm } from './components/TripForm'
import { Footer } from './components/Footer'
import { content } from './data/content'
import { SectionTransition } from './components/SectionTransition'

export default function App() {
  const [destination, setDestination] = useState('')
  useEffect(() => {
    const hash = window.location.hash.slice(1)
    const target = hash && document.getElementById(hash)
    if (target) {
      target.scrollIntoView()
      target.focus({ preventScroll: true })
    }
  }, [])
  return (
    <div className="site">
      <a className="skip-link" href="#main">
        {content.a11y.skipToContent}
      </a>
      <Navbar />
      <main id="main" tabIndex={-1}>
        <Hero />
        <SectionTransition>
          <ScrollStory />
        </SectionTransition>
        <Destinations onChoose={setDestination} />
        <SectionTransition>
          <TripForm
            destination={destination}
            onDestinationChange={setDestination}
          />
        </SectionTransition>
      </main>
      <Footer />
    </div>
  )
}
