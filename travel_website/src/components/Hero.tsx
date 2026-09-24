import { content } from '../data/content'
import { Arrow } from './Icon'

export function Hero() {
  const { hero } = content
  return (
    <section id="top" className="hero" aria-labelledby="hero-heading">
      <img
        className="hero-image"
        src="/assets/journey/ezgif-frame-001.jpg"
        alt=""
        width="1280"
        height="720"
        fetchPriority="high"
      />
      <div className="hero-shade" aria-hidden="true" />
      <div className="shell hero-layout">
        <div className="hero-copy">
          <p className="eyebrow hero-eyebrow">
            <span />
            {hero.eyebrow}
          </p>
          <h1 id="hero-heading" tabIndex={-1}>
            {hero.heading}
            <br />
            <em>{hero.emphasis}</em>
          </h1>
          <p className="hero-description">{hero.description}</p>
          <a className="hero-cta" href="#destinations">
            {hero.cta}
            <span>
              <Arrow diagonal />
            </span>
          </a>
        </div>
        <div className="hero-side-note" aria-hidden="true">
          {hero.noteLabel} — VIETNAM
        </div>
      </div>
      <div className="shell hero-bottom">
        <a className="hero-scroll-hint" href="#our-story">
          <span aria-hidden="true">↓</span>
          <span>
            {hero.scroll}
            <small>{hero.secondary}</small>
          </span>
        </a>
      </div>
    </section>
  )
}
