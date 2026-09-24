import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { reducedMotionQuery, useMediaQuery } from '../hooks/useMediaQuery'

interface RevealProps { children: ReactNode; className?: string }

export function Reveal({ children, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const revealed = useRef(false)
  const reduced = useMediaQuery(reducedMotionQuery)
  useEffect(() => {
    const element = ref.current
    if (!element || reduced || revealed.current || !('IntersectionObserver' in window)) return
    let animation: Animation | undefined
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return
      revealed.current = true
      observer.disconnect()
      // Content stays visible even when animations are unavailable or cancelled.
      animation = element.animate?.([
        { opacity: 0.75, transform: 'translateY(6px)' },
        { opacity: 1, transform: 'translateY(0)' },
      ], { duration: 250, easing: 'ease-out' })
    }, { threshold: 0.12 })
    observer.observe(element)
    return () => { observer.disconnect(); animation?.cancel() }
  }, [reduced])
  return <div ref={ref} className={className}>
    {children}
  </div>
}
