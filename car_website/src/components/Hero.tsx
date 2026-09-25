import { ApexHeadline } from './ApexHeadline'
import { ctas, hero } from '../data/content'
import { ActionLink } from './ActionLink'
import { MediaImage } from './MediaImage'

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-stage">
        <div className="hero-visual-track"><MediaImage image={hero.image} className="hero-image" eager /></div>
        <div className="hero-shutters" aria-hidden="true"><span className="hero-curtain" /><span className="hero-curtain" /></div>
        <div className="hero-shade" aria-hidden="true" />
        <div className="stage-register section-shell"><span>A / 01</span><span>Grand touring concept</span><span>Design study — 2026</span></div>
        <div className="hero-copy section-shell">
          <p className="eyebrow">{hero.label}</p>
          <ApexHeadline />
          <p className="hero-description">{hero.description}</p>
          <div className="hero-actions"><ActionLink action={ctas.explore} /></div>
        </div>
        <nav className="engineering-rail" aria-label="Explore Apex One"><a href="#model"><span>01</span>Overview</a><a href="#experience"><span>02</span>Engineering</a><a href="#gallery"><span>03</span>Perspectives</a></nav>
        <span className="stage-coordinate" aria-hidden="true">FORM × FUNCTION</span>
      </div>
      <dl className="hero-data section-shell"><div><dt>Series</dt><dd>ONE<span>/ 01</span></dd></div><div><dt>Architecture</dt><dd>GRAND TOURER</dd></div><div><dt>Design principle</dt><dd>DRIVER FIRST</dd></div><div><dt>Status</dt><dd>CONCEPT STUDY<span className="status-light" aria-hidden="true" /></dd></div></dl>
    </section>
  )
}
