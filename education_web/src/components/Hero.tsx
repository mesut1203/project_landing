import { ArrowUpRight, ArrowRight, Check, Sparkle } from '@phosphor-icons/react'
import type { HeroContent } from '../data/content'

interface HeroProps {
  data: HeroContent
}

export function Hero({ data }: HeroProps) {
  return (
    <section id="home" className="hero container" aria-labelledby="hero-title">
      <div className="hero-layout">
        <div className="hero-copy">
          <p className="eyebrow">
            <span />
            {data.eyebrow}
          </p>
          <h1 id="hero-title" aria-label={data.heading}>
            {data.headingLines.map((line, index) => (
              <span key={line} className={index === 1 ? 'hero-emphasis' : ''}>
                {line}
              </span>
            ))}
          </h1>
          <p className="hero-description">{data.description}</p>
          <div className="hero-actions">
            <a className="button button-navy" href={data.primaryCta.href}>
              {data.primaryCta.label}
              <ArrowUpRight size={20} />
            </a>
            <a className="button button-text" href={data.secondaryCta.href}>
              {data.secondaryCta.label}
              <ArrowRight size={19} />
            </a>
          </div>
          <p className="hero-note">{data.note}</p>
        </div>
        <figure className="hero-media">
          <div className="hero-photo-wrap">
            <img
              className="hero-photo"
              src={data.image.src}
              alt={data.image.alt}
              width={data.image.width}
              height={data.image.height}
              style={{ objectPosition: data.image.position }}
              fetchPriority="high"
            />
          </div>
          <span className="hero-spark" aria-hidden="true">
            <Sparkle weight="fill" />
          </span>
          <figcaption>{data.imageCaption}</figcaption>
        </figure>
      </div>
      <ul className="hero-benefits">
        {data.features.map((feature) => (
          <li key={feature}>
            <Check size={18} weight="bold" />
            {feature}
          </li>
        ))}
      </ul>
    </section>
  )
}
