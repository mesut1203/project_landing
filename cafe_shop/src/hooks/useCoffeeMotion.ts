import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(useGSAP, ScrollTrigger)

export function useCoffeeMotion() {
  useGSAP(() => {
    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.utils.toArray<HTMLImageElement>('.story-image, .gallery-card img').forEach((image) => {
        gsap.fromTo(image, { scale: 1.12 }, {
          scale: 1,
          ease: 'none',
          scrollTrigger: { trigger: image.parentElement, start: 'top bottom', end: 'bottom center', scrub: 1 },
        })
      })
    })
    media.add('(min-width: 1000px) and (prefers-reduced-motion: no-preference)', () => {
      const copy = document.querySelector<HTMLElement>('.story-copy')
      const visual = document.querySelector<HTMLElement>('.story-visual')
      if (!copy || !visual) return
      const available = () => Math.max(0, visual.offsetHeight - copy.offsetHeight)
      if (available() < 45) return
      ScrollTrigger.create({ trigger: copy, start: 'top 100px', end: () => `+=${available()}`, pin: true, pinSpacing: false, invalidateOnRefresh: true })
    })
    // Refresh downstream coordinates when text, marquee controls or menu content reflows.
    const measuredHeights = new WeakMap<Element, number>()
    let refreshFrame = 0
    const resize = new ResizeObserver((entries) => {
      let changed = false
      for (const entry of entries) {
        const height = entry.contentRect.height
        if (Math.abs(height - (measuredHeights.get(entry.target) ?? 0)) < 1) continue
        measuredHeights.set(entry.target, height)
        changed = true
      }
      if (!changed) return
      cancelAnimationFrame(refreshFrame)
      refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh())
    })
    document.querySelectorAll('.hero, .coffee-marquee, .menu-section').forEach(element => resize.observe(element))
    let disposed = false
    document.fonts.ready.then(() => { if (!disposed) ScrollTrigger.refresh() })
    return () => { disposed = true; resize.disconnect(); cancelAnimationFrame(refreshFrame); media.revert() }
  }, [])
}
