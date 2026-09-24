import { useEffect, useState } from 'react'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { Story } from './components/Story'
import { Destinations } from './components/Destinations'
import { TripForm } from './components/TripForm'
import { Footer } from './components/Footer'
import { content } from './data/content'

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
        <Story />
        <Destinations onChoose={setDestination} />
        <TripForm
          destination={destination}
          onDestinationChange={setDestination}
        />
      </main>
      <Footer />
    </div>
  )
}
