import { ArrowDownRight, ArrowUpRight } from '@phosphor-icons/react'
import { content } from '../data/content'
import { Media } from './Media'
import { Reveal } from './Reveal'

interface HeroProps { data: typeof content.story }

export function Hero({ data }: HeroProps) {
  const [arrival, ...spaces] = data.scenes
  const skip = () => window.requestAnimationFrame(() => document.getElementById('rooms')?.focus({ preventScroll: true }))

  return <section className="arrival" aria-label={data.label}>
    <div className="hero">
      <Media asset={arrival.poster} eager className="hero-image" />
      <div className="hero-copy section-shell">
        <p className="eyebrow">{data.eyebrow}</p>
        <h1>{arrival.heading}</h1>
        <p className="hero-description">{arrival.text}</p>
        <a className="text-link" href={data.skip.href} onClick={skip}>{data.skip.label}<ArrowDownRight size={20} weight="light" aria-hidden="true" /></a>
      </div>
    </div>
    <div className="arrival-spaces section-shell">
      {spaces.map((space) => <article key={space.id}>
        <Media asset={space.poster} className="arrival-image" />
        <Reveal>
          <p className="eyebrow">{space.label}</p>
          <h2>{space.heading}</h2>
          {space.text && <p className="arrival-description">{space.text}</p>}
          {space.cta && <a className="text-link" href={space.cta.href}>{space.cta.label}<ArrowUpRight size={18} weight="light" aria-hidden="true" /></a>}
        </Reveal>
      </article>)}
    </div>
  </section>
}
