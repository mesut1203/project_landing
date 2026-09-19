import { useEffect, useRef, type ReactNode } from 'react'
import { useMotionPreferences } from '../hooks/useMotionPreferences'
export function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const { reduced, paused } = useMotionPreferences()
  useEffect(() => {
    const element = ref.current
    if (!element || reduced || paused || !('IntersectionObserver' in window)) return
    let animation: Animation | undefined
    const observer = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return
      // Content remains visible if observation or the animation API is unavailable.
      animation = element.animate?.([{ opacity: 0.65, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }], {
        duration: 360, delay: Math.min(delay * 1000, 120), easing: 'cubic-bezier(.16,1,.3,1)',
      })
      observer.disconnect()
    }, { threshold: 0.12 })
    observer.observe(element)
    return () => { observer.disconnect(); animation?.cancel() }
  }, [reduced, paused, delay])
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>
}
