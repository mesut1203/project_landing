import { useEffect, useRef, type ReactNode } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'

interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
}

export function Reveal({ children, className = '', delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const element = ref.current
    if (!element || reduced || !('IntersectionObserver' in window) || !element.animate) return
    let animation: Animation | undefined
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        animation = element.animate(
          [
            { opacity: 0, transform: 'translateY(8px)' },
            { opacity: 1, transform: 'translateY(0)' },
          ],
          { duration: 250, delay, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'backwards' },
        )
        observer.disconnect()
      },
      { threshold: 0.12 },
    )
    observer.observe(element)
    return () => {
      observer.disconnect()
      animation?.cancel()
    }
  }, [delay, reduced])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
