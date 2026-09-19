import { useEffect } from 'react'
import type { RefObject } from 'react'
import { useReducedMotion } from './useReducedMotion'

export function useReveals(rootRef: RefObject<HTMLElement | null>): void {
  const reduced = useReducedMotion()
  useEffect(() => {
    if (reduced || !rootRef.current) return
    const elements = rootRef.current.querySelectorAll<HTMLElement>('[data-reveal]')
    const animations: Animation[] = []
    // Native transform/opacity reveals need no animation-library download on static mobile.
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        animations.push(entry.target.animate([
          { opacity: 0, transform: 'translateY(24px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ], { duration: 650, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }))
        observer.unobserve(entry.target)
      })
    }, { threshold: 0.08 })
    elements.forEach((element) => observer.observe(element))
    return () => { observer.disconnect(); animations.forEach((animation) => animation.cancel()) }
  }, [reduced, rootRef])
}
