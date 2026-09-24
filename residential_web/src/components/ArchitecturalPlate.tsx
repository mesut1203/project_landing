import { useRef } from 'react'
import type { ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

interface ArchitecturalPlateProps { children: ReactNode; className?: string }

/** A restrained photographic movement. The frame remains in normal document flow. */
export function ArchitecturalPlate({ children, className = '' }: ArchitecturalPlateProps) {
  const frame = useRef<HTMLDivElement>(null)
  useGSAP(() => {
    const media = gsap.matchMedia()
    media.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
      const image = frame.current?.querySelector('img')
      if (!image) return
      gsap.fromTo(image, { yPercent: -2, scale: 1.08 }, {
        yPercent: 2, scale: 1.08, ease: 'none',
        scrollTrigger: { trigger: frame.current, start: 'top bottom', end: 'bottom top', scrub: 1 },
      })
    })
    return () => media.revert()
  }, { scope: frame })
  return <div ref={frame} className={`architectural-plate ${className}`}>{children}</div>
}
