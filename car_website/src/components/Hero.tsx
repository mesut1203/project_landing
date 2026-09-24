import { ctas, hero } from '../data/content'
import { ActionLink } from './ActionLink'
import { MediaImage } from './MediaImage'

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <MediaImage image={hero.image} className="hero-image" eager />
      <div className="hero-shade" aria-hidden="true" />
      <div className="hero-copy section-shell">
        <p className="eyebrow">{hero.label}</p>
        <h1 id="hero-title" className="hero-heading">{hero.lines.map((line) => <span key={line}>{line}</span>)}</h1>
        <p className="hero-description">{hero.description}</p>
        <div className="hero-actions"><ActionLink action={ctas.explore} /></div>
      </div>
    </section>
  )
}
