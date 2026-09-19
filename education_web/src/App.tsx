import { useEffect, useState } from 'react'
import { content } from './data/content'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { LearningPaths } from './components/LearningPaths'
import { HowItWorks } from './components/HowItWorks'
import { Community } from './components/Community'
import { SignupForm } from './components/SignupForm'
import { Footer } from './components/Footer'
import './App.css'

export default function App() {
  const [goal, setGoal] = useState('')

  useEffect(() => {
    document.title = content.meta.title
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', content.meta.description)
    document.documentElement.removeAttribute('data-theme')
  }, [])

  return (
    <div className="site-shell">
      <a href="#main-content" className="skip-link">
        {content.skipLink}
      </a>
      <Navbar data={content.navbar} />
      <main id="main-content" tabIndex={-1}>
        <Hero data={content.hero} />
        <LearningPaths data={content.paths} onChoose={setGoal} />
        <HowItWorks data={content.howItWorks} />
        <Community data={content.community} />
        <SignupForm data={content.signup} goal={goal} onGoalChange={setGoal} />
      </main>
      <Footer data={content.footer} />
    </div>
  )
}
