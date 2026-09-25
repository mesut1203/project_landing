import { ArrowDownRight, ArrowUpRight } from '@phosphor-icons/react'
import { content } from '../data/content'
import { Media } from './Media'
import { Reveal } from './Reveal'
import { BookingForm } from './BookingForm'
import { ArrivalTitle } from './ArrivalTitle'

interface HeroProps { data: typeof content.story }

export function Hero({ data }: HeroProps) {
  const [arrival, ...spaces] = data.scenes
  const skip = () => window.requestAnimationFrame(() => document.getElementById('rooms')?.focus({ preventScroll: true }))

  return <section className="arrival" aria-label={data.label}>
    <div className="hero">
      <Media asset={arrival.poster} eager className="hero-image" />
      <div className="hero-copy section-shell">
        <p className="eyebrow">{data.eyebrow}</p>
        <ArrivalTitle />
        <p className="hero-description">{arrival.text}</p>
        <a className="text-link" href={data.skip.href} onClick={skip}>{data.skip.label}<ArrowDownRight size={20} weight="light" aria-hidden="true" /></a>
      </div>
      <div className="hero-coordinates" aria-hidden="true"><span>Mediterranean days</span><span>Unhurried by nature</span></div>
      <BookingForm data={content.booking} />
    </div>
    <div className="hotel-introduction section-shell"><p className="eyebrow">The Aurelia way</p><p>A little less hurry.<br /><em>A little more here.</em></p><span>Soft light, open doors, and the quiet pleasure of having nowhere else to be.</span></div>
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
