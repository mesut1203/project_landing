import { useEffect, useRef, useState } from 'react'
import { Icon } from './Icon'
import { useMotionPreferences } from '../hooks/useMotionPreferences'
const framePath = (frame: number) => `/media/sequence/frame-${String(frame).padStart(3, '0')}.jpg`
const clamp = (value: number) => Math.min(1, Math.max(0, value))

export function Hero() {
  const section = useRef<HTMLElement>(null)
  const sequenceImage = useRef<HTMLImageElement>(null)
  const media = useRef<HTMLDivElement>(null)
  const firstCopy = useRef<HTMLDivElement>(null)
  const secondCopy = useRef<HTMLDivElement>(null)
  const { cinematic, reduced, paused, toggle } = useMotionPreferences()
  const [playback, setPlayback] = useState<'film' | 'scroll'>('film')
  const scrollDriven = cinematic && playback === 'scroll'
  const playbackTime = useRef(0)
  useEffect(() => {
    const element = section.current
    const image = sequenceImage.current
    if (!element || !image) return
    if (reduced) {
      image.src = framePath(1)
      image.dataset.frame = '1'
      firstCopy.current?.removeAttribute('style')
      secondCopy.current?.removeAttribute('style')
      media.current?.removeAttribute('style')
      return
    }
    // Pausing freezes the composition as well as the current frame.
    if (paused) return
    let disposed = false
    let raf = 0
    let target = Number(image.dataset.frame) || 1
    let progress = (target - 1) / 49
    let lastTime = 0
    let direction = 1
    let start = 0
    let distance = 1
    let visible = false
    const cache = new Map<number, HTMLImageElement>()
    const pending = new Set<number>()
    const failed = new Set<number>()
    const display = (frame: number, loaded: HTMLImageElement) => {
      if (disposed || !visible || document.hidden || frame !== target) return
      if (image.dataset.frame === String(frame)) return
      image.src = loaded.src
      image.dataset.frame = String(frame)
    }
    const load = (frame: number) => {
      if (disposed || !visible || document.hidden || frame < 1 || frame > 50) return
      const cached = cache.get(frame)
      if (cached) { display(frame, cached); return }
      if (pending.size >= 3 || pending.has(frame) || failed.has(frame)) return
      pending.add(frame)
      const next = new Image()
      next.decoding = 'async'
      next.onload = async () => {
        try { await next.decode() } catch { /* A loaded image is still a valid fallback. */ }
        pending.delete(frame)
        if (disposed) return
        cache.set(frame, next)
        // Keep nearby decoded images available when the scroll direction changes.
        while (cache.size > 12) {
          const farthest = [...cache.keys()].sort((a, b) => Math.abs(b - target) - Math.abs(a - target))[0]
          cache.delete(farthest)
        }
        display(frame, next)
        preload()
      }
      next.onerror = () => { pending.delete(frame); failed.add(frame); preload() }
      next.src = framePath(frame)
    }
    const preload = () => {
      if (disposed || !visible || document.hidden) return
      // Latest frame first, then ahead of the scroll and two frames behind it.
      for (const offset of [0, direction, -direction, 2 * direction, 3 * direction, -2 * direction, 4 * direction]) {
        const frame = target + offset
        if (!cache.has(frame)) load(frame)
      }
    }
    const render = (time: number) => {
      raf = 0
      if (!visible || document.hidden) return
      const elapsed = lastTime ? Math.min(time - lastTime, 64) : 16
      lastTime = time
      const destination = clamp((window.scrollY - start) / distance)
      if (scrollDriven) {
        direction = destination >= progress ? 1 : -1
        progress += (destination - progress) * (1 - Math.exp(-elapsed / 90))
        if (Math.abs(destination - progress) < 0.001) progress = destination
      } else {
        // The archive has no timing. Play its 50 frames at 10 fps, with a
        // short hold on the final scene. Buffer instead of skipping images.
        if (cache.has(target) || failed.has(target)) playbackTime.current = (playbackTime.current + elapsed) % 6200
        progress = clamp(playbackTime.current / 4900)
        direction = 1
      }
      target = Math.round(progress * 49) + 1
      const outgoing = scrollDriven ? clamp((progress - 0.22) / 0.26) : 0
      const incoming = scrollDriven ? clamp((progress - 0.42) / 0.22) : 0
      if (firstCopy.current) {
        firstCopy.current.style.opacity = String(1 - outgoing)
        firstCopy.current.style.transform = `translateY(${-outgoing * 20}px)`
      }
      if (secondCopy.current) {
        secondCopy.current.style.opacity = String(incoming)
        secondCopy.current.style.transform = `translateY(${(1 - incoming) * 20}px)`
      }
      if (media.current) media.current.style.transform = scrollDriven ? `scale(${1 + progress * 0.035})` : 'none'
      load(target)
      preload()
      if (!scrollDriven || progress !== destination) schedule()
      else lastTime = 0
    }
    const schedule = () => { if (!raf && visible && !document.hidden) raf = requestAnimationFrame(render) }
    const measure = () => {
      const bounds = element.getBoundingClientRect()
      start = bounds.top + window.scrollY
      distance = Math.max(1, bounds.height - (element.firstElementChild as HTMLElement).offsetHeight)
      schedule()
    }
    const suspend = () => { cancelAnimationFrame(raf); raf = 0; lastTime = 0 }
    const visibilityChange = () => { suspend(); if (!document.hidden) schedule() }
    const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting
      if (visible) schedule()
      else suspend()
    }) : null
    const resize = 'ResizeObserver' in window ? new ResizeObserver(measure) : null
    if (observer) observer.observe(element)
    else visible = true
    resize?.observe(element)
    measure()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', measure, { passive: true })
    document.addEventListener('visibilitychange', visibilityChange)
    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      observer?.disconnect()
      resize?.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', measure)
      document.removeEventListener('visibilitychange', visibilityChange)
      cache.clear()
    }
  }, [scrollDriven, reduced, paused])
  return <section id="home" ref={section} className={`hero-story ${scrollDriven ? 'hero-story--cinematic' : 'hero-story--static'}`} aria-labelledby="hero-heading">
    <div className="hero-stage">
      <div ref={media} className="hero-media" aria-hidden="true">
        <picture>{reduced && <source media="(max-width: 767px)" srcSet="/media/optimized/hero-640.webp" />}<img ref={sequenceImage} src={framePath(1)} width="1280" height="720" alt="" fetchPriority="high" decoding="async" data-frame="1" /></picture>
      </div>
      <div className="hero-shade" />
      <div className="hero-content container">
        <div className="hero-copy-stack">
          <div ref={firstCopy} className="hero-copy hero-copy--first">
            <p className="eyebrow"><span className="eyebrow-line" />Fiamma Pizza House</p>
            <h1 id="hero-heading">The good<br />kind of late<span className="accent-period">.</span></h1>
            <p className="hero-description">A neighborhood pizza room for long tables, warm slices, and the last drink that becomes two.</p>
          </div>
          <div ref={secondCopy} className="hero-copy hero-copy--second" aria-hidden="true">
            <p className="eyebrow"><span className="eyebrow-line" />From our fire to your table</p>
            <p className="hero-story-heading">A little char.<br />A lot of soul<span className="accent-period">.</span></p>
            <p className="hero-description">Slow dough. Bright tomatoes. A wood-fired finish. Good things are worth staying for.</p>
          </div>
        </div>
        <div className="hero-actions">
          <a className="button" href="#visit">Book a table <Icon name="arrow" className="button-arrow" /></a>
          <a className="button button--outline" href="#menu">See the menu <Icon name="arrow" className="button-arrow" /></a>
        </div>
      </div>
      <div className="hero-bottom container">
        <a className="scroll-cue" href="#story"><Icon name="down" /><span>Good things take their time.</span></a>
        <div className="hero-playback-controls">
          {cinematic && <button className="playback-mode" type="button" aria-pressed={scrollDriven} onClick={() => {
            setPlayback(scrollDriven ? 'film' : 'scroll')
            playbackTime.current = 0
            if (paused) toggle()
          }}>{scrollDriven ? 'Watch film' : 'Explore on scroll'}</button>}
          <button className="motion-toggle" type="button" aria-pressed={paused || reduced} onClick={toggle}><Icon name={paused || reduced ? 'play' : 'pause'} />{reduced ? 'Play motion' : paused ? 'Resume motion' : 'Pause motion'}</button>
        </div>
      </div>
    </div>
  </section>
}
