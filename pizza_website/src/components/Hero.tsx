import { Icon } from './Icon'
import { Reveal } from './Reveal'

export function Hero() {
  return <section id="home" className="hero-story" aria-labelledby="hero-heading">
    <div className="hero-stage">
      <div className="hero-media" aria-hidden="true">
        <picture>
          <source media="(max-width: 767px)" srcSet="/media/optimized/hero-640.webp" />
          <img src="/media/photos/hero.jpg" width="1280" height="720" alt="" fetchPriority="high" decoding="async" />
        </picture>
      </div>
      <div className="hero-shade" />
      <div className="hero-content container">
        <Reveal className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-line" />Fiamma Pizza House</p>
          <h1 id="hero-heading">The good<br />kind of late<span className="accent-period">.</span></h1>
          <p className="hero-description">A neighborhood pizza room for long tables, warm slices, and the last drink that becomes two.</p>
        </Reveal>
        <div className="hero-actions">
          <a className="button" href="#visit">Book a table <Icon name="arrow" className="button-arrow" /></a>
          <a className="button button--outline" href="#menu">See the menu <Icon name="arrow" className="button-arrow" /></a>
        </div>
      </div>
      <div className="hero-bottom container">
        <a className="scroll-cue" href="#story"><Icon name="down" /><span>Good things take their time.</span></a>
      </div>
    </div>
  </section>
}
