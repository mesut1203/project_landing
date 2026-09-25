import { Icon } from './Icon'
import { Reveal } from './Reveal'

export function Hero() {
  return <section id="home" className="hero-story" aria-labelledby="hero-heading">
    <div className="hero-stage">
      <div className="poster-masthead"><span>Pizza. People. The good stuff.</span><div className="wordmark" aria-hidden="true">fiamma.</div><span>Made by hand. Shared by everyone.</span></div>
      <div className="hero-media">
        <img src="/media/fiamma-pizza.webp" width="1448" height="1086" alt="Wood-fired margherita pizza with fresh basil and a golden charred crust" fetchPriority="high" decoding="async" />
        <div className="hero-stamp" aria-hidden="true">HOT<br />FROM<br />THE OVEN!</div>
        <span className="photo-caption">A little char. A lot of heart.</span>
      </div>
      <div className="hero-content">
        <Reveal className="hero-copy">
          <p className="eyebrow">Wood-fired. Whole-hearted.</p>
          <h1 id="hero-heading"><span>The good</span><br /><em>kind of late<span className="accent-period">.</span></em></h1>
          <p className="hero-description">A neighborhood pizza room for long tables, warm slices, and the last drink that becomes two.</p>
        </Reveal>
        <div className="hero-actions">
          <a className="button" href="#visit">Book a table <Icon name="arrow" className="button-arrow" /></a>
          <a className="button button--outline" href="#menu">See the menu <Icon name="arrow" className="button-arrow" /></a>
        </div>
      </div>
      <div className="hero-bottom container"><span className="hero-location">Your neighborhood pizza house</span><a className="scroll-cue" href="#story"><Icon name="down" /><span>Good things take their time.</span></a></div>
    </div>
  </section>
}
