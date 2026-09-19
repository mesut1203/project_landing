import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from 'motion/react'
import type { MotionValue } from 'motion/react'
import { ArrowDownRight, ArrowUpRight } from '@phosphor-icons/react'
import { content } from '../data/content'
import type { SceneContent } from '../data/content'
import { SequencePlayer } from '../lib/sequence-player'
import type { SequenceStatus } from '../lib/sequence-player'
import { Media } from './Media'

interface ScrollStoryProps { data: typeof content.story }
interface SceneCopyProps { scene: SceneContent; progress: MotionValue<number>; index: number; active: boolean }

const subscribeReduced = (notify: () => void) => {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)')
  query.addEventListener('change', notify)
  return () => query.removeEventListener('change', notify)
}
const reducedSnapshot = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

function SceneCopy({ scene, progress, index, active }: SceneCopyProps) {
  const opacity = useTransform(progress, (p) => {
    // Separate the outgoing and incoming copy so two large headlines never overlap.
    const fade = 0.027
    const entrance = index === 0 ? 1 : Math.min(1, Math.max(0, (p - scene.start - 0.003) / fade))
    const exit = scene.end === 1 ? 1 : Math.min(1, Math.max(0, (scene.end - 0.003 - p) / fade))
    return Math.min(entrance, exit)
  })
  const y = useTransform(opacity, [0, 1], [18, 0])
  const words = scene.heading.split(' ')
  const finalWord = words.pop()
  const Heading = index === 0 ? 'h1' : 'h2'
  return <motion.div className={`scene-copy scene-copy-${index}`} style={{ opacity, y }} aria-hidden={!active} inert={!active}>
    {index === 0 && <p className="story-eyebrow">{content.story.eyebrow}</p>}
    <Heading>{words.join(' ')} <em>{finalWord}</em></Heading>
    {scene.text && <p className="scene-description">{scene.text}</p>}
    {scene.cta && <a className="story-cta" href={scene.cta.href}>{scene.cta.label}<ArrowUpRight size={20} weight="light" aria-hidden="true" /></a>}
  </motion.div>
}

function AnimatedStory({ data }: ScrollStoryProps) {
  const track = useRef<HTMLElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const player = useRef<SequencePlayer | null>(null)
  const [status, setStatus] = useState<SequenceStatus>('loading')
  const [active, setActive] = useState(0)
  const [posterFailed, setPosterFailed] = useState(false)
  const { scrollYProgress } = useScroll({ target: track, offset: ['start start', 'end end'] })
  const progress = useSpring(scrollYProgress, { stiffness: 160, damping: 36, restDelta: 0.0001 })
  useMotionValueEvent(progress, 'change', (value) => {
    player.current?.update(value)
    const index = data.scenes.findIndex((scene) => value < scene.end)
    setActive(index === -1 ? data.scenes.length - 1 : index)
  })

  useEffect(() => {
    if (!canvas.current) return
    const instance = new SequencePlayer(canvas.current, data.sequence, setStatus)
    player.current = instance
    instance.update(progress.get())
    return () => { instance.destroy(); player.current = null }
  }, [data.sequence, progress])

  const jump = (index: number) => {
    if (!track.current) return
    const scene = data.scenes[index]
    const position = index === 0 ? 0 : scene.start + 0.045
    const rect = track.current.getBoundingClientRect()
    const stageHeight = track.current.querySelector<HTMLElement>('.story-stage')?.offsetHeight || window.innerHeight
    window.scrollTo({ top: window.scrollY + rect.top + (rect.height - stageHeight) * position, behavior: 'smooth' })
  }
  const skip = () => window.requestAnimationFrame(() => document.getElementById('rooms')?.focus({ preventScroll: true }))

  return <section ref={track} className="story-track" aria-label={data.label}>
    <div className="story-stage">
      <div className="sequence-media" aria-hidden="true">
        {!posterFailed && <img className="sequence-poster" src={data.scenes[active].poster.src} alt="" width={data.sequence.width} height={data.sequence.height} fetchPriority="high" onError={() => setPosterFailed(true)} />}
        <canvas ref={canvas} className={`sequence-canvas ${status === 'ready' ? 'is-ready' : ''}`} />
        <div className="story-scrim" />
      </div>
      {posterFailed && status !== 'ready' && <p className="story-no-image">{data.imageUnavailable}</p>}
      <div className="story-content">{data.scenes.map((scene, index) => <SceneCopy key={scene.id} scene={scene} progress={progress} index={index} active={active === index} />)}</div>
      <div className="story-bottom">
        <span className="story-caption">{data.explore}</span>
        <nav className="story-chapters" aria-label={data.chaptersLabel}>{data.scenes.map((scene, index) => <button type="button" key={scene.id} className={active === index ? 'is-active' : ''} aria-current={active === index ? 'step' : undefined} onClick={() => jump(index)}><span className="chapter-line" /><span>{scene.label}</span></button>)}</nav>
        <a className="story-skip" href={data.skip.href} onClick={skip}>{data.skip.label}<ArrowDownRight size={17} weight="light" aria-hidden="true" /></a>
      </div>
      <p className={`sequence-status ${status === 'ready' ? 'sr-only' : ''}`} role="status" aria-live="polite">{status === 'loading' ? data.loading : status === 'error' ? data.fallback : ''}</p>
    </div>
  </section>
}

function StaticStory({ data }: ScrollStoryProps) {
  return <section className="static-story" aria-label={data.label}>
    <Media asset={data.finalImage} eager className="static-story-image" />
    <div className="static-story-content section-shell">
      {data.scenes.map((scene, index) => { const Heading = index === 0 ? 'h1' : 'h2'; return <article key={scene.id}><p className="eyebrow">{scene.label}</p><Heading>{scene.heading}</Heading>{scene.text && <p>{scene.text}</p>}{scene.cta && <a className="text-link" href={scene.cta.href}>{scene.cta.label}<ArrowUpRight size={18} weight="light" aria-hidden="true" /></a>}</article> })}
      <a className="text-link" href={data.skip.href}>{data.skip.label}<ArrowDownRight size={17} weight="light" aria-hidden="true" /></a>
    </div>
  </section>
}

export function ScrollStory({ data }: ScrollStoryProps) {
  const reduced = useSyncExternalStore(subscribeReduced, reducedSnapshot, () => true)
  return reduced ? <StaticStory data={data} /> : <AnimatedStory data={data} />
}
