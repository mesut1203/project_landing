import { useEffect } from 'react'
import { content } from './data/content'
import { Navbar } from './components/Navbar'
import { ResidenceStory } from './components/ResidenceStory'
import { Residences } from './components/Residences'
import { Architecture } from './components/Architecture'
import { Amenities } from './components/Amenities'
import { ViewingForm } from './components/ViewingForm'
import { Footer } from './components/Footer'

export default function App() {
  useEffect(() => {
    document.title = content.meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', content.meta.description)
  }, [])
  return <div id="top">
    <Navbar />
    <main id="main" tabIndex={-1}>
      <ResidenceStory />
      <Residences />
      <Architecture />
      <Amenities />
      <ViewingForm />
    </main>
    <Footer />
  </div>
}
