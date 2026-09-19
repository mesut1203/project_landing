import { useRef } from 'react'
import { Navbar } from './components/Navbar'
import { ScrollStory } from './components/ScrollStory'
import { ModelSection } from './components/ModelSection'
import { PerformanceSection } from './components/PerformanceSection'
import { Gallery } from './components/Gallery'
import { FinalCTA } from './components/FinalCTA'
import { Footer } from './components/Footer'
import { useReveals } from './hooks/useReveals'

function App() {
  const mainRef = useRef<HTMLElement>(null)
  useReveals(mainRef)
  return (
    <>
      <div id="top" tabIndex={-1} />
      <Navbar />
      <main ref={mainRef}>
        <ScrollStory />
        <ModelSection />
        <PerformanceSection />
        <Gallery />
        <FinalCTA />
      </main>
      <Footer />
    </>
  )
}

export default App
