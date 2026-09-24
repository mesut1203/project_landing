import { useEffect, useRef, type ReactNode } from 'react'
import { useMotionPreferences } from '../hooks/useMotionPreferences'
export function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const { reduced } = useMotionPreferences()
  const revealed = useRef(false)
  useEffect(() => {
    const element = ref.current
    if (!element || reduced || revealed.current || !('IntersectionObserver' in window)) return
    let animation: Animation | undefined
    const observer = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return
      revealed.current = true
      // Content remains visible if observation or the animation API is unavailable.
      animation = element.animate?.([{ opacity: 0.8, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], {
        duration: 280, delay: Math.min(delay * 1000, 50), easing: 'ease-out',
      })
      observer.disconnect()
    }, { threshold: 0.12 })
    observer.observe(element)
    return () => { observer.disconnect(); animation?.cancel() }
  }, [reduced, delay])
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>
}
