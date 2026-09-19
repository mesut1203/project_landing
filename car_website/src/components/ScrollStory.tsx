import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { ArrowDownIcon, ArrowRightIcon } from '@phosphor-icons/react'
import { ctas, media, story } from '../data/content'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { copyOpacity, progressToFrame } from '../lib/frameMath'
import { focusAnchor } from '../lib/anchors'
import { FrameSequence } from './FrameSequence'
import type { FrameSequenceHandle } from './FrameSequence'
import { ActionLink } from './ActionLink'

export function ScrollStory() {
  const isMobile = useMediaQuery(story.breakpoint)
  const reducedMotion = useReducedMotion()
  const config = isMobile ? media.mobile : media.desktop
  const [engineFailed, setEngineFailed] = useState(false)
  const stillMode = reducedMotion || !config.enabled || engineFailed
  const sectionRef = useRef<HTMLElement>(null)
  const sequenceRef = useRef<FrameSequenceHandle>(null)
  const skipRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const observer = new IntersectionObserver(([entry]) => {
      if (skipRef.current) skipRef.current.hidden = !entry.isIntersecting
    }, { threshold: 0 })
    observer.observe(section)
    if (stillMode) return () => observer.disconnect()

    let cancelled = false
    let cleanupEngine: (() => void) | undefined
    void Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([module, plugin]) => {
      if (cancelled) return
      const gsap = module.default
      gsap.registerPlugin(plugin.ScrollTrigger)
      plugin.ScrollTrigger.config({ ignoreMobileResize: true })
      const context = gsap.context(() => {
      const copies = [...section.querySelectorAll<HTMLElement>('[data-scene-copy]')]
      const markers = [...section.querySelectorAll<HTMLElement>('[data-scene-marker]')]
      const cue = section.querySelector<HTMLElement>('.scroll-cue')
      const progress = { value: 0 }
      const render = () => {
        sequenceRef.current?.seek(progressToFrame(progress.value, story.scenes, config))
        copies.forEach((copy, index) => {
          let opacity = copyOpacity(progress.value, story.scenes[index][config.id], index === 0, index === copies.length - 1)
          if (isMobile && index === 1) opacity = 0
          copy.style.opacity = String(opacity)
          copy.style.transform = `translate3d(0, ${(1 - opacity) * 18}px, 0)`
          const active = opacity > 0.45
          copy.inert = !active
          copy.setAttribute('aria-hidden', String(!active))
          if (markers[index]) markers[index].style.opacity = active ? '1' : '0.42'
        })
        if (cue) cue.style.opacity = String(Math.max(0, 1 - progress.value * 12))
      }
      gsap.to(progress, {
        value: 1, ease: 'none', onUpdate: render,
        scrollTrigger: {
          trigger: section, start: 'top top', end: 'bottom bottom', scrub: 0.24,
          invalidateOnRefresh: true, onRefresh: render,
        },
      })
      render()
      }, section)
      cleanupEngine = () => context.revert()
    }).catch(() => { if (!cancelled) setEngineFailed(true) })
    return () => {
      cancelled = true
      observer.disconnect()
      cleanupEngine?.()
      // These properties are updated imperatively rather than by a GSAP tween.
      // Clear them as well when switching to reduced motion or a different breakpoint.
      section.querySelectorAll<HTMLElement>('[data-scene-copy]').forEach((copy) => {
        copy.style.removeProperty('opacity')
        copy.style.removeProperty('transform')
        copy.removeAttribute('aria-hidden')
        copy.inert = false
      })
    }
  }, [config, stillMode, isMobile])

  return (
    <>
      <section ref={sectionRef} id={story.id} className={`scroll-story ${isMobile ? 'story-mobile' : 'story-desktop'} ${stillMode ? 'story-static' : ''}`}
        aria-label={story.label} style={{ '--story-height': `${config.scrollVh}svh` } as CSSProperties}>
        <div className="story-stage" style={{ '--media-aspect': `${config.width} / ${config.height}` } as CSSProperties}>
          <FrameSequence key={`${config.id}-${stillMode}`} config={config} ref={sequenceRef} staticFrame={stillMode} />
          <div className="story-shade" aria-hidden="true" />
          <div className="story-copy-wrap">
            {story.scenes.map((scene, index) => (
              <div key={scene.id} data-scene-copy className={`story-copy story-copy--${scene.id}`} inert={!stillMode && index !== 0}>
                {index === 0 ? <h1 className="hero-heading">{scene.lines.map((line) => <span key={line}>{line}</span>)}</h1> :
                  <h2 className="hero-heading">{scene.lines.map((line) => <span key={line}>{line}</span>)}</h2>}
                {index === 0 && <div className="hero-actions"><ActionLink action={ctas.explore} /><p>{story.introduction}</p></div>}
                {index === 2 && <div className="hero-actions"><ActionLink action={ctas.book} /><ActionLink action={ctas.explore} variant="text" /></div>}
              </div>
            ))}
          </div>
          {!stillMode && <div className="story-bottom">
            <span className="scroll-cue"><ArrowDownIcon size={18} aria-hidden="true" />{story.scrollCue}</span>
            <ol className="scene-rail" aria-label={story.label}>{story.scenes.map((scene, index) => (
              <li key={scene.id} data-scene-marker><span>{String(index + 1).padStart(2, '0')}</span>{scene.label}</li>
            ))}</ol>
          </div>}
        </div>
      </section>
      <a ref={skipRef} href={story.skip.href} className="skip-story" onClick={(event) => {
        event.preventDefault(); focusAnchor(story.skip.href)
      }}>{story.skip.label}<ArrowRightIcon size={15} aria-hidden="true" /></a>
    </>
  )
}
