import { useEffect, useRef, type ReactNode } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'

interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
  variant?: 'rise' | 'index' | 'band'
}

export function Reveal({ children, className = '', delay = 0, variant = 'rise' }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const played = useRef(false)
  const reduced = useReducedMotion()

  useEffect(() => {
    const element = ref.current
    if (!element || reduced || played.current || !('IntersectionObserver' in window) || !element.animate) return
    const animations: Animation[] = []
    const animate = (target: Element, frames: Keyframe[], duration: number, offset = 0) => {
      animations.push(target.animate(frames, { duration, delay: delay + offset, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' }))
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        played.current = true
        if (variant === 'index') {
          element.querySelectorAll('.course-number, .path-content, .path-image, .path-action').forEach((item, index) => {
            animate(item, [{ opacity: 0, transform: 'translateY(26px)' }, { opacity: 1, transform: 'none' }], 900, index * 100)
          })
          const rule = element.querySelector('.course-rule')
          if (rule) animate(rule, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], 1150)
        } else if (variant === 'band') {
          const backdrop = element.querySelector('.intake-backdrop')
          if (backdrop) animate(backdrop, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], 1050)
          element.querySelectorAll(':scope > div, :scope > a').forEach((item, index) => {
            animate(item, [{ opacity: 0, transform: 'translateY(18px)' }, { opacity: 1, transform: 'none' }], 800, 180 + index * 120)
          })
        } else {
          const baseTransform = getComputedStyle(element).transform
          const restingTransform = baseTransform === 'none' ? '' : baseTransform
          animate(element,
            [
              { opacity: 0, transform: `translateY(32px) ${restingTransform}` },
              { opacity: 1, transform: `translateY(0) ${restingTransform}` },
            ],
            900,
          )
        }
        observer.disconnect()
      },
      { threshold: 0.12 },
    )
    const revealForFocus = () => {
      played.current = true
      observer.disconnect()
      animations.forEach(animation => animation.cancel())
    }
    element.addEventListener('focusin', revealForFocus)
    observer.observe(element)
    return () => {
      observer.disconnect()
      element.removeEventListener('focusin', revealForFocus)
      animations.forEach(animation => animation.cancel())
    }
  }, [delay, reduced, variant])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
