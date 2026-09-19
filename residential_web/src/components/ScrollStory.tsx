import { useRef, useState } from 'react'
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from 'motion/react'
import type { MotionValue } from 'motion/react'
import { ArrowRightIcon, ArrowTopRightIcon } from '@radix-ui/react-icons'
import { content } from '../data/content'
import type { SceneContent } from '../types/content'
import { portraitQuery, reducedMotionQuery, useMediaQuery } from '../hooks/useMediaQuery'
import { useScrubVideo } from '../hooks/useScrubVideo'
import { ResponsiveImage } from './ResponsiveImage'

interface ScrollStoryProps { enabled: boolean }
interface SceneLayerProps { scene: SceneContent; index: number; progress: MotionValue<number>; active: boolean; portrait: boolean; enabled?: boolean }

function opacityAt(value: number, scene: SceneContent, index: number) {
  const band = 0.035
  if (index !== 0 && value < scene.start) return Math.max(0, 1 - (scene.start - value) / band)
  if (index !== content.story.scenes.length - 1 && value > scene.end - band) return Math.max(0, (scene.end - value) / band)
  return 1
}

function ScenePoster({ scene, index, progress, portrait, enabled }: SceneLayerProps) {
  const opacity = useTransform(progress, value => opacityAt(value, scene, index))
  const scale = useTransform(progress, [scene.start, scene.end], [1, 1.025])
  return <motion.img src={enabled || index === 0 ? (portrait ? scene.image.mobile : scene.image.desktop) : undefined} alt="" aria-hidden="true"
    className="scene-poster" style={{ opacity, scale }} decoding="async" loading={index === 0 ? 'eager' : 'lazy'}
    fetchPriority={index === 0 ? 'high' : 'auto'} />
}

function SceneCopy({ scene, index, progress, active }: SceneLayerProps) {
  // Separate the text fade-out/fade-in bands to avoid two headlines overlapping.
  const opacity = useTransform(progress, value => {
    const incoming = index === 0 ? 1 : Math.min(1, Math.max(0, (value - scene.start + 0.012) / 0.042))
    const outgoing = index === content.story.scenes.length - 1 ? 1 : Math.min(1, Math.max(0, (scene.end - 0.012 - value) / 0.035))
    return Math.min(incoming, outgoing)
  })
  const y = useTransform(opacity, [0, 1], [14, 0])
  const Heading = index === 0 ? 'h1' : 'h2'
  return <motion.div className="scene-copy" style={{ opacity, y }} aria-hidden={!active}>
    <Heading className="story-title" id={index === 0 ? 'hero-title' : undefined}>{scene.title}</Heading>
    <p className="story-description">{scene.description}</p>
  </motion.div>
}

function StaticStory() {
  return <section className="static-story" aria-label={content.story.title}>
    {content.story.scenes.map((scene, index) => {
      const Heading = index === 0 ? 'h1' : 'h2'
      return <article key={scene.id} className="static-scene page-shell">
        <ResponsiveImage image={scene.image} eager={index === 0} />
        <div className="static-copy">
          <Heading id={index === 0 ? 'hero-title' : undefined} className="story-title">{scene.title}</Heading>
          <p className="story-description">{scene.description}</p>
          {index === 0 && <div className="flex flex-wrap gap-5 pt-5">
            <a className="button button-gold" href={content.actions.viewing.href}>{content.actions.viewing.label}<ArrowTopRightIcon /></a>
            <a className="text-link" href={content.actions.skipStory.href}>{content.actions.skipStory.label}<ArrowRightIcon /></a>
          </div>}
        </div>
      </article>
    })}
  </section>
}

function AnimatedStory({ enabled }: ScrollStoryProps) {
  const root = useRef<HTMLElement>(null)
  const portrait = useMediaQuery(portraitQuery)
  const [active, setActive] = useState(0)
  const activeRef = useRef(0)
  const { scrollYProgress } = useScroll({ target: root, offset: ['start start', 'end end'] })
  const progress = useSpring(scrollYProgress, { stiffness: 180, damping: 34, restDelta: 0.0001 })
  useMotionValueEvent(progress, 'change', value => {
    const next = content.story.scenes.reduce((current, scene, index) => value >= scene.start ? index : current, 0)
    if (next !== activeRef.current) { activeRef.current = next; setActive(next) }
  })
  const { videoRef, state } = useScrubVideo({ src: content.story.desktopVideo, enabled: enabled && !portrait, progress, timeoutMs: content.story.timeoutMs })

  const jumpTo = (scene: SceneContent) => {
    if (!root.current) return
    const rect = root.current.getBoundingClientRect()
    const distance = root.current.offsetHeight - window.innerHeight
    window.scrollTo({ top: window.scrollY + rect.top + distance * (scene.start + 0.015), behavior: 'smooth' })
  }

  return <section ref={root} className={`scroll-story ${portrait ? 'is-portrait' : ''}`} aria-label={content.story.title}
    style={{ minHeight: `${content.story.heightVh}svh` }} data-active-scene={content.story.scenes[active].id}>
    <div className="story-stage">
      <div className="story-media" role="img" aria-label={content.story.scenes[active].image.alt}>
        {content.story.scenes.map((scene, index) => <ScenePoster key={scene.id} scene={scene} index={index}
          progress={progress} portrait={portrait} active={index === active} enabled={enabled} />)}
        {!portrait && <video ref={videoRef} className={`story-video ${state === 'ready' ? 'is-ready' : ''}`}
          muted playsInline preload="none" aria-hidden="true" disablePictureInPicture />}
      </div>
      <div className="story-caption page-shell">
        <div className="story-copy-stack">
          {content.story.scenes.map((scene, index) => <SceneCopy key={scene.id} scene={scene} index={index}
            progress={progress} portrait={portrait} active={index === active} />)}
        </div>
        <a className="button button-gold story-cta" href={content.actions.viewing.href}>{content.actions.viewing.label}<ArrowTopRightIcon /></a>
      </div>
      <div className="story-controls page-shell">
        <nav aria-label={content.story.navigationLabel} className="scene-navigation">
          {content.story.scenes.map((scene, index) => <button key={scene.id} onClick={() => jumpTo(scene)}
            aria-label={scene.label} aria-current={active === index ? 'step' : undefined} className={active === index ? 'is-active' : ''}>
            <span>{scene.label}</span><span className="scene-rule" aria-hidden="true" />
          </button>)}
        </nav>
        <a className="text-link skip-story" href={content.actions.skipStory.href} onClick={() => {
          requestAnimationFrame(() => document.getElementById('residences')?.focus({ preventScroll: true }))
        }}>{content.actions.skipStory.label}<ArrowRightIcon /></a>
      </div>
      {state === 'loading' && !portrait && <p className="story-loading" role="status">{content.story.loading}</p>}
      {state === 'error' && <p className="sr-only" role="status">{content.story.staticLabel}</p>}
    </div>
  </section>
}

export function ScrollStory(props: ScrollStoryProps) {
  const reduced = useMediaQuery(reducedMotionQuery)
  return reduced ? <StaticStory /> : <AnimatedStory {...props} />
}
