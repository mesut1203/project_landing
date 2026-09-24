import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(useGSAP, ScrollTrigger)

/** A finite arrival, purposeful camera movement, and one-time editorial reveals. */
export function useApexMotion() {
  useGSAP(() => {
    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const opening = gsap.timeline({ defaults: { ease: 'expo.out' } })
      opening.fromTo('.hero-curtain', { scaleX: 1 }, { scaleX: 0, duration: 1.25, stagger: 0.1 }, 0)
        .fromTo('.hero-image', { scale: 1.1 }, { scale: 1, duration: 1.7 }, 0)
        .fromTo('.stage-register > span', { x: -18, opacity: 0 }, { x: 0, opacity: 1, stagger: 0.09, duration: 0.8 }, 0.18)
        .fromTo('.hero-copy .eyebrow, .hero-description', { y: 16, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08, duration: 0.85 }, 0.25)
        .fromTo('.engineering-rail a', { x: 30, opacity: 0 }, { x: 0, opacity: 1, stagger: 0.1, duration: 0.9 }, 0.3)
        .fromTo('.hero-data > div', { y: 22, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08, duration: 0.9 }, 0.4)

      gsap.fromTo('.reading-progress', { scaleX: 0 }, {
        scaleX: 1, ease: 'none', scrollTrigger: { trigger: 'main', start: 'top top', end: 'bottom bottom', scrub: 0.25 },
      })
      const reveals = new Map<HTMLElement, gsap.core.Tween>()
      const observer = new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting || !(entry.target instanceof HTMLElement)) continue
          const element = entry.target
          observer.unobserve(element)
          if (element.contains(document.activeElement)) continue
          const isMedia = element.matches('.model-media, .gallery-item, .detail-visuals')
          const lateralEntrance = element.matches('.detail-visuals') && window.matchMedia('(min-width: 768px) and (hover: hover) and (pointer: fine)').matches
          const tween = gsap.fromTo(element, { opacity: 0, x: lateralEntrance ? 45 : 0, y: isMedia ? 55 : 32 }, {
            opacity: 1, x: 0, y: 0, duration: isMedia ? 1.2 : 0.9, ease: 'expo.out',
            delay: element.matches('.gallery-item') ? Number(element.dataset.sequence ?? 0) * 0.09 : 0,
            onComplete: () => { reveals.delete(element); gsap.set(element, { clearProps: 'transform,opacity' }) },
          })
          reveals.set(element, tween)
        }
      }, { threshold: 0.12, rootMargin: '0px 0px -20px 0px' })
      document.querySelectorAll<HTMLElement>('.model-intro, .model-media, .performance-section > h2, .detail-visuals, .detail-list, .gallery-header, .gallery-item, .final-copy').forEach(node => observer.observe(node))
      const finishFocused = (event: FocusEvent) => {
        if (!(event.target instanceof Element)) return
        const focused = event.target
        if (focused.closest('.hero')) opening.progress(1)
        reveals.forEach((tween, element) => {
          if (element.contains(focused) || focused.contains(element)) tween.progress(1)
        })
      }
      document.addEventListener('focusin', finishFocused)
      return () => {
        observer.disconnect()
        document.removeEventListener('focusin', finishFocused)
        reveals.forEach((tween, element) => { tween.kill(); gsap.set(element, { clearProps: 'transform,opacity' }) })
        reveals.clear()
      }
    })
    media.add('(min-width: 768px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
      // Separate wrappers keep camera drift independent of hover and the arrival zoom.
      gsap.to('.hero-visual-track', { yPercent: 11, ease: 'none', scrollTrigger: { trigger: '.hero-stage', start: 'top top', end: 'bottom top', scrub: 0.75 } })
      gsap.utils.toArray<HTMLElement>('.model-media img, .gallery-image-core img').forEach(image => {
        gsap.fromTo(image, { scale: 1.12, yPercent: -3 }, {
          scale: 1.02, yPercent: 0, ease: 'none',
          scrollTrigger: { trigger: image.parentElement, start: 'top bottom', end: 'bottom center', scrub: 0.8 },
        })
      })
      gsap.fromTo('.final-visual', { scale: 1.1 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.final-cta', start: 'top bottom', end: 'bottom bottom', scrub: 0.8 } })
    })
    let disposed = false
    let frame = 0
    const sizes = new WeakMap<Element, number>()
    const resize = new ResizeObserver(entries => {
      let changed = false
      for (const entry of entries) {
        const height = entry.contentRect.height
        if (Math.abs(height - (sizes.get(entry.target) ?? -1)) > 1) { sizes.set(entry.target, height); changed = true }
      }
      if (changed) { cancelAnimationFrame(frame); frame = requestAnimationFrame(() => ScrollTrigger.refresh()) }
    })
    document.querySelectorAll('.hero, .performance-section').forEach(element => resize.observe(element))
    document.fonts.ready.then(() => { if (!disposed) ScrollTrigger.refresh() })
    return () => { disposed = true; resize.disconnect(); cancelAnimationFrame(frame); media.revert() }
  }, [])
}
