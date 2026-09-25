// Adapted from DavidHDev/react-bits (ScrollReveal, TS-CSS).
// Upstream b6666e9f3a03a062143ce409f3aac53e27fdfaa8; license in ./LICENSE.md.
// Local adaptations: semantic paragraph, no blur, scoped cleanup and reduced motion.
import { useEffect, useMemo, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function ScrollReveal({ children, className = '' }: {
  children: string
  className?: string
}) {
  const containerRef = useRef<HTMLParagraphElement>(null)
  const splitText = useMemo(() => children.split(/(\s+)/).map((word, index) =>
    word.match(/^\s+$/) ? word : <span className="scroll-word" key={index}>{word}</span>,
  ), [children])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const context = gsap.context(() => {
        gsap.fromTo(el, { transformOrigin: '0% 50%', rotate: 1.5 }, {
          rotate: 0,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 55%', scrub: true },
        })
        gsap.fromTo(el.querySelectorAll('.scroll-word'), { opacity: .2 }, {
          opacity: 1,
          ease: 'none',
          stagger: .05,
          scrollTrigger: { trigger: el, start: 'top 85%', end: 'bottom 65%', scrub: true },
        })
      }, el)
      return () => context.revert()
    })
    return () => media.revert()
  }, [children])

  return <p ref={containerRef} className={`scroll-reveal ${className}`}>
    <span className="sr-only">{children}</span>
    <span aria-hidden="true">{splitText}</span>
  </p>
}
