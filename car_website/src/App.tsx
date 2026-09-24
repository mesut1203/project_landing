import { useApexMotion } from './hooks/useApexMotion'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { ModelSection } from './components/ModelSection'
import { PerformanceSection } from './components/PerformanceSection'
import { Gallery } from './components/Gallery'
import { FinalCTA } from './components/FinalCTA'
import { Footer } from './components/Footer'

function App() {
  useApexMotion()
  return (
    <>
      <div id="top" tabIndex={-1} />
      <Navbar />
      <div className="reading-progress" aria-hidden="true" />
      <main id="main-content" tabIndex={-1}>
        <Hero />
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
