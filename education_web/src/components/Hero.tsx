import { ArrowUpRight, ArrowRight, Check } from '@phosphor-icons/react'
import { useRef } from 'react'
import type { HeroContent } from '../data/content'
import { useEntranceMotion } from '../hooks/useEntranceMotion'
import { Reveal } from './Reveal'

export function Hero({ data }: { data: HeroContent }) {
  const ref = useRef<HTMLElement>(null)
  useEntranceMotion(ref, 'hero')
  return (
    <section ref={ref} id="home" className="hero container" aria-labelledby="hero-title">
      <div className="hero-layout">
        <div className="hero-copy">
          <p className="eyebrow"><span />{data.eyebrow}</p>
          <h1 id="hero-title" aria-label={data.heading}>
            {data.headingLines.map((line, index) => (
              <span key={line} className={`hero-title-mask ${index === 1 ? 'hero-emphasis' : ''}`}><span className="hero-title-line">{line}</span></span>
            ))}
          </h1>
          <p className="hero-description">{data.description}</p>
          <div className="hero-actions">
            <a className="button button-navy" href={data.primaryCta.href}>{data.primaryCta.label}<ArrowUpRight size={20} /></a>
            <a className="button button-text" href={data.secondaryCta.href}>{data.secondaryCta.label}<ArrowRight size={19} /></a>
          </div>
          <p className="hero-note">{data.note}</p>
        </div>
        <figure className="hero-media">
          <div className="hero-photo-wrap">
            <img className="hero-photo" src={data.image.src} alt={data.image.alt} width={data.image.width} height={data.image.height} fetchPriority="high" />
            <span className="hero-photo-shutter" aria-hidden="true" />
          </div>
          <figcaption><span>01 / A MIND IN MOTION</span>{data.imageCaption}</figcaption>
        </figure>
      </div>
      <Reveal className="intake-bar" variant="band">
        <span className="intake-backdrop" aria-hidden="true" />
        <div><span>YOUR PERSONAL LEARNING PLAN</span><strong>Curiosity is a good place to start.</strong></div>
        <a href="#signup">Find your starting point<ArrowUpRight size={22} /></a>
      </Reveal>
      <ul className="hero-benefits">
        {data.features.map((feature) => <li key={feature}><Check size={16} weight="bold" />{feature}</li>)}
      </ul>
    </section>
  )
}
