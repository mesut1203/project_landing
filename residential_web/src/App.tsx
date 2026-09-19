import { useCallback, useEffect, useState } from 'react'
import { content } from './data/content'
import { portraitQuery, reducedMotionQuery, useMediaQuery } from './hooks/useMediaQuery'
import { Navbar } from './components/Navbar'
import { VideoIntro } from './components/VideoIntro'
import { ScrollStory } from './components/ScrollStory'
import { Residences } from './components/Residences'
import { Architecture } from './components/Architecture'
import { Amenities } from './components/Amenities'
import { ViewingForm } from './components/ViewingForm'
import { Footer } from './components/Footer'

export default function App() {
  const reduced = useMediaQuery(reducedMotionQuery)
  const portrait = useMediaQuery(portraitQuery)
  const introSource = portrait ? content.intro.mobileVideo : content.intro.desktopVideo
  const [introDone, setIntroDone] = useState(() => reduced || !introSource || Boolean(window.location.hash) || window.scrollY > 0)
  const [revealed, setRevealed] = useState(introDone)
  const showIntro = !introDone && !reduced && Boolean(introSource)
  const reveal = useCallback(() => setRevealed(true), [])
  const complete = useCallback(() => {
    setIntroDone(true)
    setRevealed(true)
    requestAnimationFrame(() => document.getElementById('main')?.focus({ preventScroll: true }))
  }, [])

  useEffect(() => {
    document.title = content.meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', content.meta.description)
  }, [])
  useEffect(() => {
    if (reduced || !introSource) { setIntroDone(true); setRevealed(true) }
  }, [reduced, introSource])

  return <>
    <div id="top" className={`site-content ${revealed || reduced ? 'is-visible' : ''}`} inert={showIntro}>
      <Navbar />
      <main id="main" tabIndex={-1}>
        <ScrollStory enabled={!showIntro} />
        <Residences />
        <Architecture />
        <Amenities />
        <ViewingForm />
      </main>
      <Footer />
    </div>
    {showIntro && introSource && <VideoIntro key={introSource} src={introSource} onReveal={reveal} onComplete={complete} />}
  </>
}
