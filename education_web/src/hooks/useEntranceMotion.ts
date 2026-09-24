import { useEffect, useRef, type RefObject } from 'react'
import { useReducedMotion } from './useReducedMotion'

const ease = 'cubic-bezier(.16,1,.3,1)'

/** Finite editorial sequences. Cancelling restores the fully readable base CSS. */
export function useEntranceMotion(ref: RefObject<HTMLElement | null>, mode: 'hero' | 'journey') {
  const reduced = useReducedMotion()
  const played = useRef(new WeakSet<Element>())

  useEffect(() => {
    const root = ref.current
    if (!root || reduced || !root.animate || !('IntersectionObserver' in window)) return
    const animations: Animation[] = []
    let disposed = false
    const animate = (element: Element, frames: Keyframe[], duration: number, delay = 0) => {
      animations.push(element.animate(frames, { duration, delay, easing: ease, fill: 'backwards' }))
    }
    const rise = [{ opacity: 0, transform: 'translateY(18px)' }, { opacity: 1, transform: 'none' }]
    const play = (element: Element) => {
      if (disposed || played.current.has(element)) return
      played.current.add(element)
      if (mode === 'hero') {
        element.querySelectorAll('.hero-title-line').forEach((line, index) => {
          animate(line, [{ transform: 'translateY(115%) rotate(2deg)' }, { transform: 'none' }], 1150, index * 160)
        })
        element.querySelectorAll('.hero-copy .eyebrow, .hero-description, .hero-actions > a, .hero-note').forEach((item, index) => {
          animate(item, rise, 800, 120 + index * 95)
        })
        const shutter = element.querySelector('.hero-photo-shutter')
        if (shutter) animate(shutter, [{ transform: 'translateY(0)' }, { transform: 'translateY(-102%)' }], 1250, 170)
        const caption = element.querySelector('.hero-media figcaption')
        if (caption) animate(caption, rise, 750, 490)
      } else {
        element.querySelectorAll('.journey-step-label, h3, .journey-step-description').forEach((item, index) => {
          animate(item, [{ opacity: 0, transform: 'translateX(18px)' }, { opacity: 1, transform: 'none' }], 880, index * 90)
        })
        const rule = element.querySelector('.journey-step-rule')
        if (rule) animate(rule, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], 1050, 120)
      }
    }
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        play(entry.target)
        observer.unobserve(entry.target)
      }
    }, { threshold: mode === 'hero' ? 0.01 : 0.25 })

    if (mode === 'hero') {
      void document.fonts.ready.then(() => { if (!disposed) observer.observe(root) })
    } else {
      root.querySelectorAll('.journey-steps > li').forEach(item => observer.observe(item))
    }
    const finishForFocus = () => {
      animations.forEach(animation => animation.cancel())
      if (mode === 'hero') {
        played.current.add(root)
        observer.disconnect()
      }
    }
    root.addEventListener('focusin', finishForFocus)
    return () => {
      disposed = true
      observer.disconnect()
      root.removeEventListener('focusin', finishForFocus)
      animations.forEach(animation => animation.cancel())
    }
  }, [mode, reduced, ref])
}
