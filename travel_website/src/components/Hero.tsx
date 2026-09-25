import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { content } from '../data/content'
import { Arrow } from './Icon'
import DecryptedText from './react-bits/DecryptedText'

gsap.registerPlugin(ScrollTrigger)

export function Hero() {
  const { hero } = content
  const headlineWords = hero.heading.split(' ')
  const finalWord = headlineWords.pop()
  const sectionRef = useRef<HTMLElement>(null)
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const media = gsap.matchMedia()
    media.add(
      '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
      () => {
        const context = gsap.context(() => {
          gsap.to('.hero-landscape', {
            yPercent: 10,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: 'bottom top',
              scrub: true,
            },
          })
        }, section)
        return () => context.revert()
      },
    )
    return () => media.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="top"
      className="hero"
      aria-labelledby="hero-heading"
    >
      <div className="hero-landscape">
        <img
          className="hero-image"
          src="/images/ha-giang-dawn.webp"
          alt="Dòng sông xanh ngọc giữa những dãy núi đá vôi trong sương sớm"
          width="1672"
          height="941"
          fetchPriority="high"
        />
      </div>
      <div className="hero-shade" aria-hidden="true" />
      <div className="shell hero-layout">
        <div className="hero-topline">
          <p className="eyebrow hero-eyebrow">
            <DecryptedText
              text={hero.eyebrow}
              animateOn="view"
              speed={40}
              maxIterations={12}
              characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
            />
          </p>
          <span className="hero-edition">
            Những hành trình Việt Nam
            <br />
            <span>Được kể theo cách của bạn.</span>
          </span>
        </div>
        <div className="hero-copy">
          <p className="hero-prelude">{hero.emphasis}</p>
          <h1 id="hero-heading" tabIndex={-1}>
            <span>{headlineWords.join(' ')}</span> <span>{finalWord}</span>
          </h1>
          <div className="hero-bottom">
            <p className="hero-description">{hero.description}</p>
            <a className="hero-cta" href="#destinations">
              <span>{hero.cta}</span>
              <span className="cta-orbit">
                <Arrow diagonal />
              </span>
            </a>
          </div>
        </div>
        <div className="hero-caption">
          <a className="hero-scroll-hint" href="#our-story">
            <span aria-hidden="true">↓</span>
            <span>{hero.scroll}</span>
          </a>
          <p>
            Hà Giang, Việt Nam <span aria-hidden="true">—</span> Một góc nhìn
            khác.
          </p>
        </div>
      </div>
    </section>
  )
}
